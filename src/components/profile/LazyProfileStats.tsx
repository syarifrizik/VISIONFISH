
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileStats } from '@/types/profile';

// Lazy load heavy stats components
const ModernStatsCards2025 = lazy(() => import('./ModernStatsCards2025'));

interface LazyProfileStatsProps {
  stats: ProfileStats;
  layout?: 'desktop' | 'mobile';
  isOwnProfile?: boolean;
}

const StatsLoadingSkeleton = ({ layout }: { layout?: 'desktop' | 'mobile' }) => (
  <div className={`grid gap-4 ${layout === 'mobile' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-4" />
          </div>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const LazyProfileStats = ({ stats, layout = 'desktop', isOwnProfile }: LazyProfileStatsProps) => {
  return (
    <Suspense fallback={<StatsLoadingSkeleton layout={layout} />}>
      <ModernStatsCards2025
        stats={stats}
        layout={layout}
        isOwnProfile={isOwnProfile}
      />
    </Suspense>
  );
};

export default LazyProfileStats;
