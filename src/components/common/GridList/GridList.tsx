import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Col, Row } from "react-bootstrap";
import styles from "./styles.module.css";

const { gridContainer, gridItem, emptyState, emptyAnimation } = styles;

type GridListProp<T> = {
  records: T[];
  renderItem: (records: T) => React.ReactNode;
  emptyMessage?: string;
};

type HasId = { id?: number | string };

const GridList = <T extends HasId>({
  records,
  renderItem,
  emptyMessage = "No items found",
}: GridListProp<T>) => {
  const categoriesList =
    records.length > 0 ? (
      records.map((record) => (
        <Col key={record.id} className={gridItem}>
          {renderItem(record)}
        </Col>
      ))
    ) : (
      <Col xs={12}>
        <div className={emptyState}>
          <div className={emptyAnimation}>
            <DotLottieReact
              src="https://lottie.host/d80726c0-5de4-4686-8145-99b96b51c244/SAeC8Z4fN4.lottie"
              loop
              autoplay
            />
          </div>
          <p>{emptyMessage}</p>
        </div>
      </Col>
    );

  return <Row className={gridContainer}>{categoriesList}</Row>;
};

export default GridList;
