import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { 
  useGetArticle, 
  useCreateArticle, 
  useUpdateArticle, 
  useListGames,
  getGetArticleQueryKey,
  getListArticlesQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/upload";
import { Bold, Italic, Heading2, List, Link as LinkIcon, Loader2, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = [
  { value: "high_school", label: "High School" },
  { value: "college", label: "College" },
  { value: "club", label: "Club" },
  { value: "events", label: "Events" },
  { value: "athlete_spotlight", label: "Athlete Spotlights" }
];

export default function ArticleForm({ id }: { id?: string }) {
  const articleId = id ? parseInt(id, 10) : undefined;
  const isEditing = !!articleId;
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingArticle, isLoading: isLoadingArticle } = useGetArticle(
    articleId!, 
    { query: { enabled: isEditing && !isNaN(articleId!), queryKey: getGetArticleQueryKey(articleId!) } }
  );

  const { data: games } = useListGames();

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState("high_school");
  const [gameId, setGameId] = useState<number | undefined>();
  const [author, setAuthor] = useState("");
  const [featured, setFeatured] = useState(false);
  
  const [existingCoverImage, setExistingCoverImage] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize form
  useEffect(() => {
    if (isEditing && existingArticle) {
      setTitle(existingArticle.title);
      setSubtitle(existingArticle.subtitle);
      setCategory(existingArticle.category);
      setGameId(existingArticle.gameId ?? undefined);
      setAuthor(existingArticle.author);
      setFeatured(existingArticle.featured);
      setExistingCoverImage(existingArticle.coverImage || "");
      if (editorRef.current && editorRef.current.innerHTML !== existingArticle.body) {
        editorRef.current.innerHTML = existingArticle.body;
      }
    }
  }, [isEditing, existingArticle]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverImagePreview(objectUrl);
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    setExistingCoverImage("");
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  const handleLink = () => {
    const url = prompt("Enter link URL:");
    if (url) execCommand("createLink", url);
  };

  const handleSubmit = async (e: React.FormEvent, isPublished: boolean) => {
    e.preventDefault();
    
    const body = editorRef.current?.innerHTML || "";
    if (!body || body === "<br>") {
      toast({ variant: "destructive", title: "Article body required" });
      return;
    }

    try {
      setIsSaving(true);
      
      let finalCoverImage = existingCoverImage;
      if (coverImageFile) {
        finalCoverImage = await uploadFile(coverImageFile);
      }

      const payload = {
        title,
        subtitle,
        category,
        gameId: gameId || null,
        author,
        featured,
        coverImage: finalCoverImage || undefined,
        body,
        published: isPublished
      };

      if (isEditing && articleId) {
        await updateMutation.mutateAsync({ id: articleId, data: payload });
        toast({ title: "Article updated" });
      } else {
        await createMutation.mutateAsync({ data: payload });
        toast({ title: "Article created" });
      }

      queryClient.invalidateQueries({ queryKey: getListArticlesQueryKey() });
      if (articleId) queryClient.invalidateQueries({ queryKey: getGetArticleQueryKey(articleId) });
      setLocation("/admin/articles");

    } catch (err: any) {
      toast({ variant: "destructive", title: "Save failed", description: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing && isLoadingArticle) {
    return <div className="p-8"><Skeleton className="h-96 w-full" /></div>;
  }

  const isPending = isSaving;

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">
          {isEditing ? "Edit Article" : "New Article"}
        </h1>
      </div>

      <form className="space-y-8 bg-card border border-border p-6 md:p-8">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Title</Label>
              <Input required value={title} onChange={e => setTitle(e.target.value)} />
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

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Subtitle</Label>
            <Input required value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Author</Label>
              <Input required value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest">Related Game (Optional)</Label>
              <Select value={gameId ? gameId.toString() : "none"} onValueChange={v => setGameId(v === "none" ? undefined : parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select game" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {games?.map(g => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.homeTeam} vs {g.awayTeam} ({new Date(g.date).toLocaleDateString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
            <Label htmlFor="featured" className="text-xs font-bold uppercase tracking-widest">Featured Story</Label>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Cover Image (Optional)</Label>
            <p className="text-xs text-muted-foreground mb-2">If left blank, a text-only card will be generated automatically.</p>
            <div className="flex flex-col gap-4">
              {(coverImagePreview || existingCoverImage) ? (
                <div className="relative w-64 h-48 bg-muted overflow-hidden border border-border group">
                  <img src={coverImagePreview || existingCoverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={removeCoverImage}
                    className="absolute top-2 right-2 bg-black text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-full">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    disabled={isPending}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest">Body Content</Label>
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="bg-muted p-2 flex gap-1 border-b border-border">
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('bold')}><Bold className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('italic')}><Italic className="h-4 w-4" /></Button>
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('formatBlock', 'H2')}><Heading2 className="h-4 w-4" /></Button>
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => execCommand('insertUnorderedList')}><List className="h-4 w-4" /></Button>
                <div className="w-px h-6 bg-border mx-1 my-auto" />
                <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleLink}><LinkIcon className="h-4 w-4" /></Button>
              </div>
              <div 
                ref={editorRef}
                className="min-h-[300px] p-4 focus:outline-none prose dark:prose-invert max-w-none bg-background"
                contentEditable
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => setLocation("/admin/articles")} disabled={isPending}>Cancel</Button>
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
            {isEditing && existingArticle?.published ? "Update Article" : "Publish Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
