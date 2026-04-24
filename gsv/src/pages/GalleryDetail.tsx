import { useState, useEffect, useCallback } from "react";
import { useGetGallery, getGetGalleryQueryKey } from "@workspace/api-client-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { fmtDate } from "@/lib/utils";
import { Link } from "wouter";

export default function GalleryDetail({ id }: { id: string }) {
  const galleryId = parseInt(id, 10);
  const { data: gallery, isLoading } = useGetGallery(galleryId, {
    query: { enabled: !isNaN(galleryId), queryKey: getGetGalleryQueryKey(galleryId) }
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const nextImage = useCallback(() => {
    if (!gallery?.images?.length) return;
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % gallery.images.length : null));
  }, [gallery?.images]);
  
  const prevImage = useCallback(() => {
    if (!gallery?.images?.length) return;
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + gallery.images.length) % gallery.images.length : null));
  }, [gallery?.images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, closeLightbox, nextImage, prevImage]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Skeleton className="aspect-square" />
          <Skeleton className="aspect-square" />
          <Skeleton className="aspect-square" />
          <Skeleton className="aspect-square" />
        </div>
      </div>
    );
  }

  if (!gallery) {
    return <Empty title="Gallery not found" description="The gallery you are looking for does not exist." />;
  }

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-12">
      <div className="max-w-4xl mb-12">
        <div className="w-12 h-1 bg-primary mb-6" />
        <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2 block">
          {gallery.category.replace("_", " ")}
        </span>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6 leading-tight">
          {gallery.title}
        </h1>
        {gallery.description && (
          <p className="text-xl text-muted-foreground mb-6 font-medium max-w-2xl">{gallery.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-8">
          <span>{fmtDate(gallery.createdAt)}</span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>{gallery.images?.length || 0} Photos</span>
        </div>

        {gallery.game && (
          <div className="inline-block bg-card border border-border p-4 shadow-sm group hover:border-primary/50 transition-colors">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Related Game</h4>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <div className="font-bold text-xs uppercase tracking-tight">{gallery.game.homeTeam}</div>
              </div>
              <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">VS</div>
              <div className="text-center">
                <div className="font-bold text-xs uppercase tracking-tight">{gallery.game.awayTeam}</div>
              </div>
            </div>
            <Link href={`/games/${gallery.game.id}`} className="block text-center text-[10px] font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors bg-muted py-1.5 group-hover:bg-primary/10">
              View Matchup →
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {gallery.images?.sort((a, b) => a.position - b.position).map((img, index) => (
          <div
            key={img.id}
            className="aspect-square bg-muted cursor-pointer overflow-hidden group border border-border hover:border-primary/50 transition-colors"
            onClick={() => setLightboxIndex(index)}
          >
            <img
              src={img.url}
              alt={img.caption || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>

      {lightboxIndex !== null && gallery.images && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="absolute inset-0" onClick={closeLightbox} />
          
          <button
            className="absolute top-4 right-4 z-[101] text-white/50 hover:text-white transition-colors"
            onClick={closeLightbox}
          >
            <X size={32} />
          </button>

          <div className="absolute top-6 left-6 z-[101] text-primary font-black text-sm uppercase tracking-widest">
            {lightboxIndex + 1} <span className="text-white/30 mx-2">/</span> {gallery.images.length}
          </div>

          <button
            className="absolute left-4 md:left-8 z-[101] text-white/50 hover:text-primary transition-colors p-4 hidden md:block"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
          >
            <ChevronLeft size={48} strokeWidth={1} />
          </button>

          <div className="relative z-[100] pointer-events-none flex flex-col items-center">
            <img
              src={gallery.images[lightboxIndex].url}
              alt={gallery.images[lightboxIndex].caption || "Lightbox image"}
              className="max-h-[85vh] max-w-[90vw] object-contain drop-shadow-2xl"
            />
            {gallery.images[lightboxIndex].caption && (
              <div className="mt-4 text-center max-w-2xl">
                <span className="text-white/80 font-medium text-sm md:text-base">
                  {gallery.images[lightboxIndex].caption}
                </span>
              </div>
            )}
          </div>

          <button
            className="absolute right-4 md:right-8 z-[101] text-white/50 hover:text-primary transition-colors p-4 hidden md:block"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
          >
            <ChevronRight size={48} strokeWidth={1} />
          </button>
          
          {/* Mobile navigation controls */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-12 md:hidden z-[101]">
             <button
              className="text-white/50 hover:text-primary transition-colors p-4 bg-black/50 rounded-full"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="text-white/50 hover:text-primary transition-colors p-4 bg-black/50 rounded-full"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
