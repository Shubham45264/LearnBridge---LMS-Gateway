import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GraduationCap, Loader2, Github } from "lucide-react";

const SigninPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 bg-background relative overflow-hidden pt-24 pb-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

        <div className="max-w-md w-full mx-auto space-y-10 animate-slow-fade">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_30px_rgb(139,92,246,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-600">
                LearnBridge
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">Welcome Back</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">Sign in to continue your learning journey and access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-base px-6"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                <Link to="#" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-base px-6"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 text-base font-bold transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In to Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl font-bold flex items-center gap-3 hover:bg-secondary/50 transition-all">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google" />
              Google
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl font-bold flex items-center gap-3 hover:bg-secondary/50 transition-all">
              <Github className="h-5 w-5" />
              Github
            </Button>
          </div>

          <p className="text-center text-sm font-medium text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>

      {/* Right Side - Visual/Quote */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        <div className="relative z-10 flex flex-col justify-center items-center text-center p-20 text-white space-y-8">
          <div className="h-24 w-24 rounded-3xl glass flex items-center justify-center mb-8 rotate-3 shadow-2xl">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-black leading-tight max-w-lg">
            "Investment in knowledge pays the best interest."
          </h2>
          <div className="space-y-1">
            <p className="font-bold text-xl">Benjamin Franklin</p>
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase">Founding Father of the U.S.</p>
          </div>

          <div className="flex gap-2 pt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 1 ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


export default SigninPage;
