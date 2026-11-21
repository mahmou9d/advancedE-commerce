import { useEffect, useRef, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  MdOutlineSearch,
  MdKeyboardArrowDown,
  MdMenu,
  MdClose,
} from "react-icons/md";
import HeaderLeftBar from "./HeaderLeftBar/HeaderLeftBar";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { authLogout } from "@store/auth/authSlice";
import { actGetWishlist } from "@store/wishlist/wishlistSlice";
import actGetProductSearch from "@store/products/act/actGetProductSearch";
import { setSearchText } from "@store/search/searchSlice";

/* ---------- Shared styles ---------- */
const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-white/10 text-white"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  } ${focus}`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-blue-600/15 text-blue-300"
      : "text-slate-300 hover:bg-white/5 hover:text-white"
  } ${focus}`;

const mainLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/categories", label: "Categories", end: false },
  { to: "/offers", label: "Offers", end: false },
];

/* ---------- Small parts ---------- */
const Logo = ({ onClick }: { onClick?: () => void }) => (
  <Link
    to="/"
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-lg ${focus}`}
  >
    <span className="text-2xl font-extrabold tracking-tight text-white">
      Prime
    </span>
    <span className="rounded-md bg-blue-600 px-2 py-0.5 text-lg font-bold text-white">
      Ecom
    </span>
  </Link>
);

const SearchBox = ({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) => (
  <label className={`relative block ${className}`}>
    <span className="sr-only">Search products</span>
    <MdOutlineSearch
      aria-hidden="true"
      className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
    />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search products..."
      className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-2.5 pl-11 pr-4 text-sm text-slate-100 placeholder-slate-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
    />
  </label>
);

/* ---------- Header ---------- */
function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.isAdmin;

  const [expanded, setExpanded] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // desktop user dropdown
  const [searchs, setSearchs] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* Data: load products once, wishlist when logged in */
  useEffect(() => {
    dispatch(actGetProductSearch());
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) dispatch(actGetWishlist("productIds"));
  }, [dispatch, accessToken]);

  /* Typing in search saves the text and opens the search page */
  useEffect(() => {
    const text = searchs.trim();
    if (text) {
      dispatch(setSearchText(text));
      navigate("/search");
    }
  }, [dispatch, navigate, searchs]);

  /* Scroll effect */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menus on outside click or Escape */
  useEffect(() => {
    const onPointer = (e: MouseEvent) => {
      const t = e.target as Node;
      if (expanded && headerRef.current && !headerRef.current.contains(t)) {
        setExpanded(false);
      }
      if (menuOpen && dropdownRef.current && !dropdownRef.current.contains(t)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [expanded, menuOpen]);

  const closeAll = () => {
    setExpanded(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(authLogout());
    closeAll();
    navigate("/");
  };

  const displayName = user?.firstName || (isAdmin ? "Admin" : "Account");
  const accountLinks = isAdmin
    ? [{ to: "/admin", label: "Dashboard", end: false }]
    : [
        { to: "/profile", label: "Profile", end: true },
        { to: "/profile/orders", label: "Orders", end: false },
      ];

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-slate-950/85 shadow-lg shadow-black/30 backdrop-blur-xl"
          : "border-transparent bg-slate-950"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* ===== Mobile bar (< lg) ===== */}
        <div className="flex h-16 items-center justify-between lg:hidden">
          <HeaderLeftBar />
          <Logo onClick={closeAll} />
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="mobile-menu"
            aria-label={expanded ? "Close menu" : "Open menu"}
            className={`rounded-xl border border-white/10 bg-slate-900/80 p-2 text-slate-200 transition hover:bg-slate-800 ${focus}`}
          >
            {expanded ? (
              <MdClose className="h-6 w-6" />
            ) : (
              <MdMenu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* ===== Desktop bar (>= lg) ===== */}
        <div className="hidden h-20 items-center gap-6 lg:flex">
          <Logo />

          <nav aria-label="Main" className="flex items-center gap-1">
            {mainLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <SearchBox
            value={searchs}
            onChange={setSearchs}
            className="ml-auto w-full max-w-sm"
          />

          {/* User area */}
          {!accessToken ? (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={`rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-500 ${focus}`}
              >
                Register
              </NavLink>
            </div>
          ) : (
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                className={`flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/80 py-1.5 pl-1.5 pr-3 text-sm font-medium transition hover:border-white/25 ${focus}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold uppercase">
                  {displayName.charAt(0)}
                </span>
                {displayName}
                <MdKeyboardArrowDown
                  className={`h-5 w-5 text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-2xl shadow-black/50"
                >
                  {accountLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.end}
                      role="menuitem"
                      onClick={closeAll}
                      className="block rounded-xl px-3 py-2.5 text-sm text-slate-200 transition hover:bg-white/10"
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <div className="my-1.5 h-px bg-white/10" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-rose-300 transition hover:bg-rose-500/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <HeaderLeftBar />
        </div>

        {/* ===== Mobile collapsible menu ===== */}
        {expanded && (
          <div
            id="mobile-menu"
            className="space-y-4 border-t border-white/10 pb-5 pt-4 lg:hidden"
          >
            <SearchBox value={searchs} onChange={setSearchs} />

            <nav aria-label="Main" className="space-y-1">
              {mainLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={closeAll}
                  className={mobileLinkClass}
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="space-y-1 border-t border-white/10 pt-4">
              {!accessToken ? (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeAll}
                    className={mobileLinkClass}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeAll}
                    className={`block rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-500 ${focus}`}
                  >
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <p className="flex items-center gap-3 px-4 pb-2 text-sm font-semibold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold uppercase">
                      {displayName.charAt(0)}
                    </span>
                    {displayName}
                  </p>
                  {accountLinks.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.end}
                      onClick={closeAll}
                      className={mobileLinkClass}
                    >
                      {l.label}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-rose-300 transition hover:bg-rose-500/10 ${focus}`}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
