
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ClientListSkeletonProps {
  count: number;
  viewMode: "grid" | "list";
}

export const ClientListSkeleton = ({ count, viewMode }: ClientListSkeletonProps) => {
  return (
    <div className={viewMode === "grid" 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
      : "space-y-3"}>
      {Array(count).fill(0).map((_, index) => (
        viewMode === "grid" ? (
          <Card key={index}>
            <div className="h-2 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              <Skeleton className="h-8 w-full mt-3" />
            </CardContent>
          </Card>
        ) : (
          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-12" />
            </div>
            
            <Skeleton className="h-8 w-16" />
          </div>
        )
      ))}
    </div>
  );
};
