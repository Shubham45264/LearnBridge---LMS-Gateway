import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { courseService } from "@/services/courseService";
import { progressService } from "@/services/progressService";
import { toast } from "sonner";
import { CheckCircle, PlayCircle, Loader2, Clock, Shield, ExternalLink, GraduationCap, ArrowLeft, Menu, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ReactPlayerComponent = ReactPlayer as any;

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [lectures, setLectures] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      courseService.getCourse(courseId),
      courseService.getLectures(courseId),
      progressService.getCourseProgress(courseId).catch(() => null),
    ]).then(([courseRes, lecRes, progRes]) => {
      setCourse(courseRes.data.data || courseRes.data);
      const lectureData = lecRes.data.data?.lectures || lecRes.data.data || lecRes.data.lectures || lecRes.data;
      const fetchedLectures = Array.isArray(lectureData) ? lectureData : [];
      setLectures(fetchedLectures);

      if (fetchedLectures.length > 0) {
        setCurrent(0);
      }

      if (progRes?.data?.data) {
        setProgress(progRes.data.data);
      }
    }).finally(() => setLoading(false));
  }, [courseId]);

  const completedIds: string[] = Array.from(new Set(
    progress?.progress?.filter((l: any) => l.isCompleted).map((l: any) => l.lecture) || []
  ));
  const progressPercent = lectures.length > 0 ? Math.min(100, Math.round((completedIds.length / lectures.length) * 100)) : 0;

  const markComplete = async () => {
    const lec = lectures[current];
    if (!lec || !courseId) return;
    try {
      await progressService.markLectureComplete(courseId, lec._id);

      setProgress((p: any) => {
        const currentProgress = p?.progress || [];
        const isAlreadyMarked = currentProgress.some((item: any) => item.lecture === lec._id && item.isCompleted);

        if (isAlreadyMarked) return p;

        return {
          ...p,
          progress: [...currentProgress, { lecture: lec._id, isCompleted: true }],
        };
      });

      toast.success("Lecture marked as complete!");
    } catch {
      toast.error("Failed to update progress");
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Loading Classroom...</p>
      </div>
    </div>
  );

  if (lectures.length === 0) return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center animate-slow-fade">
      <div className="h-24 w-24 rounded-[40px] bg-secondary flex items-center justify-center mb-8 rotate-3">
        <PlayCircle className="h-12 w-12 text-muted-foreground opacity-30" />
      </div>
      <h2 className="text-3xl font-black mb-4 tracking-tight">Access Your Content</h2>
      <p className="text-muted-foreground max-w-md mb-10 text-lg leading-relaxed italic">
        "The first step towards getting somewhere is to decide that you are not going to stay where you are."
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} variant="outline" className="h-14 rounded-2xl px-8 font-bold">Refresh Content</Button>
        <Button onClick={() => window.history.back()} className="h-14 rounded-2xl px-10 font-black bg-primary shadow-xl shadow-primary/20">Go Back Home</Button>
      </div>
    </div>
  );

  const currentLecture = lectures[current];

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden animate-slow-fade">
      {/* Immersive Header */}
      <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 relative z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:scale-110">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="hidden sm:block text-lg font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              LearnBridge
            </span>
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl font-bold gap-2 text-muted-foreground hover:text-primary" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
              <span className="max-w-[200px] truncate">{course?.title}</span>
              <ChevronRight className="h-3 w-3" />
              <span className="text-primary">{currentLecture?.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={markComplete} disabled={completedIds.includes(currentLecture?._id)} className={`h-10 rounded-xl px-4 text-sm font-black transition-all ${completedIds.includes(currentLecture?._id) ? 'bg-green-500/10 text-green-600 border-0 hover:bg-green-500/10' : 'bg-primary shadow-lg shadow-primary/20 scale-100 hover:scale-105 active:scale-95'}`}>
            {completedIds.includes(currentLecture?._id) ? (
              <><CheckCircle className="mr-2 h-4 w-4" /> Completed</>
            ) : (
              <><CheckCircle className="mr-2 h-4 w-4" /> Mark Done</>
            )}
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Video Area (Main) */}
        <main className="flex-1 overflow-y-auto bg-slate-50/30 dark:bg-transparent">
          <div className="p-4 md:p-8 md:pb-24">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Video Player Wrapper */}
              <div className="group relative aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_22px_70px_4px_rgba(0,0,0,0.56)] border-[12px] border-card/80 transition-all duration-500 hover:border-card">
                {currentLecture?.videoUrl ? (
                  <ReactPlayerComponent
                    url={currentLecture.videoUrl}
                    width="100%"
                    height="100%"
                    controls
                    playing={true}
                    className="absolute top-0 left-0"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-mesh opacity-50">
                    <PlayCircle className="h-24 w-24 text-primary/20 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Lesson Details */}
              <div className="space-y-6 px-4">
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{currentLecture?.title}</h1>
                    <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> 12:45 MINS</span>
                      <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-primary" /> Certificate included</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="rounded-xl px-4 py-2 text-xs font-black bg-secondary/80 border-0">
                    LESSON {current + 1} OF {lectures.length}
                  </Badge>
                </div>

                <div className="p-8 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-sm shadow-sm space-y-6">
                  <h3 className="text-xl font-black flex items-center gap-3">
                    <div className="h-6 w-1 rounded-full bg-primary" />
                    Lesson Description
                  </h3>
                  <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed italic text-lg">
                    {currentLecture?.description || "In this lesson, we break down the core architecture and practical implementation steps. Pay close attention to the code samples shared during the segment."}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Q&A', icon: '❓' },
                    { label: 'Notes', icon: '📝' },
                    { label: 'Files', icon: '📁' },
                    { label: 'Caption', icon: '💬' }
                  ].map((tab) => (
                    <button key={tab.label} className="group h-16 rounded-[1.5rem] bg-card border border-border/40 hover:border-primary/30 hover:bg-primary/5 transition-all flex flex-col items-center justify-center p-2">
                      <span className="text-sm font-black group-hover:text-primary">{tab.label}</span>
                      <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">Resources</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar (Playlist) */}
        <aside className="w-full md:w-[400px] border-l bg-card/60 backdrop-blur-xl flex flex-col h-full shadow-2xl relative z-20 overflow-hidden">
          <div className="p-8 border-b bg-card/40">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Menu className="h-5 w-5 text-primary" /> Course Outline
                </h3>
                <span className="text-sm font-black bg-primary/10 text-primary px-3 py-1 rounded-lg">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-2 rounded-full bg-secondary overflow-hidden" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-3 pb-24">
              {lectures.map((lec, i) => {
                const isComplete = completedIds.includes(lec._id);
                const isActive = i === current;
                return (
                  <button
                    key={lec._id}
                    onClick={() => setCurrent(i)}
                    className={`w-full flex items-center gap-4 rounded-[1.5rem] p-4 text-left transition-all duration-300 group ${isActive
                      ? "bg-primary text-white shadow-xl shadow-primary/25 translate-x-1"
                      : "hover:bg-primary/5"
                      }`}
                  >
                    <div className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 font-black text-sm transition-all ${isActive ? "bg-white/20 text-white rotate-6" : "bg-secondary group-hover:bg-primary/20 group-hover:text-primary"}`}>
                      {isComplete ? <CheckCircle className="h-5 w-5" /> : (
                        isActive ? <PlayCircle className="h-5 w-5 animate-pulse" /> : String(i + 1).padStart(2, '0')
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <span className={`font-black text-sm leading-tight block truncate ${isActive ? "text-white" : "text-foreground"}`}>{lec.title}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest block px-2 py-0.5 rounded-md ${isActive ? "bg-white/10 text-white/80" : "bg-black/5 text-muted-foreground"}`}>15:00 MINS</span>
                        {isComplete && !isActive && <Badge className="bg-green-500/10 text-green-500 border-0 h-4 px-1.5 text-[8px] font-black">DONE</Badge>}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? "text-white rotate-90" : "text-muted-foreground group-hover:translate-x-1"}`} />
                  </button>
                );
              })}
            </div>
          </ScrollArea>

          <footer className="p-6 border-t bg-card/60 backdrop-blur-md absolute bottom-0 left-0 w-full">
            <Button variant="outline" className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-widest gap-2 hover:bg-primary/10 hover:text-primary border-primary/20 shadow-sm">
              <ExternalLink className="h-4 w-4" /> Curriculum PDF
            </Button>
          </footer>
        </aside>
      </div>
    </div>
  );
};


export default CoursePlayerPage;
