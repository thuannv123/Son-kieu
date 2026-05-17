import Image from "next/image";
import Link from "next/link";

interface Crumb { label: string; href?: string }

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  /** Breadcrumb trail */
  crumbs?: Crumb[];
  /** Optional label above the title */
  eyebrow?: string;
  /** Dark overlay strength 0-1 */
  overlay?: number;
  /** CTA button */
  cta?: { label: string; href: string };
  /** Tall hero (default) or compact */
  size?: "default" | "compact";
}

export default function PageHero({
  title,
  subtitle,
  imageUrl = "/hero.jpg",
  crumbs,
  eyebrow,
  overlay = 0.55,
  cta,
  size = "default",
}: PageHeroProps) {
  const minH = size === "compact" ? "min-h-[38vh]" : "min-h-[56vh]";

  return (
    <section className={`relative overflow-hidden bg-canopy ${minH} flex flex-col`}>
      {/* Background image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
        unoptimized={imageUrl.startsWith("http")}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg,
            rgba(5,46,22,${overlay * 0.8}) 0%,
            rgba(5,46,22,${overlay * 0.5}) 50%,
            rgba(5,46,22,${overlay}) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-16 pt-32 text-center">

        {/* Breadcrumbs */}
        {crumbs && crumbs.length > 0 && (
          <nav className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/55">
            <Link href="/" className="transition hover:text-white/90">Trang chủ</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="opacity-40">|</span>
                {c.href ? (
                  <Link href={c.href} className="transition hover:text-white/90">{c.label}</Link>
                ) : (
                  <span className="text-white/80">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/55">
            {eyebrow}
          </p>
        )}

        {/* Title — Keemala: large italic serif */}
        <h1 className="font-display text-[clamp(2.8rem,8vw,6rem)] font-normal italic
                       leading-[1.05] tracking-[0.04em] text-white drop-shadow-sm">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mx-auto mt-5 max-w-2xl text-[16px] font-light leading-[1.9] text-white/75">
            {subtitle}
          </p>
        )}

        {/* CTA */}
        {cta && (
          <div className="mt-8">
            <Link href={cta.href} className="ds-btn ds-btn-white">
              {cta.label}
            </Link>
          </div>
        )}
      </div>

      {/* Bottom wave — dark page hero → white content */}
      <div className="pointer-events-none w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          className="block w-full"
          style={{ height: "70px", marginBottom: "-1px" }}
          aria-hidden="true"
        >
          <path
            d="M0,70 L0,35 C180,10 360,50 540,38 C720,26 900,0 1080,14
               C1220,26 1360,55 1440,42 L1440,70 Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
