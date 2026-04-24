import { useGetArticle, getGetArticleQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { fmtDate } from "@/lib/utils";

export default function ArticleDetail({ id }: { id: string }) {
  const articleId = parseInt(id, 10);
  const { data: article, isLoading } = useGetArticle(articleId, {
    query: { enabled: !isNaN(articleId), queryKey: getGetArticleQueryKey(articleId) }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <Skeleton className="w-full h-[60vh] mb-12" />
        <div className="container mx-auto px-4 max-w-3xl">
          <Skeleton className="h-12 mb-4" />
          <Skeleton className="h-6 mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
        </div>
      </div>
    );
  }

  if (!article) {
    return <Empty title="Article not found" description="The article you are looking for does not exist." />;
  }

  return (
    <article className="min-h-screen bg-background pb-20">
      {article.coverImage ? (
        <div className="relative w-full h-[60vh] lg:h-[70vh] bg-black">
          <img
            src={article.coverImage}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full">
            <div className="container mx-auto px-4 pb-12 max-w-4xl">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 inline-block bg-black/50 px-3 py-1 border border-primary/30">
                {article.category.replace("_", " ")}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight">
                {article.title}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl">{article.subtitle}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative w-full py-20 bg-black pt-32 lg:pt-40 pb-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="w-16 h-1.5 bg-primary mb-8" />
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-6 inline-block">
              {article.category.replace("_", " ")}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tight">
              {article.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-3xl leading-snug">{article.subtitle}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 max-w-4xl grid grid-cols-1 lg:grid-cols-4 gap-12 mt-8">
        <div className="lg:col-span-1 order-last lg:order-first">
          <div className="sticky top-24 border-t-4 border-primary pt-4">
            <div className="font-bold uppercase tracking-wider text-sm mb-1">By {article.author}</div>
            <div className="text-muted-foreground text-sm mb-8 font-medium">{fmtDate(article.createdAt)}</div>

            {article.game && (
              <div className="bg-card border border-border p-6 shadow-sm mb-8 group hover:border-primary/50 transition-colors">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4 border-b border-border pb-2">Related Game</h4>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-center w-2/5">
                    <div className="font-bold text-sm truncate uppercase tracking-tight">{article.game.homeTeam}</div>
                    <div className="text-2xl font-black mt-1">{article.game.homeScore ?? "-"}</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-black uppercase tracking-widest">VS</div>
                  <div className="text-center w-2/5">
                    <div className="font-bold text-sm truncate uppercase tracking-tight">{article.game.awayTeam}</div>
                    <div className="text-2xl font-black mt-1">{article.game.awayScore ?? "-"}</div>
                  </div>
                </div>
                <Link href={`/games/${article.game.id}`} className="block text-center text-[10px] font-black uppercase tracking-widest text-foreground hover:text-primary transition-colors bg-muted py-2 group-hover:bg-primary/10">
                  Game Details →
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-primary/80 prose-img:border prose-img:border-border"
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>
      </div>
    </article>
  );
}
