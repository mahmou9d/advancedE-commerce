import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {  Suspense } from "react";

const PageSuspenseFallback = ({ children }: { children:React.ReactNode}) => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: "100px",
            height: "70px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "50px",
          }}
        >
          <DotLottieReact
            src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
            loop
            autoplay
          />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

export default PageSuspenseFallback
