import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type GridListProp<T> = {
  records: T[];
  renderItem: (record: T) => React.ReactNode;
  emptyMessage?: string;
};

type HasId = { id?: number | string };

const GridList = <T extends HasId>({
  records,
  renderItem,
  emptyMessage = "No items found",
}: GridListProp<T>) => {
  if (records.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-12 text-center"
      >
        <div className="h-48 w-48 sm:h-64 sm:w-64">
          <DotLottieReact
            src="https://lottie.host/d80726c0-5de4-4686-8145-99b96b51c244/SAeC8Z4fN4.lottie"
            loop
            autoplay
          />
        </div>
        <p className="mt-4 text-base font-medium text-slate-300">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
      {records.map((record, index) => (
        <div key={record.id ?? index} className="min-w-0">
          {renderItem(record)}
        </div>
      ))}
    </div>
  );
};

export default GridList;
