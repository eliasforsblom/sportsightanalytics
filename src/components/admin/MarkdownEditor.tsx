import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Table,
  Minus,
  Loader2,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostContent } from "@/components/PostContent";
import { cn } from "@/lib/utils";

type ViewMode = "write" | "split" | "preview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Markdown editor with a formatting toolbar, inline image uploads
 * (button, drag & drop or paste) and a live preview.
 */
export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [view, setView] = useState<ViewMode>("write");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const applyWrap = useCallback(
    (before: string, after = "", placeholderText = "") => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.substring(start, end) || placeholderText;
      const next = value.substring(0, start) + before + selected + after + value.substring(end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(start + before.length, start + before.length + selected.length);
      });
    },
    [value, onChange]
  );

  const insertBlock = useCallback(
    (text: string) => {
      const el = textareaRef.current;
      const start = el ? el.selectionStart : value.length;
      const prefix = value.substring(0, start);
      const needsBreak = prefix.length > 0 && !prefix.endsWith("\n\n");
      const insertion = `${needsBreak ? (prefix.endsWith("\n") ? "\n" : "\n\n") : ""}${text}\n\n`;
      const next = prefix + insertion + value.substring(start);
      onChange(next);
      requestAnimationFrame(() => {
        el?.focus();
        const pos = prefix.length + insertion.length;
        el?.setSelectionRange(pos, pos);
      });
    },
    [value, onChange]
  );

  const uploadFile = useCallback(
    async (file: File) => {
      const isVideo = file.type.startsWith("video/");
      const bucket = isVideo ? "post-videos" : "post-images";
      setUploading(true);
      try {
        const ext = file.name.split(".").pop();
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) throw error;
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(path);

        insertBlock(
          isVideo
            ? `<video src="${publicUrl}" controls></video>`
            : `![${file.name.replace(/\.[^.]+$/, "")}](${publicUrl})`
        );
        toast({ title: isVideo ? "Video uploaded" : "Image uploaded" });
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [insertBlock, toast]
  );

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files) return;
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          await uploadFile(file);
        }
      }
    },
    [uploadFile]
  );

  const tools = [
    { icon: Heading2, label: "Heading 2", action: () => applyWrap("## ", "", "Heading") },
    { icon: Heading3, label: "Heading 3", action: () => applyWrap("### ", "", "Heading") },
    { icon: Bold, label: "Bold", action: () => applyWrap("**", "**", "bold text") },
    { icon: Italic, label: "Italic", action: () => applyWrap("*", "*", "italic text") },
    { icon: List, label: "Bullet list", action: () => applyWrap("- ", "", "List item") },
    { icon: ListOrdered, label: "Numbered list", action: () => applyWrap("1. ", "", "List item") },
    { icon: Quote, label: "Quote", action: () => applyWrap("> ", "", "Quote") },
    { icon: Code, label: "Code block", action: () => applyWrap("```\n", "\n```", "code") },
    {
      icon: Table,
      label: "Table",
      action: () =>
        insertBlock("| Column | Column |\n| --- | --- |\n| Value | Value |"),
    },
    { icon: Minus, label: "Divider", action: () => insertBlock("---") },
  ];

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
        {tools.map((tool) => (
          <Button
            key={tool.label}
            type="button"
            variant="ghost"
            size="sm"
            aria-label={tool.label}
            title={tool.label}
            onClick={tool.action}
          >
            <tool.icon className="h-4 w-4" />
          </Button>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" aria-label="Insert link" title="Insert link">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 space-y-2">
            <Input placeholder="Link text" value={linkText} onChange={(e) => setLinkText(e.target.value)} />
            <Input placeholder="https://…" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            <Button
              type="button"
              size="sm"
              className="w-full"
              onClick={() => {
                if (!linkUrl) return;
                applyWrap(`[${linkText || linkUrl}](${linkUrl})`);
                setLinkUrl("");
                setLinkText("");
              }}
            >
              Insert link
            </Button>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="Upload image or video"
          title="Upload image or video"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="ml-auto">
          <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <TabsList className="h-8">
              <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
              <TabsTrigger value="split" className="text-xs">Split</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className={cn("grid gap-0", view === "split" && "md:grid-cols-2")}>
        {view !== "preview" && (
          <div
            className={cn("relative", dragActive && "ring-2 ring-primary ring-inset")}
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
          >
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onPaste={(e) => {
                const files = Array.from(e.clipboardData.files);
                if (files.length) {
                  e.preventDefault();
                  handleFiles(files);
                }
              }}
              placeholder={placeholder ?? "Write your post in Markdown. Drag, paste or upload images anywhere in the text…"}
              className="min-h-[420px] resize-y rounded-none border-0 font-mono text-sm focus-visible:ring-0"
            />
            {dragActive && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background/80">
                <span className="flex items-center gap-2 text-sm text-primary">
                  <Upload className="h-4 w-4" /> Drop to upload
                </span>
              </div>
            )}
          </div>
        )}

        {view !== "write" && (
          <div className="min-h-[420px] overflow-auto border-l border-border p-6">
            {value.trim() ? (
              <PostContent content={value} className="prose-base" />
            ) : (
              <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
        Markdown supported · {value.trim() ? value.trim().split(/\s+/).length : 0} words · drag & drop or paste
        images directly into the text
      </div>
    </div>
  );
};
