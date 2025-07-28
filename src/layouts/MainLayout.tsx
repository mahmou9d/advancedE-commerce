import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Header, Footer } from "@components/common";

import styles from "./styles.module.css";
import { ToastList } from "@components/feedback";
const { container, wrappert } = styles;
function MainLayout() {
  return (
    <div style={{ backgroundColor: "black", color: "#fff" }}>
      <Container className={container}>
        <Header />
        <div className={wrappert}>
          <Outlet />
        </div>
        <ToastList/>


        <Footer />
      </Container>
    </div>
  );
}

export default MainLayout;

