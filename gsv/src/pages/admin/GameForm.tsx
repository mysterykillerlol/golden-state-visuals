import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useGetGame, 
  useCreateGame, 
  useUpdateGame, 
  getGetGameQueryKey,
  getListGamesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { value: "high_school", label: "High School" },
  { value: "college", label: "College" },
  { value: "club", label: "Club" },
  { value: "events", label: "Events" }
];

export default function GameForm({ id }: { id?: string }) {
  const gameId = id ? parseInt(id, 10) : undefined;
  const isEditing = !!gameId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingData, isLoading: isLoadingGame } = useGetGame(
    gameId!, 
    { query: { enabled: isEditing && !isNaN(gameId!), queryKey: getGetGameQueryKey(gameId!) } }
  );

  const createMutation = useCreateGame();
  const updateMutation = useUpdateGame();

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [date, setDate] = useState("");
  const [location, setGameLocation] = useState("");
  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");
  const [category, setCategory] = useState("high_school");
  const [sport, setSport] = useState("Basketball");

  // Initialize form
  useEffect(() => {
    if (isEditing && existingData?.game) {
      const g = existingData.game;
      setHomeTeam(g.homeTeam);
      setAwayTeam(g.awayTeam);
      // Format ISO date to datetime-local expected format (YYYY-MM-DDThh:mm)
      setDate(new Date(g.date).toISOString().slice(0, 16));
      setGameLocation(g.location);
      setHomeScore(g.homeScore?.toString() || "");
      setAwayScore(g.awayScore?.toString() || "");
      setCategory(g.category);
      setSport(g.sport);
    }
  }, [isEditing, existingData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      homeTeam,
      awayTeam,
      date: new Date(date).toISOString(),
      location,
      homeScore: homeScore ? parseInt(homeScore) : null,
      awayScore: awayScore ? parseInt(awayScore) : null,
      category,
      sport,
    };

    if (isEditing && gameId) {
      updateMutation.mutate({ id: gameId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Game updated" });
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetGameQueryKey(gameId) });
          setLocation("/admin/games");
        },
        onError: (err) => toast({ variant: "destructive", title: "Update failed", description: err.message })
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Game created" });
          queryClient.invalidateQueries({ queryKey: getListGamesQueryKey() });
          setLocation("/admin/games");
        },
        onError: (err) => toast({ variant: "destructive", title: "Creation failed", description: err.message })
      });
    }
  };

  if (isEditing && isLoadingGame) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {isEditing ? "Edit Game" : "New Game"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-card border border-border p-6 md:p-8 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 p-4 border border-border bg-muted/20">
            <h3 className="font-black uppercase text-sm tracking-widest text-primary mb-4">Home Team</h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Name</Label>
              <Input required value={homeTeam} onChange={e => setHomeTeam(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Score (Optional)</Label>
              <Input type="number" value={homeScore} onChange={e => setHomeScore(e.target.value)} />
            </div>
          </div>

          <div className="space-y-4 p-4 border border-border bg-muted/20">
            <h3 className="font-black uppercase text-sm tracking-widest text-primary mb-4">Away Team</h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Name</Label>
              <Input required value={awayTeam} onChange={e => setAwayTeam(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Score (Optional)</Label>
              <Input type="number" value={awayScore} onChange={e => setAwayScore(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Date & Time</Label>
            <Input type="datetime-local" required value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Location</Label>
            <Input required value={location} onChange={e => setGameLocation(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Sport</Label>
            <Input required value={sport} onChange={e => setSport(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => setLocation("/admin/games")}>Cancel</Button>
          <Button type="submit" disabled={isPending} className="font-bold uppercase tracking-widest">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Game"}
          </Button>
        </div>
      </form>
    </div>
  );
}
