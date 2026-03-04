const SkeletonCard = () => (
  <div className="rounded-[32px] border-primary/5 bg-card/50 overflow-hidden shadow-xl shadow-primary/5 animate-slow-fade">
    <div className="aspect-video bg-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" style={{ backgroundSize: '100% 100%' }} />
    </div>
    <div className="p-8 space-y-4">
      <div className="h-4 bg-secondary rounded-full w-3/4 animate-pulse" />
      <div className="h-3 bg-secondary rounded-full w-1/2 animate-pulse" />
      <div className="pt-4 flex justify-between items-center">
        <div className="h-8 w-24 bg-secondary rounded-xl animate-pulse" />
        <div className="h-4 w-12 bg-secondary rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

export const SkeletonLine = ({ className = "w-full" }: { className?: string }) => (
  <div className={`h-4 bg-secondary rounded-full animate-pulse ${className}`} />
);

export default SkeletonCard;
