import { NavLink, Link, useNavigate } from "react-router-dom";
import { Badge, Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import styles from "./styles.module.css";
import HeaderLeftBar from "./HeaderLeftBar/HeaderLeftBar";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { authLogout } from "@store/auth/authSlice";
import { useEffect, useState } from "react";
import { actGetWishlist } from "@store/wishlist/wishlistSlice";
import { MdOutlineSearch } from "react-icons/md";
import actGetProductSearch from "@store/products/act/actGetProductSearch";
import { setSearchText } from "@store/search/searchSlice";

const {
  searchIcon,
  headerContainer,
  headerLogo,
  Links,
  headerLeftBar,
  search,
  searchInput,
  menu,
  headerWrapper,
  navbarCustom,
} = styles;

function Header() {
  const isAdmin = useAppSelector((state) => state.auth.user?.isAdmin);
  const [expanded, setExpanded] = useState(false);
  const [searchs, setSearchs] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(actGetProductSearch());
    if (searchs.trim()) {
      dispatch(setSearchText(searchs.trim()));
      navigate("/search");
    }
    if (accessToken) {
      dispatch(actGetWishlist("productIds"));
    }
  }, [dispatch, accessToken, searchs, navigate]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${headerWrapper} ${scrolled ? "scrolled" : ""}`}>
      <Navbar
        expanded={expanded}
        expand="lg"
        className={`${menu} ${navbarCustom}`}
      >
        <Container fluid className={headerContainer}>
          {/* Logo */}
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <h1 className={headerLogo}>
              <span className="logo-text">Prime</span>
              <Badge bg="danger" className="logo-badge">
                Ecom
              </Badge>
            </h1>
          </Link>

          {/* Mobile Toggle */}
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
            className="order-lg-last"
          />

          {/* Navigation Links */}
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto nav-links-group">
              <Nav.Link
                as={NavLink}
                className={Links}
                to="/"
                onClick={() => setExpanded(false)}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className={Links}
                to="categories"
                onClick={() => setExpanded(false)}
              >
                Categories
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className={Links}
                to="offers"
                onClick={() => setExpanded(false)}
              >
                Offers
              </Nav.Link>
            </Nav>

            {/* Search Bar */}
            <div className={search}>
              <MdOutlineSearch className={searchIcon} />
              <input
                className={searchInput}
                placeholder="Search products..."
                onChange={(e) => setSearchs(e.target.value)}
                value={searchs}
              />
            </div>

            {/* User Menu */}
            <Nav className="user-nav-group">
              {!accessToken ? (
                <>
                  <Nav.Link
                    as={NavLink}
                    className={Links}
                    to="login"
                    onClick={() => setExpanded(false)}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    className={Links}
                    to="register"
                    onClick={() => setExpanded(false)}
                  >
                    Register
                  </Nav.Link>
                </>
              ) : isAdmin ? (
                <NavDropdown
                  title={`${user?.firstName || "Admin"}`}
                  id="basic-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="admin"
                    onClick={() => {
                      setExpanded(false);
                      navigate("/admin");
                    }}
                  >
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={NavLink}
                    to="/"
                    onClick={() => {
                      dispatch(authLogout());
                      setExpanded(false);
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  title={`${user?.firstName}`}
                  id="basic-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="profile"
                    onClick={() => setExpanded(false)}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="profile/orders"
                    onClick={() => setExpanded(false)}
                  >
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={NavLink}
                    to="/"
                    onClick={() => {
                      dispatch(authLogout());
                      setExpanded(false);
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>

            {/* Cart & Wishlist */}
            <div className={headerLeftBar}>
              <HeaderLeftBar />
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
