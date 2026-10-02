import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../lib/api.js";

export default function ServiceCatalog() {
  const { categoryId } = useParams();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getCategories()
      .then((data) => setCategories(data.categories))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getServices(categoryId)
      .then((data) => setServices(data.services))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/customer" className="text-sm text-slate-500 hover:text-slate-700">
            ← Dashboard
          </Link>
          <h1 className="text-xl font-bold text-slate-800">Browse Services</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            to="/customer/services"
            className={`px-3 py-1.5 rounded text-sm font-medium ${
              !categoryId
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/customer/services/category/${cat.id}`}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                categoryId === cat.id
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-blue-300"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading services…</p>
        ) : services.length === 0 ? (
          <p className="text-slate-500">No services found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/customer/services/${service.id}`}
                className="block p-5 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-sm transition"
              >
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                  {service.category.name}
                </span>
                <h3 className="text-base font-semibold text-slate-800 mt-1 mb-1">
                  {service.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {service.description}
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  {service.providerCount} provider{service.providerCount !== 1 ? "s" : ""} available
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
