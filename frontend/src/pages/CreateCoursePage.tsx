import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { courseService } from "@/services/courseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Camera } from "lucide-react";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", description: "", category: "", price: "" });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (thumbnail) data.append("thumbnail", thumbnail);
      await courseService.createCourse(data);
      toast.success("Course created successfully!");
      navigate("/instructor");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slow-fade">
      <div className="bg-card border-b py-12 mb-10">
        <div className="container max-w-4xl">
          <div className="flex items-center gap-4 text-sm font-bold text-primary mb-4">
            <Button variant="ghost" size="sm" className="rounded-xl h-9 px-4 font-bold" onClick={() => navigate("/instructor")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Create New Course</h1>
          <p className="text-muted-foreground font-medium text-lg mt-2">Design a premium learning experience for your students.</p>
        </div>
      </div>

      <div className="container max-w-4xl pb-20">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-10 rounded-[32px] border-primary/5 shadow-2xl shadow-primary/5 space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Course Title</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Master React.js from Scratch"
                    required
                    className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-lg px-6 font-black"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Engaging Subtitle</Label>
                  <Input
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="One sentence that captures the value of this course"
                    className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-base px-6 font-medium italic"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Course Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={8}
                    placeholder="What will students learn? Why should they take this course?"
                    className="rounded-3xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-base p-6 font-medium leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-8 rounded-[32px] border-primary/5 shadow-xl shadow-primary/5 space-y-6 sticky top-24">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Pricing & Category</Label>
                <div className="space-y-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground font-bold">₹</div>
                    <Input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="Course Price"
                      className="h-14 pl-10 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all font-black text-xl"
                    />
                  </div>
                  <Input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Category (e.g. Design)"
                    className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Course Media</Label>
                <div className="aspect-video rounded-2xl bg-secondary/50 border-2 border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden group">
                  {preview ? (
                    <img src={preview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center px-4">Upload high-res thumbnail</p>
                    </>
                  )}
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-black uppercase tracking-widest">Change Image</span>
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <Button type="submit" disabled={loading} className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black text-lg shadow-2xl shadow-primary/20 transition-all active:scale-95">
                  {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : null}
                  Publish Course
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest">Saved automatically to drafts</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};


export default CreateCoursePage;
