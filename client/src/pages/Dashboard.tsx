import { useJobs } from "@/hooks/use-jobs";
import { CreateJobDialog } from "@/components/CreateJobDialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { Briefcase, ArrowRight, Clock, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: jobs, isLoading } = useJobs();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
              Recruitment Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your job postings and find the perfect candidates.
            </p>
          </div>
          <CreateJobDialog />
        </div>

        {jobs && jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/jobs/${job.id}`}>
                  <Card className="h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 bg-white/50 backdrop-blur-sm cursor-pointer rounded-2xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl mb-3">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.createdAt ? format(new Date(job.createdAt), "MMM d") : "New"}
                        </span>
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">
                        {job.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-muted-foreground line-clamp-3 mb-6 h-18 text-sm leading-relaxed">
                        {job.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Users className="w-4 h-4" />
                          <span>View Candidates</span>
                        </div>
                        <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent text-primary font-semibold">
                          Open <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs posted yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Create your first job posting to start collecting resumes and ranking candidates.
            </p>
            <CreateJobDialog />
          </div>
        )}
      </div>
    </div>
  );
}
