import { Heading } from "@components/common";
import { Loading } from "@components/feedback";
import { Input } from "@components/form";
import useLogin from "@hooks/useLogin";
import { Row, Col, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Navigate } from "react-router-dom";


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
    <div style={{ marginBottom: "20px" }}>
      <Heading title="User Login" />
            <Loading loading={loading} error={error} type="table">
      
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          {searchParams.get("message") === "login_required" && (
            <Alert variant="success">
              You need to login to view this content
            </Alert>
          )}
          {searchParams.get("message") === "account_created" && (
            <Alert variant="success">
              Your account successfully created, please login
            </Alert>
          )}
          <Form onSubmit={handleSubmit(submitForm)}>
            <Input
              label={"Email Address"}
              name={"email"}
              register={register}
              error={formErrors.email?.message}
            />
            {/* <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" name="email" />
            </Form.Group> */}
            <Input
              type="password"
              label={"Password"}
              name={"password"}
              register={register}
              error={formErrors.password?.message}
            />
            {/* <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" />
            </Form.Group> */}

            <Button variant="danger" type="submit">
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
};

export default Login;
