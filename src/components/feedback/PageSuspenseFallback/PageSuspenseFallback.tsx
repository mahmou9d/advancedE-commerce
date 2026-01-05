import { Suspense } from "react";
import "./PageSuspenseFallback.css";

const PageSuspenseFallback = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense
      fallback={
        <div className="page-spinner-container">
          <div className="page-spinner"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default PageSuspenseFallback;
