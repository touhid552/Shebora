import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DHAKA_NEIGHBORHOODS } from '../utils/geo.js';
import { Wrench, User, Mail, Lock, Phone, MapPin, Briefcase, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer' | 'provider'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [area, setArea] = useState('Gulshan');
  const [addressLine, setAddressLine] = useState('');

  // Provider specific
  const [selectedCategories, setSelectedCategories] = useState(['AC Repair']);
  const [experienceYears, setExperienceYears] = useState(3);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const availableCategories = [
    'AC Repair',
    'Plumbing',
    'Electrical Repair',
    'Home Cleaning',
    'Appliance Repair',
    'Painting'
  ];

  const handleCategoryToggle = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const selectedHood = DHAKA_NEIGHBORHOODS.find(n => n.area === area) || DHAKA_NEIGHBORHOODS[0];

      const payload = {
        name,
        email,
        phone,
        password,
        role,
        address: {
          area,
          building: addressLine || 'House 1',
          lat: selectedHood.lat,
          lng: selectedHood.lng
        },
        categories: selectedCategories,
        experienceYears: Number(experienceYears)
      };

      const res = await register(payload);
      if (role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border border-neutral-200 shadow-md flex items-center justify-center mx-auto overflow-hidden">
            <img src="/assets/aistudio/image_cc3069dd.png" alt="Shebora Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Create a Shebora Account</h1>
          <p className="text-xs text-neutral-500">Join Dhaka's premier home service ecosystem</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-neutral-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            I am a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('provider')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              role === 'provider'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            I am a Service Technician
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {role === 'provider' && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed">
            📢 <strong>Provider Notice:</strong> To ensure customer trust and safety, technician accounts require review & verification approval by Shebora Administrator before receiving customer bookings.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tanvir Ahmed or Rafiqul Islam"
              required
              className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Phone Number (Dhaka / BD)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                required
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              minLength={6}
              className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Dhaka Area / Base</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {DHAKA_NEIGHBORHOODS.map(n => (
                  <option key={n.area} value={n.area}>{n.area}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Road / House Details</label>
              <input
                type="text"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="e.g. House 14, Road 7"
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Provider Specific Skills */}
          {role === 'provider' && (
            <div className="pt-2 border-t border-neutral-200 space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">Select Service Skills (at least one):</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`p-2 rounded-xl text-left font-semibold border transition-all cursor-pointer ${
                        selectedCategories.includes(cat)
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">Years of Practical Experience:</label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer pt-3"
          >
            {loading ? 'Creating account...' : role === 'provider' ? 'Submit Provider Registration' : 'Register Customer Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-neutral-500 pt-2 border-t border-neutral-100">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-700 font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
