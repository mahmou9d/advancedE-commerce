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
  linkItem,
  divider,
  companyInfo,
} = styles;

function Footer() {
  return (
    <div className={footerContainer}>
      <div className={footercontent}>
        {/* About Section */}
        <div className={col}>
          <h3 className={title}>Prime E-commerce</h3>
          <p className={text}>
            Your trusted destination for quality products. We offer an extensive
            range of men's, women's, and kids' fashion, electronics, sports
            gear, and footwear at competitive prices.
          </p>
        </div>

        {/* Contact Section */}
        <div className={col}>
          <h3 className={title}>Contact Us</h3>
          <div className={citem}>
            <FaLocationArrow size={16} />
            <span className={text}>
              Kayaloram Rd, Punnamada, Kottankulangara, Alappuzha, Kerala,
              688006
            </span>
          </div>
          <div className={citem}>
            <FaMobileAlt size={16} />
            <span className={text}>+91 010-090-14597</span>
          </div>
          <div className={citem}>
            <FaEnvelope size={16} />
            <span className={text}>mohnud0987@gmail.com</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className={col}>
          <h3 className={title}>Categories</h3>
          <span className={`${text} ${linkItem}`}>Men's Fashion</span>
          <span className={`${text} ${linkItem}`}>Women's Fashion</span>
          <span className={`${text} ${linkItem}`}>Kids' Collection</span>
          <span className={`${text} ${linkItem}`}>Sports & Fitness</span>
          <span className={`${text} ${linkItem}`}>Electronics</span>
          <span className={`${text} ${linkItem}`}>Footwear</span>
        </div>

        {/* Quick Links Section */}
        <div className={col}>
          <h3 className={title}>Quick Links</h3>
          <span className={`${text} ${linkItem}`}>Home</span>
          <span className={`${text} ${linkItem}`}>Shop</span>
          <span className={`${text} ${linkItem}`}>Special Offers</span>
          <span className={`${text} ${linkItem}`}>Privacy Policy</span>
          <span className={`${text} ${linkItem}`}>Terms & Conditions</span>
          <span className={`${text} ${linkItem}`}>Contact Us</span>
        </div>
      </div>

      {/* Divider */}
      <div className={divider}></div>

      {/* Bottom Bar */}
      <div className={bottom}>
        <div className={bottombarcontent}>
          <p className={companyInfo}>
            © 2025 Prime E-commerce. All rights reserved.
          </p>
          <p className={textfooter}>
            Crafted with care by <strong>Mahmoud</strong> | Premium E-commerce
            Solutions
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
