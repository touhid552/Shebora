import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Wrench,
  CheckCircle,
  Clock,
  MapPin,
  ExternalLink,
  DollarSign,
  AlertTriangle,
  Power,
  ShieldCheck,
  Star,
  Compass,
  Calendar,
  Phone
} from 'lucide-react';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Settings
  const [isAvailable, setIsAvailable] = useState(false);
  const [serviceRadiusKm, setServiceRadiusKm] = useState(10);
  const [workingHours, setWorkingHours] = useState('08:00 AM - 09:00 PM');
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    loadProviderData();
  }, []);

  async function loadProviderData() {
    setLoading(true);
    try {
      const [profileRes, jobsRes] = await Promise.all([
        api.getMyProviderProfile(),
        api.getProviderJobs()
      ]);

      if (profileRes?.data) {
        setProfile(profileRes.data.profile);
        setStats(profileRes.data.stats);
        setIsAvailable(profileRes.data.profile.isAvailable || false);
        setServiceRadiusKm(profileRes.data.profile.serviceRadiusKm || 10);
        setWorkingHours(profileRes.data.profile.workingHours || '08:00 AM - 09:00 PM');
      }

      if (jobsRes?.data) {
        setJobs(jobsRes.data);
      }
    } catch (err) {
      console.error('Error fetching provider data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusTransition = async (bookingId, nextStatus) => {
    setUpdatingStatusId(bookingId);
    try {
      await api.updateJobStatus(bookingId, nextStatus);
      setFeedbackMsg(`Job status updated to ${nextStatus.replace('_', ' ')}.`);
      loadProviderData();
    } catch (err) {
      alert(err.message || 'Status update failed.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.updateProviderSettings({
        isAvailable,
        serviceRadiusKm,
        workingHours
      });
      setFeedbackMsg('Coverage radius and availability saved.');
    } catch (err) {
      alert(err.message || 'Failed to update settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  const isApproved = profile?.approvalStatus === 'approved';

  if (loading) {
    return <div className="py-20 text-center text-xs text-neutral-400">Loading technician portal...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Provider Verification Warning if not yet approved */}
      {!isApproved ? (
        <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <h3 className="font-extrabold text-base">Account Pending Admin Approval</h3>
          </div>
          <p className="text-xs leading-relaxed max-w-2xl text-amber-800">
            Welcome, <strong>{profile?.name}</strong>! As part of Shebora's customer safety standards, providers must not receive customer bookings until their identity documents (NID/trade license) are reviewed and approved by the Shebora Administrator.
          </p>
          <div className="text-[11px] text-amber-700 bg-amber-100/60 p-2.5 rounded-lg inline-block">
            Submitted Document: <strong>{profile?.verificationDoc?.type || 'National ID'}</strong> (Status: Under Review)
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Verified Technician Profile: <strong>{profile?.name}</strong> ({profile?.approvalStatus})</span>
          </div>
          <span className="font-semibold text-emerald-700">⭐ {profile?.rating || 4.9} Rating</span>
        </div>
      )}

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg('')} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Total BDT Earnings</span>
          <div className="text-2xl font-black text-neutral-900">৳{stats?.totalEarnings || 0}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">After 10% platform commission</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Completed Jobs</span>
          <div className="text-2xl font-black text-neutral-900">{stats?.completedCount || 0}</div>
          <span className="text-[10px] text-neutral-500">Dhaka households served</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Active Dispatches</span>
          <div className="text-2xl font-black text-emerald-700">{stats?.activeCount || 0}</div>
          <span className="text-[10px] text-neutral-500">In-progress or on the way</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Customer Rating</span>
          <div className="text-2xl font-black text-amber-500 flex items-center gap-1">
            <Star className="w-6 h-6 fill-amber-400" />
            {profile?.rating || 4.9}
          </div>
          <span className="text-[10px] text-neutral-500">({profile?.reviewsCount || 0} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Assigned Jobs Lifecycle Management */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Assigned Job Queue & Status Updates
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Follow Shebora's strict status progression for customer transparency.
            </p>
          </div>

          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 text-neutral-400 text-xs">
                No job dispatches currently assigned to your profile.
              </div>
            ) : (
              jobs.map((job) => {
                const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${job.address?.lat || 23.81},${job.address?.lng || 90.41}`;

                return (
                  <div
                    key={job.id}
                    className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-neutral-500">{job.bookingNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-800 uppercase">
                            {job.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-neutral-900 mt-1">{job.serviceName}</h3>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 block font-medium">Customer Bill</span>
                        <span className="text-xl font-black text-neutral-900">৳{job.pricing?.totalAmount}</span>
                        <span className="text-[10px] text-emerald-700 block font-semibold">
                          Your share: ৳{job.pricing?.providerEarnings || Math.round(job.pricing?.totalAmount * 0.9)}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      <div>
                        <span className="text-neutral-400 block">Customer Contact:</span>
                        <div className="font-bold text-neutral-900">{job.customerName}</div>
                        <div className="text-neutral-600 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{job.customerPhone}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-neutral-400 block">Service Address:</span>
                        <div className="font-bold text-neutral-900">
                          {job.address?.building}, {job.address?.area}
                        </div>
                        {job.address?.apartment && (
                          <div className="text-neutral-600 text-[11px]">{job.address.apartment}</div>
                        )}
                        <a
                          href={directionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-bold hover:underline mt-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open Directions in Maps
                        </a>
                      </div>
                    </div>

                    {job.notes && (
                      <div className="text-xs text-neutral-600 italic bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                        "Note: {job.notes}"
                      </div>
                    )}

                    {/* Status Update Actions */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Scheduled for: <strong>{job.scheduledDate} ({job.scheduledTime})</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        {job.status === 'requested' && (
                          <>
                            <button
                              type="button"
                              disabled={updatingStatusId === job.id}
                              onClick={() => handleStatusTransition(job.id, 'accepted')}
                              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
                            >
                              Accept Job
                            </button>
                            <button
                              type="button"
                              disabled={updatingStatusId === job.id}
                              onClick={() => handleStatusTransition(job.id, 'rejected')}
                              className="px-3 py-1.5 bg-neutral-100 hover:bg-red-50 text-red-600 font-semibold text-xs rounded-lg cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {job.status === 'accepted' && (
                          <button
                            type="button"
                            disabled={updatingStatusId === job.id}
                            onClick={() => handleStatusTransition(job.id, 'on_the_way')}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
                          >
                            Mark "On The Way"
                          </button>
                        )}

                        {job.status === 'on_the_way' && (
                          <button
                            type="button"
                            disabled={updatingStatusId === job.id}
                            onClick={() => handleStatusTransition(job.id, 'arrived')}
                            className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
                          >
                            Mark "Arrived at Premises"
                          </button>
                        )}

                        {job.status === 'arrived' && (
                          <button
                            type="button"
                            disabled={updatingStatusId === job.id}
                            onClick={() => handleStatusTransition(job.id, 'in_progress')}
                            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
                          >
                            Start Work (In Progress)
                          </button>
                        )}

                        {job.status === 'in_progress' && (
                          <button
                            type="button"
                            disabled={updatingStatusId === job.id}
                            onClick={() => handleStatusTransition(job.id, 'completed')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-xs"
                          >
                            Job Completed & Bill Collected
                          </button>
                        )}

                        {job.status === 'completed' && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Work Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Availability & Service Radius Controls */}
        <div className="space-y-6">
          <form
            onSubmit={handleSaveSettings}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5"
          >
            <h3 className="font-bold text-base text-neutral-900 border-b border-neutral-100 pb-3">
              Availability & Service Radius
            </h3>

            {/* Online / Offline Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <div>
                <div className="font-bold text-xs text-neutral-900">Live Booking Availability</div>
                <div className="text-[10px] text-neutral-500">Enable to receive new Dhaka customer requests</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  disabled={!isApproved}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Radius Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-neutral-700">Dispatch Radius (km):</span>
                <span className="text-emerald-700 font-extrabold">{serviceRadiusKm} km</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={serviceRadiusKm}
                onChange={(e) => setServiceRadiusKm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <p className="text-[10px] text-neutral-400">
                Customers within this distance from your base in <strong>{profile?.location?.area || 'Dhaka'}</strong> will see you on the interactive map.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Working Hours:</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="e.g. 08:00 AM - 09:00 PM"
                className="w-full p-2.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingSettings}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </form>

          {/* Provider Profile Summary */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-neutral-800">Verified Skills & Categories</h4>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.categories || []).map(cat => (
                <span key={cat} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-semibold text-[11px]">
                  {cat}
                </span>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-neutral-600 text-[11px]">
              <div>Operating Base: <strong>{profile?.location?.address || 'Dhaka Central'}</strong></div>
              <div>Experience: <strong>{profile?.experienceYears || 5} years in field</strong></div>
              <div>Commission: <strong>10% Platform Fee</strong> (90% Retained)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
