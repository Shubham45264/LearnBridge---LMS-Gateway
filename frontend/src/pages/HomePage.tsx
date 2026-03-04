import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseService } from "@/services/courseService";
import CourseCard from "@/components/CourseCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, Sparkles, Trophy, Users } from "lucide-react";

const HomePage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getPublished()
      .then((res) => {
        const data = res.data.data || res.data.courses || res.data || [];
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);


  return (
    <div className="animate-slow-fade">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest animate-bounce">
                <Sparkles className="h-3.5 w-3.5" />
                Next Generation Learning
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight">
                Master Any Skill <br />
                <span className="text-gradient">Without Limits.</span>
              </h1>

              <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Join 10,000+ students mastering development, design, and business with premium expert-led courses.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Button size="lg" className="rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 text-base font-bold transition-all active:scale-95 group" asChild>
                  <Link to="/search">
                    Explore All Courses
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button size="lg" variant="ghost" className="rounded-2xl h-14 px-8 text-base font-bold hover:bg-primary/10 transition-all" asChild>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                    </div>
                  ))}
                  <div className="h-10 w-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white">
                    +10k
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-bold">Trusted by</span> students globally
                </p>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden glass-card p-4 premium-shadow animate-float">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                  alt="Learning"
                  className="rounded-2xl w-full h-[400px] object-cover"
                />
                <div className="absolute top-10 right-10 glass p-4 rounded-2xl shadow-2xl animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Course Completed!</p>
                      <p className="text-[10px] text-muted-foreground">2 mins ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Blobs */}
              <div className="absolute -top-10 -right-10 h-64 w-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: "Courses", value: "500+", color: "text-blue-500" },
              { icon: Users, label: "Students", value: "10K+", color: "text-purple-500" },
              { icon: GraduationCap, label: "Instructors", value: "100+", color: "text-pink-500" },
              { icon: Trophy, label: "Completions", value: "25K+", color: "text-amber-500" },
            ].map((stat, i) => (
              <div key={i} className="text-center space-y-2 group">
                <div className={`mx-auto h-12 w-12 rounded-2xl bg-background flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-black">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container relative overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* Featured Courses */}
      <section className="py-32">
        <div className="container space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                Top Rated
              </div>
              <h2 className="text-4xl font-black">Popular Courses</h2>
              <p className="text-muted-foreground">The most sought-after skills in the industry right now.</p>
            </div>
            <Button variant="ghost" className="rounded-xl font-bold group" asChild>
              <Link to="/search">
                View All Courses
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-secondary animate-pulse" />
              ))
            ) : (
              courses.slice(0, 8).map((course) => (
                <CourseCard key={course._id} course={course} />
              ))
            )}
            {!loading && courses.length === 0 && (
              <div className="col-span-full py-20 text-center animate-in fade-in zoom-in duration-500">
                <div className="mx-auto h-20 w-20 rounded-3xl bg-secondary flex items-center justify-center mb-6">
                  <BookOpen className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold">No courses found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mt-2">Check back later for new expert-led content.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container relative overflow-hidden pb-10">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* CTA Section */}
      <section className="container pb-32">
        <div className="relative rounded-[40px] overflow-hidden bg-primary py-20 px-8 md:px-20 text-center space-y-10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-600 to-pink-500" />
          <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <GraduationCap className="h-64 w-64 text-white" />
          </div>

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Ready to Kickstart Your Career?
            </h2>
            <p className="text-white/80 text-lg">
              Unlock unlimited access to all courses and certificates with our premium plan. Start your 7-day free trial today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Button size="lg" className="rounded-2xl h-14 px-10 bg-white text-primary hover:bg-white/90 shadow-2xl font-bold text-base transition-all active:scale-95">
                Join Now for Free
              </Button>
              <Button variant="outline" size="lg" className="rounded-2xl h-14 px-10 border-white bg-white/10 text-white hover:bg-white/20 font-bold text-base backdrop-blur-sm transition-all">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


export default HomePage;
