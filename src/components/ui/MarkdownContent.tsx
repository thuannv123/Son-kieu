import type { ReactNode } from "react";
import Link from "next/link";

function parseInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\/[a-z0-9][a-z0-9/_-]*)/gi);
  if (parts.length === 1) return text;
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return <strong key={i} className="font-semibold text-gray-900">{p.slice(2, -2)}</strong>;
    if (p.startsWith("*") && p.endsWith("*"))
      return <em key={i}>{p.slice(1, -1)}</em>;
    if (p.startsWith("`") && p.endsWith("`"))
      return <code key={i} className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-700">{p.slice(1, -1)}</code>;
    if (/^\/[a-z0-9][a-z0-9/_-]*$/i.test(p))
      return <Link key={i} href={p} className="font-semibold text-emerald-700 hover:text-emerald-800">{p}</Link>;
    return p;
  });
}

function getHeading(line: string) {
  const match = line.match(/^(#{1,4})\s*(.+)$/);
  if (!match) return null;
  return { level: match[1].length, text: match[2].trim() };
}

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = "" }: Props) {
  const lines = content
    .replace(/\r\n/g, "\n")
    .replace(/\s+(#{1,4}\s+)/g, "\n$1")
    .replace(/\s+(-\s+)/g, "\n$1")
    .trim()
    .split("\n");

  const nodes: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    if (text) {
      nodes.push(
        <p key={`p-${nodes.length}`}>
          {parseInline(text)}
        </p>
      );
    }
    paragraph = [];
  }

  function flushList() {
    if (!list.length) return;
    nodes.push(
      <ul key={`ul-${nodes.length}`} className="space-y-2 pl-1">
        {list.map((item, li) => (
          <li key={li} className="flex items-start gap-2.5">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
            <span>{parseInline(item)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line === "---") {
      flushParagraph();
      flushList();
      nodes.push(<hr key={`hr-${nodes.length}`} className="border-gray-200" />);
      continue;
    }

    const heading = getHeading(line);
    if (heading) {
      flushParagraph();
      flushList();
      if (heading.level === 1) {
        nodes.push(
          <h2 key={`h1-${nodes.length}`} className="mt-2 text-2xl font-black leading-tight text-gray-900">
            {parseInline(heading.text)}
          </h2>
        );
      } else if (heading.level === 2) {
        nodes.push(
          <h2 key={`h2-${nodes.length}`} className="mt-2 text-xl font-bold text-gray-900">
            {parseInline(heading.text)}
          </h2>
        );
      } else if (heading.level === 3) {
        nodes.push(
          <h3 key={`h3-${nodes.length}`} className="mt-1 text-[17px] font-bold text-gray-800">
            {parseInline(heading.text)}
          </h3>
        );
      } else {
        nodes.push(
          <h4 key={`h4-${nodes.length}`} className="text-[15px] font-bold text-gray-800">
            {parseInline(heading.text)}
          </h4>
        );
      }
      continue;
    }

    if (/^[-*] /.test(line)) {
      flushParagraph();
      list.push(line.slice(2).trim());
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();

  return (
    <div className={`space-y-4 text-[15px] leading-relaxed text-gray-700 ${className}`}>
      {nodes}
    </div>
  );
}
