import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ProviderSearch() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    city: "",
    area: "",
    pincode: "",
    available: "",
  });

  function fetchProviders(params = {}) {
    setLoading(true);
    setError("");
    api
      .searchProviders(params)
      .then((data) => setProviders(data.providers))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProviders();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const params = {};
    if (filters.city) params.city = filters.city;
    if (filters.area) params.area = filters.area;
    if (filters.pincode) params.pincode = filters.pincode;
    if (filters.available) params.available = filters.available;
    fetchProviders(params);
  }

  function handleReset() {
    setFilters({ city: "", area: "", pincode: "", available: "" });
    fetchProviders();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/customer" className="text-sm text-slate-500 hover:text-slate-700">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Find Providers</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Area</label>
              <input
                type="text"
                value={filters.area}
                onChange={(e) => setFilters({ ...filters, area: e.target.value })}
                placeholder="e.g. Andheri"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Pincode</label>
              <input
                type="text"
                value={filters.pincode}
                onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
                placeholder="e.g. 400058"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Availability</label>
              <select
                value={filters.available}
                onChange={(e) => setFilters({ ...filters, available: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="true">Available only</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading providers…</p>
        ) : providers.length === 0 ? (
          <p className="text-slate-500">No providers found. Try adjusting your search.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {providers.map((provider) => (
              <Link
                key={provider.id}
                to={`/customer/providers/${provider.id}`}
                className="block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-semibold text-slate-800">{provider.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      provider.isAvailable
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {provider.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-2">
                  {provider.city || "City not set"}
                  {provider.area ? `, ${provider.area}` : ""}
                  {provider.pincode ? ` - ${provider.pincode}` : ""}
                </p>
                <div className="flex flex-wrap gap-1">
                  {provider.services.slice(0, 3).map((s) => (
                    <span
                      key={s.id}
                      className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded"
                    >
                      {s.name}
                    </span>
                  ))}
                  {provider.services.length > 3 && (
                    <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      +{provider.services.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
