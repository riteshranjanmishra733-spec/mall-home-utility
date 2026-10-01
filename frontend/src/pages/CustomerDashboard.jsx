import { useAuth } from "../context/AuthContext.jsx";

export default function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          Customer Dashboard
        </h1>
        <p className="text-slate-600 mb-2">Coming in the next task</p>
        <p className="text-sm text-slate-400 mb-6">
          Logged in as {user?.email} ({user?.role})
        </p>
        <button
          onClick={logout}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
