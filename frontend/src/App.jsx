// src/App.jsx
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CompanyDetail from "./pages/CompanyDetail.jsx";
import AddExperience from "./pages/AddExperience.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";

/* ──────────────────────────────────────────────────────────────
   Public Landing (Hero + Logos in ONE card)
   ────────────────────────────────────────────────────────────── */
function MarketingHome() {
  // Local-first → Wikimedia SVG → PNG fallbacks (colored)
  const BRANDS = [
    { name: "Google",    srcs: ["/brands/google.svg","https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/320px-Google_2015_logo.svg.png"]},
    { name: "Microsoft", srcs: ["/brands/microsoft.svg","https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/320px-Microsoft_logo.svg.png"]},
    { name: "Amazon",    srcs: ["/brands/amazon.svg","https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png"]},
    { name: "Netflix",   srcs: ["/brands/netflix.svg","https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/320px-Netflix_2015_logo.svg.png"]},
    { name: "Apple",     srcs: ["/brands/apple.svg","https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/240px-Apple_logo_black.svg.png"]},
    { name: "IBM",       srcs: ["/brands/ibm.svg","https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/320px-IBM_logo.svg.png"]},
    { name: "Oracle",    srcs: ["/brands/oracle.svg","https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/320px-Oracle_logo.svg.png"]},
    { name: "Airbnb",    srcs: ["/brands/airbnb.svg","https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_Bélo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/320px-Airbnb_Logo_B%C3%A9lo.svg.png"]},
    { name: "PayPal",    srcs: ["/brands/paypal.svg","https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/320px-PayPal.svg.png"]},
    { name: "Spotify",   srcs: ["/brands/spotify.svg","https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/320px-Spotify_logo_with_text.svg.png"]},
    { name: "LinkedIn",  srcs: ["/brands/linkedin.svg","https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png","https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/240px-LinkedIn_logo_initials.png"]},
    { name: "Tesla",     srcs: ["/brands/tesla.svg","https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/240px-Tesla_T_symbol.svg.png"]},
    { name: "NVIDIA",    srcs: ["/brands/nvidia.svg","https://upload.wikimedia.org/wikipedia/sco/2/21/Nvidia_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/320px-Nvidia_logo.svg.png"]},
    { name: "Intel",     srcs: ["/brands/intel.svg","https://upload.wikimedia.org/wikipedia/commons/6/6a/Intel_logo_%282020%2C_dark_blue%29.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Intel_logo_%282020%2C_dark_blue%29.svg/320px-Intel_logo_%282020%2C_dark_blue%29.svg.png"]},
    { name: "Samsung",   srcs: ["/brands/samsung.svg","https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/320px-Samsung_Logo.svg.png"]},
    { name: "Dell",      srcs: ["/brands/dell.svg","https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/320px-Dell_Logo.svg.png"]},
    { name: "SAP",       srcs: ["/brands/sap.svg","https://upload.wikimedia.org/wikipedia/commons/5/59/SAP_2011_logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/SAP_2011_logo.svg/320px-SAP_2011_logo.svg.png"]},
    { name: "GitHub",    srcs: ["/brands/github.svg","https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/240px-Octicons-mark-github.svg.png"]},
    { name: "Slack",     srcs: ["/brands/slack.svg","https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png","https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Slack_Icon.png/240px-Slack_Icon.png"]},
    { name: "Zoom",      srcs: ["/brands/zoom.svg","https://upload.wikimedia.org/wikipedia/commons/7/7b/Zoom_Communications_Logo.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/320px-Zoom_Communications_Logo.svg.png"]},
    { name: "Dropbox",   srcs: ["/brands/dropbox.svg","https://upload.wikimedia.org/wikipedia/commons/7/78/Dropbox_Icon.svg","https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Dropbox_Icon.svg/240px-Dropbox_Icon.svg.png"]},
  ];

  const onImgError = (e, list) => {
    const idx = Number(e.currentTarget.dataset.idx || 0);
    const next = list[idx + 1];
    if (next) {
      e.currentTarget.dataset.idx = String(idx + 1);
      e.currentTarget.src = next;
    }
  };

  return (
    <>
      <Navbar />
      <main className="section">
        {/* ONE premium card: hero + brands */}
        <div className="card overflow-hidden p-0">
          {/* Hero strip (slightly smaller) */}
          <div className="px-8 sm:px-12 pt-12 pb-10 bg-gradient-to-br from-white to-brand-50/50">
            <div className="text-center max-w-5xl mx-auto">
              <h1 className="hero-title text-4xl sm:text-5xl">
                Placement tracking, <span className="text-brand-700">done right.</span>
              </h1>
              <p className="hero-sub text-base sm:text-lg">
                Organize companies, rounds and outcomes — all in one beautiful dashboard.
              </p>
              <div className="mt-7 flex items-center justify-center gap-3.5">
                <Link
                  to="/signup"
                  className="btn-primary px-5 sm:px-6 py-2.5 text-sm sm:text-base"
                >
                  Get started
                </Link>
                <Link
                  to="/login"
                  className="btn-outline px-5 sm:px-6 py-2.5 text-sm sm:text-base"
                >
                  I already have an account
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          {/* Logo wall (slightly smaller logos & tighter gaps) */}
          <div className="px-8 sm:px-12 py-10">
            <p className="text-center text-slate-500 text-sm sm:text-base">
              Trusted by students who interviewed at
            </p>

            <ul
              className="
                mt-8
                grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
                gap-x-14 gap-y-12 xl:gap-x-18 xl:gap-y-14
                place-items-center
              "
            >
              {BRANDS.map((b) => (
                <li key={b.name} className="w-full flex items-center justify-center p-2.5 sm:p-3">
                  <img
                    src={b.srcs[0]}
                    data-idx="0"
                    onError={(e) => onImgError(e, b.srcs)}
                    referrerPolicy="no-referrer"
                    decoding="async"
                    alt={b.name}
                    title={b.name}
                    className="h-11 md:h-12 lg:h-14 max-w-[190px] object-contain transition-transform duration-150 hover:scale-[1.04]"
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

/* ────────────────────────────────────────────────────────────── */
function NotFound() {
  return (
    <div className="section">
      <div className="card p-6">Not Found</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MarketingHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login defaultTab="signup" />} />

      <Route path="/user/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/admin/dashboard" element={<Navigate to="/admin" replace />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/:id"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <CompanyDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-experience"
        element={
          <ProtectedRoute roles={["user", "admin"]}>
            <AddExperience />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
