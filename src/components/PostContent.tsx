import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { cn } from "@/lib/utils";

/**
 * Sanitize schema extended so authored markdown may embed media and styled
 * blocks (legacy posts were written as raw HTML, so both paths are supported).
 */
const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    "video",
    "source",
    "iframe",
    "figure",
    "figcaption",
  ],
  attributes: {
    ...defaultSchema.attributes,
    "*": [...(defaultSchema.attributes?.["*"] ?? []), "className", "style"],
    img: [...(defaultSchema.attributes?.img ?? []), "loading", "width", "height"],
    video: ["src", "controls", "poster", "loop", "muted", "playsInline", "className"],
    source: ["src", "type"],
    iframe: ["src", "title", "allow", "allowFullScreen", "frameBorder", "className"],
  },
};

interface PostContentProps {
  content: string;
  className?: string;
}

/** Renders post body markdown (with legacy inline HTML support). */
export const PostContent = ({ content, className }: PostContentProps) => (
  <div
    className={cn(
      "prose prose-lg max-w-none text-left",
      "prose-headings:font-display prose-headings:font-normal",
      "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
      "prose-img:rounded-xl prose-img:border prose-img:border-border",
      "prose-blockquote:border-l-primary prose-blockquote:not-italic",
      "prose-table:text-base",
      className
    )}
  >
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema]]}
      components={{
        img: ({ node, ...props }) => (
          <img {...props} loading="lazy" alt={props.alt ?? ""} className="mx-auto rounded-xl" />
        ),
        video: ({ node, ...props }) => (
          <video {...props} controls className="w-full rounded-xl" />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table {...props} />
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
