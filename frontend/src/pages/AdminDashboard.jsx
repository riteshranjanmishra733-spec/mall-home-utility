import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

function dateOnly(value) {
  return value ? String(value).slice(0, 10) : "—";
}

function dateTime(value) {
  return value ? new Date(value).toLocaleString() : "—";
}

function EmptyRow({ columns, children }) {
  return (
    <tr>
      <td colSpan={columns} className="px-4 py-6 text-center text-sm text-slate-500">
        {children}
      </td>
    </tr>
  );
}

function Table({ headers, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs font-medium uppercase text-slate-500">
          <tr>{headers.map((header) => <th key={header} className="px-4 py-3">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
      </table>
    </div>
  );
}

function Section({ title, count, children }) {
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="font-semibold text-slate-800">{title}</h2>
        {count !== undefined && <span className="text-sm text-slate-500">{count}</span>}
      </div>
      {children}
    </section>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    Promise.all([
      api.getAdminOverview(),
      api.getAdminUsers(),
      api.getAdminProviders(),
      api.getAdminServices(),
      api.getAdminCategories(),
      api.getAdminBookings(),
    ])
      .then(([overviewData, usersData, providersData, servicesData, categoriesData, bookingsData]) => {
        if (cancelled) return;
        setOverview(overviewData.overview);
        setUsers(usersData.users);
        setProviders(providersData.providers);
        setServices(servicesData.services);
        setCategories(categoriesData.categories);
        setBookings(bookingsData.bookings);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load admin dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const serviceCountsByCategory = services.reduce((counts, service) => {
    counts[service.category.id] = (counts[service.category.id] || 0) + 1;
    return counts;
  }, {});

  const statistics = overview ? [
    ["Total users", overview.totalUsers],
    ["Customers", overview.totalCustomers],
    ["Provider accounts", overview.totalProviderAccounts],
    ["Provider profiles", overview.totalProviderProfiles],
    ["Services", overview.totalServices],
    ["Bookings", overview.totalBookings],
  ] : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              disabled={loading}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              {loading ? "Loading…" : "Refresh"}
            </button>
            <button
              type="button"
              onClick={logout}
              className="rounded bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        {error ? (
          <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>Unable to load admin data: {error}</span>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)} className="font-medium underline">
              Try again
            </button>
          </div>
        ) : loading && !overview ? (
          <p className="py-10 text-center text-sm text-slate-500">Loading admin dashboard…</p>
        ) : (
          <>
            <section aria-label="Overview statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              {statistics.map(([label, value]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-white px-4 py-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-800">{value.toLocaleString()}</p>
                </div>
              ))}
            </section>

            <Section title="Users" count={users.length}>
              <Table headers={["Name", "Email", "Role", "Created"]}>
                {users.length === 0 ? <EmptyRow columns={4}>No users found.</EmptyRow> : users.map((listedUser) => (
                  <tr key={listedUser.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{listedUser.name}</td>
                    <td className="px-4 py-3 text-slate-600">{listedUser.email}</td>
                    <td className="px-4 py-3 text-slate-600">{listedUser.role}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">{dateTime(listedUser.createdAt)}</td>
                  </tr>
                ))}
              </Table>
            </Section>

            <Section title="Providers" count={providers.length}>
              <Table headers={["Provider", "Location", "Availability", "Offered services"]}>
                {providers.length === 0 ? <EmptyRow columns={4}>No provider profiles found.</EmptyRow> : providers.map((provider) => (
                  <tr key={provider.id}>
                    <td className="min-w-52 px-4 py-3">
                      <p className="font-medium text-slate-800">{provider.name}</p>
                      <p className="text-slate-500">{provider.email}</p>
                      {provider.phone && <p className="text-slate-500">{provider.phone}</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {[provider.city, provider.area, provider.pincode].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{provider.isAvailable ? "Available" : "Unavailable"}</td>
                    <td className="min-w-64 px-4 py-3 text-slate-600">
                      {provider.offeredServices.length === 0 ? "None" : provider.offeredServices.map((service) => (
                        <span key={service.id} className="mr-1 inline-block rounded bg-slate-100 px-2 py-1 text-xs">
                          {service.name}{!service.isActive || !service.isAvailable ? " (off)" : ""}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </Table>
            </Section>

            <div className="grid gap-6 xl:grid-cols-2">
              <Section title="Services" count={services.length}>
                <Table headers={["Service", "Category", "Status"]}>
                  {services.length === 0 ? <EmptyRow columns={3}>No services found.</EmptyRow> : services.map((service) => (
                    <tr key={service.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{service.name}</p>
                        {service.description && <p className="text-xs text-slate-500">{service.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{service.category.name}</td>
                      <td className="px-4 py-3 text-slate-600">{service.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </Table>
              </Section>

              <Section title="Categories" count={categories.length}>
                <Table headers={["Category", "Description", "Services"]}>
                  {categories.length === 0 ? <EmptyRow columns={3}>No categories found.</EmptyRow> : categories.map((category) => (
                    <tr key={category.id}>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{category.name}</td>
                      <td className="px-4 py-3 text-slate-600">{category.description || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{serviceCountsByCategory[category.id] || 0}</td>
                    </tr>
                  ))}
                </Table>
              </Section>
            </div>

            <Section title="Bookings" count={bookings.length}>
              <Table headers={["Customer", "Provider", "Service", "Date / time", "Status", "Address / notes"]}>
                {bookings.length === 0 ? <EmptyRow columns={6}>No bookings found.</EmptyRow> : bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="min-w-44 px-4 py-3">
                      <p className="font-medium text-slate-800">{booking.customer.name}</p>
                      <p className="text-slate-500">{booking.customer.email}</p>
                    </td>
                    <td className="min-w-44 px-4 py-3">
                      <p className="font-medium text-slate-800">{booking.provider.name}</p>
                      <p className="text-slate-500">{booking.provider.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.service.name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {dateOnly(booking.bookingDate)}{booking.bookingTime ? ` · ${booking.bookingTime}` : ""}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">{booking.status}</td>
                    <td className="min-w-56 px-4 py-3 text-slate-600">
                      <p>{booking.address}</p>
                      {booking.notes && <p className="mt-1 text-xs text-slate-500">{booking.notes}</p>}
                    </td>
                  </tr>
                ))}
              </Table>
            </Section>
          </>
        )}
      </main>
    </div>
  );
}
