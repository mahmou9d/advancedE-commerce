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
  mobileHeader,
  desktopNav,
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (expanded) {
        setExpanded(false);
      }
    };

    if (expanded) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [expanded]);

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <header className={`${headerWrapper} ${scrolled ? "scrolled" : ""}`}>
      <Navbar
        expanded={expanded}
        expand="lg"
        className={`${menu} ${navbarCustom}`}
      >
        <Container fluid className={headerContainer}>
          {/* Mobile Header Layout - Visible on screens < 992px */}
          <div className={mobileHeader}>
            {/* Left: Cart & Wishlist Icons */}
            <div className={headerLeftBar}>
              <HeaderLeftBar />
            </div>

            {/* Center: Logo */}
            <Link
              to={"/"}
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={handleNavClick}
            >
              <h1 className={headerLogo}>
                <span className="logo-text">Prime</span>
                <Badge bg="danger" className="logo-badge">
                  Ecom
                </Badge>
              </h1>
            </Link>

            {/* Right: Menu Toggle */}
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            />
          </div>

          {/* Desktop Header Layout - Visible on screens >= 992px */}
          <div className={desktopNav}>
            {/* Logo */}
            <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
              <h1 className={headerLogo}>
                <span className="logo-text">Prime</span>
                <Badge bg="danger" className="logo-badge">
                  Ecom
                </Badge>
              </h1>
            </Link>

            {/* Navigation Links */}
            <Nav className="me-auto nav-links-group">
              <Nav.Link
                as={NavLink}
                className={Links}
                to="/"
                onClick={handleNavClick}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className={Links}
                to="categories"
                onClick={handleNavClick}
              >
                Categories
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className={Links}
                to="offers"
                onClick={handleNavClick}
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
                    onClick={handleNavClick}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    className={Links}
                    to="register"
                    onClick={handleNavClick}
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
                      handleNavClick();
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
                      handleNavClick();
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
                    end
                    onClick={handleNavClick}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="profile/orders"
                    onClick={handleNavClick}
                  >
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={NavLink}
                    to="/"
                    onClick={() => {
                      dispatch(authLogout());
                      handleNavClick();
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
          </div>

          {/* Mobile Collapsible Menu */}
          <Navbar.Collapse id="basic-navbar-nav">
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

            {/* Navigation Links */}
            <Nav className="mobile-nav-links">
              <Nav.Link
                as={NavLink}
                className={Links}
                to="/"
                onClick={handleNavClick}
              >
                Home
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className={Links}
                to="categories"
                onClick={handleNavClick}
              >
                Categories
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                className={Links}
                to="offers"
                onClick={handleNavClick}
              >
                Offers
              </Nav.Link>
            </Nav>

            {/* User Menu */}
            <Nav className="mobile-user-nav">
              {!accessToken ? (
                <>
                  <Nav.Link
                    as={NavLink}
                    className={Links}
                    to="login"
                    onClick={handleNavClick}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    className={Links}
                    to="register"
                    onClick={handleNavClick}
                  >
                    Register
                  </Nav.Link>
                </>
              ) : isAdmin ? (
                <NavDropdown
                  title={`${user?.firstName || "Admin"}`}
                  id="mobile-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="admin"
                    onClick={() => {
                      handleNavClick();
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
                      handleNavClick();
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  title={`${user?.firstName}`}
                  id="mobile-nav-dropdown"
                  className="user-dropdown"
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="profile"
                    end
                    onClick={handleNavClick}
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={NavLink}
                    to="profile/orders"
                    onClick={handleNavClick}
                  >
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    as={NavLink}
                    to="/"
                    onClick={() => {
                      dispatch(authLogout());
                      handleNavClick();
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
