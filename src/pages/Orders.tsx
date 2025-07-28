import { Heading } from "@components/common";
import ProductInfo from "@components/eCommerce/ProductInfo/ProductInfo";
import { Loading } from "@components/feedback";
import { TProduct } from "@customTypes/product";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actGetOrders from "@store/orders/act/actGetOrders";
import { resetOrderStatus } from "@store/orders/ordersSlice";
import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

const Orders = () => {

    const dispatch = useAppDispatch()

const {loading,error,orderList} =useAppSelector((state)=>state.orders)
console.log(orderList)
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
  setSelectedProduct((prev) => [...prev, ...newItems]);
};
    useEffect(()=>{

        const promise =dispatch(actGetOrders())

        return ()=>{
            promise.abort()
            dispatch(resetOrderStatus())
        }
    },[dispatch])
  return (
    <div>
      <Modal show={showModal} onHide={closeModalHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Products Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
      <Heading title="My Order" />
      <Loading loading={loading} error={error} type="table">
        <Table>
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
                <td>#{el.firebaseKey}</td>
                <td>
                  {el.items.length} item(s)
                  {" / "}
                  <span
                    onClick={() => el.firebaseKey && viewDetailsHandler(el.firebaseKey)}
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    Product Details
                  </span>
                </td>
                <td>{el.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Loading>
    </div>
  );
}

export default Orders
