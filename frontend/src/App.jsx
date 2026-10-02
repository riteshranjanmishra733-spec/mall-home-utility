import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ServiceCatalog from "./pages/ServiceCatalog.jsx";
import ServiceDetail from "./pages/ServiceDetail.jsx";
import ProviderSearch from "./pages/ProviderSearch.jsx";
import ProviderDetail from "./pages/ProviderDetail.jsx";
import ProviderDashboard from "./pages/ProviderDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Customer routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ServiceCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services/category/:categoryId"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ServiceCatalog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/services/:id"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ServiceDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/providers"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ProviderSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/providers/:id"
        element={
          <ProtectedRoute allowedRoles={["CUSTOMER"]}>
            <ProviderDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/provider"
        element={
          <ProtectedRoute allowedRoles={["PROVIDER"]}>
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
