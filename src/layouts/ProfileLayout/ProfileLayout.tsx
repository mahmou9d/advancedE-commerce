import { Container, Row, Col } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./styles.module.css";

const ProfileLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Container>
        <Row className={styles.layoutRow}>
          <Col md={3} className={styles.sidebarCol}>
            <div className={styles.sidebar}>
              <div className={styles.sidebarHeader}>
                <i className="bi bi-person-circle"></i>
                <h3>My Profile</h3>
              </div>

              <nav className={styles.navigation}>
                <NavLink
                  to=""
                  end
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <i className="bi bi-person-fill"></i>
                  <span>Account Info</span>
                  <i className="bi bi-chevron-right"></i>
                </NavLink>

                <NavLink
                  to="orders"
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <i className="bi bi-bag-check-fill"></i>
                  <span>My Orders</span>
                  <i className="bi bi-chevron-right"></i>
                </NavLink>

                <NavLink
                  to="/wishlist"
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <i className="bi bi-heart-fill"></i>
                  <span>Wishlist</span>
                  <i className="bi bi-chevron-right"></i>
                </NavLink>

                <NavLink
                  to="/cart"
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <i className="bi bi-cart-fill"></i>
                  <span>Shopping Cart</span>
                  <i className="bi bi-chevron-right"></i>
                </NavLink>
              </nav>

              <div className={styles.sidebarFooter}>
                <button className={styles.logoutButton}>
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </Col>

          <Col md={9} className={styles.contentCol}>
            <div className={styles.contentWrapper}>
              <Outlet />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfileLayout;
