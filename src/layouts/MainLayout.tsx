import { Outlet } from "react-router-dom";
import { Header, Footer } from "@components/common";
import { ToastList } from "@components/feedback";
import styles from "./styles.module.css";

const { mainLayout, contentWrapper } = styles;

function MainLayout() {
  return (
    <div className={mainLayout}>
      <Header />

      <main className={contentWrapper}>
        <Outlet />
      </main>

      <ToastList />

      <Footer />
    </div>
  );
}

export default MainLayout;
