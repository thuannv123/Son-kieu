"use client";

import { useRef } from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  required?: boolean;
}

type WrapMode = "block-start" | "inline";
interface Fmt { label: string; title: string; syntax: string; mode: WrapMode }

const FORMATS: Fmt[] = [
  { label: "H2",     title: "Tiêu đề lớn",   syntax: "# ",   mode: "block-start" },
  { label: "H3",     title: "Tiêu đề nhỏ",   syntax: "## ",  mode: "block-start" },
  { label: "─ List", title: "Danh sách",      syntax: "- ",   mode: "block-start" },
  { label: "B",      title: "In đậm",         syntax: "**",   mode: "inline"       },
];

function insert(ta: HTMLTextAreaElement, fmt: Fmt, onChange: (v: string) => void) {
  const { selectionStart: s, selectionEnd: e, value: v } = ta;
  const selected = v.slice(s, e);
  let next: string, cursor: number;

  if (fmt.mode === "block-start") {
    const lineStart = v.lastIndexOf("\n", s - 1) + 1;
    const before = v.slice(0, lineStart);
    const line   = v.slice(lineStart, e || v.indexOf("\n", lineStart) >>> 0);
    const after  = v.slice(e || v.indexOf("\n", lineStart) >>> 0);
    next   = before + fmt.syntax + line + after;
    cursor = lineStart + fmt.syntax.length + line.length;
  } else {
    next   = v.slice(0, s) + fmt.syntax + selected + fmt.syntax + v.slice(e);
    cursor = selected ? e + fmt.syntax.length * 2 : s + fmt.syntax.length;
  }

  onChange(next);
  requestAnimationFrame(() => {
    ta.focus();
    ta.setSelectionRange(cursor, cursor);
  });
}

function insertTable(ta: HTMLTextAreaElement, onChange: (v: string) => void) {
  const { selectionStart: s, value: v } = ta;
  const tpl = "\n| Cột 1 | Cột 2 | Cột 3 |\n|-------|-------|-------|\n| Nội dung | Nội dung | Nội dung |\n";
  const next = v.slice(0, s) + tpl + v.slice(s);
  onChange(next);
  requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + tpl.length, s + tpl.length); });
}

const INPUT = "w-full rounded-b-xl border border-t-0 border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 font-mono focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition resize-y";

export default function ContentEditor({ value, onChange, rows = 20, required }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-t-xl border border-gray-200 bg-gray-100 px-2 py-1.5">
        {FORMATS.map(fmt => (
          <button
            key={fmt.label}
            type="button"
            title={fmt.title}
            onClick={() => ref.current && insert(ref.current, fmt, onChange)}
            className={`rounded-lg px-2.5 py-1 text-[12px] font-bold text-gray-600 transition
              hover:bg-white hover:shadow-sm hover:text-gray-900
              ${fmt.label === "B" ? "italic" : ""}`}>
            {fmt.label}
          </button>
        ))}
        <div className="mx-1 h-4 w-px bg-gray-300" />
        <button
          type="button"
          title="Chèn bảng"
          onClick={() => ref.current && insertTable(ref.current, onChange)}
          className="rounded-lg px-2.5 py-1 text-[12px] font-bold text-gray-600 transition hover:bg-white hover:shadow-sm hover:text-gray-900">
          ⊞ Bảng
        </button>
        <div className="ml-auto text-[10px] text-gray-400 pr-1">
          # H2 &nbsp;·&nbsp; ## H3 &nbsp;·&nbsp; **bold** &nbsp;·&nbsp; - list
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={ref}
        className={INPUT}
        rows={rows}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={"# Tiêu đề H2\n\nNội dung đoạn văn...\n\n## Tiêu đề H3\n\n- Mục 1\n- Mục 2"}
      />
    </div>
  );
}
