import { Input } from "@components/form";
import useLogin from "@hooks/useLogin";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
  const {
    error,
    loading,
    accessToken,
    register,
    handleSubmit,
    formErrors,
    submitForm,
    searchParams,
  } = useLogin();

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.loginContainer}>
        <Row className="justify-content-center">
          <Col>
            <div className={styles.loginCard}>
              <div className={styles.loginHeader}>
                <h2 className={styles.loginTitle}>Welcome Back</h2>
                <p className={styles.loginSubtitle}>
                  Please login to your account
                </p>
              </div>

              {searchParams.get("message") === "login_required" && (
                <Alert variant="info" className={styles.alert}>
                  <i className="bi bi-info-circle-fill"></i>
                  You need to login to view this content
                </Alert>
              )}

              {searchParams.get("message") === "account_created" && (
                <Alert variant="success" className={styles.alert}>
                  <i className="bi bi-check-circle-fill"></i>
                  Your account successfully created, please login
                </Alert>
              )}

              <Form onSubmit={handleSubmit(submitForm)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    register={register}
                    error={formErrors.email?.message}
                    placeholder="Enter your email"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    type="password"
                    label="Password"
                    name="password"
                    register={register}
                    error={formErrors.password?.message}
                    placeholder="Enter your password"
                  />
                </div>

                <div className={styles.forgotPassword}>
                  <a href="/forgot-password" className={styles.forgotLink}>
                    Forgot Password?
                  </a>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading === "pending"}
                >
                  {loading === "pending" ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className={styles.spinner}
                      />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Login</span>
                      <i className="bi bi-arrow-right"></i>
                    </>
                  )}
                </Button>

                {error && (
                  <div className={styles.errorMessage}>
                    <i className="bi bi-exclamation-triangle-fill"></i>
                    <span>{error}</span>
                  </div>
                )}
              </Form>

              <div className={styles.divider}>
                <span>OR</span>
              </div>

              <div className={styles.signupSection}>
                <p className={styles.signupText}>
                  Don't have an account?{" "}
                  <a href="/register" className={styles.signupLink}>
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
    </div>
  );
};

export default Login;
