import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateJob } from "@/hooks/use-jobs";
import { Plus, Briefcase, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { insertJobSchema } from "@shared/schema";

export function CreateJobDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();
  
  const createJob = useCreateJob();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createJob.mutateAsync({ title, description });
      toast({ title: "Success", description: "Job posting created successfully" });
      setOpen(false);
      setTitle("");
      setDescription("");
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to create job posting", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
          <Plus className="w-4 h-4" /> Create New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display text-primary">New Job Posting</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Job Title
            </label>
            <Input 
              placeholder="e.g. Senior Frontend Engineer" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" /> Description
            </label>
            <Textarea 
              placeholder="Paste the full job description here..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] rounded-xl border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createJob.isPending}
              className="rounded-xl min-w-[120px]"
            >
              {createJob.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
