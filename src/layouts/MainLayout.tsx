import { Outlet } from "react-router-dom";
import { Header, Footer } from "@components/common";
import { ToastList } from "@components/feedback";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

const {
  mainLayout,
  contentWrapper,
  modalOverlay,
  modalContent,
  modalHeader,
  modalBody,
  modalFooter,
  closeBtn,
  credentialsBox,
  credentialItem,
  label,
  value,
  copyBtn,
} = styles;

function MainLayout() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);

    // Reset after 2 seconds
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className={mainLayout}>
      <Header />

      <main className={contentWrapper}>
        <Outlet />
      </main>

      <ToastList />

      <Footer />

      {/* Welcome Modal */}
      {showWelcome && (
        <div className={modalOverlay} onClick={handleClose}>
          <div className={modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={modalHeader}>
              <h2>🎉 Welcome to Our Store!</h2>
              <button className={closeBtn} onClick={handleClose}>
                ×
              </button>
            </div>

            <div className={modalBody}>
              <p style={{ marginBottom: "20px", fontSize: "16px" }}>
                You can login with admin account using these credentials:
              </p>

              <div className={credentialsBox}>
                <div className={credentialItem}>
                  <span className={label}>Email:</span>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <span className={value}>monud0987a@gmail.com</span>
                    <button
                      className={copyBtn}
                      style={{
                        background:
                          copiedField === "email" ? "#007bff" : "#28a745",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() =>
                        copyToClipboard("monud0987a@gmail.com", "email")
                      }
                    >
                      {copiedField === "email" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>

                <div className={credentialItem}>
                  <span className={label}>Password:</span>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <span className={value}>Qqwe123!@#</span>
                    <button
                      className={copyBtn}
                      style={{
                        background:
                          copiedField === "password" ? "#007bff" : "#28a745",
                        transition: "all 0.3s ease",
                      }}
                      onClick={() => copyToClipboard("Qqwe123!@#", "password")}
                    >
                      {copiedField === "password" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className={modalFooter}>
              <button
                onClick={handleClose}
                style={{
                  padding: "10px 30px",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Got it, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainLayout;
