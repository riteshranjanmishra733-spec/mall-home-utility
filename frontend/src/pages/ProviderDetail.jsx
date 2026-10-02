import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ProviderDetail() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getProvider(id)
      .then((data) => setProvider(data.provider))
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
          <Link to="/customer/providers" className="text-blue-600 hover:underline">
            ← Back to providers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/customer/providers" className="text-sm text-slate-500 hover:text-slate-700">
            ← Providers
          </Link>
          <h1 className="text-xl font-bold text-slate-800">{provider.name}</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">About</h2>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    provider.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {provider.isAvailable ? "Available" : "Currently Unavailable"}
                </span>
              </div>
              {provider.bio && (
                <p className="text-slate-600 text-sm leading-relaxed">{provider.bio}</p>
              )}
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Services Offered</h2>
              {provider.services.length === 0 ? (
                <p className="text-slate-500 text-sm">No services listed.</p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  {provider.services.map((s) => (
                    <div key={s.id} className="flex items-center justify-between gap-3 p-3 rounded border border-slate-200">
                      <div>
                        <Link to={`/customer/services/${s.id}`} className="text-sm font-medium text-slate-800 hover:text-blue-600">
                          {s.name}
                        </Link>
                        <p className="text-xs text-slate-400">{s.categoryName}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            s.isAvailable && provider.isAvailable
                              ? "bg-green-50 text-green-600"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {s.isAvailable && provider.isAvailable ? "Available" : "Off"}
                        </span>
                        {s.isAvailable && provider.isAvailable ? (
                          <Link
                            to={`/customer/providers/${id}/services/${s.id}/book`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            Book Service
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact / location card */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Location</h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-400 text-xs uppercase tracking-wide">City</dt>
                  <dd className="text-slate-700">{provider.city || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs uppercase tracking-wide">Area</dt>
                  <dd className="text-slate-700">{provider.area || "Not specified"}</dd>
                </div>
                <div>
                  <dt className="text-slate-400 text-xs uppercase tracking-wide">Pincode</dt>
                  <dd className="text-slate-700">{provider.pincode || "Not specified"}</dd>
                </div>
              </dl>
            </div>

            {provider.phone && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">Contact</h2>
                <p className="text-sm text-slate-700">{provider.phone}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
