import { NavLink, Link, useNavigate } from "react-router-dom";
// import { HeaderBasket, HeaderWishlist } from "../../eCommerce";
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
  menu
} = styles;

function Header() {
  const isAdmin = useAppSelector((state) => state.auth.user?.isAdmin);
  const [expanded, setExpanded] = useState(false);
  const [searchs, setSearchs] = useState("");
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

  return (
    <header>
      <div className={headerContainer}>
        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className={headerLogo}>
            <span>Prime</span>
            <Badge bg="danger">Ecom</Badge>
          </h1>
        </Link>

        <div className={headerLeftBar}>
          <HeaderLeftBar />
        </div>
      </div>

      <Navbar
        expanded={expanded}
        style={{
          borderRadius: "10px",
          boxShadow: "0px 0 5px 0px red",
        }}
        expand="lg"
        className={menu}
      >
        {!expanded && (
          <div className={search}>
            <MdOutlineSearch className={searchIcon} />
            <input
              className={searchInput}
              placeholder="search"
              onChange={(e) => setSearchs(e.target.value)}
            />
          </div>
        )}
        <Container className="menudrop">
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(expanded ? false : true)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
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
              {/* {!expanded && (
                <div className={search}>
                  <MdOutlineSearch className={searchIcon} />
                  <input
                    className={searchInput}
                    placeholder="search"
                    onChange={(e) => setSearchs(e.target.value)}
                  />
                </div>
              )} */}
            </Nav>

            <Nav>
              {!accessToken ? (
                <>
                  <Nav.Link
                    as={NavLink}
                    to="login"
                    onClick={() => setExpanded(false)}
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={NavLink}
                    to="register"
                    onClick={() => setExpanded(false)}
                  >
                    Register
                  </Nav.Link>
                </>
              ) : isAdmin ? (
                <NavDropdown
                  title={`Welcome : ${user?.firstName || "Admin"} ${user?.lastName}`}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item
                    as={NavLink}
                    to="admin"
                    onClick={() => {
                      setExpanded(false);
                      navigate("/admin");
                    }}
                  >
                    Add
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
                  title={`Welcome : ${user?.firstName} ${user?.lastName}`}
                  id="basic-nav-dropdown"
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
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
