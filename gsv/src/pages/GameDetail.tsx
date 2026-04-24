import { useGetGame, getGetGameQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Empty } from "@/components/ui/empty";
import { fmtDate } from "@/lib/utils";
import { TextOnlyCard } from "./CategoryArticles";

export default function GameDetail({ id }: { id: string }) {
  const gameId = parseInt(id, 10);
  const { data, isLoading } = useGetGame(gameId, {
    query: { enabled: !isNaN(gameId), queryKey: getGetGameQueryKey(gameId) }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-48 w-full mb-8" />
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!data?.game) {
    return <Empty title="Game not found" description="The game you are looking for does not exist." />;
  }

  const { game, articles, galleries } = data;

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-12">
      {/* Game Header */}
      <div className="bg-card border-t-4 border-primary p-8 md:p-12 mb-12 shadow-xl">
        <div className="text-center mb-8">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 inline-block">
            {game.category.replace("_", " ")} • {game.sport}
          </span>
          <div className="text-muted-foreground font-medium">{fmtDate(game.date)} • {game.location}</div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          <div className="text-center w-full md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter truncate">{game.homeTeam}</h2>
            <div className="text-6xl md:text-8xl font-black mt-4 text-primary">{game.homeScore ?? "-"}</div>
          </div>
          
          <div className="text-xl md:text-3xl font-black text-muted-foreground uppercase tracking-widest">VS</div>
          
          <div className="text-center w-full md:w-1/3">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter truncate">{game.awayTeam}</h2>
            <div className="text-6xl md:text-8xl font-black mt-4 text-primary">{game.awayScore ?? "-"}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Articles Section */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-border pb-2">Coverage</h3>
          {!articles || articles.length === 0 ? (
            <p className="text-muted-foreground">No articles published for this game yet.</p>
          ) : (
            <div className="space-y-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className="group flex flex-col sm:flex-row gap-6 bg-card border border-border hover:border-primary transition-colors cursor-pointer h-full items-stretch">
                  {article.coverImage ? (
                    <div className="w-full sm:w-64 aspect-video bg-muted shrink-0 overflow-hidden">
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full sm:w-64 shrink-0 bg-black flex flex-col justify-end p-4 group-hover:bg-zinc-900 transition-colors">
                       <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{article.category.replace("_", " ")}</span>
                       <div className="w-8 h-0.5 bg-primary" />
                    </div>
                  )}
                  <div className="flex flex-col justify-center p-4 sm:p-0 sm:pr-4 sm:py-4 flex-1">
                    <h4 className="text-xl font-black group-hover:text-primary transition-colors mb-2 leading-tight tracking-tight">{article.title}</h4>
                    <p className="text-muted-foreground line-clamp-2 text-sm mb-3">{article.subtitle}</p>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-auto">
                      By {article.author}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Galleries Section */}
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b-2 border-border pb-2">Photos</h3>
          {!galleries || galleries.length === 0 ? (
            <p className="text-muted-foreground">No photo galleries for this game yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {galleries.map((gallery) => (
                <Link key={gallery.id} href={`/galleries/${gallery.id}`} className="group block cursor-pointer">
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative mb-3">
                    <img src={gallery.coverImage} alt={gallery.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                      {gallery.images?.length || 0} Photos
                    </div>
                  </div>
                  <h4 className="font-bold group-hover:text-primary transition-colors leading-tight">{gallery.title}</h4>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
