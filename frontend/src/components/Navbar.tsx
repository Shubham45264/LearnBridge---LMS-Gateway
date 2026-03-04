import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, GraduationCap, LogOut, Menu, Search, User, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary shadow-[0_8px_30px_rgb(139,92,246,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-600 to-indigo-600">
            LearnBridge
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/search" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
            <Search className="h-4 w-4" /> Browse
          </Link>
          {isAuthenticated && (
            <Link to="/my-learning" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> My Learning
            </Link>
          )}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full p-0.5 border-2 border-transparent hover:border-primary/20 transition-all duration-300">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary text-white text-xs font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass border shadow-2xl rounded-2xl p-2 mt-2">
                <div className="px-3 py-3">
                  <p className="text-sm font-bold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="rounded-xl cursor-pointer py-2.5">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/my-learning")} className="rounded-xl cursor-pointer py-2.5">
                  <BookOpen className="mr-2 h-4 w-4 text-muted-foreground" /> My Learning
                </DropdownMenuItem>
                {user?.role === "instructor" && (
                  <DropdownMenuItem onClick={() => navigate("/instructor")} className="rounded-xl cursor-pointer py-2.5">
                    <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" /> Instructor
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/signin")} className="rounded-xl font-semibold">Sign In</Button>
              <Button size="sm" onClick={() => navigate("/signup")} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 active:scale-95 font-semibold">Get Started</Button>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden rounded-xl p-2 bg-muted/50 hover:bg-muted transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t glass p-6 md:hidden animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-2">
            <Link to="/search" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors">
              <Search className="h-4 w-4" /> Browse Courses
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-learning" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors">
                  <BookOpen className="h-4 w-4" /> My Learning
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors">
                  <User className="h-4 w-4" /> Profile
                </Link>
                {user?.role === "instructor" && (
                  <Link to="/instructor" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-primary/10 transition-colors">
                    <GraduationCap className="h-4 w-4" /> Instructor Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
                <Button variant="outline" size="lg" className="rounded-xl font-semibold" onClick={() => { navigate("/signin"); setMobileOpen(false); }}>Sign In</Button>
                <Button size="lg" className="rounded-xl bg-primary text-white font-semibold" onClick={() => { navigate("/signup"); setMobileOpen(false); }}>Register</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};


export default Navbar;
