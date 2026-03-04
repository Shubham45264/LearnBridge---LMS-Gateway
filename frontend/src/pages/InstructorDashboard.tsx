import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { BookOpen, Edit, Loader2, Plus, User, Star, GraduationCap, PlayCircle } from "lucide-react";
import SkeletonCard from "@/components/SkeletonCard";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    courseService.getInstructorCourses()
      .then((res) => {
        const data = res.data.data || res.data.courses || res.data || [];
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-slow-fade">
      <div className="bg-card border-b py-12 mb-10">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight text-gradient">Instructor Studio</h1>
              <p className="text-muted-foreground font-medium text-lg italic">"Teaching is the highest form of understanding." — Aristotle</p>
            </div>
            <Button onClick={() => navigate("/instructor/create")} className="h-14 rounded-2xl px-8 bg-primary font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Plus className="mr-2 h-6 w-6" /> Create New Content
            </Button>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          {[
            { label: 'Total Students', value: '1,284', icon: User, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Active Courses', value: courses.length, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: 'Course Ratings', value: '4.9', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Monthly Earnings', value: '₹42,000', icon: GraduationCap, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl border-primary/5 shadow-xl shadow-primary/5 flex items-center gap-5">
              <div className={`h-14 w-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">{stat.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black tracking-tight">Your Courses</h2>
            <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-green-500" /> {courses.filter(c => c.isPublished).length} Published
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-32 animate-in fade-in zoom-in duration-500">
              <div className="mx-auto h-24 w-24 rounded-[40px] bg-secondary flex items-center justify-center mb-8 rotate-3">
                <BookOpen className="h-10 w-10 text-muted-foreground opacity-40" />
              </div>
              <h3 className="text-2xl font-black mb-2">No courses yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-10">Start sharing your knowledge with the world. Your first course is just a few clicks away!</p>
              <Button size="lg" onClick={() => navigate("/instructor/create")} className="h-14 rounded-2xl px-10 font-black shadow-2xl shadow-primary/20">
                Launch Your First Course
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {courses.map((c) => (
                <div key={c._id} className="group flex flex-col md:flex-row items-center gap-8 rounded-[32px] glass-card p-6 border-primary/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all">
                  <div className="h-40 w-full md:w-64 rounded-2xl bg-secondary overflow-hidden shrink-0 relative">
                    {c.thumbnail ? (
                      <img src={c.thumbnail} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/20" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className={`rounded-lg border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${c.isPublished ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {c.isPublished ? "Live" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{c.title}</h3>
                      <p className="text-muted-foreground font-medium line-clamp-1">{c.subtitle}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <PlayCircle className="h-4 w-4 text-primary" />
                        {c.lectures?.length || 0} Lectures
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <User className="h-4 w-4 text-primary" />
                        0 Students
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <Star className="h-4 w-4 text-amber-500" />
                        N/A Rating
                      </div>
                      <div className="text-sm font-black text-gradient">
                        {c.price > 0 ? `₹${c.price}` : "Free"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:w-40 h-12 rounded-xl font-bold gap-2 border-primary/20 hover:bg-primary/5" onClick={() => navigate(`/instructor/edit/${c._id}`)}>
                      <Edit className="h-4 w-4" /> Edit Content
                    </Button>
                    <Button variant="outline" className="flex-1 md:w-40 h-12 rounded-xl font-bold gap-2 border-primary/20 hover:bg-primary/5">
                      <User className="h-4 w-4" /> View Analytics
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default InstructorDashboard;
