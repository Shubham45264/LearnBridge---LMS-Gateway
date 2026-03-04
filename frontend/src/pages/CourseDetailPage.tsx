import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { paymentService } from "@/services/paymentService";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { BookOpen, CheckCircle, Clock, Loader2, PlayCircle, Shield, User, Star, ArrowRight, ExternalLink } from "lucide-react";
import { SkeletonLine } from "@/components/SkeletonCard";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      courseService.getCourse(courseId),
      courseService.getLectures(courseId).catch(() => ({ data: { lectures: [] } })),
    ])
      .then(([courseRes, lectureRes]) => {
        setCourse(courseRes.data.data || courseRes.data);
        const lectureData = lectureRes.data.data?.lectures || lectureRes.data.lectures || lectureRes.data;
        setLectures(Array.isArray(lectureData) ? lectureData : []);
      })

      .catch(() => toast.error("Failed to load course"))
      .finally(() => setLoading(false));
  }, [courseId]);

  const isEnrolled = user?.enrolledCourses?.some((e: any) => (e.course?._id || e.course) === courseId);


  const handleBuy = async () => {
    if (!isAuthenticated) { navigate("/signin"); return; }
    setBuying(true);
    try {
      if (course.price === 0) {
        await paymentService.enrollFree(courseId!);
        toast.success("Enrolled successfully!");
        navigate(`/course/${courseId}/learn`);
      } else {
        // Use Stripe Checkout
        const res = await paymentService.createStripeSession(courseId!);
        if (res.data.success && res.data.data?.checkoutUrl) {
          // Redirect to Stripe Checkout
          window.location.href = res.data.data.checkoutUrl;
        } else {
          toast.error("Failed to create checkout session");
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Process failed. Try again.");
    } finally {
      setBuying(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-20 space-y-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 w-2/3 bg-secondary animate-pulse rounded-2xl" />
            <div className="h-4 w-1/2 bg-secondary animate-pulse rounded-lg" />
            <div className="h-64 bg-secondary animate-pulse rounded-3xl" />
          </div>
          <div className="h-96 bg-secondary animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!course) return (
    <div className="container py-32 text-center space-y-6">
      <div className="mx-auto h-20 w-20 rounded-3xl bg-secondary flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-2xl font-black">Course Not Found</h3>
      <Button variant="outline" className="rounded-xl" onClick={() => navigate("/")}>Go Back Home</Button>
    </div>
  );

  return (
    <div className="animate-slow-fade">
      {/* Hero Header */}
      <div className="relative pt-20 pb-16 bg-card border-b overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="container max-w-6xl relative z-10">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="rounded-lg bg-primary/10 text-primary border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {course.category || "General"}
                </Badge>
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/5 px-3 py-1 rounded-lg">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  <span className="text-xs font-black">4.9 (4.2k Ratings)</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed italic">
                {course.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-3 bg-secondary/50 px-4 py-3 rounded-2xl">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarFallback className="bg-primary text-white text-xs font-bold">
                      {course.instructor?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Instructor</p>
                    <p className="text-sm font-bold">{course.instructor?.name || "Expert Instructor"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold leading-none">{lectures.length} Lectures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold leading-none">24h Total content</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-sm font-bold leading-none">Lifetime Access</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              {/* Fixed width placeholder or image if available */}
              <div className="rounded-3xl overflow-hidden glass-card p-2 premium-shadow rotate-1 aspect-video relative">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" className="rounded-2xl w-full h-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-secondary flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-primary/20" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="h-16 w-16 rounded-full bg-white text-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                    <PlayCircle className="h-8 w-8 fill-current" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-primary" />
                Description
              </h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed space-y-4">
                {course.description || "No description provided for this premium course."}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                  <div className="h-8 w-1.5 rounded-full bg-primary" />
                  Curriculum
                </h2>
                <Badge variant="outline" className="rounded-lg">{lectures.length} Lessons</Badge>
              </div>

              <div className="grid gap-3">
                {lectures.map((lec: any, i: number) => (
                  <div key={lec._id || i} className="group flex items-center justify-between p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center font-bold text-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="font-bold text-sm">{lec.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="text-xs font-medium">15:00</span>
                      <PlayCircle className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </div>
                  </div>
                ))}
                {lectures.length === 0 && (
                  <p className="text-sm text-muted-foreground italic bg-secondary/50 p-6 rounded-2xl text-center">Curriculum is being updated. Check back soon!</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar / CTA */}
          <div className="space-y-8">
            <div className="rounded-[32px] glass-card p-8 premium-shadow space-y-8 sticky top-24 border-primary/10">
              <div className="space-y-2">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">One-time payment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tight text-gradient">
                    {course.price ? `₹${course.price}` : "FREE"}
                  </span>
                  {course.price > 0 && <span className="text-lg text-muted-foreground line-through font-bold">₹{Math.round(course.price * 2.5)}</span>}
                </div>
              </div>

              <div className="space-y-3">
                {isEnrolled || user?._id === course.instructor?._id ? (
                  <Button className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all" onClick={() => navigate(`/course/${courseId}/learn`)}>
                    <PlayCircle className="mr-3 h-6 w-6" /> Continue Learning
                  </Button>
                ) : (
                  <>
                    <Button
                      className="w-full h-16 rounded-2xl bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 active:scale-95 transition-all disabled:opacity-70 group"
                      onClick={handleBuy}
                      disabled={buying}
                    >
                      {buying ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : <ArrowRight className="mr-3 h-6 w-6 transition-transform group-hover:translate-x-1" />}
                      {course.price === 0 ? "Enroll for Free" : "Buy Premium Access"}
                    </Button>

                  </>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <p className="text-xs font-bold uppercase tracking-widest text-center text-muted-foreground">Includes premium features</p>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { icon: CheckCircle, text: "Full lifetime access", color: "text-green-500" },
                    { icon: CheckCircle, text: "Course completion certificate", color: "text-green-500" },
                    { icon: CheckCircle, text: "Access on mobile and TV", color: "text-green-500" },
                    { icon: CheckCircle, text: "30-Day Money-Back Guarantee", color: "text-green-500" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                      <span className="text-sm font-bold text-foreground/80">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4 border-t border-border/50">
                <p className="text-xs font-bold text-muted-foreground">Share this course:</p>
                <div className="flex gap-2">
                  {['fb', 'tw', 'ln'].map(s => (
                    <div key={s} className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CourseDetailPage;
