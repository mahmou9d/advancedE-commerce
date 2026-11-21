import { NavLink, Outlet } from "react-router-dom";

const focus =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const icons = {
  userCircle:
    "M12 21a9 9 0 100-18 9 9 0 000 18zM12 13a3 3 0 100-6 3 3 0 000 6zM6.2 18.5a6 6 0 0111.6 0",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0",
  bag: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
  heart:
    "M12 21s-7-4.6-9.3-9.2C1.3 8.9 3 5.5 6.3 5.5c2 0 3.2 1 3.7 2 .5-1 1.7-2 3.7-2 3.3 0 5 3.4 3.6 6.3C19 16.4 12 21 12 21z",
  cart: "M3 4h2l2.4 11h10.2L20 7H6.2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  chevron: "M9 6l6 6-6 6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9",
};

const Icon = ({
  name,
  className = "h-5 w-5",
}: {
  name: keyof typeof icons;
  className?: string;
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <path d={icons[name]} />
  </svg>
);

const links: {
  to: string;
  label: string;
  icon: keyof typeof icons;
  end?: boolean;
}[] = [
  { to: "", label: "Account info", icon: "user", end: true },
  { to: "orders", label: "My orders", icon: "bag" },
];

const ProfileLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      <div className="mx-auto grid max-w-7xl items-start gap-8 px-6 py-10 md:grid-cols-[260px_1fr] lg:py-14">
        {/* Sidebar */}
        <aside className="rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] md:sticky md:top-24">
          <div className="flex items-center gap-3 px-2 pb-4 pt-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
              <Icon name="userCircle" className="h-6 w-6" />
            </span>
            <h2 className="text-lg font-bold">My profile</h2>
          </div>

          <nav
            aria-label="Profile"
            className="space-y-1 border-t border-white/10 pt-4"
          >
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-medium transition ${focus} ${
                    isActive
                      ? "border-blue-400/30 bg-blue-500/10 text-blue-300"
                      : "border-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon name={l.icon} />
                <span className="flex-1">{l.label}</span>
                <Icon
                  name="chevron"
                  className="h-4 w-4 text-slate-500 motion-safe:transition motion-safe:group-hover:translate-x-0.5"
                />
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 border-t border-white/10 pt-4">
            <button
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium text-slate-300 transition hover:border-rose-400/30 hover:bg-rose-500/10 hover:text-rose-300 ${focus}`}
            >
              <Icon name="logout" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
