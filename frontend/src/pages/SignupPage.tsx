import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { GraduationCap, Loader2, BookOpen } from "lucide-react";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(name, email, password, role);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Signup failed";
      const validationErrors = err.response?.data?.error?.errors || err.response?.data?.errors;

      if (validationErrors && Array.isArray(validationErrors)) {
        validationErrors.forEach((e: any) => toast.error(e.message || e));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Right Side - Visual (Swapped for Signup) */}
      <div className="hidden lg:flex flex-1 bg-primary relative overflow-hidden order-last">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />

        <div className="relative z-10 flex flex-col justify-center items-center text-center p-20 text-white space-y-8">
          <div className="h-24 w-24 rounded-3xl glass flex items-center justify-center mb-8 rotate-3 shadow-2xl">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-4xl font-black leading-tight max-w-lg">
            "The beautiful thing about learning is that no one can take it away from you."
          </h2>
          <div className="space-y-1">
            <p className="font-bold text-xl">B.B. King</p>
            <p className="text-white/60 text-sm font-medium tracking-widest uppercase">Legendary Musician</p>
          </div>

          <div className="flex gap-2 pt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === 2 ? 'w-8 bg-white' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-32 bg-background relative overflow-hidden pt-24 pb-12">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500" />

        <div className="max-w-md w-full mx-auto space-y-8 animate-slow-fade py-12">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group mb-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_30px_rgb(139,92,246,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-600">
                LearnBridge
              </span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">Create Account</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">Start your learning adventure with our premium platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="h-12 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all px-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="h-12 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all px-6"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="h-12 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all px-6"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Join as</Label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "student", label: "Learn", icon: GraduationCap },
                  { value: "instructor", label: "Teach", icon: BookOpen },
                ].map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all duration-300 ${role === r.value
                      ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 scale-[1.02]"
                      : "border-border hover:border-primary/20 hover:bg-secondary/50"
                      }`}
                  >
                    <r.icon className={`h-5 w-5 ${role === r.value ? "text-primary" : "text-muted-foreground"}`} />
                    <p className={`font-bold text-sm ${role === r.value ? "text-primary" : "text-foreground"}`}>{r.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 text-base font-bold transition-all active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Free Account"}
            </Button>
          </form>

          <p className="text-center text-sm font-medium text-muted-foreground">
            Already have an account? <Link to="/signin" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default SignupPage;
