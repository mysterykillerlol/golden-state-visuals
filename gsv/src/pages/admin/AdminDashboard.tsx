import { useGetAdminStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { FileText, Camera, Calendar, ArrowRight, MessageSquare } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: "Articles",
      value: stats.totalArticles,
      subValue: `${stats.publishedArticles} published • ${stats.draftArticles} drafts`,
      icon: FileText,
      link: "/admin/articles",
      newLink: "/admin/articles/new"
    },
    {
      title: "Posts",
      value: stats.totalPosts,
      subValue: "Short updates",
      icon: MessageSquare,
      link: "/admin/posts",
      newLink: "/admin/posts/new"
    },
    {
      title: "Galleries",
      value: stats.totalGalleries,
      subValue: `${stats.totalImages} total images`,
      icon: Camera,
      link: "/admin/galleries",
      newLink: "/admin/galleries/new"
    },
    {
      title: "Games",
      value: stats.totalGames,
      subValue: "Scores & schedules",
      icon: Calendar,
      link: "/admin/games",
      newLink: "/admin/games/new"
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to the GSV admin portal.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground mb-4">{stat.subValue}</div>
              <div className="flex items-center gap-4">
                <Link href={stat.link} className="inline-flex items-center text-xs font-bold text-primary hover:text-foreground transition-colors uppercase tracking-widest">
                  Manage <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
                <Link href={stat.newLink} className="inline-flex items-center text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest">
                  + New
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.totalArticles === 0 && stats.totalGalleries === 0 && (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-2">Ready to launch?</h2>
            <p className="text-muted-foreground mb-6">Your site is currently empty. Create your first piece of content.</p>
            <Link href="/admin/articles/new">
              <Button className="font-bold uppercase tracking-widest">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {stats.recentUploads && stats.recentUploads.length > 0 && (
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter mb-4">Recent Uploads</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {stats.recentUploads.map((upload) => (
              <Link key={upload.id} href={`/admin/galleries/${upload.galleryId}/edit`} className="group block">
                <div className="aspect-square bg-muted border border-border overflow-hidden relative">
                  <img 
                    src={upload.url} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest px-2 text-center">
                      {upload.galleryTitle}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
