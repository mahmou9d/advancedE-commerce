import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaLocationArrow, FaMobileAlt } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { actGetCategories } from "@store/categories/categoriesSlice";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const footerLink = `inline-block rounded text-sm text-slate-400 transition hover:text-white ${focus}`;

const headingClass =
  "mb-4 text-sm font-semibold uppercase tracking-wider text-white";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/categories", label: "Shop" },
  { to: "/offers", label: "Special Offers" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/contact", label: "Contact Us" },
];

const contacts = [
  {
    Icon: FaLocationArrow,
    text: "Egypt - Cairo",
  },
  { Icon: FaMobileAlt, text: "+20 100 901 4597", href: "tel:+201009014597" },
  {
    Icon: FaEnvelope,
    text: "mohnud0987@gmail.com",
    href: "mailto:mohnud0987@gmail.com",
  },
];

function Footer() {
  const dispatch = useAppDispatch();
  const categoriesRecords = useAppSelector((state) => state.categories.records);

  useEffect(() => {
    if (categoriesRecords.length === 0) {
      dispatch(actGetCategories());
    }
  }, [dispatch, categoriesRecords.length]);

  return (
    <footer className="border-t border-white/10 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <Link
              to="/"
              className={`mb-4 inline-flex items-center gap-1.5 rounded-lg ${focus}`}
            >
              <span className="text-xl font-extrabold tracking-tight text-white">
                Prime
              </span>
              <span className="rounded-md bg-blue-600 px-2 py-0.5 text-base font-bold text-white">
                Ecom
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Your trusted destination for premium products. Explore our curated collections of
              men's, women's, and kids' fashion, electronics, sports gear, and footwear at competitive prices.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className={headingClass}>Contact Us</h3>
            <ul className="space-y-3">
              {contacts.map(({ Icon, text, href }) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <Icon
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-blue-400"
                  />
                  {href ? (
                    <a
                      href={href}
                      className={`rounded transition hover:text-white ${focus}`}
                    >
                      {text}
                    </a>
                  ) : (
                    <span>{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories (Loaded dynamically from database) */}
          <nav aria-label="Categories">
            <h3 className={headingClass}>Categories</h3>
            <ul className="space-y-2.5">
              {categoriesRecords.length > 0 ? (
                categoriesRecords.map((c) => (
                  <li key={c.prefix}>
                    <Link
                      to={`/categories/products/${c.prefix}`}
                      className={footerLink}
                    >
                      {c.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-slate-500">Loading categories...</li>
              )}
            </ul>
          </nav>

          {/* Quick Links */}
          <nav aria-label="Quick links">
            <h3 className={headingClass}>Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={footerLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs sm:px-6 md:flex-row md:text-left">
          <p>© 2026 Prime E-commerce. All rights reserved.</p>
          <p>
            Crafted with care by{" "}
            <strong className="font-semibold text-slate-200">Mahmoud</strong> |
            Premium E-commerce Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
