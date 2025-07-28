import { Heading } from "@components/common";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Input } from "@components/form";
import useRegister from "@hooks/useRegister";
import { Navigate } from "react-router-dom";
import { Loading } from "@components/feedback";


// type signUpType =z.infer<typeof signUpSchema>
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword:string
// };

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
    <div style={{ marginBottom: "20px" }}>
      <Heading title="User Registration" />
      <Loading loading={loading} error={error} type="table">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label={"First Name"}
              name={"firstName"}
              register={register}
              error={formErrors.firstName?.message}
            />
            {/* <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                {...register("firstName")}
                isInvalid={!!formErrors.firstName?.message}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.firstName?.message}
              </Form.Control.Feedback>
            </Form.Group> */}
            <Input
              label={"Last Name"}
              name={"lastName"}
              register={register}
              error={formErrors.lastName?.message}
            />
            {/* <Form.Group className="mb-3">

              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                {...register("lastName")}
                isInvalid={!!formErrors.lastName?.message}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.lastName?.message}
              </Form.Control.Feedback>
            </Form.Group> */}
            <Input
              label="Email Address"
              name="email"
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
                emailAvailabilityStatus === "checking"
                  ? true
                  : false || loading === "pending"
              }
            />
            {/* <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                {...register("email")}
                isInvalid={!!formErrors.email?.message}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.email?.message}
              </Form.Control.Feedback>
            </Form.Group> */}
            <Input
              type="password"
              label={"password"}
              name={"password"}
              register={register}
              error={formErrors.password?.message}
            />
            {/* <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                {...register("password")}
                isInvalid={!!formErrors.password?.message}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.password?.message}
              </Form.Control.Feedback>
            </Form.Group> */}
            <Input
              type="password"
              label={"confrim Password"}
              name={"confirmPassword"}
              register={register}
              error={formErrors.confirmPassword?.message}
            />
            {/* <Form.Group className="mb-3">
              <Form.Label>confrim Password</Form.Label>
              <Form.Control
                type="password"
                {...register("confirmPassword")}
                isInvalid={!!formErrors.confirmPassword?.message}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group> */}
            <Button
              variant="danger"
              type="submit"
              disabled={
                emailAvailabilityStatus === "checking" || loading === "pending"
              }
            >
              {loading === "pending" ? (
                <>
                  <Spinner animation="border" size="sm"></Spinner> Loading...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            {error && (
              <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
            )}
          </Form>
        </Col>
      </Row>
      </Loading>
    </div>
  );
}

export default Register;
