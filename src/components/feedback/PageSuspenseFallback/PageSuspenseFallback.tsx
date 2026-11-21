import React, { Suspense } from "react";

const PageSuspenseFallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[300px] w-full items-center justify-center py-12">
          <div className="relative flex items-center justify-center">
            {/* Outer soft glow ring */}
            <div className="h-12 w-12 rounded-full border-4 border-blue-500/20" />
            {/* Animated spinning ring */}
            <div className="absolute h-12 w-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default PageSuspenseFallback;
