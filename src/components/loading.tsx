import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingCardProps {
  showHeader?: boolean;
  lines?: number;
  className?: string;
}

export function LoadingCard({ 
  showHeader = true, 
  lines = 3, 
  className = "" 
}: LoadingCardProps) {
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

export function LoadingGrid({ 
  count = 6, 
  className = "" 
}: { 
  count?: number; 
  className?: string; 
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}