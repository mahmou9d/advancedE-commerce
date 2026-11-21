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
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Welcome to Our Store!
              </h2>
              <button className={closeBtn} onClick={handleClose}>
                &times;
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
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onClick={() =>
                        copyToClipboard("monud0987a@gmail.com", "email")
                      }
                    >
                      {copiedField === "email" ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
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
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                      onClick={() => copyToClipboard("Qqwe123!@#", "password")}
                    >
                      {copiedField === "password" ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
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
