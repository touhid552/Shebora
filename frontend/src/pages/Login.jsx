
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function Login({ expectedRole }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dashboardPaths = {
    customer: '/dashboard/customer',
    provider: '/dashboard/provider',
    admin: '/dashboard/admin'
  };

  const portalNames = {
    customer: 'Customer',
    provider: 'Provider',
    admin: 'Admin'
  };

  const pageTitle = expectedRole
    ? `${portalNames[expectedRole]} Sign In`
    : 'Sign in to Shebora';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const response = await login(email, password, expectedRole);
      const userRole = response?.user?.role;

      if (!userRole || !dashboardPaths[userRole]) {
        throw new Error('Unable to identify your account role.');
      }

      navigate(
        location.state?.from?.pathname || dashboardPaths[userRole],
        { replace: true }
      );
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-14">
      <div className="surface-card space-y-6 p-5 shadow-sm sm:p-7">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-neutral-200 shadow-md flex items-center justify-center mx-auto overflow-hidden">
            <img
              src="/assets/brand/shebora-logo.png"
              alt="Shebora Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            {pageTitle}
          </h1>

          <p className="text-xs text-neutral-500">
            Access your Dhaka appointments, technician hub, or admin desk
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Email Address
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. customer@shebora.bd"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Password
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Portal Links */}
        {!expectedRole && (
          <div className="text-center pt-2 border-t border-neutral-100">
            <p className="text-xs text-neutral-500 mb-2">
              Choose your login portal
            </p>

            <div className="flex justify-center gap-4 text-xs font-semibold">
              <Link to="/customer/login" className="text-emerald-700 hover:underline">
                Customer
              </Link>
              <Link to="/provider/login" className="text-emerald-700 hover:underline">
                Provider
              </Link>
              <Link to="/admin/login" className="text-emerald-700 hover:underline">
                Admin
              </Link>
            </div>
          </div>
        )}

        {/* Registration */}
        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-emerald-700 font-bold hover:underline">
            Register as Customer or Pro
          </Link>
        </div>

      </div>
    </div>
  );
}
