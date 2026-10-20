import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Wrench, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Login() {
  const { login, switchRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    try {
      await switchRole(role);
      if (role === 'admin') navigate('/dashboard/admin');
      else if (role === 'provider') navigate('/dashboard/provider');
      else navigate('/dashboard/customer');
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-neutral-200 shadow-md flex items-center justify-center mx-auto overflow-hidden">
            <img src="/assets/aistudio/image_cc3069dd.png" alt="Shebora Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Sign in to Shebora</h1>
          <p className="text-xs text-neutral-500">Access your Dhaka appointments, technician hub, or admin desk</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1-Click Demo Accounts Banner */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
          <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider text-center">
            ⚡ 1-Click Instant Evaluation Login:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-neutral-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-center cursor-pointer shadow-2xs"
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('provider')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-neutral-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-center cursor-pointer shadow-2xs"
            >
              Provider
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-neutral-200 hover:border-emerald-300 rounded-lg text-[11px] font-bold text-center cursor-pointer shadow-2xs"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
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
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
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
