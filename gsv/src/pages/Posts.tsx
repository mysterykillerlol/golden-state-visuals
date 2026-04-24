import { useListPosts } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/lib/utils";
import { Empty } from "@/components/ui/empty";

export default function PostsFeed() {
  const { data: posts, isLoading } = useListPosts();

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-12 border-b-4 border-black pb-4 flex items-end justify-between">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground">
            Live Updates
          </h1>
          <p className="text-muted-foreground mt-2 font-bold uppercase tracking-widest text-sm">
            Quick hits, scores, and breaking news
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      ) : !posts || posts.length === 0 ? (
        <Empty
          title="No posts yet"
          description="Check back soon for live updates and breaking news."
        />
      ) : (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {posts.map((post) => (
            <div key={post.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              
              {/* Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card p-6 border border-border shadow-sm hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  {post.category ? (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-muted text-muted-foreground">
                      {post.category.replace("_", " ")}
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary border border-primary/20">
                      Update
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {fmtDate(post.createdAt)}
                  </span>
                </div>
                
                <p className="text-lg md:text-xl font-medium leading-snug mb-4">
                  {post.body}
                </p>
                
                {post.author && (
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <div className="w-4 h-px bg-primary" />
                    {post.author}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
