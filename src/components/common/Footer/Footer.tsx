import styles from "./styles.module.css";
import { FaEnvelope, FaLocationArrow, FaMobileAlt } from "react-icons/fa";
const {
  footerContainer,
  footercontent,
  col,
  title,
  textfooter,
  text,
  citem,
  bottombarcontent,
  bottom,
} = styles;
function Footer() {
  return (
    <div className={footerContainer}>
      <div style={{ width: "100%" }}>
        <div className={footercontent}>
          <div className={col}>
            <div className={title}>Home</div>
            <div className={text}>
              Voluptatem accusantium doloremque laudantium, totam rem aperiam,
              eaque ipsa quae ab illo inventore veritatis et quasi architecto
              beatae vitae dicta sunt explicabo eaque ipsa quae ab illo.
            </div>
          </div>
          <div className={col}>
            <div className={title}>Contact</div>

            <div className={citem}>
              <FaLocationArrow />
              <div className={text}>
                Kayaloram Rd, Punnamada, Kottankulangara, Alappuzha, Kerala,
                688006
              </div>
            </div>
            <div className={citem}>
              <FaMobileAlt />
              <div className={text}>Phone: 01009014597</div>
            </div>
            <div className={citem}>
              <FaEnvelope />
              <div className={text}>Email: mohnud0987@gmail.com</div>
            </div>
          </div>
          <div className={col}>
            <div className={title}>Categories</div>
            <span className={text}>Men</span>
            <span className={text}>Women</span>
            <span className={text}>Kids</span>
            <span className={text}>Sports</span>
            <span className={text}>Electronics</span>
            <span className={text}>Shoes</span>
          </div>
          <div className={col}>
            <div className={title}>pages</div>
            <span className={text}>Home</span>
            <span className={text}>category</span>
            <span className={text}>offers</span>
            <span className={text}>Privacy Policy</span>

            <span className={text}>Terms & Conditions</span>
            <span className={text}>Contact Us</span>
          </div>
        </div>
        <div className={bottom}>
          <div className={bottombarcontent}>
            <span className={textfooter}>
              Prime E-commerce 2025 CREATED BY mahmoud. PREMIUM E-COMMERCE
              SOLUTIONS.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
