export type AdminRole = "SUPER_ADMIN" | "MANAGER";

export interface AdminSession {
  staffId:  string;
  role:     AdminRole;
  isLegacy: boolean;
}

const ROLE_HIERARCHY: AdminRole[] = ["MANAGER", "SUPER_ADMIN"];

async function sign(payload: string): Promise<string> {
  const secret  = process.env.ADMIN_SECRET_KEY ?? "";
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false, ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function buildSessionToken(staffId: string, role: AdminRole): Promise<string> {
  const payload = `${staffId}.${role}`;
  return `${payload}.${await sign(payload)}`;
}

export async function parseSessionToken(token: string): Promise<AdminSession | null> {
  const secret = process.env.ADMIN_SECRET_KEY;
  if (!secret) return null;

  // Legacy: raw shared secret
  if (token === secret) {
    return { staffId: "legacy", role: "SUPER_ADMIN", isLegacy: true };
  }

  // New format: staffId.ROLE.hmac
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload  = token.slice(0, lastDot);
  const sig      = token.slice(lastDot + 1);
  const expected = await sign(payload);
  if (expected !== sig) return null;

  const dotIdx = payload.indexOf(".");
  if (dotIdx === -1) return null;
  const staffId = payload.slice(0, dotIdx);
  const role    = payload.slice(dotIdx + 1) as AdminRole;

  if (!ROLE_HIERARCHY.includes(role)) return null;

  return { staffId, role, isLegacy: false };
}

export async function getSessionFromRequest(req: { cookies: { get(name: string): { value: string } | undefined } }): Promise<AdminSession | null> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  return parseSessionToken(token);
}

export async function isAdminAuthorized(req: { cookies: { get(name: string): { value: string } | undefined } }): Promise<boolean> {
  return (await getSessionFromRequest(req)) !== null;
}

export function hasRole(session: AdminSession | null, minRole: AdminRole): boolean {
  if (!session) return false;
  return ROLE_HIERARCHY.indexOf(session.role) >= ROLE_HIERARCHY.indexOf(minRole);
}

export const NAV_ROLES: Record<string, AdminRole[]> = {
  "/admin/dashboard": ["SUPER_ADMIN", "MANAGER"],
  "/admin/bookings":  ["SUPER_ADMIN", "MANAGER"],
  "/admin/checkin":   ["SUPER_ADMIN", "MANAGER"],
  "/admin/safety":    ["SUPER_ADMIN", "MANAGER"],
  "/admin/resources": ["SUPER_ADMIN", "MANAGER"],
  "/admin/dining":    ["SUPER_ADMIN", "MANAGER"],
  "/admin/gallery":   ["SUPER_ADMIN", "MANAGER"],
  "/admin/staff":     ["SUPER_ADMIN"],
  "/admin/analytics": ["SUPER_ADMIN", "MANAGER"],
  "/admin/cms":       ["SUPER_ADMIN", "MANAGER"],
  "/admin/reviews":   ["SUPER_ADMIN", "MANAGER"],
  "/admin/settings":  ["SUPER_ADMIN"],
};
