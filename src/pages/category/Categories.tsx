import { Container } from "react-bootstrap";
import { Category } from "@components/eCommerce";
import { Loading } from "@components/feedback";
import GridList from "@components/common/GridList/GridList";
import useCategories from "@hooks/useCategories";
import styles from "./styles.module.css";

const Categories = () => {
  const { loading, error, records } = useCategories();

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageDescription}>Browse our collection</p>
        </div>

        <div className={styles.contentSection}>
          <Loading loading={loading} error={error} type="category">
            <GridList
              records={records}
              renderItem={(record) => <Category {...record} />}
            />
          </Loading>
        </div>
      </Container>
    </div>
  );
};

export default Categories;
