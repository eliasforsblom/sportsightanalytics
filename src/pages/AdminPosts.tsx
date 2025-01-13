import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { Pencil, Trash, Star } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PostFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image_url: string;
  highlighted: boolean;
}

const AdminPosts = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PostFormData>({
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image_url: "",
      highlighted: false,
    },
  });

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching posts",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPosts(data || []);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== "forsblomelias@gmail.com") {
        navigate("/");
      } else {
        setIsAdmin(true);
        fetchPosts();
      }
    };
    
    checkAdmin();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      if (isEditing) {
        const { error } = await supabase
          .from("posts")
          .update({
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            image_url: data.image_url,
            highlighted: data.highlighted,
            updated_at: new Date().toISOString(),
          })
          .eq("id", isEditing);

        if (error) throw error;

        toast({
          title: "Post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("posts")
          .insert([{
            title: data.title,
            excerpt: data.excerpt,
            content: data.content,
            category: data.category,
            image_url: data.image_url,
            highlighted: data.highlighted,
          }]);

        if (error) throw error;

        toast({
          title: "Post created successfully",
        });
      }

      form.reset();
      setIsEditing(null);
      setDialogOpen(false);
      fetchPosts();
    } catch (error: any) {
      toast({
        title: `Error ${isEditing ? "updating" : "creating"} post`,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (post: any) => {
    setIsEditing(post.id);
    form.reset({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image_url: post.image_url,
      highlighted: post.highlighted,
    });
    setDialogOpen(true);
  };

  const handleCreateNew = () => {
    setIsEditing(null);
    form.reset({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      image_url: "",
      highlighted: false,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Post deleted successfully",
    });

    fetchPosts();
  };

  const toggleHighlight = async (id: string, currentHighlighted: boolean) => {
    const { error } = await supabase
      .from("posts")
      .update({ highlighted: !currentHighlighted })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating highlight status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Post ${!currentHighlighted ? "highlighted" : "unhighlighted"} successfully`,
    });

    fetchPosts();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Manage Posts</h1>
          <div className="flex gap-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateNew}>Create New Post</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Post" : "Create New Post"}</DialogTitle>
                </DialogHeader>
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
                          <FormLabel>Content (HTML)</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-[200px]" />
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
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                    <Button type="submit">{isEditing ? "Update" : "Create"} Post</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p className="text-gray-600">{post.category}</p>
                  <p className="mt-2">{post.excerpt}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleHighlight(post.id, post.highlighted)}
                    className={post.highlighted ? "text-yellow-500" : ""}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(post)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPosts;