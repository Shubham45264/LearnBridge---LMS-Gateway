import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { courseService } from "@/services/courseService";
import CourseCard from "@/components/CourseCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async (q: string) => {
    setLoading(true);
    try {
      const res = q
        ? await courseService.search(q)
        : await courseService.getPublished();
      const data = res.data.data || res.data.courses || res.data;
      setCourses(Array.isArray(data) ? data : []);

    } catch {
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(query);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
    fetchCourses(query);
  };

  return (
    <div className="animate-slow-fade">
      <div className="bg-card border-b py-16 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-black tracking-tight">Browse Our Catalog</h1>
            <p className="text-muted-foreground text-lg font-medium">Over 500+ premium courses taught by industry experts.</p>

            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                value={query}
                onChange={(e) => setQuery(setQuery(e.target.value) as any)}
                placeholder="What do you want to learn today?"
                className="h-16 pl-14 pr-32 rounded-3xl bg-background border-2 border-border/50 focus:border-primary/30 focus:ring-4 focus:ring-primary/5 shadow-2xl transition-all text-base font-medium"
              />
              <div className="absolute inset-y-2 right-2 flex items-center">
                <Button type="submit" className="h-12 rounded-2xl px-8 bg-primary font-bold shadow-xl shadow-primary/20">
                  Search
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {['Development', 'Design', 'Business', 'Marketing', 'Photography'].map(tag => (
                <button key={tag} className="px-5 py-2 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary text-xs font-bold transition-all border border-transparent hover:border-primary/20" onClick={() => { setQuery(tag); fetchCourses(tag); }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-32">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-bold">{courses.length} Results Found</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-muted-foreground">Sort by:</span>
            <select className="bg-transparent text-sm font-bold focus:outline-none">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[380px] rounded-3xl bg-secondary animate-pulse" />
            ))
          ) : (
            courses.map((c) => <CourseCard key={c._id} course={c} />)
          )}

          {!loading && courses.length === 0 && (
            <div className="col-span-full py-32 text-center animate-in fade-in zoom-in duration-500">
              <div className="mx-auto h-24 w-24 rounded-[40px] bg-secondary flex items-center justify-center mb-8 rotate-3">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-black mb-2">No courses found matching "{query}"</h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-10">
                Try searching for broader terms or explore different categories.
              </p>
              <Button variant="outline" size="lg" className="rounded-2xl px-10 h-14 font-black text-base" onClick={() => { setQuery(""); fetchCourses(""); }}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default SearchPage;
