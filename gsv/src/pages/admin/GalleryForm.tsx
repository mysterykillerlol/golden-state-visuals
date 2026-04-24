import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useGetGallery, 
  useCreateGallery, 
  useUpdateGallery, 
  useListGames,
  useAddGalleryImages,
  useDeleteGalleryImage,
  getGetGalleryQueryKey,
  getListGalleriesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { uploadFile, uploadFiles } from "@/lib/upload";
import { Loader2, Trash2, ImagePlus, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

const CATEGORIES = [
  { value: "high_school", label: "High School" },
  { value: "college", label: "College" },
  { value: "club", label: "Club" },
  { value: "events", label: "Events" }
];

interface LocalImage {
  file: File;
  previewUrl: string;
}

export default function GalleryForm({ id }: { id?: string }) {
  const galleryId = id ? parseInt(id, 10) : undefined;
  const isEditing = !!galleryId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingGallery, isLoading: isLoadingGallery } = useGetGallery(
    galleryId!, 
    { query: { enabled: isEditing && !isNaN(galleryId!), queryKey: getGetGalleryQueryKey(galleryId!) } }
  );

  const { data: games } = useListGames();

  const createMutation = useCreateGallery();
  const updateMutation = useUpdateGallery();
  const addImagesMutation = useAddGalleryImages();
  const deleteImageMutation = useDeleteGalleryImage();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("high_school");
  const [gameId, setGameId] = useState<number | undefined>();
  
  const [existingCoverImage, setExistingCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // For gallery images
  const [localImages, setLocalImages] = useState<LocalImage[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form
  useEffect(() => {
    if (isEditing && existingGallery) {
      setTitle(existingGallery.title);
      setDescription(existingGallery.description || "");
      setCategory(existingGallery.category);
      setGameId(existingGallery.gameId ?? undefined);
      setExistingCoverImage(existingGallery.coverImage);
    }
  }, [isEditing, existingGallery]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
      localImages.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    setCoverImageFile(file);
    setCoverImagePreview(URL.createObjectURL(file));
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    if (coverImagePreview) URL.revokeObjectURL(coverImagePreview);
    setCoverImagePreview(null);
    setExistingCoverImage("");
  };

  const handleMultipleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newLocalImages = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    setLocalImages(prev => [...prev, ...newLocalImages]);
    if (e.target) e.target.value = '';
  };

  const removeLocalImage = (index: number) => {
    setLocalImages(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleDeleteExistingImage = (imageId: number) => {
    if (!confirm("Remove this image from the gallery?")) return;
    if (!galleryId) return;

    deleteImageMutation.mutate({ id: galleryId, imageId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey(galleryId) });
      },
      onError: (err) => toast({ variant: "destructive", title: "Failed to delete", description: err.message })
    });
  };

  const handleSubmit = async (e: React.FormEvent, isPublished: boolean) => {
    e.preventDefault();
    
    if (!existingCoverImage && !coverImageFile) {
      toast({ variant: "destructive", title: "Cover image required" });
      return;
    }

    try {
      setIsSaving(true);
      
      let finalCoverImage = existingCoverImage;
      if (coverImageFile) {
        finalCoverImage = await uploadFile(coverImageFile);
      }

      // If we have local images, upload them first
      let uploadedImageUrls: string[] = [];
      if (localImages.length > 0) {
        const filesToUpload = localImages.map(img => img.file);
        uploadedImageUrls = await uploadFiles(filesToUpload);
      }

      const payload = {
        title,
        description,
        category,
        gameId: gameId || null,
        coverImage: finalCoverImage,
        published: isPublished
      };

      if (isEditing && galleryId) {
        await updateMutation.mutateAsync({ id: galleryId, data: payload });
        
        // Add new images to existing gallery if any were uploaded
        if (uploadedImageUrls.length > 0) {
          await addImagesMutation.mutateAsync({ 
            id: galleryId, 
            data: { urls: uploadedImageUrls } 
          });
        }
        
        toast({ title: "Gallery updated" });
      } else {
        // Create new gallery with all images
        await createMutation.mutateAsync({ 
          data: { ...payload, images: uploadedImageUrls } 
        });
        toast({ title: "Gallery created" });
      }

      queryClient.invalidateQueries({ queryKey: getListGalleriesQueryKey() });
      if (galleryId) queryClient.invalidateQueries({ queryKey: getGetGalleryQueryKey(galleryId) });
      setLocation("/admin/galleries");

    } catch (err: any) {
      toast({ variant: "destructive", title: "Save failed", description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing && isLoadingGallery) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  const isPending = isSaving;

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {isEditing ? "Edit Gallery" : "New Gallery"}
        </h1>
      </div>

      <form className="space-y-8 bg-card border border-border p-6 md:p-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Title</Label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Description (Optional)</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Related Game (Optional)</Label>
            <Select value={gameId ? gameId.toString() : "none"} onValueChange={v => setGameId(v === "none" ? undefined : parseInt(v))}>
              <SelectTrigger>
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {games?.map(g => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.homeTeam} vs {g.awayTeam} ({new Date(g.date).toLocaleDateString()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Label className="text-xs font-bold uppercase tracking-widest">Cover Image</Label>
            <div className="flex flex-col gap-4">
              {(coverImagePreview || existingCoverImage) ? (
                <div className="relative w-64 h-48 bg-muted overflow-hidden border border-border group">
                  <img src={coverImagePreview || existingCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-black text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleCoverChange} 
                    disabled={isPending}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Gallery Images Management */}
          <div className="space-y-4 pt-8 border-t border-border mt-8">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-black uppercase tracking-widest">Gallery Images</Label>
              <div className="relative">
                <Input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleMultipleImagesChange}
                  disabled={isPending}
                />
                <Button type="button" variant="outline" size="sm" className="font-bold uppercase tracking-widest text-xs">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Existing Images (Edit mode) */}
              {isEditing && existingGallery?.images?.map((img) => (
                <div key={img.id} className="aspect-square relative group bg-muted border border-border">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.id)}
                    className="absolute top-2 right-2 p-1.5 bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Pending Local Images */}
              {localImages.map((img, i) => (
                <div key={i} className="aspect-square relative group bg-muted border border-border">
                  <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5">
                    New
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLocalImage(i)}
                    className="absolute top-2 right-2 p-1.5 bg-black text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            {((isEditing && (!existingGallery?.images || existingGallery.images.length === 0)) || 
               (!isEditing && localImages.length === 0)) && (
              <div className="p-8 text-center border-2 border-dashed border-border bg-muted/20 text-muted-foreground text-sm uppercase tracking-widest font-bold">
                No images added yet
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => setLocation("/admin/galleries")} disabled={isPending}>Cancel</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={(e) => handleSubmit(e, false)}
            disabled={isPending}
          >
            Save Draft
          </Button>
          <Button 
            type="button" 
            onClick={(e) => handleSubmit(e, true)}
            disabled={isPending} 
            className="font-bold uppercase tracking-widest"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing && existingGallery?.published ? "Update Gallery" : "Publish Gallery"}
          </Button>
        </div>
      </form>
    </div>
  );
}
