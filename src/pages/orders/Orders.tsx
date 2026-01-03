import { useEffect, useState } from "react";
import { Container, Modal, Table } from "react-bootstrap";
import ProductInfo from "@components/eCommerce/ProductInfo/ProductInfo";
import { Loading } from "@components/feedback";
import { TProduct } from "@customTypes/product";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetOrders from "@store/orders/act/actGetOrders";
import { resetOrderStatus } from "@store/orders/ordersSlice";
import styles from "./styles.module.css";

const Orders = () => {
  const dispatch = useAppDispatch();
  const { loading, error, orderList } = useAppSelector((state) => state.orders);

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TProduct[]>([]);

  const closeModalHandler = () => {
    setShowModal(false);
    setSelectedProduct([]);
  };

  const viewDetailsHandler = (firebaseKey: string) => {
    const productDetails = orderList.find(
      (order) => order.firebaseKey === firebaseKey
    );
    const newItems = productDetails?.items ?? [];

    setShowModal(true);
    setSelectedProduct(newItems);
  };

  useEffect(() => {
    const promise = dispatch(actGetOrders());

    return () => {
      promise.abort();
      dispatch(resetOrderStatus());
    };
  }, [dispatch]);

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <div className={styles.orderIcon}>
            <i className="bi bi-bag-check-fill"></i>
          </div>
          <h1 className={styles.pageTitle}>My Orders</h1>
          <p className={styles.pageDescription}>
            {orderList.length > 0
              ? `You have ${orderList.length} ${
                  orderList.length === 1 ? "order" : "orders"
                }`
              : "Track your order history"}
          </p>
        </div>

        <div className={styles.contentSection}>
          <Loading loading={loading} error={error} type="table">
            {orderList.length > 0 ? (
              <div className={styles.tableWrapper}>
                <Table hover responsive className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Items</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((el) => (
                      <tr key={el.firebaseKey}>
                        <td>
                          <span className={styles.orderNumber}>
                            #{el.firebaseKey?.slice(0, 8)}
                          </span>
                        </td>
                        <td>
                          <span className={styles.itemCount}>
                            {el.items.length}{" "}
                            {el.items.length === 1 ? "item" : "items"}
                          </span>
                          <span className={styles.divider}>•</span>
                          <span
                            onClick={() =>
                              el.firebaseKey &&
                              viewDetailsHandler(el.firebaseKey)
                            }
                            className={styles.viewDetails}
                          >
                            View Details
                            <i className="bi bi-arrow-right"></i>
                          </span>
                        </td>
                        <td>
                          <span className={styles.totalPrice}>
                            ${el.subtotal.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <i className="bi bi-cart-x"></i>
                <h3>No Orders Yet</h3>
                <p>Start shopping and your orders will appear here</p>
                <a href="/categories" className={styles.shopButton}>
                  <span>Start Shopping</span>
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            )}
          </Loading>
        </div>
      </Container>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={closeModalHandler}
        centered
        className={styles.orderModal}
      >
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title>
            <i className="bi bi-box-seam"></i>
            Order Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.modalBody}>
          {selectedProduct.map((el) => (
            <ProductInfo
              key={el.id}
              title={el.title}
              img={el.img}
              price={el.price}
              quantity={el.quantity}
              direction="column"
              style={{ marginBottom: "10px" }}
            />
          ))}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Orders;
