import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  useGetPost, 
  useCreatePost, 
  useUpdatePost, 
  getGetPostQueryKey,
  getListPostsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "high_school", label: "High School" },
  { value: "college", label: "College" },
  { value: "club", label: "Club" },
  { value: "events", label: "Events" },
  { value: "athlete_spotlight", label: "Athlete Spotlights" }
];

export default function PostForm({ id }: { id?: string }) {
  const postId = id ? parseInt(id, 10) : undefined;
  const isEditing = !!postId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingPost, isLoading: isLoadingPost } = useGetPost(
    postId!, 
    { query: { enabled: isEditing && !isNaN(postId!), queryKey: getGetPostQueryKey(postId!) } }
  );

  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState(false);

  // Initialize form
  useEffect(() => {
    if (isEditing && existingPost) {
      setBody(existingPost.body);
      setCategory(existingPost.category || "general");
      setAuthor(existingPost.author);
      setPublished(existingPost.published);
    }
  }, [isEditing, existingPost]);

  const handleSubmit = (e: React.FormEvent, isPublished: boolean) => {
    e.preventDefault();
    
    if (!body) {
      toast({ variant: "destructive", title: "Post body required" });
      return;
    }

    const payload = {
      body,
      category: category === "general" ? null : category,
      author,
      published: isPublished,
    };

    if (isEditing && postId) {
      updateMutation.mutate({ id: postId, data: payload }, {
        onSuccess: () => {
          toast({ title: "Post updated" });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetPostQueryKey(postId) });
          setLocation("/admin/posts");
        },
        onError: (err) => toast({ variant: "destructive", title: "Update failed", description: err.message })
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          toast({ title: "Post created" });
          queryClient.invalidateQueries({ queryKey: getListPostsQueryKey() });
          setLocation("/admin/posts");
        },
        onError: (err) => toast({ variant: "destructive", title: "Creation failed", description: err.message })
      });
    }
  };

  if (isEditing && isLoadingPost) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-2xl space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {isEditing ? "Edit Post" : "New Post"}
        </h1>
      </div>

      <form className="space-y-8 bg-card border border-border p-6 md:p-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest flex justify-between">
              <span>Body Content</span>
              <span className={body.length > 280 ? "text-destructive" : "text-muted-foreground"}>
                {body.length} / 280
              </span>
            </Label>
            <Textarea 
              required 
              value={body} 
              onChange={e => setBody(e.target.value)} 
              rows={5}
              placeholder="What's happening?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Author</Label>
              <Input required value={author} onChange={e => setAuthor(e.target.value)} />
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
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => setLocation("/admin/posts")}>Cancel</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={(e) => handleSubmit(e, false)}
            disabled={isPending}
          >
            Save Draft
          </Button>
          <Button 
            type="button" 
            onClick={(e) => handleSubmit(e, true)}
            disabled={isPending} 
            className="font-bold uppercase tracking-widest"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing && existingPost?.published ? "Update Post" : "Publish Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
