import { useParams, Link } from "wouter";
import { useJob } from "@/hooks/use-jobs";
import { useCandidates, useUploadCandidate, useAnalyzeCandidate } from "@/hooks/use-candidates";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Upload, Bot, FileText, CheckCircle2, 
  AlertCircle, ChevronRight, Download, RefreshCw 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function JobDetail() {
  const { id } = useParams();
  const jobId = parseInt(id || "0");
  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const { data: candidates, isLoading: candidatesLoading } = useCandidates(jobId);
  const uploadCandidate = useUploadCandidate();
  const analyzeCandidate = useAnalyzeCandidate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Derived state
  const sortedCandidates = candidates?.slice().sort((a, b) => (b.score || 0) - (a.score || 0));

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("resume", file);
      
      try {
        await uploadCandidate.mutateAsync({ jobId, formData });
        toast({ 
          title: "Upload Complete", 
          description: `${file.name} has been added to the candidate pool.` 
        });
      } catch (error) {
        toast({ 
          title: "Upload Failed", 
          description: `Could not upload ${file.name}.`, 
          variant: "destructive" 
        });
      }
    }
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async (candidateId: number) => {
    try {
      await analyzeCandidate.mutateAsync({ id: candidateId, jobId });
      toast({ title: "Analysis Complete", description: "Candidate has been ranked successfully." });
    } catch (error) {
      toast({ title: "Analysis Failed", variant: "destructive" });
    }
  };

  if (jobLoading || !job) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>

        {/* Job Header */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">{job.title}</h1>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Posted On</span>
                <span className="font-medium text-slate-900">
                  {job.createdAt ? format(new Date(job.createdAt), "MMMM d, yyyy") : "Recently"}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Candidates</span>
                <span className="font-medium text-slate-900 text-2xl">
                  {candidates?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div 
          className={`
            relative rounded-3xl border-2 border-dashed transition-all duration-200 p-10 text-center mb-12
            ${isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-slate-300 hover:border-primary/50 hover:bg-slate-50"}
          `}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileUpload(e.dataTransfer.files);
          }}
        >
          <input 
            type="file" 
            multiple 
            accept=".pdf,.doc,.docx" 
            className="hidden" 
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Upload Resumes</h3>
            <p className="text-muted-foreground">
              Drag and drop PDF or DOCX files here, or click to browse. 
              We'll automatically analyze them against the job description.
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadCandidate.isPending}
              className="mt-4 rounded-xl px-8"
            >
              {uploadCandidate.isPending ? "Uploading..." : "Select Files"}
            </Button>
          </div>
        </div>

        {/* Candidates List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-bold text-slate-900">Candidate Rankings</h2>
            {candidates && candidates.length > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm bg-white">
                {candidates.length} Applicants
              </Badge>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            {candidatesLoading ? (
               <div className="p-8 space-y-4">
                 {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
               </div>
            ) : !candidates || candidates.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No candidates yet</h3>
                <p className="text-muted-foreground">Upload resumes to see AI-powered rankings.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="w-[300px] pl-8">Name / Email</TableHead>
                    <TableHead>Resume</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>AI Analysis</TableHead>
                    <TableHead className="text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {sortedCandidates?.map((candidate) => (
                      <motion.tr 
                        key={candidate.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-slate-50/80 transition-colors border-slate-100"
                      >
                        <TableCell className="pl-8 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900 text-base">{candidate.name}</span>
                            <span className="text-sm text-muted-foreground">{candidate.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="truncate max-w-[150px]">Resume.pdf</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {candidate.score !== null ? (
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-12 flex items-center justify-center">
                                <svg className="transform -rotate-90 w-12 h-12">
                                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                    className={`${
                                      candidate.score > 80 ? 'text-green-500' : 
                                      candidate.score > 50 ? 'text-yellow-500' : 'text-red-500'
                                    }`}
                                    strokeDasharray={125.6}
                                    strokeDashoffset={125.6 - (125.6 * candidate.score) / 100}
                                  />
                                </svg>
                                <span className="absolute text-xs font-bold">{candidate.score}</span>
                              </div>
                            </div>
                          ) : (
                            <Badge variant="secondary" className="bg-slate-100 text-slate-500">Pending</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-md">
                          {candidate.feedback ? (
                            <div className="text-sm text-slate-600 line-clamp-2" title={candidate.feedback}>
                              {candidate.feedback}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Not analyzed yet</span>
                          )}
                          
                          {candidate.skills && Array.isArray(candidate.skills) && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.skills.slice(0, 3).map((skill: string, idx: number) => (
                                <span key={idx} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className="text-[10px] text-slate-400 px-1">+{candidate.skills.length - 3}</span>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          {candidate.score === null ? (
                            <Button 
                              onClick={() => handleAnalyze(candidate.id)}
                              disabled={analyzeCandidate.isPending}
                              size="sm"
                              className="bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-all"
                            >
                              {analyzeCandidate.isPending && analyzeCandidate.variables?.id === candidate.id ? (
                                <><RefreshCw className="w-3 h-3 mr-2 animate-spin" /> Analyzing</>
                              ) : (
                                <><Bot className="w-3 h-3 mr-2" /> Analyze AI</>
                              )}
                            </Button>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                                  <CheckCircle2 className="w-5 h-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Analysis Complete</TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
