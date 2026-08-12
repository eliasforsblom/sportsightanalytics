import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Star, Eye, EyeOff, Search, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/date-utils";

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
  translations?: { sv: { title: string; excerpt: string; content: string } };
}

interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: string) => void;
  onToggleHighlight: (id: string, highlighted: boolean) => void;
  onToggleDraft?: (id: string, draft: boolean) => void;
}

type Filter = "all" | "published" | "draft";

export const PostList = ({ posts, onEdit, onDelete, onToggleHighlight, onToggleDraft }: PostListProps) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (filter === "published" && post.draft) return false;
      if (filter === "draft" && !post.draft) return false;
      if (!term) return true;
      return (
        post.title.toLowerCase().includes(term) ||
        post.category.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term)
      );
    });
  }, [posts, filter, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({posts.length})</TabsTrigger>
            <TabsTrigger value="published">Published ({posts.filter((p) => !p.draft).length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({posts.filter((p) => p.draft).length})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts"
            className="pl-9"
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <Card className="p-10 text-center text-muted-foreground">No posts match this view.</Card>
      )}

      {filtered.map((post) => (
        <Card key={post.id} className="p-5 transition-shadow hover:shadow-md">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 flex-1 gap-5">
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt=""
                  className="h-24 w-32 flex-shrink-0 rounded-lg object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg">{post.title}</h3>
                  <Badge variant={post.draft ? "secondary" : "default"}>
                    {post.draft ? <EyeOff className="mr-1 h-3 w-3" /> : <Eye className="mr-1 h-3 w-3" />}
                    {post.draft ? "Draft" : "Published"}
                  </Badge>
                  {post.highlighted && (
                    <Badge variant="outline" className="text-primary">
                      <Star className="mr-1 h-3 w-3" /> Featured
                    </Badge>
                  )}
                  {post.translations?.sv?.title && <Badge variant="outline">SV</Badge>}
                </div>
                <p className="mb-1 text-sm text-primary">{post.category}</p>
                <p className="mb-2 text-sm text-muted-foreground">{formatDate(post.created_at)}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </div>

            <div className="flex flex-shrink-0 flex-wrap gap-2">
              {onToggleDraft && (
                <Button variant="outline" size="sm" onClick={() => onToggleDraft(post.id, post.draft)}>
                  {post.draft ? "Publish" : "Unpublish"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleHighlight(post.id, post.highlighted)}
                title="Toggle featured"
              >
                <Star className={post.highlighted ? "h-4 w-4 fill-current text-primary" : "h-4 w-4"} />
              </Button>
              <Button variant="outline" size="sm" asChild title="View post">
                <Link to={`/research/${post.id}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(post)} title="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" title="Delete">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      "{post.title}" and its Swedish translation will be permanently removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(post.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
