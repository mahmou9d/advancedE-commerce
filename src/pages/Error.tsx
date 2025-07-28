import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
// , useRouteError, isRouteErrorResponse
const Error = () => {
  // const error = useRouteError();
  // let errorStatus: number;
  // let errorStatusText: string;

  // if (isRouteErrorResponse(error)) {
  //   errorStatus = error.status;
  //   errorStatusText = error.statusText;
  // } else {
  //   errorStatus = 404;
  //   errorStatusText = "Page Not Found";
  // }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background: "black",
        color: "red",
        textAlign: "center",
        paddingTop: "15%",
      }}
    >
      <Container style={{ background: "black",display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",width:"700px",marginTop:"-100px" }}>
        <DotLottieReact
          src="https://lottie.host/30eb3236-0ecc-486d-8655-da6e741660b3/ep2ZM7q5gP.lottie"
          loop
          autoplay
          width={""}
        />
        <Link to="/" replace={true} style={{textDecoration:"none",color:"red"}}>
          How about going back to safety?
        </Link>
      </Container>
    </div>
  );
};

export default Error;
  