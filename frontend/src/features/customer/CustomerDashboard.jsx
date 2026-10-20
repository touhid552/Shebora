import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  Star,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Phone,
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals state
  const [invoiceBooking, setInvoiceBooking] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [complaintBooking, setComplaintBooking] = useState(null);
  const [cancelBookingId, setCancelBookingId] = useState(null);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Complaint form
  const [complaintType, setComplaintType] = useState('Work Quality Issue');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [complaintSubmitting, setComplaintSubmitting] = useState(false);

  // Cancel form
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    loadBookings();
  }, [activeFilter]);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await api.getMyBookings(activeFilter);
      if (res?.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    try {
      await api.submitReview({
        bookingId: reviewBooking.id,
        rating: reviewRating,
        comment: reviewComment
      });
      setFeedbackMsg('Review published successfully! Thank you for your feedback.');
      setReviewBooking(null);
      setReviewComment('');
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setComplaintSubmitting(true);
    try {
      await api.submitComplaint({
        bookingId: complaintBooking.id,
        issueType: complaintType,
        description: complaintDescription
      });
      setFeedbackMsg('Complaint submitted to Shebora Support. We will follow up within 24 hours.');
      setComplaintBooking(null);
      setComplaintDescription('');
    } catch (err) {
      alert(err.message || 'Failed to submit complaint.');
    } finally {
      setComplaintSubmitting(false);
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    setCancelSubmitting(true);
    try {
      await api.cancelBooking(cancelBookingId, cancelReason);
      setFeedbackMsg('Booking cancelled successfully.');
      setCancelBookingId(null);
      setCancelReason('');
      loadBookings();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      requested: { bg: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Requested' },
      accepted: { bg: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Accepted' },
      on_the_way: { bg: 'bg-indigo-100 text-indigo-800 border-indigo-200', label: 'On The Way' },
      arrived: { bg: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Technician Arrived' },
      in_progress: { bg: 'bg-teal-100 text-teal-800 border-teal-200', label: 'In Progress' },
      completed: { bg: 'bg-emerald-100 text-emerald-800 border-emerald-200', label: 'Completed' },
      cancelled: { bg: 'bg-neutral-100 text-neutral-600 border-neutral-200', label: 'Cancelled' },
      rejected: { bg: 'bg-red-100 text-red-700 border-red-200', label: 'Rejected' }
    };
    const s = map[status] || { bg: 'bg-neutral-100 text-neutral-700 border-neutral-200', label: status };
    return (
      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border uppercase tracking-wide ${s.bg}`}>
        {s.label}
      </span>
    );
  };

  const stepOrder = ['requested', 'accepted', 'on_the_way', 'arrived', 'in_progress', 'completed'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            Customer Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            My Service Appointments & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Track real-time technician status, inspect digital invoices, submit reviews, and file warranty complaints.
          </p>
        </div>

        <Link
          to="/book-service"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors self-start sm:self-auto"
        >
          Book New Service
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg('')} className="font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2 overflow-x-auto text-xs">
        {['all', 'requested', 'accepted', 'in_progress', 'completed', 'cancelled'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 rounded-lg font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === tab
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-3">
          <Calendar className="w-10 h-10 text-neutral-300 mx-auto" />
          <h3 className="font-bold text-base text-neutral-800">No Appointments in this tab</h3>
          <p className="text-xs text-neutral-500">
            You don't have any appointments matching "{activeFilter}".
          </p>
          <Link
            to="/book-service"
            className="inline-block px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-lg"
          >
            Book a Home Service
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const currentStepIdx = stepOrder.indexOf(booking.status);
            const isTerminal = ['completed', 'cancelled', 'rejected'].includes(booking.status);

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-neutral-500">{booking.bookingNumber}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mt-1">
                      {booking.serviceName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-neutral-400 block font-medium">Total Bill</span>
                    <span className="text-2xl font-black text-neutral-900">৳{booking.pricing?.totalAmount}</span>
                    <span className="text-[11px] text-neutral-500 block">
                      {booking.payment?.status === 'paid' ? '✅ Paid' : 'Cash on Service'}
                    </span>
                  </div>
                </div>

                {/* Progress tracker for active jobs */}
                {!isTerminal && (
                  <div className="py-2">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 mb-2">
                      <span>Requested</span>
                      <span>Accepted</span>
                      <span>On the Way</span>
                      <span>Arrived</span>
                      <span>In Progress</span>
                      <span>Completed</span>
                    </div>
                    <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-600 transition-all duration-500 rounded-full"
                        style={{ width: `${((currentStepIdx + 1) / stepOrder.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-neutral-400 block">Appointment Schedule:</span>
                    <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {booking.scheduledDate} ({booking.scheduledTime})
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-400 block">Assigned Technician:</span>
                    <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                      {booking.providerName}
                    </div>
                    {booking.providerPhone && (
                      <div className="text-neutral-500 text-[11px]">📞 {booking.providerPhone}</div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-neutral-400 block">Dhaka Address:</span>
                    <div className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{booking.address.building}, {booking.address.area}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvoiceBooking(booking)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      View Invoice
                    </button>

                    <button
                      type="button"
                      onClick={() => setComplaintBooking(booking)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Lodge Complaint
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Review eligible only for completed and not yet reviewed */}
                    {booking.status === 'completed' && !booking.hasReview && (
                      <button
                        type="button"
                        onClick={() => setReviewBooking(booking)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer shadow-xs"
                      >
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Write Review
                      </button>
                    )}

                    {/* Cancellation eligible for non-terminal stages */}
                    {['requested', 'accepted', 'on_the_way'].includes(booking.status) && (
                      <button
                        type="button"
                        onClick={() => setCancelBookingId(booking.id)}
                        className="px-3 py-1.5 rounded-lg font-semibold text-red-600 hover:bg-red-50 border border-red-200 cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {invoiceBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">Shebora Work Invoice</h3>
                  <p className="text-[10px] text-neutral-400">Dhaka Household Marketplace</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceBooking(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div>
                <span className="text-neutral-400 block">Invoice Number:</span>
                <span className="font-bold font-mono text-neutral-900">{invoiceBooking.bookingNumber}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Date of Issue:</span>
                <span className="font-bold text-neutral-900">{new Date(invoiceBooking.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Customer Name:</span>
                <span className="font-bold text-neutral-900">{invoiceBooking.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">Dhaka Area:</span>
                <span className="font-bold text-neutral-900">{invoiceBooking.address?.area}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-neutral-700 mb-1">Itemized Charges:</div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span>{invoiceBooking.serviceName} Base Labor:</span>
                <span className="font-bold">৳{invoiceBooking.pricing?.baseAmount}</span>
              </div>
              {invoiceBooking.pricing?.emergencyFee > 0 && (
                <div className="flex justify-between py-1 border-b border-neutral-100 text-amber-700">
                  <span>Night Emergency Charge:</span>
                  <span className="font-bold">+৳{invoiceBooking.pricing?.emergencyFee}</span>
                </div>
              )}
              {invoiceBooking.pricing?.materialsCost > 0 && (
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span>Authorized Spare Materials:</span>
                  <span className="font-bold">৳{invoiceBooking.pricing?.materialsCost}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-base font-black text-neutral-900 border-t-2 border-neutral-900">
                <span>Total BDT Payable:</span>
                <span>৳{invoiceBooking.pricing?.totalAmount}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 text-[11px] leading-relaxed">
              <strong>Warranty Certificate:</strong> This work is insured with 30-day Shebora service guarantee. For claims, call 09612-SHEBORA with your booking reference.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 cursor-pointer"
              >
                Print Invoice
              </button>
              <button
                type="button"
                onClick={() => setInvoiceBooking(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-neutral-900">Review Completed Job</h3>
                <p className="text-xs text-neutral-500">{reviewBooking.serviceName}</p>
              </div>
              <button type="button" onClick={() => setReviewBooking(null)} className="cursor-pointer text-neutral-400">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">Overall Rating (1 - 5 Stars):</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Honest Feedback:</label>
              <textarea
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="How was the punctuality, cleanliness, and repair quality of the technician?"
                required
                className="w-full p-3 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReviewBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
              >
                {reviewSubmitting ? 'Publishing...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lodge Complaint Modal */}
      {complaintBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleComplaintSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-neutral-900">Lodge A Service Complaint</h3>
                <p className="text-xs text-neutral-500">Booking {complaintBooking.bookingNumber}</p>
              </div>
              <button type="button" onClick={() => setComplaintBooking(null)} className="cursor-pointer text-neutral-400">✕</button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Issue Category:</label>
              <select
                value={complaintType}
                onChange={(e) => setComplaintType(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Work Quality Issue">Work Quality / Incomplete Repair</option>
                <option value="Billing Discrepancy">Billing / Material Pricing Dispute</option>
                <option value="Unprofessional Behavior">Technician Behavior</option>
                <option value="Severe Delay">Unreasonable Delay without Notice</option>
                <option value="Other">Other Warranty Claim</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Detailed Explanation:</label>
              <textarea
                rows="3"
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                placeholder="Describe what occurred on your premises so Shebora operations can investigate."
                required
                className="w-full p-3 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setComplaintBooking(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={complaintSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                {complaintSubmitting ? 'Lodging...' : 'Submit to Operations'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelBookingId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <form onSubmit={handleCancelSubmit} className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-neutral-900">Cancel Appointment?</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to cancel this booking? Please provide a reason to notify the technician.
            </p>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Schedule conflict, problem already resolved"
              required
              className="w-full p-2.5 text-xs border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelBookingId(null)}
                className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-lg cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="submit"
                disabled={cancelSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                {cancelSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
