import { useListPosts, useDeletePost, getListPostsQueryKey, useUpdatePost } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

export default function PostsList() {
  const { data: posts, isLoading } = useListPosts({ includeUnpublished: true });
  const deleteMutation = useDeletePost();
  const updateMutation = useUpdatePost();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Post deleted" });
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to delete", description: err.message });
      }
    });
  };

  const handleTogglePublish = (id: number, published: boolean) => {
    updateMutation.mutate({ id, data: { published } }, {
      onSuccess: () => {
        toast({ title: published ? "Post published" : "Post unpublished" });
        queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to update", description: err.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Posts</h1>
        <Link href="/admin/posts/new">
          <Button className="font-bold uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-sm">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No posts found. Click "New Post" to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Body</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-[300px] truncate">
                    {post.body}
                  </TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{fmtDate(post.createdAt)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={post.published} 
                      onCheckedChange={(checked) => handleTogglePublish(post.id, checked)}
                      disabled={updateMutation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
