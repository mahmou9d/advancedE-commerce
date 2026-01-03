import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Input } from "@components/form";
import useRegister from "@hooks/useRegister";
import { Navigate } from "react-router-dom";
import { Loading } from "@components/feedback";
import styles from "./styles.module.css";

function Register() {
  const {
    loading,
    error,
    accessToken,
    formErrors,
    emailAvailabilityStatus,
    submitForm,
    register,
    handleSubmit,
    emailOnBlurHandler,
  } = useRegister();

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.loginContainer}>
      <Loading loading={loading} error={error} type="table">
        <Row className="justify-content-center">
          <Col>
            <div className={styles.loginCard}>
              <div className={styles.loginHeader}>
                <h2 className={styles.loginTitle}>Create Account</h2>
                <p className={styles.loginSubtitle}>
                  Join us today and get started
                </p>
              </div>

              <Form onSubmit={handleSubmit(submitForm)} className={styles.form}>
                <div className={styles.inputGroup}>
                  <Input
                    label="First Name"
                    name="firstName"
                    register={register}
                    error={formErrors.firstName?.message}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    label="Last Name"
                    name="lastName"
                    register={register}
                    error={formErrors.lastName?.message}
                    placeholder="Enter your last name"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    register={register}
                    onBlur={emailOnBlurHandler}
                    error={
                      formErrors.email?.message
                        ? formErrors.email?.message
                        : emailAvailabilityStatus === "notAvailable"
                        ? "This email is already in use."
                        : emailAvailabilityStatus === "failed"
                        ? "Error from the server."
                        : ""
                    }
                    formText={
                      emailAvailabilityStatus === "checking"
                        ? "We're currently checking the availability of this email address. Please wait a moment."
                        : ""
                    }
                    success={
                      emailAvailabilityStatus === "available"
                        ? "This email is available for use."
                        : ""
                    }
                    disabled={
                      emailAvailabilityStatus === "checking" ||
                      loading === "pending"
                    }
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
                    placeholder="Create a password"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <Input
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    register={register}
                    error={formErrors.confirmPassword?.message}
                    placeholder="Confirm your password"
                  />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className={styles.submitButton}
                  disabled={
                    emailAvailabilityStatus === "checking" ||
                    loading === "pending"
                  }
                >
                  {loading === "pending" ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        className={styles.spinner}
                      />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
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
                  Already have an account?{" "}
                  <a href="/login" className={styles.signupLink}>
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Loading>
    </div>
  );
}

export default Register;
