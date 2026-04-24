import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { AuthGuard } from "@/components/AuthGuard";

import Home from "@/pages/Home";
import CategoryArticles from "@/pages/CategoryArticles";
import Galleries from "@/pages/Galleries";
import GalleryDetail from "@/pages/GalleryDetail";
import ArticleDetail from "@/pages/ArticleDetail";
import GameDetail from "@/pages/GameDetail";
import PostsFeed from "@/pages/Posts";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

import { AdminLayout } from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ArticlesList from "@/pages/admin/ArticlesList";
import ArticleForm from "@/pages/admin/ArticleForm";
import PostsList from "@/pages/admin/PostsList";
import PostForm from "@/pages/admin/PostForm";
import GamesList from "@/pages/admin/GamesList";
import GameForm from "@/pages/admin/GameForm";
import GalleriesList from "@/pages/admin/GalleriesList";
import GalleryForm from "@/pages/admin/GalleryForm";
import SettingsPage from "@/pages/admin/SettingsPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      {/* Admin Routes - Protected and wrapped in AdminLayout */}
      <Route path="/admin">
        <AuthGuard><AdminLayout><AdminDashboard /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/articles">
        <AuthGuard><AdminLayout><ArticlesList /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/articles/new">
        <AuthGuard><AdminLayout><ArticleForm /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/articles/:id/edit">
        {(params) => <AuthGuard><AdminLayout><ArticleForm id={params.id} /></AdminLayout></AuthGuard>}
      </Route>
      
      <Route path="/admin/posts">
        <AuthGuard><AdminLayout><PostsList /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/posts/new">
        <AuthGuard><AdminLayout><PostForm /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/posts/:id/edit">
        {(params) => <AuthGuard><AdminLayout><PostForm id={params.id} /></AdminLayout></AuthGuard>}
      </Route>

      <Route path="/admin/games">
        <AuthGuard><AdminLayout><GamesList /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/games/new">
        <AuthGuard><AdminLayout><GameForm /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/games/:id/edit">
        {(params) => <AuthGuard><AdminLayout><GameForm id={params.id} /></AdminLayout></AuthGuard>}
      </Route>
      
      <Route path="/admin/galleries">
        <AuthGuard><AdminLayout><GalleriesList /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/galleries/new">
        <AuthGuard><AdminLayout><GalleryForm /></AdminLayout></AuthGuard>
      </Route>
      <Route path="/admin/galleries/:id/edit">
        {(params) => <AuthGuard><AdminLayout><GalleryForm id={params.id} /></AdminLayout></AuthGuard>}
      </Route>

      <Route path="/admin/settings">
        <AuthGuard><AdminLayout><SettingsPage /></AdminLayout></AuthGuard>
      </Route>

      {/* Public Routes - Wrapped in Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/high-school">
              {() => <CategoryArticles category="high_school" />}
            </Route>
            <Route path="/college">
              {() => <CategoryArticles category="college" />}
            </Route>
            <Route path="/club">
              {() => <CategoryArticles category="club" />}
            </Route>
            <Route path="/events">
              {() => <CategoryArticles category="events" />}
            </Route>
            <Route path="/spotlights">
              {() => <CategoryArticles category="athlete_spotlight" />}
            </Route>
            
            <Route path="/galleries" component={Galleries} />
            <Route path="/galleries/:id">
              {(params) => <GalleryDetail id={params.id} />}
            </Route>
            
            <Route path="/articles/:id">
              {(params) => <ArticleDetail id={params.id} />}
            </Route>
            
            <Route path="/games/:id">
              {(params) => <GameDetail id={params.id} />}
            </Route>
            
            <Route path="/posts" component={PostsFeed} />
            
            <Route path="/login" component={Login} />
            
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
