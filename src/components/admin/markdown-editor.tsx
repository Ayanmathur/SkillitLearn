"use client";

import { useState, useRef, useCallback } from "react";
import { uploadContentImage } from "@/app/(main)/admin/actions/upload-actions";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Split-pane markdown editor with toolbar.
 * Supports: Bold, Italic, Code, Heading, Link, List
 * Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+K (link)
 */
export function MarkdownEditor({ value, onChange }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleImageUpload() {
    fileInputRef.current?.click();
  }

  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadContentImage(fd);
      if (result.error) { alert(result.error); return; }
      if (result.url) { insertAtCursor(`![${file.name}](${result.url})`); }
    } catch { alert("Upload failed."); }
    setUploading(false);
    e.target.value = "";
  }

  const wrapSelection = useCallback(
    (prefix: string, suffix?: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.substring(start, end);
      const suf = suffix ?? prefix;
      const newVal = value.substring(0, start) + prefix + selected + suf + value.substring(end);
      onChange(newVal);
      // Restore cursor
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    },
    [value, onChange]
  );

  const insertAtCursor = useCallback(
    (text: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const pos = el.selectionStart;
      const newVal = value.substring(0, pos) + text + value.substring(pos);
      onChange(newVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(pos + text.length, pos + text.length);
      }, 0);
    },
    [value, onChange]
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") { e.preventDefault(); wrapSelection("**"); }
      else if (e.key === "i") { e.preventDefault(); wrapSelection("*"); }
      else if (e.key === "k") { e.preventDefault(); wrapSelection("[", "](url)"); }
    }
    // Tab → insert 2 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCursor("  ");
    }
  }

  return (
    <div className="rounded-xl border border-[var(--border-color)] overflow-hidden bg-surface">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 bg-surface-raised border-b border-[var(--border-color)] flex-wrap">
        <ToolBtn title="Bold (Ctrl+B)" onClick={() => wrapSelection("**")}>
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn title="Italic (Ctrl+I)" onClick={() => wrapSelection("*")}>
          <em>I</em>
        </ToolBtn>
        <ToolBtn title="Inline Code" onClick={() => wrapSelection("`")}>
          <code className="text-[10px]">{`<>`}</code>
        </ToolBtn>
        <ToolBtn title="Code Block" onClick={() => wrapSelection("```\n", "\n```")}>
          <span className="text-[10px]">{"{ }"}</span>
        </ToolBtn>
        <span className="w-px h-5 bg-[var(--border-color)] mx-1" />
        <ToolBtn title="Heading" onClick={() => insertAtCursor("## ")}>H</ToolBtn>
        <ToolBtn title="Bullet List" onClick={() => insertAtCursor("- ")}>•</ToolBtn>
        <ToolBtn title="Numbered List" onClick={() => insertAtCursor("1. ")}>1.</ToolBtn>
        <ToolBtn title="Link (Ctrl+K)" onClick={() => wrapSelection("[", "](url)")}>🔗</ToolBtn>
        <ToolBtn title="Upload Image" onClick={handleImageUpload}>{uploading ? "⏳" : "🖼️"}</ToolBtn>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelected} className="hidden" />

        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`text-[10px] px-2 py-1 rounded-lg font-semibold transition-colors
            ${showPreview ? "bg-accent text-white" : "text-text-muted hover:text-text-secondary"}`}
        >
          {showPreview ? "Editor" : "Preview"}
        </button>
      </div>

      {/* Content */}
      {showPreview ? (
        <div className="p-4 min-h-[200px] max-h-[400px] overflow-auto text-sm text-text-secondary leading-relaxed prose prose-sm max-w-none">
          <MarkdownPreview content={value} />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={10}
          className="w-full px-4 py-3 text-sm text-text-primary bg-transparent focus:outline-none resize-y min-h-[200px] font-mono leading-relaxed"
          placeholder="Write step content in Markdown..."
        />
      )}
    </div>
  );
}

function ToolBtn({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs text-text-muted
                 hover:bg-accent/10 hover:text-accent transition-colors"
    >
      {children}
    </button>
  );
}

/** Simple markdown preview renderer */
function MarkdownPreview({ content }: { content: string }) {
  if (!content) return <span className="text-text-muted italic">Nothing to preview</span>;

  const blocks = content.split(/\n\n+/);

  return (
    <>
      {blocks.map((block, i) => {
        const t = block.trim();
        if (!t) return null;

        if (t.startsWith("```")) {
          const lines = t.split("\n");
          const code = lines.slice(1, -1).join("\n");
          return <pre key={i} className="bg-[#1e1e2e] text-green-300 rounded-xl p-3 text-xs overflow-x-auto my-2"><code>{code || lines.slice(1).join("\n")}</code></pre>;
        }
        if (t.startsWith("### ")) return <h4 key={i} className="font-bold text-text-primary mt-3 mb-1">{t.slice(4)}</h4>;
        if (t.startsWith("## ")) return <h3 key={i} className="font-bold text-text-primary text-base mt-4 mb-1">{t.slice(3)}</h3>;
        if (t.startsWith("# ")) return <h2 key={i} className="font-bold text-text-primary text-lg mt-4 mb-1">{t.slice(2)}</h2>;

        if (t.match(/^[-*]\s/m)) {
          return <ul key={i} className="list-disc list-inside space-y-0.5 my-1">{t.split("\n").filter(l => l.trim()).map((l, j) => <li key={j} className="text-sm">{l.replace(/^[-*]\s*/, "")}</li>)}</ul>;
        }

        return <p key={i} className="my-1">{t}</p>;
      })}
    </>
  );
}
