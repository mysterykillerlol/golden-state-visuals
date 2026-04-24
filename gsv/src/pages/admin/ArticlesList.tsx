import { useListArticles, useDeleteArticle, getListArticlesQueryKey, useUpdateArticle } from "@workspace/api-client-react";
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

export default function ArticlesList() {
  // Pass includeUnpublished if the backend supports it or just call it. 
  // Wait, backend admin routes return all when logged in. Let's just call it.
  const { data: articles, isLoading } = useListArticles();
  const deleteMutation = useDeleteArticle();
  const updateMutation = useUpdateArticle();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Article deleted" });
        queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to delete", description: err.message });
      }
    });
  };

  const handleTogglePublish = (id: number, published: boolean) => {
    updateMutation.mutate({ id, data: { published } }, {
      onSuccess: () => {
        toast({ title: published ? "Article published" : "Article unpublished" });
        queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to update", description: err.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Articles</h1>
        <Link href="/admin/articles/new">
          <Button className="font-bold uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> New Article
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
        ) : !articles || articles.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No articles found. Click "New Article" to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">
                    <div className="truncate max-w-[300px]">{article.title}</div>
                    {article.featured && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 ml-2 rounded-sm uppercase font-bold inline-block mt-1">Featured</span>}
                    {!article.coverImage && <span className="text-[10px] border border-border px-1.5 py-0.5 ml-2 rounded-sm uppercase font-bold inline-block mt-1">Text-only</span>}
                  </TableCell>
                  <TableCell className="capitalize text-xs font-bold text-muted-foreground">
                    {article.category.replace("_", " ")}
                  </TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{fmtDate(article.createdAt)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={article.published} 
                      onCheckedChange={(checked) => handleTogglePublish(article.id, checked)}
                      disabled={updateMutation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(article.id)}
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
