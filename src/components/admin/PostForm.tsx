import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MarkdownEditor } from "./MarkdownEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";

const translationSchema = z.object({
  title: z.string().optional().default(""),
  excerpt: z.string().optional().default(""),
  content: z.string().optional().default(""),
});

const postSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  excerpt: z.string().trim().min(10, "Write a short excerpt (min 10 characters)"),
  content: z.string().trim().min(1, "Content is required"),
  category: z.string().trim().min(1, "Category is required"),
  image_url: z.string().trim().url("Upload or paste a featured image URL"),
  video_url: z.string().optional().or(z.literal("")),
  highlighted: z.boolean(),
  created_at: z.string().min(1),
  draft: z.boolean(),
  translations: z.object({ sv: translationSchema }),
});

export type PostFormData = z.infer<typeof postSchema>;

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  isEditing: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Transfers", "Analytics", "Expected Goals", "League Analysis", "Opinion"];

export const PostForm = ({ initialData, onSubmit, isEditing, onClose }: PostFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [language, setLanguage] = useState<"en" | "sv">("en");

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      excerpt: initialData?.excerpt ?? "",
      content: initialData?.content ?? "",
      category: initialData?.category ?? "",
      image_url: initialData?.image_url ?? "",
      video_url: initialData?.video_url ?? "",
      highlighted: initialData?.highlighted ?? false,
      created_at: (initialData?.created_at ?? new Date().toISOString()).split("T")[0],
      draft: initialData?.draft ?? true,
      translations: {
        sv: {
          title: initialData?.translations?.sv?.title ?? "",
          excerpt: initialData?.translations?.sv?.excerpt ?? "",
          content: initialData?.translations?.sv?.content ?? "",
        },
      },
    },
  });

  const uploadFeatured = async (event: React.ChangeEvent<HTMLInputElement>, kind: "image" | "video") => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const bucket = kind === "image" ? "post-images" : "post-videos";
      const { error } = await supabase.storage.from(bucket).upload(path, file);
      if (error) throw error;
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);
      form.setValue(kind === "image" ? "image_url" : "video_url", publicUrl, { shouldValidate: true });
      toast({ title: `${kind === "image" ? "Image" : "Video"} uploaded` });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const copyEnglishToSwedish = () => {
    form.setValue("translations.sv.title", form.getValues("title"));
    form.setValue("translations.sv.excerpt", form.getValues("excerpt"));
    form.setValue("translations.sv.content", form.getValues("content"));
    toast({ title: "English copied to Swedish", description: "Now translate the text." });
  };

  const submit = async (data: PostFormData) => {
    await onSubmit(data);
  };

  const svValues = form.watch("translations.sv");
  const hasSwedish = Boolean(svValues?.title || svValues?.excerpt || svValues?.content);
  const isDraft = form.watch("draft");

  const renderLocaleFields = (locale: "en" | "sv") => {
    const prefix = locale === "en" ? "" : "translations.sv.";
    return (
      <div className="space-y-6">
        <FormField
          control={form.control}
          name={`${prefix}title` as "title"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder={locale === "en" ? "Post title" : "Rubrik"} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${prefix}excerpt` as "excerpt"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} className="min-h-[90px] resize-y" placeholder="One or two sentences shown on cards and in search results." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${prefix}content` as "content"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <MarkdownEditor value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
        <Tabs value={language} onValueChange={(v) => setLanguage(v as "en" | "sv")}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="sv" className="gap-2">
                Svenska
                {hasSwedish && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
              </TabsTrigger>
            </TabsList>
            {language === "sv" && (
              <Button type="button" variant="outline" size="sm" onClick={copyEnglishToSwedish}>
                <Copy className="mr-2 h-4 w-4" /> Copy English
              </Button>
            )}
          </div>
          <TabsContent value="en" className="mt-6">{renderLocaleFields("en")}</TabsContent>
          <TabsContent value="sv" className="mt-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Optional. If left empty, Swedish readers see the English version.
            </p>
            {renderLocaleFields("sv")}
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 rounded-xl border border-border p-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} list="post-categories" placeholder="e.g. Transfers" />
                </FormControl>
                <datalist id="post-categories">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="created_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Publication date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Featured image</FormLabel>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="https://… or upload"
                      className="flex-1 min-w-[240px]"
                    />
                    <Button type="button" variant="outline" disabled={uploading} asChild>
                      <label className="cursor-pointer">
                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadFeatured(e, "image")} />
                      </label>
                    </Button>
                  </div>
                  {field.value && (
                    <img src={field.value} alt="Featured preview" className="h-40 w-full rounded-lg object-cover" />
                  )}
                </div>
                <FormDescription>Shown on the front page and research cards.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video_url"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Featured video (optional)</FormLabel>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder="https://… or upload"
                      className="flex-1 min-w-[240px]"
                    />
                    <Button type="button" variant="outline" disabled={uploading} asChild>
                      <label className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" /> Upload
                        <input type="file" accept="video/*" className="hidden" onChange={(e) => uploadFeatured(e, "video")} />
                      </label>
                    </Button>
                    {field.value && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => field.onChange("")}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {field.value && <video src={field.value} controls className="w-full max-w-sm rounded-lg" />}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highlighted"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <FormLabel>Highlight on front page</FormLabel>
                  <FormDescription>Adds the post to the featured carousel.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="draft"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border border-border p-4">
                <div>
                  <FormLabel>Draft</FormLabel>
                  <FormDescription>Drafts are hidden from the public site.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-3 border-t border-border bg-background/95 px-6 py-4 backdrop-blur">
          <Badge variant={isDraft ? "secondary" : "default"}>{isDraft ? "Draft" : "Published"}</Badge>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {isDraft && (
              <Button
                type="button"
                variant="secondary"
                disabled={form.formState.isSubmitting}
                onClick={() => {
                  form.setValue("draft", false);
                  form.handleSubmit(submit)();
                }}
              >
                Publish now
              </Button>
            )}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save changes" : "Create post"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
