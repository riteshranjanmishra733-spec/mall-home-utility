import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { api } from "../lib/api.js";

const PUBLIC_REGISTRATION_ROLES = ["CUSTOMER", "PROVIDER"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    city: "",
    area: "",
    pincode: "",
    phone: "",
    bio: "",
    serviceIds: [],
  });
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (form.role !== "PROVIDER") return;

    let cancelled = false;
    setServicesLoading(true);
    setServicesError("");
    api
      .getServices()
      .then((data) => {
        if (!cancelled) setServices(data.services || []);
      })
      .catch((err) => {
        if (!cancelled) setServicesError(err.message);
      })
      .finally(() => {
        if (!cancelled) setServicesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.role]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleServiceToggle(serviceId) {
    setForm((current) => ({
      ...current,
      serviceIds: current.serviceIds.includes(serviceId)
        ? current.serviceIds.filter((id) => id !== serviceId)
        : [...current.serviceIds, serviceId],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!PUBLIC_REGISTRATION_ROLES.includes(form.role)) {
      setError("Please select a valid account role");
      return;
    }
    if (form.role === "PROVIDER") {
      if (!form.city.trim()) {
        setError("City is required for provider registration");
        return;
      }
      if (servicesError) {
        setError("Available services could not be loaded. Please try again.");
        return;
      }
      if (form.serviceIds.length === 0) {
        setError("Select at least one service");
        return;
      }
    }

    setLoading(true);
    try {
      const registrationData = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      };
      if (form.role === "PROVIDER") {
        Object.assign(registrationData, {
          city: form.city,
          area: form.area,
          pincode: form.pincode,
          phone: form.phone,
          bio: form.bio,
          serviceIds: form.serviceIds,
        });
      }
      const user = await register(registrationData);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate(`/${user.role.toLowerCase()}`), 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 text-center">
          Create Account
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CUSTOMER">Customer</option>
              <option value="PROVIDER">Provider</option>
            </select>
          </div>

          {form.role === "PROVIDER" && (
            <div className="space-y-4 border border-slate-200 rounded p-4">
              <div>
                <label htmlFor="provider-city" className="block text-sm font-medium text-slate-700 mb-1">
                  City
                </label>
                <input
                  id="provider-city"
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="provider-area" className="block text-sm font-medium text-slate-700 mb-1">
                    Area <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input id="provider-area" type="text" name="area" value={form.area} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="provider-pincode" className="block text-sm font-medium text-slate-700 mb-1">
                    Pincode <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <input id="provider-pincode" type="text" name="pincode" value={form.pincode} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label htmlFor="provider-phone" className="block text-sm font-medium text-slate-700 mb-1">
                  Phone <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input id="provider-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label htmlFor="provider-bio" className="block text-sm font-medium text-slate-700 mb-1">
                  Bio <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <textarea id="provider-bio" name="bio" rows="3" value={form.bio} onChange={handleChange} className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-slate-700 mb-2">
                  Services offered <span className="text-red-600">*</span>
                </legend>
                {servicesLoading ? (
                  <p className="text-sm text-slate-500">Loading services…</p>
                ) : servicesError ? (
                  <p role="alert" className="text-sm text-red-600">{servicesError}</p>
                ) : services.length === 0 ? (
                  <p className="text-sm text-slate-500">No active services are available.</p>
                ) : (
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {services.map((service) => (
                      <label key={service.id} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={form.serviceIds.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{service.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </fieldset>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || (form.role === "PROVIDER" && servicesLoading)}
            className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
