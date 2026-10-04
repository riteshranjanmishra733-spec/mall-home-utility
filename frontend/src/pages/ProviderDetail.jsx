
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
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>

          <Link
            to="/customer/providers"
            className="text-blue-600 hover:underline"
          >
            ← Back to providers
          </Link>
        </div>
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            to="/customer/providers"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            ← Providers
          </Link>

          <h1 className="text-xl font-bold text-slate-800">
            {provider.name}
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Profile */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">
                  About
                </h2>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    provider.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {provider.isAvailable
                    ? "Available"
                    : "Currently Unavailable"}
                </span>
              </div>

              {provider.bio && (
                <p className="text-slate-600 text-sm leading-relaxed">
                  {provider.bio}
                </p>
              )}
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Services Offered
              </h2>

              {provider.services.length === 0 ? (
                <p className="text-slate-500 text-sm">
                  No services listed.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {provider.services.map((service) => {
                    const serviceAvailable =
                      service.isAvailable && provider.isAvailable;

                    return (
                      <div
                        key={service.id}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Link
                              to={`/customer/services/${service.id}`}
                              className="text-sm font-semibold text-slate-800 hover:text-blue-600"
                            >
                              {service.name}
                            </Link>

                            <p className="text-xs text-slate-400 mt-1">
                              {service.categoryName}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 text-xs px-2 py-0.5 rounded ${
                              serviceAvailable
                                ? "bg-green-50 text-green-600"
                                : "bg-slate-50 text-slate-400"
                            }`}
                          >
                            {serviceAvailable ? "Available" : "Off"}
                          </span>
                        </div>

                        {/* PRICE */}
                        <div className="mt-4">
                          <p className="text-xs text-slate-400">
                            Service Price
                          </p>

                          <p className="text-lg font-bold text-slate-800">
                            ₹{service.price ?? "Not set"}
                          </p>
                        </div>

                        {/* BOOK BUTTON */}
                        {serviceAvailable && (
                          <Link
                            to={`/customer/providers/${id}/services/${service.id}/book`}
                            className="inline-block mt-3 w-full text-center px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Book Service
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Location / Contact */}
          <div className="space-y-6">

            {/* Location */}
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Location
              </h2>

              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-slate-400 text-xs uppercase tracking-wide">
                    City
                  </dt>

                  <dd className="text-slate-700">
                    {provider.city || "Not specified"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 text-xs uppercase tracking-wide">
                    Area
                  </dt>

                  <dd className="text-slate-700">
                    {provider.area || "Not specified"}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-400 text-xs uppercase tracking-wide">
                    Pincode
                  </dt>

                  <dd className="text-slate-700">
                    {provider.pincode || "Not specified"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Contact */}
            {provider.phone && (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-2">
                  Contact
                </h2>

                <p className="text-sm text-slate-700">
                  {provider.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

