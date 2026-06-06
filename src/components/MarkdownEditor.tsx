import { useRef, useState, useEffect } from "react";
import { Bold, Italic, Heading2, List, ListOrdered, Link as LinkIcon, Quote, Eye, Pencil } from "lucide-react";
import { renderMarkdown } from "@/lib/markdown";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  minRows?: number;
};

export function MarkdownEditor({ value, onChange, placeholder, maxLength = 5000, minRows = 5 }: Props) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  // auto-resize
  useEffect(() => {
    const el = taRef.current;
    if (!el || tab !== "write") return;
    el.style.height = "auto";
    el.style.height = Math.max(el.scrollHeight, minRows * 24) + "px";
  }, [value, tab, minRows]);

  function wrap(before: string, after = before, placeholderText = "") {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end) || placeholderText;
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + before.length;
      ta.setSelectionRange(pos, pos + sel.length);
    });
  }

  function prefixLines(prefix: string) {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const block = value.slice(lineStart, end);
    const replaced = block
      .split("\n")
      .map((l, i) => (prefix === "1. " ? `${i + 1}. ${l.replace(/^\d+\.\s+/, "")}` : `${prefix}${l.replace(new RegExp("^" + prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), "")}`))
      .join("\n");
    const next = value.slice(0, lineStart) + replaced + value.slice(end);
    onChange(next);
  }

  function insertLink() {
    const url = window.prompt("URL liên kết:");
    if (!url) return;
    wrap("[", `](${url})`, "tên liên kết");
  }

  const btn = "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground";

  return (
    <div className="rounded-lg border border-border bg-input">
      <div className="flex items-center justify-between gap-2 border-b border-border px-1.5 py-1">
        <div className="flex items-center gap-0.5">
          <button type="button" title="In đậm (Ctrl+B)" onClick={() => wrap("**", "**", "in đậm")} className={btn}><Bold className="h-4 w-4" /></button>
          <button type="button" title="In nghiêng (Ctrl+I)" onClick={() => wrap("*", "*", "in nghiêng")} className={btn}><Italic className="h-4 w-4" /></button>
          <button type="button" title="Tiêu đề" onClick={() => prefixLines("## ")} className={btn}><Heading2 className="h-4 w-4" /></button>
          <button type="button" title="Trích dẫn" onClick={() => prefixLines("> ")} className={btn}><Quote className="h-4 w-4" /></button>
          <button type="button" title="Danh sách" onClick={() => prefixLines("- ")} className={btn}><List className="h-4 w-4" /></button>
          <button type="button" title="Danh sách số" onClick={() => prefixLines("1. ")} className={btn}><ListOrdered className="h-4 w-4" /></button>
          <button type="button" title="Liên kết" onClick={insertLink} className={btn}><LinkIcon className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => setTab("write")}
            className={"inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs " + (tab === "write" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <Pencil className="h-3 w-3" /> Soạn
          </button>
          <button type="button" onClick={() => setTab("preview")}
            className={"inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs " + (tab === "preview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}>
            <Eye className="h-3 w-3" /> Xem trước
          </button>
        </div>
      </div>

      {tab === "write" ? (
        <textarea
          ref={taRef}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder ?? "Hỗ trợ Markdown: **đậm**, *nghiêng*, [link](url), - danh sách…"}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") { e.preventDefault(); wrap("**", "**", "in đậm"); }
            else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "i") { e.preventDefault(); wrap("*", "*", "in nghiêng"); }
            else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); insertLink(); }
          }}
          className="block w-full resize-none bg-transparent px-3 py-2 text-sm outline-none"
          style={{ minHeight: minRows * 24 }}
        />
      ) : (
        <div
          className="prose prose-invert max-w-none px-3 py-2 text-sm prose-p:my-2 prose-headings:my-3 prose-a:text-primary"
          style={{ minHeight: minRows * 24 }}
          dangerouslySetInnerHTML={{ __html: value.trim() ? renderMarkdown(value) : '<p class="text-muted-foreground">Chưa có nội dung.</p>' }}
        />
      )}

      <div className="flex items-center justify-between border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
        <span>Markdown: **đậm** *nghiêng* [link](url) ## tiêu đề</span>
        <span className={value.length > maxLength * 0.9 ? "text-destructive" : ""}>{value.length}/{maxLength}</span>
      </div>
    </div>
  );
}