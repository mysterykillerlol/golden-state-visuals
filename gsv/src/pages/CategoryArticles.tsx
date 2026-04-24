import { useListArticles } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { fmtDate } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  high_school: "High School",
  college: "College",
  club: "Club",
  events: "Events",
  athlete_spotlight: "Athlete Spotlights",
};

export function TextOnlyCard({ category, title, author, date }: { category: string, title: string, author?: string, date?: string }) {
  return (
    <div className="w-full h-full min-h-[250px] bg-gradient-to-br from-black to-zinc-900 border border-white/10 p-6 md:p-8 flex flex-col justify-end group-hover:border-primary/50 transition-colors">
      <div className="w-12 h-1 bg-primary mb-4" />
      <span className="text-primary font-bold tracking-widest uppercase text-[10px] md:text-xs mb-2 block">{category.replace("_", " ")}</span>
      <h3 className="text-xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-3 text-[10px] md:text-xs text-white/60 font-bold uppercase tracking-wider mt-auto pt-4 border-t border-white/10">
        {author && <span>{author}</span>}
        {date && <span>{date}</span>}
      </div>
    </div>
  );
}

export default function CategoryArticles({ category }: { category: string }) {
  const { data: articles, isLoading } = useListArticles({ category });
  const title = CATEGORY_LABELS[category] || category;

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 border-b-4 border-primary pb-4 inline-block">
        {title}
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : !articles || articles.length === 0 ? (
        <Empty
          title={`No ${title} stories yet`}
          description={`We don't have any ${title} articles right now. Check back soon!`}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="group flex flex-col cursor-pointer h-full">
              {article.coverImage ? (
                <>
                  <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2">{article.category.replace("_", " ")}</span>
                    <h2 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{article.subtitle}</p>
                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-auto">
                      {fmtDate(article.createdAt)} • {article.author}
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full">
                  <TextOnlyCard 
                    category={article.category} 
                    title={article.title} 
                    author={article.author} 
                    date={fmtDate(article.createdAt)} 
                  />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
