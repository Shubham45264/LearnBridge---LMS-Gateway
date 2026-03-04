import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Plus, Upload, ArrowLeft, PlayCircle, Save, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", category: "", price: "" });
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureVideo, setLectureVideo] = useState<File | null>(null);
  const [uploadingLecture, setUploadingLecture] = useState(false);
  const [lectures, setLectures] = useState<any[]>([]);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      courseService.getCourse(courseId),
      courseService.getLectures(courseId).catch(() => ({ data: { data: { lectures: [] } } })),
    ]).then(([cRes, lRes]) => {
      const c = cRes.data.data || cRes.data;
      if (c) {
        setForm({
          title: c.title || "",
          subtitle: c.subtitle || "",
          description: c.description || "",
          category: c.category || "",
          price: String(c.price || ""),
        });
      }

      const lectureData = lRes.data.data?.lectures || lRes.data.lectures || lRes.data || [];
      setLectures(Array.isArray(lectureData) ? lectureData : []);
    }).finally(() => setLoading(false));

  }, [courseId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      await courseService.updateCourse(courseId!, data);
      toast.success("Course details synchronized!");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await courseService.publishCourse(courseId!);
      toast.success("Course is now live!");
      navigate("/instructor");
    } catch {
      toast.error("Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleAddLecture = async () => {
    if (!lectureTitle || !lectureVideo) { toast.error("Title and video required"); return; }
    setUploadingLecture(true);
    try {
      const data = new FormData();
      data.append("title", lectureTitle);
      data.append("video", lectureVideo);
      const res = await courseService.addLecture(courseId!, data);
      const newLec = res.data.data || res.data;
      setLectures((prev) => [...prev, newLec]);

      setLectureTitle("");
      setLectureVideo(null);
      toast.success("New lecture uploaded successfully!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingLecture(false);
    }
  };

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="animate-slow-fade pb-20">
      <div className="bg-card border-b py-12 mb-10">
        <div className="container max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-sm font-bold text-primary mb-2">
                <Button variant="ghost" size="sm" className="rounded-xl h-9 px-4 font-bold" onClick={() => navigate("/instructor")}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              </div>
              <h1 className="text-4xl font-black tracking-tight leading-tight">Editing: {form.title}</h1>
              <p className="text-muted-foreground font-medium text-lg italic opacity-75">Update your course content and structure.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePublish} disabled={publishing} className="h-14 rounded-2xl px-8 bg-green-500 hover:bg-green-600 font-black shadow-xl shadow-green-500/20 active:scale-95 transition-all">
                {publishing ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlayCircle className="mr-2 h-5 w-5" />}
                {publishing ? "Publishing..." : "Go Live Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left: General Settings */}
          <div className="lg:col-span-3 space-y-10">
            <form onSubmit={handleSave} className="glass-card p-10 rounded-[32px] border-primary/5 shadow-2xl shadow-primary/5 space-y-8">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-primary" />
                Course Details
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-lg font-black px-6" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Subtitle</Label>
                  <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all font-medium px-6" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={6} className="rounded-3xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all p-6 font-medium leading-relaxed resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                    <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all font-bold px-6" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Price (₹)</Label>
                    <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all font-black px-6 text-xl" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-border/50">
                <Button type="submit" disabled={saving} className="h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black px-10 shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  {saving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Save className="mr-3 h-5 w-5" />}
                  Sync Details
                </Button>
              </div>
            </form>
          </div>

          {/* Right: Lectures Management */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 rounded-[32px] border-primary/5 shadow-xl shadow-primary/5 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-black tracking-tight">Lectures</h2>
                <Badge className="bg-primary/10 text-primary border-0 rounded-lg">{lectures.length}</Badge>
              </div>

              <div className="space-y-3">
                {lectures.map((lec, i) => (
                  <div key={lec._id || i} className="flex items-center gap-4 rounded-2xl bg-secondary/50 p-4 group hover:bg-primary/5 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0 font-black text-sm text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className="font-bold text-sm truncate flex-1">{lec.title}</span>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 rounded-lg hover:bg-primary/10 hover:text-primary">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {lectures.length === 0 && (
                  <div className="py-10 text-center border-2 border-dashed border-border rounded-2xl">
                    <PlayCircle className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                    <p className="text-sm font-bold text-muted-foreground">No lectures yet</p>
                  </div>
                )}
              </div>

              <div className="border-t border-border/50 pt-8 space-y-5 px-2">
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Add New Content</h3>
                </div>

                <div className="space-y-4">
                  <Input placeholder="Lecture Title" value={lectureTitle} onChange={(e) => setLectureTitle(e.target.value)} className="h-12 rounded-xl bg-secondary/50 border-0 font-bold px-4" />

                  <div className="relative h-32 rounded-2xl bg-secondary/30 border-2 border-dashed border-border flex flex-col items-center justify-center group hover:border-primary/30 transition-all overflow-hidden">
                    {lectureVideo ? (
                      <div className="flex flex-col items-center gap-1 text-primary">
                        <PlayCircle className="h-6 w-6" />
                        <p className="text-[10px] font-black uppercase tracking-widest truncate max-w-[150px]">{lectureVideo.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Choose Video File</p>
                      </>
                    )}
                    <input type="file" accept="video/*" onChange={(e) => setLectureVideo(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>

                  <Button onClick={handleAddLecture} disabled={uploadingLecture} className="w-full h-14 rounded-2xl bg-primary font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {uploadingLecture ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="mr-2 h-5 w-5" /> Sync Content</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EditCoursePage;
