import { Link, useNavigate, useLocation } from "react-router-dom";
import { authStore } from "../auth";
import { clearToken } from "../api";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname, search } = useLocation();
  const u = authStore.user;

  const logout = () => {
    clearToken();
    authStore.logout();
    nav("/", { replace: true });
  };

  const showUserSeg = u && u.role !== "admin" && pathname.startsWith("/dashboard");
  const params = new URLSearchParams(search);
  const currentTab = params.get("tab") === "mine" ? "mine" : "browse";
  const goTab = (t) => {
    const q = new URLSearchParams(search);
    if (t === "browse") q.delete("tab");
    else q.set("tab", "mine");
    nav({ pathname: "/dashboard", search: q.toString() ? `?${q.toString()}` : "" });
  };

  const linkCls = (active) =>
    `text-sm px-3 py-2 rounded-xl ${
      active
        ? "bg-slate-900/5 text-slate-900 font-semibold"
        : "text-slate-600 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="nav-accent" />
      <div className="nav-shell">
        <div className="nav-grid">
          {/* Brand */}
          <h1 className="font-extrabold text-lg sm:text-xl text-slate-900">
            <span className="text-brand-600">Place</span>ment
          </h1>

          {/* Center nav links */}
          <nav className="nav-center hidden sm:flex">
            {u &&
              (u.role === "admin" ? (
                <Link
                  to="/admin"
                  className={linkCls(pathname.startsWith("/admin"))}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className={linkCls(pathname.startsWith("/dashboard"))}
                >
                  Dashboard
                </Link>
              ))}
            {showUserSeg && (
              <div className="seg">
                <button
                  onClick={() => goTab("browse")}
                  className={`seg-btn ${
                    currentTab === "browse" ? "seg-btn-active" : "seg-btn-idle"
                  }`}
                >
                  Explore
                </button>
                <button
                  onClick={() => goTab("mine")}
                  className={`seg-btn ${
                    currentTab === "mine" ? "seg-btn-active" : "seg-btn-idle"
                  }`}
                >
                  My Submissions
                </button>
              </div>
            )}
          </nav>

          {/* Right side */}
          <div className="nav-right flex flex-wrap gap-2 sm:gap-3">
            {u && u.role !== "admin" && (
              <Link
                to="/add-experience"
                className="btn-primary h-9 sm:h-10 text-sm sm:text-base"
              >
                Add Experience
              </Link>
            )}
            {u && (
              <span className="hidden sm:flex items-center text-slate-700 text-sm mx-1">
                <span className="truncate max-w-[140px] sm:max-w-[180px] font-medium">
                  {u.name || "User"}
                </span>
              </span>
            )}
            {u ? (
              <button onClick={logout} className="btn-outline h-9 sm:h-10">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-ghost h-9 sm:h-10">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary h-9 sm:h-10">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
