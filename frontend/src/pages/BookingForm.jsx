import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api.js";

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function BookingForm() {
  const { providerId, serviceId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ bookingDate: "", bookingTime: "", address: "", notes: "" });

  useEffect(() => {
    Promise.all([api.getProvider(providerId), api.getService(serviceId)])
      .then(([providerData, serviceData]) => {
        setProvider(providerData.provider);
        setService(serviceData.service);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [providerId, serviceId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await api.createBooking({
        providerId,
        serviceId,
        bookingDate: form.bookingDate,
        bookingTime: form.bookingTime,
        address: form.address,
        notes: form.notes,
      });
      navigate("/customer/bookings", {
        state: {
          bookingSuccess: `Your ${result.booking?.service?.name || service.name} request was submitted.`,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><p className="text-slate-500">Loading booking details…</p></div>;
  }

  const offeredService = provider?.services.find((item) => item.id === serviceId);
  const canBook = offeredService?.isAvailable && provider?.isAvailable;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to={`/customer/providers/${providerId}`} className="text-sm text-slate-500 hover:text-slate-700">← Provider</Link>
          <h1 className="text-xl font-bold text-slate-800">Book Service</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {error && <div role="alert" className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {!provider || !service ? (
          <p className="text-slate-600">The selected provider or service could not be found.</p>
        ) : !canBook ? (
          <section className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-slate-700">This provider is not currently available for {service.name}.</p>
            <Link to={`/customer/providers/${providerId}`} className="inline-block mt-4 text-sm text-blue-600 hover:underline">Back to provider</Link>
          </section>
        ) : (
          <>
            <section className="bg-white rounded-lg border border-slate-200 p-5 mb-5">
              <h2 className="text-lg font-semibold text-slate-800">{service.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{provider.name}{provider.city ? ` · ${provider.city}` : ""}</p>
            </section>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="booking-date" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input id="booking-date" type="date" min={localDateString(new Date())} required value={form.bookingDate} onChange={(event) => setForm({ ...form, bookingDate: event.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="booking-time" className="block text-sm font-medium text-slate-700 mb-1">Time <span className="font-normal text-slate-400">(optional)</span></label>
                  <input id="booking-time" type="time" value={form.bookingTime} onChange={(event) => setForm({ ...form, bookingTime: event.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label htmlFor="booking-address" className="block text-sm font-medium text-slate-700 mb-1">Service address</label>
                <textarea id="booking-address" required rows="3" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="booking-notes" className="block text-sm font-medium text-slate-700 mb-1">Notes <span className="font-normal text-slate-400">(optional)</span></label>
                <textarea id="booking-notes" rows="3" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60">
                {submitting ? "Submitting…" : "Confirm Booking"}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
