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

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  highlighted: boolean;
  created_at: string;
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

  const form = useForm<PostFormData>({
    defaultValues: initialData || {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image_url: "",
      highlighted: false,
      created_at: new Date().toISOString().split('T')[0], // Default to today's date
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
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
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Publication Date</FormLabel>
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
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
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
                <FormLabel className="text-base">Highlight Post</FormLabel>
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
        <div className="flex justify-end gap-2">
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