
import { Container } from "react-bootstrap";
import { Category } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import GridList from "@components/common/GridList/GridList";
import { Heading } from "@components/common";
import useCategories from "@hooks/useCategories";

const Categories = () => {
const { loading, error, records }=useCategories()


  return (
    <>
      <Heading title="Categories"/>
      <Container>
        <Loading loading={loading} error={error} type="category">
          <GridList
            records={records}
            renderItem={(record) => <Category {...record} />}
          />
        </Loading>
      </Container>
    </>
  );
};

export default Categories;
