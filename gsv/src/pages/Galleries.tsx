import { useListGalleries } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { fmtDate } from "@/lib/utils";

export default function Galleries() {
  const { data: galleries, isLoading } = useListGalleries();

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-primary pb-4 inline-block">
        Photo Galleries
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : !galleries || galleries.length === 0 ? (
        <Empty
          title="No galleries found"
          description="We haven't published any photo galleries yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleries.map((gallery) => (
            <Link key={gallery.id} href={`/galleries/${gallery.id}`} className="group cursor-pointer block h-full">
              <div className="flex flex-col h-full bg-card border border-border group-hover:border-primary/50 transition-colors">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3 bg-primary text-black px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                    {gallery.images?.length || 0} Photos
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-1">{gallery.category.replace("_", " ")}</span>
                  <h2 className="text-xl font-black leading-tight group-hover:text-primary transition-colors tracking-tight">
                    {gallery.title}
                  </h2>
                  <div className="text-[10px] text-muted-foreground mt-auto pt-4 uppercase tracking-widest font-bold">
                    {fmtDate(gallery.createdAt)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
