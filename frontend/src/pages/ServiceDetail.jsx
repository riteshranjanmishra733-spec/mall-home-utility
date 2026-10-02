import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    Promise.all([api.getService(id), api.getProvidersForService(id)])
      .then(([svcData, provData]) => {
        setService(svcData.service);
        setProviders(provData.providers);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/customer/services" className="text-blue-600 hover:underline">
            ← Back to services
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/customer/services" className="text-sm text-slate-500 hover:text-slate-700">
            ← Services
          </Link>
          <h1 className="text-xl font-bold text-slate-800">{service.name}</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {service.category.name}
          </span>
          <p className="text-slate-600 mt-2">{service.description}</p>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Providers ({providers.length})
        </h2>

        {providers.length === 0 ? (
          <p className="text-slate-500">No providers available for this service yet.</p>
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
                {provider.city && (
                  <p className="text-sm text-slate-500">
                    {provider.city}
                    {provider.area ? `, ${provider.area}` : ""}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
