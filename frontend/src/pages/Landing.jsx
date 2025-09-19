import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container max-w-7xl px-4 py-10 space-y-8">
        {/* Hero */}
        <section className="card p-8 md:p-12 text-center">
          <h1 className="hero-title">
            Placement tracking, done right.
          </h1>
          <p className="hero-sub">
            Organize companies, rounds and outcomes — all in one beautiful dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/signup" className="btn-primary h-12 px-6 text-base">
              Get started
            </Link>
            <Link to="/login" className="btn-outline h-12 px-6 text-base">
              I already have an account
            </Link>
          </div>
        </section>

        {/* Feature cards */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="text-lg font-semibold">Clean interface</div>
            <p className="mt-2 text-slate-600">
              Fast, minimal and focused on your workflow.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-lg font-semibold">Role aware</div>
            <p className="mt-2 text-slate-600">
              Admins review & approve; users track their journey.
            </p>
          </div>
          <div className="card p-6">
            <div className="text-lg font-semibold">Secure & reliable</div>
            <p className="mt-2 text-slate-600">
              JWT auth with protected routes and actions.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
