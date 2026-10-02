import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Customer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user?.email}</span>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            to="/customer/services"
            className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Browse Services</h2>
            <p className="text-sm text-slate-500">
              Explore service categories and find what you need
            </p>
          </Link>

          <Link
            to="/customer/providers"
            className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">Find Providers</h2>
            <p className="text-sm text-slate-500">
              Search for providers by city, area, or pincode
            </p>
          </Link>

          <Link
            to="/customer/bookings"
            className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-1">My Bookings</h2>
            <p className="text-sm text-slate-500">View your service requests and their status</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
