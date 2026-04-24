import { useGetMe, useLogout, getGetMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  const { data } = useGetMe();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      }
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tighter">Settings</h1>
      
      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Admin Profile</CardTitle>
          <CardDescription>Currently signed in as</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Name</p>
              <p className="text-lg font-medium">{data?.user?.name || "Admin"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Email</p>
              <p className="text-lg font-medium">{data?.user?.email || "admin@example.com"}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <Button 
              variant="destructive" 
              className="font-bold uppercase tracking-widest"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center text-sm text-muted-foreground pt-12">
        <p>Golden State Visuals — Editorial CMS v1</p>
      </div>
    </div>
  );
}
