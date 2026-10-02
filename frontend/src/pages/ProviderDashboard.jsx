import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

export default function ProviderDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getProviderBookings()
      .then((data) => setBookings(data.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Provider Dashboard</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <button onClick={logout} className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded hover:bg-slate-800">Logout</button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Assigned Bookings</h2>
        {error && <div role="alert" className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
        {loading ? (
          <p className="text-slate-500">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <p className="text-slate-500">No bookings assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <article key={booking.id} className="bg-white rounded-lg border border-slate-200 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{booking.service.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">Customer: {booking.customer.name} · {booking.customer.email}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-amber-50 text-amber-700">{booking.status}</span>
                </div>
                <dl className="grid gap-3 sm:grid-cols-2 mt-4 text-sm">
                  <div><dt className="text-xs text-slate-400">Date and time</dt><dd className="text-slate-700">{String(booking.bookingDate).slice(0, 10)}{booking.bookingTime ? ` · ${booking.bookingTime}` : " · Time not specified"}</dd></div>
                  <div><dt className="text-xs text-slate-400">Address</dt><dd className="text-slate-700">{booking.address}</dd></div>
                  {booking.notes && <div className="sm:col-span-2"><dt className="text-xs text-slate-400">Notes</dt><dd className="text-slate-700">{booking.notes}</dd></div>}
                </dl>
              </article>
            ))}
          </div>
        )}
        </main>
    </div>
  );
}
