import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ShieldCheck,
  Users,
  Briefcase,
  AlertCircle,
  FileText,
  DollarSign,
  CheckCircle,
  XCircle,
  PauseCircle,
  PlayCircle,
  History,
  Layers,
  Search,
  Filter,
  Check,
  X
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // overview, providers, bookings, complaints, audit_logs
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Provider verification detail modal
  const [inspectProvider, setInspectProvider] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Complaint resolve modal
  const [resolvingComplaint, setResolvingComplaint] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, [activeTab]);

  async function loadAllAdminData() {
    setLoading(true);
    try {
      const [statsRes, prvRes, bkRes, cmpRes, logsRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllProviders(),
        api.getAllBookings(),
        api.getAllComplaints(),
        api.getAuditLogs(),
        api.getAllUsers()
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (prvRes?.data) setProviders(prvRes.data);
      if (bkRes?.data) setBookings(bkRes.data);
      if (cmpRes?.data) setComplaints(cmpRes.data);
      if (logsRes?.data) setAuditLogs(logsRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleApprovalChange = async (providerId, newStatus) => {
    setUpdatingId(providerId);
    try {
      await api.updateProviderApproval(providerId, newStatus, approvalNote || `Admin updated status to ${newStatus}`);
      setFeedbackMsg(`Provider ${newStatus.toUpperCase()} successfully.`);
      setInspectProvider(null);
      setApprovalNote('');
      loadAllAdminData();
    } catch (err) {
      alert(err.message || 'Approval update failed.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResolveComplaint = async (e) => {
    e.preventDefault();
    if (!resolvingComplaint) return;
    try {
      await api.resolveComplaint(resolvingComplaint.id, 'resolved', resolutionText);
      setFeedbackMsg('Complaint marked as resolved.');
      setResolvingComplaint(null);
      setResolutionText('');
      loadAllAdminData();
    } catch (err) {
      alert(err.message || 'Failed to resolve complaint.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Shebora Administration Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Marketplace Operations & Provider Approval
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Real database analytics, verified document audits, complaint resolution, and platform governance.
          </p>
        </div>

        <button
          type="button"
          onClick={loadAllAdminData}
          className="self-start sm:self-auto px-4 py-2 text-xs font-bold bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          Refresh Data
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg('')} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Gross GMV</span>
          <div className="text-xl font-black text-neutral-900 mt-1">৳{stats?.financials?.grossRevenueBDT || 0}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">100% Verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Platform Comm.</span>
          <div className="text-xl font-black text-emerald-700 mt-1">৳{stats?.financials?.platformCommissionBDT || 0}</div>
          <span className="text-[10px] text-neutral-500">10% Take rate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Total Customers</span>
          <div className="text-xl font-black text-neutral-900 mt-1">{stats?.users?.customers || 0}</div>
          <span className="text-[10px] text-neutral-500">Registered users</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Active Bookings</span>
          <div className="text-xl font-black text-blue-700 mt-1">{stats?.bookings?.active || 0}</div>
          <span className="text-[10px] text-neutral-500">In Dhaka pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Pending Providers</span>
          <div className="text-xl font-black text-amber-600 mt-1">{stats?.providers?.pending || 0}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Action required</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Open Complaints</span>
          <div className="text-xl font-black text-red-600 mt-1">{stats?.complaints?.open || 0}</div>
          <span className="text-[10px] text-neutral-500">Under investigation</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'All Providers & Approvals' },
          { id: 'bookings', label: `All Bookings (${bookings.length})` },
          { id: 'complaints', label: `Customer Complaints (${complaints.length})` },
          { id: 'users', label: `User Directory (${users.length})` },
          { id: 'audit_logs', label: 'Audit Trail' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Providers and Approvals */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-base text-neutral-900">Provider Verification Desk</h3>
              <p className="text-xs text-neutral-500">
                Rule: Providers must not receive customer bookings until their accounts are approved.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] border-y border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Categories</th>
                  <th className="py-3 px-4">Dhaka Base</th>
                  <th className="py-3 px-4">Verification Doc</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {providers.map((p) => {
                  const statusColors = {
                    approved: 'bg-emerald-100 text-emerald-800',
                    pending: 'bg-amber-100 text-amber-800 font-bold',
                    suspended: 'bg-neutral-100 text-neutral-700',
                    rejected: 'bg-red-100 text-red-700'
                  };

                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/80">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.photo || '/src/assets/why_choose_us/service-1.jpg'}
                            alt={p.name}
                            className="w-9 h-9 rounded-full object-cover border border-neutral-200"
                          />
                          <div>
                            <div className="font-bold text-neutral-900">{p.name}</div>
                            <div className="text-[11px] text-neutral-400">{p.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(p.categories || []).map(cat => (
                            <span key={cat} className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px]">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">
                        📍 {p.location?.area || 'Dhaka'} ({p.serviceRadiusKm || 10}km)
                      </td>
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => setInspectProvider(p)}
                          className="font-semibold text-emerald-700 hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          {p.verificationDoc?.type || 'View NID'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${statusColors[p.approvalStatus] || 'bg-neutral-100'}`}>
                          {p.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {p.approvalStatus !== 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleApprovalChange(p.id, 'approved')}
                              className="px-2.5 py-1 rounded bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 cursor-pointer"
                            >
                              Approve
                            </button>
                          )}
                          {p.approvalStatus === 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleApprovalChange(p.id, 'rejected')}
                              className="px-2.5 py-1 rounded bg-neutral-100 text-red-600 hover:bg-red-50 text-[11px] font-semibold cursor-pointer"
                            >
                              Reject
                            </button>
                          )}
                          {p.approvalStatus === 'approved' && (
                            <button
                              type="button"
                              onClick={() => handleApprovalChange(p.id, 'suspended')}
                              className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-[11px] font-semibold cursor-pointer"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: All Bookings */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-neutral-900">All Marketplace Bookings ({bookings.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] border-y border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Technician</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-neutral-50/80">
                    <td className="py-3 px-4 font-mono font-bold text-neutral-800">{b.bookingNumber}</td>
                    <td className="py-3 px-4 font-semibold text-neutral-900">{b.serviceName}</td>
                    <td className="py-3 px-4">
                      <div>{b.customerName}</div>
                      <div className="text-[10px] text-neutral-400">📍 {b.address?.area}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-emerald-800">{b.providerName}</td>
                    <td className="py-3 px-4 text-neutral-600">{b.scheduledDate} {b.scheduledTime}</td>
                    <td className="py-3 px-4 font-extrabold text-neutral-900">৳{b.pricing?.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Complaints Desk */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-neutral-900">Customer Complaints & Dispute Desk</h3>
          <div className="space-y-4">
            {complaints.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">Zero active complaints!</div>
            ) : (
              complaints.map(c => (
                <div key={c.id} className="p-4 rounded-xl border border-neutral-200 space-y-3 bg-neutral-50/50">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded">{c.issueType}</span>
                      <span className="text-xs font-semibold text-neutral-800">Booking {c.bookingNumber}</span>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-700">"{c.description}"</p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-200">
                    <div>Customer: <strong>{c.customerName}</strong> ({c.customerPhone}) • Tech: <strong>{c.providerName}</strong></div>
                    {c.status !== 'resolved' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setResolvingComplaint(c);
                          setResolutionText(`Contacted ${c.customerName}. Re-inspection dispatched.`);
                        }}
                        className="px-3 py-1 bg-emerald-700 text-white font-bold rounded cursor-pointer"
                      >
                        Resolve Complaint
                      </button>
                    ) : (
                      <div className="text-emerald-700 font-semibold">Resolution: {c.adminResolution}</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-neutral-900">User Account Directory ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-500 uppercase tracking-wider text-[10px] border-y border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Current Role</th>
                  <th className="py-3 px-4">Dhaka Area</th>
                  <th className="py-3 px-4 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="py-3 px-4 font-bold text-neutral-900">{u.name}</td>
                    <td className="py-3 px-4 text-neutral-600 font-mono">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-500">📍 {u.address?.area || 'Dhaka'}</td>
                    <td className="py-3 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          type="button"
                          onClick={async () => {
                            await api.updateUserRole(u.id, 'admin');
                            setFeedbackMsg(`Promoted ${u.name} to Administrator.`);
                            loadAllAdminData();
                          }}
                          className="px-2.5 py-1 rounded text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 cursor-pointer"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content: Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-6 space-y-4">
          <h3 className="font-bold text-base text-neutral-900">System Activity & Audit Trail ({auditLogs.length})</h3>
          <div className="space-y-2">
            {auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-neutral-800">{log.action}: <span className="font-normal text-neutral-600">{log.details}</span></div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">By: {log.performedBy}</div>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Provider Verification Document Modal */}
      {inspectProvider && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-neutral-900">Provider Credentials Audit</h3>
                <p className="text-xs text-neutral-500">{inspectProvider.name}</p>
              </div>
              <button type="button" onClick={() => setInspectProvider(null)} className="cursor-pointer text-neutral-400">✕</button>
            </div>

            <div className="space-y-3 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div><strong>Document Type:</strong> {inspectProvider.verificationDoc?.type || 'NID'}</div>
              <div><strong>Submission Time:</strong> {new Date(inspectProvider.verificationDoc?.submittedAt || Date.now()).toLocaleString()}</div>
              <div><strong>Service Categories:</strong> {(inspectProvider.categories || []).join(', ')}</div>
              <div><strong>Years of Field Experience:</strong> {inspectProvider.experienceYears} Years</div>
              <div><strong>Operating Base:</strong> {inspectProvider.location?.address}</div>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-900 text-xs rounded-lg border border-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Identity certificate verified against Dhaka Metropolitan Police records.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Administrative Notes:</label>
              <input
                type="text"
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="e.g. NID verified, electrical license confirmed valid"
                className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleApprovalChange(inspectProvider.id, 'rejected')}
                className="px-4 py-2 bg-neutral-100 hover:bg-red-50 text-red-600 font-bold text-xs rounded-xl cursor-pointer"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={() => handleApprovalChange(inspectProvider.id, 'approved')}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Approve Technician
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {resolvingComplaint && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleResolveComplaint} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-neutral-900">Resolve Customer Complaint</h3>
            <p className="text-xs text-neutral-500">Booking {resolvingComplaint.bookingNumber} • {resolvingComplaint.issueType}</p>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Resolution Action Note:</label>
              <textarea
                rows="3"
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                required
                className="w-full p-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolvingComplaint(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
              >
                Confirm Resolution
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
