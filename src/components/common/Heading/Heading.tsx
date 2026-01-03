import { memo } from "react";
import styles from "./styles.module.css";

const { heading, headingLine } = styles;

type HeadingProps = {
  title: string;
  align?: "left" | "center" | "right";
};

const Heading = memo(({ title, align = "left" }: HeadingProps) => {
  return (
    <div className={`${heading} ${align}`}>
      <h2>{title}</h2>
      <div className={headingLine}></div>
    </div>
  );
});

Heading.displayName = "Heading";

export default Heading;
