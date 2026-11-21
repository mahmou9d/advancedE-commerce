import { memo } from "react";

type HeadingProps = {
  title: string;
  align?: "left" | "center" | "right";
};

const alignClasses = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const Heading = memo(({ title, align = "left" }: HeadingProps) => {
  return (
    <div className={`mb-8 flex flex-col gap-3 ${alignClasses[align]}`}>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      <div aria-hidden="true" className="h-1 w-16 rounded-full bg-blue-600" />
    </div>
  );
});

Heading.displayName = "Heading";

export default Heading;
