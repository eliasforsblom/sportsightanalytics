import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PostForm } from "@/components/admin/PostForm";
import { PostList } from "@/components/admin/PostList";

interface Post {
  id: string;
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

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

  const handleSubmit = async (data: Omit<Post, "id">) => {
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
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Post created successfully",
        });
      }

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

  const handleEdit = (post: Post) => {
    setIsEditing(post.id);
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

  const handleCreateNew = () => {
    setIsEditing(null);
    setDialogOpen(true);
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
              <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? "Edit Post" : "Create New Post"}</DialogTitle>
                </DialogHeader>
                <PostForm
                  initialData={posts.find(post => post.id === isEditing)}
                  onSubmit={handleSubmit}
                  isEditing={!!isEditing}
                  onClose={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>

        <PostList
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleHighlight={toggleHighlight}
        />
      </div>
    </div>
  );
};

export default AdminPosts;