import ContentLoader from "react-content-loader";
import { Row, Col } from "react-bootstrap";

const CategorySkeleton = () => {
  const renderSkeletons = Array(5)
    .fill(0)
    .map((_, idx) => (
      <Col key={idx} xs={4} className="d-flex justify-content-center mb-5 mt-2">
        <ContentLoader
          speed={2}
          width={200}
          height={200}
          viewBox="0 0 200 200"
          backgroundColor="#3f3f3f"
          foregroundColor="#ffffff"
        >
          <rect x="61" y="179" rx="3" ry="3" width="85" height="6" />
          <circle cx="104" cy="84" r="84" />
        </ContentLoader>
      </Col>
    ));
  return <Row>{renderSkeletons}</Row>;
};

export default CategorySkeleton;
