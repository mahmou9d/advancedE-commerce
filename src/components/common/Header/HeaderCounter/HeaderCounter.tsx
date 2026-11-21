import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

type HeaderCounterProps = {
  totalQuantity: number;
  svgIcon: React.ReactNode;
  title: string;
  to: string;
};

const HeaderCounter = ({
  totalQuantity,
  svgIcon,
  title,
  to,
}: HeaderCounterProps) => {
  const [isAction, setIsAction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!totalQuantity) return;
    setIsAction(true);
    const debounce = setTimeout(() => setIsAction(false), 300);
    return () => clearTimeout(debounce);
  }, [totalQuantity]);

  return (
    <button
      type="button"
      onClick={() => navigate(to)}
      aria-label={
        totalQuantity > 0 ? `${title}, ${totalQuantity} items` : title
      }
      className={`group flex items-center gap-2 rounded-xl px-2.5 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white ${focus}`}
    >
      {/* Icon + badge */}
      <span className="relative flex h-6 w-6 items-center justify-center text-2xl [&>svg]:h-6 [&>svg]:w-6">
        {svgIcon}

        {totalQuantity > 0 && (
          <span
            className={`absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-bold leading-none text-white shadow-lg shadow-blue-600/30 ring-2 ring-slate-950 transition-transform duration-300 ${
              isAction ? "scale-125" : "scale-100"
            }`}
          >
            {totalQuantity}
          </span>
        )}
      </span>

      {/* Title (hidden on small screens to keep the bar compact) */}
      <span className="hidden text-sm font-medium xl:inline">{title}</span>
    </button>
  );
};

export default HeaderCounter;
