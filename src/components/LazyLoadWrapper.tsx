import { Suspense, ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface LazyLoadWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const LazyLoadWrapper = ({ children, fallback }: LazyLoadWrapperProps) => {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
};
