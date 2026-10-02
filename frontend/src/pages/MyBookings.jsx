import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "../lib/api.js";

const statusStyle = {
  PENDING: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function MyBookings() {
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBookings()
      .then((data) => setBookings(data.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/customer" className="text-sm text-slate-500 hover:text-slate-700">← Dashboard</Link>
          <h1 className="text-xl font-bold text-slate-800">My Bookings</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {location.state?.bookingSuccess && (
          <div role="status" className="mb-5 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {location.state.bookingSuccess}
          </div>
        )}
        {error && <div role="alert" className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}
        {loading ? (
          <p className="text-slate-500">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-600">You have no bookings yet.</p>
            <Link to="/customer/services" className="inline-block mt-3 text-sm text-blue-600 hover:underline">Browse services</Link>
          </section>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const date = String(booking.bookingDate).slice(0, 10);
              return (
                <article key={booking.id} className="bg-white rounded-lg border border-slate-200 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-slate-800">{booking.service.name}</h2>
                      <p className="text-sm text-slate-500 mt-1">Provider: {booking.provider.user.name}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${statusStyle[booking.status] || statusStyle.PENDING}`}>
                      {booking.status}
                    </span>
                  </div>
                  <dl className="grid gap-3 sm:grid-cols-2 mt-4 text-sm">
                    <div><dt className="text-xs text-slate-400">Date and time</dt><dd className="text-slate-700">{date}{booking.bookingTime ? ` · ${booking.bookingTime}` : " · Time not specified"}</dd></div>
                    <div><dt className="text-xs text-slate-400">Address</dt><dd className="text-slate-700">{booking.address}</dd></div>
                  </dl>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
