import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              R
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">
              Rank<span className="text-primary">AI</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-slate-900">{user.firstName} {user.lastName}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => logout()}
                className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Button asChild className="rounded-xl shadow-md shadow-primary/20">
              <a href="/api/login">Login</a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
