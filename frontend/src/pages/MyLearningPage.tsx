import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

import CourseCard from "@/components/CourseCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const MyLearningPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await authService.getProfile();
        const user = res.data.data || res.data.user || res.data;
        const enrolled = user.enrolledCourses?.filter((e: any) => !!e.course) || [];
        setCourses(enrolled);
      } catch (err) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  return (
    <div className="animate-slow-fade">
      <div className="bg-card border-b py-12 mb-10">
        <div className="container">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight">My Learning</h1>
            <p className="text-muted-foreground font-medium">Continue where you left off and master new skills.</p>
          </div>
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[350px] rounded-3xl bg-secondary animate-pulse" />
            ))
          ) : (
            courses.map((item) => (
              <CourseCard
                key={item.course?._id || item._id}
                course={item.course || item}
                progress={item.progress}
                isLearning={true}
              />
            ))
          )}

          {!loading && courses.length === 0 && (
            <div className="col-span-full py-32 text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto h-24 w-24 rounded-[40px] bg-secondary flex items-center justify-center mb-8 rotate-3">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-black mb-2">You haven't enrolled in any courses yet</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-10">
                Explore our massive library of premium courses and start your learning journey today.
              </p>
              <Button size="lg" className="rounded-2xl px-10 h-14 font-black text-base shadow-2xl shadow-primary/20" onClick={() => window.location.href = '/search'}>
                Browse Courses
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MyLearningPage;
