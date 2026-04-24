import { useListGames, useDeleteGame, getListGamesQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function GamesList() {
  const { data: games, isLoading } = useListGames();
  const deleteMutation = useDeleteGame();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Game deleted" });
        queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Failed to delete", description: err.message });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Games</h1>
        <Link href="/admin/games/new">
          <Button className="font-bold uppercase tracking-widest text-xs">
            <Plus className="mr-2 h-4 w-4" /> New Game
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-sm">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : !games || games.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No games found. Click "New Game" to create one.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matchup</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date & Location</TableHead>
                <TableHead>Category/Sport</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell className="font-bold">
                    {game.homeTeam} vs {game.awayTeam}
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {(game.homeScore !== null && game.awayScore !== null) 
                      ? `${game.homeScore} - ${game.awayScore}` 
                      : "TBD"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{fmtDate(game.date)}</div>
                    <div className="text-xs text-muted-foreground">{game.location}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs font-bold uppercase tracking-widest">{game.category.replace("_", " ")}</div>
                    <div className="text-xs text-muted-foreground">{game.sport}</div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/admin/games/${game.id}/edit`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(game.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
