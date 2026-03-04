import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, Star } from "lucide-react";

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    subtitle?: string;
    thumbnail?: string;
    price?: number;
    instructor?: { name: string };
    category?: string;
    lectureCount?: number;
  };
  progress?: number;
  isLearning?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, progress, isLearning }) => {
  return (
    <Link
      to={isLearning ? `/course/${course._id}/learn` : `/course/${course._id}`}
      className="group block course-card-hover"
    >
      <div className="course-card-inner rounded-3xl glass-card overflow-hidden h-full flex flex-col premium-shadow transition-all duration-500">
        <div className="aspect-video relative overflow-hidden">
          {course.thumbnail ? (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-purple-500/20">
              <BookOpen className="h-12 w-12 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {course.category && (
            <Badge className="absolute top-4 left-4 glass text-[10px] uppercase tracking-wider font-bold border-0 rounded-lg px-2.5 py-1">
              {course.category}
            </Badge>
          )}

          {!isLearning && (
            <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <div className="glass p-2 rounded-xl">
                <ArrowRight className="h-4 w-4 text-primary" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-bold">4.8</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">• 2.5k reviews</span>
          </div>

          <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-2">
            {course.title}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-1 mb-4">
            by <span className="font-semibold text-foreground/80">{course.instructor?.name || "Expert Instructor"}</span>
          </p>

          <div className="mt-auto pt-4 border-t border-border/50">
            {isLearning ? (
              <div className="space-y-2.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-muted-foreground tracking-wide uppercase">Your Progress</span>
                  <span className="text-primary">{progress || 0}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress || 0}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Now</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {course.price ? (
                    <span className="font-extrabold text-lg text-primary tracking-tight">₹{course.price}</span>
                  ) : (
                    <span className="font-extrabold text-lg text-green-500 tracking-tight text-gradient">FREE</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};


export default CourseCard;
