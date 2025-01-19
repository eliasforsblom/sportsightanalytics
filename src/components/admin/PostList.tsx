import { Button } from "@/components/ui/button";
import { Pencil, Trash, Star, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  highlighted: boolean;
  created_at: string;
  draft: boolean;
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
        <Card key={post.id} className="p-6 transition-shadow hover:shadow-md">
          <div className="flex justify-between items-start gap-6">
            <div className="flex gap-6 flex-1 min-w-0">
              {post.image_url && (
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-gray-900 truncate">{post.title}</h2>
                  {post.draft && (
                    <Badge variant="secondary" className="ml-2">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </Badge>
                  )}
                  {!post.draft && (
                    <Badge variant="default" className="ml-2">
                      <Eye className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-primary mb-1">{post.category}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleHighlight(post.id, post.highlighted)}
                className={post.highlighted ? "text-yellow-500 hover:text-yellow-600" : ""}
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
        </Card>
      ))}
    </div>
  );
};