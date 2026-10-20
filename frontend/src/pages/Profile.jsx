import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { DHAKA_NEIGHBORHOODS } from '../utils/geo.js';
import { User, Phone, MapPin, Mail, ShieldCheck, Check } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [area, setArea] = useState(user?.address?.area || 'Gulshan');
  const [building, setBuilding] = useState(user?.address?.building || '');
  const [road, setRoad] = useState(user?.address?.road || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const hood = DHAKA_NEIGHBORHOODS.find(n => n.area === area) || DHAKA_NEIGHBORHOODS[0];
      await updateProfile({
        name,
        phone,
        address: {
          area,
          building,
          road,
          lat: hood.lat,
          lng: hood.lng
        }
      });
      setMessage('Profile and address saved successfully.');
    } catch (err) {
      setMessage(err.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Account & Address Settings</h1>
        <p className="text-xs text-neutral-500 mt-1">Keep your contact details and default Dhaka service location up to date.</p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt="Avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-600"
          />
          <div>
            <div className="font-bold text-sm text-neutral-900">{user?.name}</div>
            <div className="text-[11px] text-neutral-500 font-mono">{user?.email}</div>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-100 text-emerald-800 mt-1">
              {user?.role}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-neutral-700 mb-1">Contact Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="017XXXXXXXX"
            className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Dhaka Area / Zone</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {DHAKA_NEIGHBORHOODS.map(n => (
                <option key={n.area} value={n.area}>{n.area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Building / House</label>
            <input
              type="text"
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="e.g. Green Valley Apt 4B"
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl transition-colors cursor-pointer"
        >
          {saving ? 'Saving changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
