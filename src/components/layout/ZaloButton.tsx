import Link from "next/link";

export default function ZaloButton() {
  return (
    <Link
      href="https://zalo.me/0857086588"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Zalo"
      className="
        fixed bottom-4 left-4 z-50
        group flex items-center gap-0
        h-12 w-12
        overflow-hidden
        rounded-full
        bg-[#0068ff]
        shadow-[0_4px_18px_rgba(0,104,255,0.45)]
        transition-all duration-300 ease-out
        hover:w-36 hover:rounded-full
        hover:shadow-[0_6px_24px_rgba(0,104,255,0.55)]
        active:scale-95
      "
    >
      {/* Zalo "Z" icon */}
      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
        <svg
          width="26"
          height="26"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="24" cy="24" r="24" fill="white" fillOpacity="0.2" />
          <text
            x="50%"
            y="50%"
            dominantBaseline="central"
            textAnchor="middle"
            fill="white"
            fontFamily="Arial, sans-serif"
            fontSize="22"
            fontWeight="900"
            letterSpacing="-1"
          >
            Z
          </text>
        </svg>
      </span>

      {/* Label — visible on hover */}
      <span
        className="
          whitespace-nowrap
          pr-4 text-[13px] font-bold text-white
          opacity-0 translate-x-1
          transition-all duration-200 ease-out
          group-hover:opacity-100 group-hover:translate-x-0
        "
      >
        Chat Zalo
      </span>
    </Link>
  );
}
