import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Col, Row } from "react-bootstrap";
import "./grid.css"
type GridListProp<T> = {
  records: T[];
  renderItem: (records: T) => React.ReactNode;
};
type HasId = { id?: number | string };

const GridList = <T extends HasId>({
  records,
  renderItem,
}: GridListProp<T>) => {
  const categoriesList =
    records.length > 0 ? (
      records.map((record) => (
        <Col
          // xs={3}
          key={record.id}
          className="d-flex mb-5 mt-2 grid"
        >
          {renderItem(record)}
        </Col>
      ))
    ) : (
      <div style={{width:"100%",height:"400px"}}>
        <DotLottieReact
          src="https://lottie.host/d80726c0-5de4-4686-8145-99b96b51c244/SAeC8Z4fN4.lottie"
          loop
          autoplay
        />
      </div>
    );

  return <Row>{categoriesList}</Row>;
};

export default GridList;
