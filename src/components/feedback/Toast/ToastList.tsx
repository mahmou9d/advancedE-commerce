import { AnimatePresence, motion } from "motion/react";
import { useAppSelector } from "@store/hooks";
import ToastItem from "./ToastItem";

const ToastList = () => {
  const { records } = useAppSelector((state) => state.toasts);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-center gap-3 sm:inset-x-auto sm:right-4 sm:w-full sm:max-w-sm sm:items-stretch"
    >
      <AnimatePresence>
        {records.map((record) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ ease: "easeInOut", duration: 0.25 }}
            layout
            className="pointer-events-auto w-full"
          >
            <ToastItem
              id={record.id}
              title={record.title}
              type={record.type}
              message={record.message}
              delayAnimation={record.delayAnimation}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastList;
