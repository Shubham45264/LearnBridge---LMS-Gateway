import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("bio", bio);
      if (avatar) formData.append("avatar", avatar);
      await authService.updateProfile(formData);
      await refreshProfile();
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-slow-fade">
      <div className="bg-card border-b py-12 mb-10">
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-primary/10 transition-transform duration-500 group-hover:scale-105">
                <AvatarImage src={preview || user?.avatar} className="object-cover" />
                <AvatarFallback className="bg-primary text-white text-4xl font-black">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-2 right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl bg-primary text-white shadow-2xl hover:bg-primary/90 transition-all hover:scale-110 active:scale-95">
                <Camera className="h-5 w-5" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
            </div>

            <div className="text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <h1 className="text-4xl font-black tracking-tight">{user?.name}</h1>
                <Badge className="rounded-lg bg-primary/10 text-primary border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {user?.role}
                </Badge>
              </div>
              <p className="text-muted-foreground font-medium text-lg">{user?.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-6 pt-2">
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black">12</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Courses</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center md:text-left">
                  <p className="text-2xl font-black">4</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Certificates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl pb-20">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Settings Sidebar */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 ml-2">Personal Settings</h3>
            {['Account Info', 'Security', 'Notifications', 'Payments', 'Privacy'].map((item, i) => (
              <button key={item} className={`w-full text-left px-4 py-3.5 rounded-2xl font-bold text-sm transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                {item}
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8 glass-card p-10 rounded-[32px] border-primary/5 shadow-2xl shadow-primary/5">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Display Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 rounded-2xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-base px-6 font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="bio" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Professional Bio</Label>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50">Max 500 characters</span>
                  </div>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={5}
                    placeholder="Tell us about yourself..."
                    className="rounded-3xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20 transition-all text-base p-6 font-medium leading-relaxed resize-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-4 border-t border-border/50">
                <Button type="button" variant="ghost" className="h-12 rounded-xl font-bold px-8">Discard</Button>
                <Button type="submit" disabled={loading} className="h-14 rounded-2xl bg-primary hover:bg-primary/90 font-black px-10 shadow-xl shadow-primary/20 active:scale-95 transition-all">
                  {loading ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : null}
                  Update Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ProfilePage;
