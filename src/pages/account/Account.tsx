import { Container } from "react-bootstrap";
import { useAppSelector } from "@store/hooks";
import styles from "./styles.module.css";

const Account = () => {
  const accountInfo = useAppSelector((state) => state.auth.user);

  // Get initials for avatar
  const getInitials = () => {
    if (!accountInfo) return "U";
    const first = accountInfo.firstName?.charAt(0) || "";
    const last = accountInfo.lastName?.charAt(0) || "";
    return (first + last).toUpperCase();
  };

  return (
    <div className={styles.pageWrapper}>
      <Container>
        <div className={styles.headerSection}>
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}>{getInitials()}</div>
          </div>
          <h1 className={styles.pageTitle}>Account Profile</h1>
          <p className={styles.pageDescription}>
            Manage your personal information
          </p>
        </div>

        <div className={styles.contentSection}>
          <div className={styles.profileCard}>
            <div className={styles.cardHeader}>
              <i className="bi bi-person-circle"></i>
              <h2>Personal Information</h2>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <i className="bi bi-person-fill"></i>
                  <span>First Name</span>
                </div>
                <div className={styles.infoValue}>
                  {accountInfo?.firstName || "Not provided"}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <i className="bi bi-person-fill"></i>
                  <span>Last Name</span>
                </div>
                <div className={styles.infoValue}>
                  {accountInfo?.lastName || "Not provided"}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>
                  <i className="bi bi-envelope-fill"></i>
                  <span>Email Address</span>
                </div>
                <div className={styles.infoValue}>
                  {accountInfo?.email || "Not provided"}
                </div>
              </div>
            </div>

            {/* <div className={styles.cardFooter}>
              <button className={styles.editButton}>
                <i className="bi bi-pencil-square"></i>
                <span>Edit Profile</span>
              </button>
            </div> */}
          </div>

          {/* Additional Info Card */}
          {/* <div className={styles.statsCard}>
            <div className={styles.statItem}>
              <i className="bi bi-bag-check-fill"></i>
              <div className={styles.statContent}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statLabel}>Orders</span>
              </div>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <i className="bi bi-heart-fill"></i>
              <div className={styles.statContent}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statLabel}>Wishlist</span>
              </div>
            </div>

            <div className={styles.statDivider}></div>

            <div className={styles.statItem}>
              <i className="bi bi-star-fill"></i>
              <div className={styles.statContent}>
                <span className={styles.statValue}>0</span>
                <span className={styles.statLabel}>Reviews</span>
              </div>
            </div>
          </div> */}
        </div>
      </Container>
    </div>
  );
};

export default Account;
