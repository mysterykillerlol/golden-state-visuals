import { useListGalleries, useDeleteGallery, getListGalleriesQueryKey, useUpdateGallery } from "@workspace/api-client-react";
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

export default function GalleriesList() {
  const { data: galleries, isLoading } = useListGalleries();
  const deleteMutation = useDeleteGallery();
  const updateMutation = useUpdateGallery();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery? This will also remove all its images.")) return;
    
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Gallery deleted" });
        queryClient.invalidateQueries({ queryKey: getListGalleriesQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to delete", description: err.message });
      }
    });
  };

  const handleTogglePublish = (id: number, published: boolean) => {
    updateMutation.mutate({ id, data: { published } }, {
      onSuccess: () => {
        toast({ title: published ? "Gallery published" : "Gallery unpublished" });
        queryClient.invalidateQueries({ queryKey: getListGalleriesQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to update", description: err.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Galleries</h1>
        <Link href="/admin/galleries/new">
          <Button className="font-bold uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> New Gallery
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
        ) : !galleries || galleries.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No galleries found. Click "New Gallery" to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleries.map((gallery) => (
                <TableRow key={gallery.id}>
                  <TableCell>
                    <div className="h-12 w-16 bg-muted overflow-hidden">
                      <img src={gallery.coverImage} alt="" className="h-full w-full object-cover" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-[200px]">{gallery.title}</TableCell>
                  <TableCell className="font-mono">{gallery.images?.length || 0}</TableCell>
                  <TableCell className="capitalize text-xs font-bold text-muted-foreground">
                    {gallery.category.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{fmtDate(gallery.createdAt)}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={gallery.published} 
                      onCheckedChange={(checked) => handleTogglePublish(gallery.id, checked)}
                      disabled={updateMutation.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/galleries/${gallery.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(gallery.id)}
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
