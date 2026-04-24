import { useListPosts, useListArticles, useGetHomeFeatured } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/lib/utils";
import type { Article, Post } from "@workspace/api-client-react";
import { Empty } from "@/components/ui/empty";

function TextOnlyCard({ category, title, author, date }: { category: string, title: string, author?: string, date?: string }) {
  return (
    <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-black to-zinc-900 border border-white/10 p-8 flex flex-col justify-end group-hover:border-primary/50 transition-colors">
      <div className="w-12 h-1 bg-primary mb-6" />
      <span className="text-primary font-bold tracking-widest uppercase text-xs mb-3 block">{category.replace("_", " ")}</span>
      <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <div className="flex items-center gap-3 text-xs text-white/60 font-medium uppercase tracking-wider mt-auto pt-4 border-t border-white/10">
        {author && <span>{author}</span>}
        {date && <span>{date}</span>}
      </div>
    </div>
  );
}

function SectionBlock({ title, slug, limit = 4 }: { title: string, slug: string, limit?: number }) {
  const { data: articles, isLoading } = useListArticles({ category: slug, limit });

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-end justify-between mb-6 border-b-2 border-black pb-2">
        <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
        <Link href={`/${slug.replace("_", "-")}`} className="text-xs font-bold uppercase tracking-widest text-primary hover:text-black transition-colors">View All →</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`} className="group block h-full">
            <div className="flex flex-col h-full">
              {article.coverImage ? (
                <div className="aspect-[4/3] overflow-hidden bg-muted mb-4">
                  <img 
                    src={article.coverImage} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="mb-4 flex-1">
                  <TextOnlyCard category={article.category} title={article.title} />
                </div>
              )}
              {article.coverImage && (
                <div className="flex flex-col flex-1">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-1">{article.category.replace("_", " ")}</span>
                  <h3 className="text-lg font-black leading-tight mb-2 group-hover:text-primary transition-colors">{article.title}</h3>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-auto pt-2">
                    {fmtDate(article.createdAt)}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const { data: featuredData, isLoading: isFeaturedLoading } = useGetHomeFeatured();
  const { data: posts, isLoading: isPostsLoading } = useListPosts({ limit: 6 });

  if (isFeaturedLoading || isPostsLoading) {
    return (
      <div className="space-y-12 pb-12">
        <Skeleton className="w-full h-10 rounded-none" />
        <Skeleton className="w-full h-[60vh] rounded-none" />
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const { hero, gameOfTheWeek, latest, featuredGalleries } = featuredData || {};

  const isEmpty = !hero && (!latest || latest.length === 0) && (!posts || posts.length === 0);

  if (isEmpty) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-foreground">GSV</h1>
          <div className="w-24 h-2 bg-primary mx-auto mb-8" />
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4">Nothing live yet</h2>
          <p className="text-muted-foreground text-lg mb-12">Coverage starting soon. The premier independent sports media outlet for the Bay Area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ticker */}
      {posts && posts.length > 0 && (
        <div className="bg-black text-white border-b border-white/10 overflow-hidden relative flex items-center h-10">
          <div className="absolute left-0 top-0 bottom-0 bg-primary z-10 px-4 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-black">Latest</span>
          </div>
          <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] ml-24">
            {posts.map((post, i) => (
              <div key={post.id} className="flex items-center mx-8">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest mr-2 border border-primary/30 px-1.5 py-0.5">
                  {post.category ? post.category.replace("_", " ") : "UPDATE"}
                </span>
                <Link href="/posts" className="text-xs font-medium hover:text-primary transition-colors cursor-pointer">
                  {post.body.length > 60 ? post.body.substring(0, 60) + "..." : post.body}
                </Link>
                {i < posts.length - 1 && <span className="mx-8 text-white/20">•</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      {hero && (
        <section className="w-full bg-black group relative">
          {hero.coverImage ? (
            <div className="h-[60vh] md:h-[80vh] relative overflow-hidden">
              <img 
                src={hero.coverImage} 
                alt={hero.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-16 w-full max-w-5xl">
                <div className="w-16 h-1.5 bg-primary mb-6" />
                <span className="text-primary font-bold tracking-widest uppercase text-xs md:text-sm mb-4 inline-block bg-black/50 px-3 py-1 border border-primary/30">
                  {hero.category.replace("_", " ")}
                </span>
                <Link href={`/articles/${hero.id}`}>
                  <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-6 hover:text-primary transition-colors cursor-pointer tracking-tight">
                    {hero.title}
                  </h1>
                </Link>
                <p className="text-lg md:text-2xl text-gray-300 mb-6 max-w-3xl font-medium">{hero.subtitle}</p>
                <div className="flex items-center gap-6 text-xs md:text-sm text-gray-400 font-bold uppercase tracking-widest">
                  <span>By {hero.author}</span>
                  <span>{fmtDate(hero.createdAt)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[50vh] md:h-[60vh]">
              <Link href={`/articles/${hero.id}`} className="block h-full cursor-pointer">
                <TextOnlyCard 
                  category={hero.category} 
                  title={hero.title} 
                  author={hero.author} 
                  date={fmtDate(hero.createdAt)} 
                />
              </Link>
            </div>
          )}
        </section>
      )}

      <div className="container mx-auto px-4 py-12 md:py-16">
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* Latest News Column */}
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-2 inline-block">Latest Coverage</h2>
            <div className="space-y-6">
              {latest?.slice(0, 6).map((article) => (
                <Link key={article.id} href={`/articles/${article.id}`} className="group block">
                  <article className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-b border-border pb-6">
                    <div className="md:col-span-1 h-full min-h-[120px]">
                      {article.coverImage ? (
                        <div className="aspect-[4/3] md:aspect-square overflow-hidden bg-muted h-full">
                          <img 
                            src={article.coverImage} 
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-full bg-black p-4 flex flex-col justify-end group-hover:bg-zinc-900 transition-colors">
                          <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">{article.category.replace("_", " ")}</span>
                          <div className="w-6 h-0.5 bg-primary" />
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-3 flex flex-col justify-center">
                      <span className="text-primary font-bold text-[10px] uppercase tracking-widest mb-2 hidden md:block">{article.category.replace("_", " ")}</span>
                      <h3 className="text-xl md:text-2xl font-black mb-2 group-hover:text-primary transition-colors leading-tight tracking-tight">{article.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{article.subtitle}</p>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {fmtDate(article.createdAt)} • {article.author}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-12">
            
            {/* Game of the Week */}
            {gameOfTheWeek && (
              <div className="bg-black text-white p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-center text-primary">Game of the Week</h3>
                <div className="flex justify-between items-center mb-8">
                  <div className="text-center w-2/5">
                    <div className="text-4xl font-black mb-2">{gameOfTheWeek.homeScore ?? "-"}</div>
                    <div className="text-sm font-bold uppercase tracking-widest truncate text-white/80">{gameOfTheWeek.homeTeam}</div>
                  </div>
                  <div className="text-primary text-sm font-black uppercase tracking-widest">VS</div>
                  <div className="text-center w-2/5">
                    <div className="text-4xl font-black mb-2">{gameOfTheWeek.awayScore ?? "-"}</div>
                    <div className="text-sm font-bold uppercase tracking-widest truncate text-white/80">{gameOfTheWeek.awayTeam}</div>
                  </div>
                </div>
                <div className="text-center text-xs font-bold uppercase tracking-widest text-white/50 mb-6">
                  {fmtDate(gameOfTheWeek.date)}<br/>{gameOfTheWeek.location}
                </div>
                <Link href={`/games/${gameOfTheWeek.id}`} className="block text-center bg-white text-black font-black uppercase tracking-widest text-sm py-4 hover:bg-primary transition-colors">
                  Matchup Details
                </Link>
              </div>
            )}

            {/* Quick Posts */}
            {posts && posts.length > 0 && (
              <div className="border border-border p-6 bg-card">
                <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                  <h3 className="text-xl font-black uppercase tracking-tighter">Live Updates</h3>
                  <Link href="/posts" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-foreground">All →</Link>
                </div>
                <div className="space-y-6">
                  {posts.slice(0, 4).map(post => (
                    <div key={post.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      {post.category && (
                        <span className="inline-block px-1.5 py-0.5 bg-muted text-[10px] font-bold uppercase tracking-widest mb-2">
                          {post.category.replace("_", " ")}
                        </span>
                      )}
                      <p className="text-sm font-medium mb-2">{post.body}</p>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                        {fmtDate(post.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section Blocks */}
        <SectionBlock title="High School" slug="high_school" />
        <SectionBlock title="College" slug="college" />
        
        {/* Featured Galleries Strip */}
        {featuredGalleries && featuredGalleries.length > 0 && (
          <section className="mt-24 mb-16 bg-black text-white p-8 md:p-12 -mx-4 md:mx-0">
            <div className="flex items-end justify-between mb-10 border-b border-white/20 pb-4">
              <h2 className="text-3xl font-black uppercase tracking-tighter">Top Galleries</h2>
              <Link href="/galleries" className="text-xs font-bold uppercase tracking-widest text-primary hover:text-white transition-colors">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGalleries.map((gallery) => (
                <Link key={gallery.id} href={`/galleries/${gallery.id}`} className="group cursor-pointer block">
                  <div className="aspect-[4/5] overflow-hidden mb-4 relative border border-white/10">
                    <img 
                      src={gallery.coverImage} 
                      alt={gallery.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3 bg-primary text-black px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                      {gallery.images?.length || 0} Photos
                    </div>
                    <div className="absolute bottom-0 left-0 p-4 w-full">
                      <div className="w-8 h-1 bg-primary mb-3" />
                      <h3 className="font-black text-xl leading-tight group-hover:text-primary transition-colors text-white tracking-tight">{gallery.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <SectionBlock title="Athlete Spotlights" slug="athlete_spotlight" limit={4} />

      </div>
    </div>
  );
}
