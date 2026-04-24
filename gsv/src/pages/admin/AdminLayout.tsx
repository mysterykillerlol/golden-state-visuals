import { Link, useLocation } from "wouter";
import { useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, FileText, Camera, Calendar, LogOut, Settings, MessageSquare } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      }
    });
  };

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Manage Articles", icon: FileText, exact: true },
    { href: "/admin/articles/new", label: "Create Article", icon: FileText },
    { href: "/admin/posts", label: "Posts", icon: MessageSquare },
    { href: "/admin/galleries", label: "Galleries", icon: Camera },
    { href: "/admin/games", label: "Games", icon: Calendar },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-black uppercase tracking-tighter">GSV Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location === item.href 
              : location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm font-bold text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold uppercase tracking-widest text-xs"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Nav (simplified) */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
           <h2 className="font-black uppercase tracking-tighter">GSV Admin</h2>
           <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
             Logout
           </Button>
        </div>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
