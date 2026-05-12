import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Khu Du Lịch Sinh Thái Sơn Kiều";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background:
            "linear-gradient(135deg, #04130a 0%, #064e3b 48%, #0f766e 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 82% 18%, rgba(167,243,208,0.28), transparent 30%), radial-gradient(circle at 18% 84%, rgba(20,184,166,0.26), transparent 34%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#047857",
              fontSize: 44,
              fontWeight: 900,
            }}
          >
            SK
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 42, fontWeight: 900 }}>Sơn Kiều</div>
            <div style={{ fontSize: 18, letterSpacing: 5, color: "#a7f3d0", fontWeight: 800 }}>
              DU LỊCH SINH THÁI
            </div>
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 78, lineHeight: 0.95, fontWeight: 900, maxWidth: 900 }}>
            Thiên nhiên hoang sơ giữa Trường Sơn
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.45, color: "#d1fae5", maxWidth: 760 }}>
            Hang động, hồ suối tự nhiên, ẩm thực bản địa và trải nghiệm sinh thái tại Quảng Trị.
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", gap: 18, fontSize: 22, color: "#ecfdf5" }}>
          <span>khudulichsonkieu.vn</span>
          <span>•</span>
          <span>Trường Sơn · Quảng Trị</span>
        </div>
      </div>
    ),
    size,
  );
}
