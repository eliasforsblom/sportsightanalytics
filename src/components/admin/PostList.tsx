import { Button } from "@/components/ui/button";
import { Pencil, Trash, Star } from "lucide-react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  highlighted: boolean;
  created_at: string;
}

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onToggleHighlight: (id: string, highlighted: boolean) => void;
}

export const PostList = ({ posts, onEdit, onDelete, onToggleHighlight }: PostListProps) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600">{post.category}</p>
                <p className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</p>
                <p className="mt-2">{post.excerpt}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleHighlight(post.id, post.highlighted)}
                className={post.highlighted ? "text-yellow-500" : ""}
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(post)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(post.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};