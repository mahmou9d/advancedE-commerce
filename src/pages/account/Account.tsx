import { useAppSelector } from "@store/hooks";

const icons = {
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0",
  mail: "M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm0 0l9 6 9-6",
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

const Account = () => {
  const accountInfo = useAppSelector((state) => state.auth.user);

  const getInitials = () => {
    if (!accountInfo) return "U";
    const first = accountInfo.firstName?.charAt(0) || "";
    const last = accountInfo.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const fields = [
    {
      label: "First name",
      value: accountInfo?.firstName,
      icon: "user" as const,
    },
    { label: "Last name", value: accountInfo?.lastName, icon: "user" as const },
    {
      label: "Email address",
      value: accountInfo?.email,
      icon: "mail" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased">
      {/* Header */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950"
        />
        <div
          aria-hidden="true"
          className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl"
        />

        <div className="mx-auto max-w-7xl px-6 py-16 text-center sm:py-20">
          <span
            aria-hidden="true"
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-blue-400/30 bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold shadow-lg shadow-blue-600/30"
          >
            {getInitials()}
          </span>
          <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Account profile
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
            Manage your personal information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-2xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:p-8">
          <h2 className="text-xl font-bold">Personal information</h2>

          <dl className="mt-6 divide-y divide-white/10">
            {fields.map((f) => (
              <div
                key={f.label}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
              >
                <dt className="flex items-center gap-3 text-sm text-slate-400">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-400">
                    <Icon name={f.icon} className="h-4 w-4" />
                  </span>
                  {f.label}
                </dt>
                <dd
                  className={`break-all font-medium sm:text-right ${
                    f.value ? "text-slate-100" : "text-slate-500"
                  }`}
                >
                  {f.value || "Not provided"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
};

export default Account;
