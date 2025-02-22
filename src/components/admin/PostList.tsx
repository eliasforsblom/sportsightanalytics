import { Button } from "@/components/ui/button";
import { Pencil, Trash, Star, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
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
  const [showDrafts, setShowDrafts] = useState(true);
  const [previewPost, setPreviewPost] = useState<Post | null>(null);
  
  const filteredPosts = showDrafts ? posts : posts.filter(post => !post.draft);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2 mb-4">
        <span className="text-sm text-gray-600">Show drafts</span>
        <Switch
          checked={showDrafts}
          onCheckedChange={setShowDrafts}
        />
      </div>

      {filteredPosts.map((post) => (
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
              {post.draft && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPreviewPost(post)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              )}
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

      <Dialog open={!!previewPost} onOpenChange={() => setPreviewPost(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {previewPost && (
            <div className="space-y-6">
              {previewPost.image_url && (
                <img 
                  src={previewPost.image_url} 
                  alt={previewPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              <h1 className="text-3xl font-bold">{previewPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{new Date(previewPost.created_at).toLocaleDateString()}</span>
                <span>{previewPost.category}</span>
              </div>
              <p className="text-lg text-gray-600">{previewPost.excerpt}</p>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};