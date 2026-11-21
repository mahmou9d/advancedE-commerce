import { useCallback, useEffect, useState } from "react";
import { TToast } from "@customTypes/toasts";
import { useAppDispatch } from "@store/hooks";
import { removeToast, stopDelayAnimation } from "@store/toasts/toastsSlice";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
  check: "M5 13l4 4L19 7",
  info: "M12 8h.01M11 12h1v5h1M12 21a9 9 0 100-18 9 9 0 000 18z",
  warn: "M12 9v4m0 4h.01M10.3 4.3L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.3a2 2 0 00-3.4 0z",
  close: "M6 6l12 12M18 6L6 18",
};

const Icon = ({
  name,
  className = "h-5 w-5",
}: {
  name: keyof typeof icons;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d={icons[name]} />
  </svg>
);

// Keyed by the same type names the old Bootstrap `alert-${type}` used.
const variants: Record<
  string,
  { box: string; iconBox: string; bar: string; icon: keyof typeof icons }
> = {
  success: {
    box: "border-emerald-400/30",
    iconBox: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    bar: "bg-emerald-400",
    icon: "check",
  },
  danger: {
    box: "border-rose-400/30",
    iconBox: "border-rose-400/20 bg-rose-500/10 text-rose-300",
    bar: "bg-rose-400",
    icon: "warn",
  },
  warning: {
    box: "border-amber-400/30",
    iconBox: "border-amber-400/20 bg-amber-500/10 text-amber-300",
    bar: "bg-amber-400",
    icon: "warn",
  },
  info: {
    box: "border-blue-400/30",
    iconBox: "border-blue-400/20 bg-blue-500/10 text-blue-300",
    bar: "bg-blue-400",
    icon: "info",
  },
};

const ToastItem = ({ id, type, title, message, delayAnimation }: TToast) => {
  const dispatch = useAppDispatch();
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  const totalWidth = 100;
  const duration = 4000; // total duration in ms
  const intervalTime = duration / totalWidth;

  const v = variants[type as string] ?? variants.info;
  const isUrgent = type === "danger" || type === "warning";

  const closeToastHandler = useCallback(() => {
    dispatch(removeToast(id));
  }, [id, dispatch]);

  // Progress bar timer
  useEffect(() => {
    if (delayAnimation) return;
    const timer = setInterval(() => {
      setProgress((prev) => (prev < totalWidth && !paused ? prev + 1 : prev));
    }, intervalTime);
    return () => clearInterval(timer);
  }, [intervalTime, delayAnimation, paused]);

  // Close when finished
  useEffect(() => {
    if (progress === totalWidth) closeToastHandler();
  }, [progress, closeToastHandler]);

  // Initial delay before the progress starts
  useEffect(() => {
    if (!delayAnimation) return;
    const timer = setTimeout(() => dispatch(stopDelayAnimation(id)), 1000);
    return () => clearTimeout(timer);
  }, [delayAnimation, dispatch, id]);

  return (
    <div
      role={isUrgent ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={`relative w-full max-w-sm overflow-hidden rounded-2xl border bg-slate-900/90 shadow-2xl shadow-black/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md ${v.box}`}
    >
      <div className="flex items-start gap-3 p-4 pr-12">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${v.iconBox}`}
        >
          <Icon name={v.icon} />
        </span>
        <div className="min-w-0">
          <h5 className="text-sm font-semibold capitalize text-slate-100">
            {title ? title : type}
          </h5>
          <p className="mt-1 break-words text-sm leading-relaxed text-slate-400">
            {message}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={closeToastHandler}
        aria-label="Close notification"
        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white ${focus}`}
      >
        <Icon name="close" className="h-4 w-4" />
      </button>

      {/* Progress bar */}
      <div aria-hidden="true" className="h-1 w-full bg-white/5">
        <span
          className={`block h-full ${v.bar}`}
          style={{
            width: `${progress}%`,
            transition: `width ${intervalTime}ms linear`,
          }}
        />
      </div>
    </div>
  );
};

export default ToastItem;
