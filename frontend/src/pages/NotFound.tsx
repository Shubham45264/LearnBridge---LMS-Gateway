import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh relative overflow-hidden animate-slow-fade">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="glass-card max-w-2xl w-full p-20 rounded-[48px] border-primary/5 shadow-[0_32px_128px_-12px_rgba(0,0,0,0.1)] text-center relative z-10">
        <div className="relative inline-block mb-10">
          <h1 className="text-[120px] font-black tracking-tighter leading-none text-gradient opacity-20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center translate-y-4">
            <div className="h-24 w-24 rounded-[32px] bg-primary/10 flex items-center justify-center">
              <Search className="h-10 w-10 text-primary" />
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-black mb-4 tracking-tight">You've reached a dead end</h2>
        <p className="text-muted-foreground text-lg font-medium max-w-md mx-auto mb-12">
          The path you were looking for doesn't exist anymore or was never there. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <Button className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95">
              <ArrowLeft className="mr-3 h-5 w-5" /> Back to Home
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" className="h-14 px-10 rounded-2xl border-primary/20 hover:bg-primary/5 font-bold text-lg transition-all">
              Search Courses
            </Button>
          </Link>
        </div>

        <div className="mt-16 pt-10 border-t border-border/50">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Error logged for pathname: <span className="text-primary italic lowercase">{location.pathname}</span></p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
