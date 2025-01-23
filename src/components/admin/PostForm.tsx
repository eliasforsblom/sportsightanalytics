import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RichTextEditor } from "./RichTextEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  highlighted: boolean;
  created_at: string;
  draft: boolean;
  translations?: {
    sv: {
      title: string;
      excerpt: string;
      content: string;
    };
  };
}

interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  isEditing: boolean;
  onClose: () => void;
}

export const PostForm = ({ initialData, onSubmit, isEditing, onClose }: PostFormProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "sv">("en");

  const form = useForm<PostFormData>({
    defaultValues: {
      ...initialData || {
        title: "",
        excerpt: "",
        content: "",
        category: "",
        image_url: "",
        highlighted: false,
        created_at: new Date().toISOString().split('T')[0],
        draft: true,
      },
      translations: initialData?.translations || {
        sv: {
          title: "",
          excerpt: "",
          content: "",
        },
      },
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      form.setValue('image_url', publicUrl);
      
      toast({
        title: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const renderFormFields = (language: "en" | "sv") => {
    const basePrefix = language === "en" ? "" : `translations.${language}.`;
    const isTranslation = language !== "en";

    return (
      <div className="space-y-6">
        <FormField
          control={form.control}
          name={`${basePrefix}title` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Title</FormLabel>
              <FormControl>
                <Input {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePrefix}excerpt` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} className="w-full min-h-[100px] resize-y" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`${basePrefix}content` as any}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Content</FormLabel>
              <FormControl>
                <RichTextEditor 
                  value={field.value} 
                  onChange={field.onChange}
                  onImageUpload={handleImageUpload}
                />
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs value={currentLanguage} onValueChange={(value) => setCurrentLanguage(value as "en" | "sv")}>
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="sv">Svenska</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="space-y-6">
            {renderFormFields("en")}
          </TabsContent>
          <TabsContent value="sv" className="space-y-6">
            {renderFormFields("sv")}
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Category</FormLabel>
              <FormControl>
                <Input {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="created_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Publication Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">Featured Image</FormLabel>
              <div className="space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full"
                />
                {field.value && (
                  <div className="mt-2">
                    <img 
                      src={field.value} 
                      alt="Preview" 
                      className="max-w-[200px] rounded-md"
                    />
                  </div>
                )}
                <Input 
                  type="hidden" 
                  {...field}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highlighted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">Highlight Post</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="draft"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-semibold">Draft</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : isEditing ? "Update" : "Create"} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};