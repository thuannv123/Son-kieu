import type { ReactNode } from "react";

function parseInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  if (parts.length === 1) return text;
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="font-semibold text-gray-900">{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*"))
      return <em key={i}>{p.slice(1, -1)}</em>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={i} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-700">{p.slice(1, -1)}</code>;
    return p;
  });
}

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = "" }: Props) {
  const blocks = content.trim().split(/\n\n+/);

  return (
    <div className={`space-y-4 text-[15px] leading-relaxed text-gray-700 ${className}`}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        const lines   = trimmed.split("\n");
        const first   = lines[0];

        if (trimmed === "---")
          return <hr key={bi} className="border-gray-200" />;

        if (first.startsWith("## "))
          return (
            <h2 key={bi} className="mt-2 text-xl font-bold text-gray-900">
              {parseInline(first.slice(3))}
            </h2>
          );

        if (first.startsWith("### "))
          return (
            <h3 key={bi} className="mt-1 text-[17px] font-bold text-gray-800">
              {parseInline(first.slice(4))}
            </h3>
          );

        if (first.startsWith("#### "))
          return (
            <h4 key={bi} className="text-[15px] font-bold text-gray-800">
              {parseInline(first.slice(5))}
            </h4>
          );

        if (lines.some(l => /^[-*] /.test(l))) {
          const items = lines.filter(l => /^[-*] /.test(l));
          return (
            <ul key={bi} className="space-y-2 pl-1">
              {items.map((l, li) => (
                <li key={li} className="flex items-start gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{parseInline(l.slice(2))}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={bi}>
            {lines.flatMap((line, li) => [
              ...(li > 0 ? [<br key={`br-${bi}-${li}`} />] : []),
              parseInline(line),
            ])}
          </p>
        );
      })}
    </div>
  );
}
