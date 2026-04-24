import { useLocation } from "wouter";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Skeleton } from "./ui/skeleton";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useGetMe();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !data?.user) {
      setLocation("/login");
    }
  }, [isLoading, data, setLocation]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!data?.user) {
    return null;
  }

  return <>{children}</>;
}
