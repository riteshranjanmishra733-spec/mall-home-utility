import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Landing() {
  const { user, logout } = useAuth();
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Mall &amp; Home Utility Services
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          The application is running.
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Backend Status
          </h2>
          {health && (
            <p className="text-green-600 font-medium">{health.message}</p>
          )}
          {error && (
            <p className="text-red-600 font-medium">
              Unable to reach backend: {error}
            </p>
          )}
          {!health && !error && (
            <p className="text-slate-400 font-medium">Checking…</p>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          {user ? (
            <>
              <Link
                to={`/${user.role.toLowerCase()}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
