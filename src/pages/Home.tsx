import { Button } from "react-bootstrap";
import "./Home.css"
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useNavigate } from "react-router-dom";



const Home = () => {
  const naviage =useNavigate()
  return (
    <div className="home">
      {/* <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div> <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div> */}

      <div className="masking-container">
        <h1 className="masked-text">Prime Ecom</h1>
        <div className="button2">
          <Button
            onClick={() => naviage("categories")}
            className="btn"
            variant="danger"
            style={{
              fontSize: "28px",
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "column",
              cursor: "pointer",
              borderRadius: "50px",
              width: "200px",
            }}
          >
            <span>Shoping</span>
            <span> Now</span>
          </Button>
          <Button
            onClick={() => naviage("offers")}
            variant="danger"
            className="btn"
            style={{ fontSize: "28px", borderRadius: "50px", width: "200px" }}
          >
            Offer
            <span
              style={{
                fontSize: "34px",
                fontWeight: "bold",
                marginLeft: "5px",
                color: "mediumblue",
              }}
            >
              50%
            </span>
          </Button>
          <DotLottieReact
            className="animation"
            style={{ width: "45%", height: "50%" }}
            src="https://lottie.host/9791f638-3b38-41c6-8eb7-d2e46c8cf050/I4iHexNY20.lottie"
            loop
            autoplay
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          margin: "10px",
        }}
      >
        {/* <DotLottieReact
          style={{ width: "45%", height: "50%" }}
          src="https://lottie.host/988bedf9-1bbd-4f1b-8bc6-5cef39dbcf21/akVB4jL4yD.lottie"
          loop
          autoplay
        /> */}
      </div>
    </div>
  );
};

export default Home;
