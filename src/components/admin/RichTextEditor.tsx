import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  Image as ImageIcon,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Video
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onVideoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export const RichTextEditor = ({ value, onChange, onImageUpload, onVideoUpload }: RichTextEditorProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [showImageInput, setShowImageInput] = useState(false);
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const insertAtCursor = (before: string, after: string = "") => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      insertAtCursor(`<img src="${publicUrl}" alt="Uploaded image" class="max-w-full rounded-lg my-4" />\n`);
      
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('post-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-videos')
        .getPublicUrl(filePath);

      insertAtCursor(`<video controls class="w-full rounded-lg my-4">
        <source src="${publicUrl}" type="${file.type}">
        Your browser does not support the video tag.
      </video>\n`);
      
      if (onVideoUpload) {
        onVideoUpload(event);
      }
      
      toast({
        title: "Video uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error uploading video",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageUrl = () => {
    if (imageUrl) {
      insertAtCursor(`<img src="${imageUrl}" alt="Image" class="max-w-full rounded-lg my-4" />\n`);
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const handleVideoUrl = () => {
    if (videoUrl) {
      insertAtCursor(`<video controls class="w-full rounded-lg my-4">
        <source src="${videoUrl}">
        Your browser does not support the video tag.
      </video>\n`);
      setVideoUrl("");
      setShowVideoInput(false);
    }
  };

  const handleLink = () => {
    if (linkUrl && linkText) {
      insertAtCursor(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80">${linkText}</a>`);
      setLinkUrl("");
      setLinkText("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 p-2 bg-accent rounded-t-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor("<h1>", "</h1>")}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor("<h2>", "</h2>")}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor("<strong>", "</strong>")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor("<em>", "</em>")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor("<ul>\n  <li>", "</li>\n</ul>")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor("<ol>\n  <li>", "</li>\n</ol>")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor('<blockquote class="border-l-4 border-primary pl-4 italic">', "</blockquote>")}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => insertAtCursor('<code class="bg-accent px-2 py-1 rounded">', "</code>")}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowVideoInput(!showVideoInput)}
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {showImageInput && (
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button 
            type="button"
            onClick={handleImageUrl}
            size="sm"
          >
            Insert
          </Button>
          <div className="mx-2">or</div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </div>
      )}

      {showVideoInput && (
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Enter video URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <Button 
            type="button"
            onClick={handleVideoUrl}
            size="sm"
          >
            Insert
          </Button>
          <div className="mx-2">or</div>
          <Input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            disabled={uploading}
          />
        </div>
      )}

      {showLinkInput && (
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Link text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
          />
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
          <Button 
            type="button"
            onClick={handleLink}
            size="sm"
          >
            Insert
          </Button>
        </div>
      )}

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[300px] font-mono"
        placeholder="Write your post content here..."
      />
    </div>
  );
};