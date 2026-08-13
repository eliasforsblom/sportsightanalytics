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
      // Medium-like reading rhythm
      "prose-p:my-6 prose-p:leading-[1.75] prose-p:text-[1.125rem]",
      "prose-headings:font-display prose-headings:font-normal",
      "prose-h2:mt-14 prose-h2:mb-4 prose-h2:text-[2rem] prose-h2:leading-tight",
      "prose-h3:mt-10 prose-h3:mb-3 prose-h3:text-2xl",
      "prose-li:my-2 prose-li:leading-[1.75] prose-ul:my-6 prose-ol:my-6",
      "prose-a:text-primary prose-a:underline prose-a:underline-offset-4 prose-a:decoration-primary/30 hover:prose-a:decoration-primary",
      "prose-img:my-10 prose-img:rounded-xl prose-img:border prose-img:border-border",
      "prose-figure:my-10 prose-figcaption:mt-3 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-muted-foreground",
      "prose-blockquote:my-8 prose-blockquote:border-l-2 prose-blockquote:border-l-primary prose-blockquote:pl-6 prose-blockquote:not-italic prose-blockquote:font-display prose-blockquote:text-xl",
      "prose-hr:my-12",
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
