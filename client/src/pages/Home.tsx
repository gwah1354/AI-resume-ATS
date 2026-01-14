import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Bot, BrainCircuit, BarChart3 } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/dashboard");
    }
  }, [user, isLoading, setLocation]);

  // Loading state (while checking auth)
  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white opacity-70 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 mb-8 animate-enter opacity-0" style={{ animationDelay: '0.1s' }}>
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
              AI-Powered Recruitment V1.0
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 mb-8 animate-enter opacity-0" style={{ animationDelay: '0.2s' }}>
              Hire the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Top 1%</span> <br/>
              Faster than ever.
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-enter opacity-0" style={{ animationDelay: '0.3s' }}>
              Stop drowning in resumes. Our AI analyzes thousands of applicants instantly, ranking them by relevance, skills, and potential fit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-enter opacity-0" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="rounded-full px-8 h-14 text-lg shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300">
                <a href="/api/login">
                  Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full px-8 h-14 text-lg text-slate-600 hover:text-slate-900">
                <a href="#features">How it works</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Bot className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-3">AI Resume Parsing</h3>
              <p className="text-slate-600 leading-relaxed">
                Automatically extract skills, experience, and education from PDFs and DOCs with human-level accuracy.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
                <BrainCircuit className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-3">Contextual Matching</h3>
              <p className="text-slate-600 leading-relaxed">
                Go beyond keywords. Our AI understands semantic meaning to match candidates who truly fit the role.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900 mb-3">Smart Ranking</h3>
              <p className="text-slate-600 leading-relaxed">
                Instantly see the best candidates ranked by score, with detailed explanations for every decision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">Trusted by modern HR teams</h2>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple geometric placeholders for logos */}
            <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-8 w-32 bg-slate-200 rounded-md"></div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center opacity-80 text-sm">
          <p>&copy; 2025 RankAI Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
