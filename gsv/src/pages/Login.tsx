import { useState } from "react";
import { useLogin, getGetMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { data: { email, password } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          setLocation("/admin");
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: err.message || "Invalid credentials",
          });
        },
      }
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4 py-20">
      <div className="w-full max-w-md p-8 md:p-12 border border-border bg-card shadow-sm group hover:border-primary/50 transition-colors">
        <div className="w-12 h-1 bg-primary mb-8" />
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Editorial Access</h1>
        <p className="text-muted-foreground mb-8 text-sm font-medium">Authorized personnel only.</p>

        {loginMutation.isError && (
          <div className="bg-destructive/10 text-destructive text-sm font-bold uppercase tracking-widest px-4 py-3 mb-6 border border-destructive/20">
            Incorrect email or password.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
            <Input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-background border-border rounded-none focus-visible:ring-primary h-12"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
            <Input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-background border-border rounded-none focus-visible:ring-primary h-12"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full rounded-none font-bold uppercase tracking-widest h-12 mt-4"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
