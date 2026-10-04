import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const statusStyle = {
  PENDING: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  COMPLETED: "bg-blue-50 text-blue-700",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function ProviderDashboard() {
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  const [error, setError] = useState("");
  const [serviceError, setServiceError] = useState("");

  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [savingPriceId, setSavingPriceId] = useState(null);

  useEffect(() => {
    api.getProviderBookings()
      .then((data) => setBookings(data.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    api.getProviderServices()
      .then((data) => setServices(data.services))
      .catch((err) => setServiceError(err.message))
      .finally(() => setServicesLoading(false));
  }, []);

  async function updateBookingStatus(bookingId, status) {
    setUpdatingBookingId(bookingId);
    setError("");

    try {
      const { booking } = await api.updateProviderBookingStatus(
        bookingId,
        status
      );

      setBookings((current) =>
        current.map((item) =>
          item.id === booking.id
            ? { ...item, ...booking }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingBookingId(null);
    }
  }

  function startEditingPrice(service) {
    setEditingServiceId(service.id);
    setPriceInput(String(service.price ?? ""));
    setServiceError("");
  }

  function cancelEditingPrice() {
    setEditingServiceId(null);
    setPriceInput("");
  }

  async function savePrice(serviceId) {
    const price = Number(priceInput);

    if (!Number.isFinite(price) || price < 0) {
      setServiceError("Please enter a valid non-negative price.");
      return;
    }

    setSavingPriceId(serviceId);
    setServiceError("");

    try {
      const { providerService } =
        await api.updateProviderServicePrice(serviceId, price);

      setServices((current) =>
        current.map((service) =>
          service.id === serviceId
            ? {
                ...service,
                price: providerService.price,
              }
            : service
        )
      );

      cancelEditingPrice();
    } catch (err) {
      setServiceError(err.message);
    } finally {
      setSavingPriceId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Provider Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              {user?.email}
            </p>
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm bg-slate-700 text-white rounded hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* SERVICES */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            My Services
          </h2>

          {serviceError && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
            >
              {serviceError}
            </div>
          )}

          {servicesLoading ? (
            <p className="text-slate-500">
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <p className="text-slate-500">
                No services assigned yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="bg-white rounded-lg border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {service.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        {service.categoryName}
                      </p>

                      <p className="text-sm text-slate-600 mt-2">
                        Current price:{" "}
                        <span className="font-semibold text-slate-800">
                          ₹{service.price}
                        </span>
                      </p>
                    </div>

                    {editingServiceId !== service.id ? (
                      <button
                        type="button"
                        onClick={() => startEditingPrice(service)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit Price
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center">
                          <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 border-r-0 rounded-l text-slate-600">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={priceInput}
                            onChange={(e) =>
                              setPriceInput(e.target.value)
                            }
                            className="w-28 px-3 py-1.5 border border-slate-300 rounded-r focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => savePrice(service.id)}
                          disabled={savingPriceId === service.id}
                          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                        >
                          {savingPriceId === service.id
                            ? "Saving..."
                            : "Save"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditingPrice}
                          disabled={savingPriceId === service.id}
                          className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded hover:bg-slate-300 disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* BOOKINGS */}
        <section>
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Assigned Bookings
          </h2>

          {error && (
            <div
              role="alert"
              className="mb-5 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm"
            >
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-slate-500">
              Loading bookings...
            </p>
          ) : bookings.length === 0 ? (
            <p className="text-slate-500">
              No bookings assigned yet.
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="bg-white rounded-lg border border-slate-200 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {booking.service.name}
                      </h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Customer: {booking.customer.name} ·{" "}
                        {booking.customer.email}
                      </p>
                    </div>

                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        statusStyle[booking.status] ||
                        statusStyle.PENDING
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <dl className="grid gap-3 sm:grid-cols-2 mt-4 text-sm">
                    <div>
                      <dt className="text-xs text-slate-400">
                        Date and time
                      </dt>

                      <dd className="text-slate-700">
                        {String(booking.bookingDate).slice(0, 10)}
                        {booking.bookingTime
                          ? ` · ${booking.bookingTime}`
                          : " · Time not specified"}
                      </dd>
                    </div>

                    <div>
                      <dt className="text-xs text-slate-400">
                        Address
                      </dt>

                      <dd className="text-slate-700">
                        {booking.address}
                      </dd>
                    </div>

                    {booking.notes && (
                      <div className="sm:col-span-2">
                        <dt className="text-xs text-slate-400">
                          Notes
                        </dt>

                        <dd className="text-slate-700">
                          {booking.notes}
                        </dd>
                      </div>
                    )}
                  </dl>

                  {booking.status === "PENDING" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "ACCEPTED"
                          )
                        }
                        disabled={
                          updatingBookingId === booking.id
                        }
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60"
                      >
                        {updatingBookingId === booking.id
                          ? "Updating..."
                          : "Accept"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          updateBookingStatus(
                            booking.id,
                            "REJECTED"
                          )
                        }
                        disabled={
                          updatingBookingId === booking.id
                        }
                        className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-60"
                      >
                        {updatingBookingId === booking.id
                          ? "Updating..."
                          : "Reject"}
                      </button>
                    </div>
                  )}

                  {booking.status === "ACCEPTED" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateBookingStatus(
                          booking.id,
                          "COMPLETED"
                        )
                      }
                      disabled={
                        updatingBookingId === booking.id
                      }
                      className="mt-4 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                    >
                      {updatingBookingId === booking.id
                        ? "Updating..."
                        : "Complete"}
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}