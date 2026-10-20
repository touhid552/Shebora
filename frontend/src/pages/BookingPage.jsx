import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import AddressLocationPicker from '../components/map/AddressLocationPicker.jsx';
import { DHAKA_CENTER } from '../utils/geo.js';
import {
  Wrench,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Star
} from 'lucide-react';

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const preselectedServiceId = searchParams.get('serviceId');
  const preselectedProviderId = searchParams.get('providerId');

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId || '');
  const [selectedProviderId, setSelectedProviderId] = useState(preselectedProviderId || '');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [address, setAddress] = useState({
    area: user?.address?.area || 'Gulshan',
    road: user?.address?.road || '',
    building: user?.address?.building || '',
    apartment: user?.address?.apartment || '',
    landmarks: '',
    lat: user?.address?.lat || DHAKA_CENTER.lat,
    lng: user?.address?.lng || DHAKA_CENTER.lng
  });
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [srvRes, prvRes] = await Promise.all([
          api.getServices(),
          api.getApprovedProviders()
        ]);
        if (srvRes?.data) {
          setServices(srvRes.data);
          if (!selectedServiceId && srvRes.data.length > 0) {
            setSelectedServiceId(srvRes.data[0].id);
          }
        }
        if (prvRes?.data) {
          setProviders(prvRes.data);
        }
      } catch (err) {
        console.error('Error loading booking data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedService = services.find(s => s.id === selectedServiceId);
  const selectedProvider = providers.find(p => p.id === selectedProviderId);

  // Filter providers matching selected service category
  const eligibleProviders = providers.filter(p => {
    if (!selectedService) return true;
    return p.categories && p.categories.includes(selectedService.category);
  });

  // Calculate pricing breakdown
  const baseRate = selectedService?.basePrice || 1000;
  const isNight = scheduledTime.includes('PM') && (scheduledTime.startsWith('10') || scheduledTime.startsWith('11'));
  const emergencyFee = isNight ? 200 : 0;
  const platformFee = Math.round((baseRate + emergencyFee) * 0.10);
  const totalAmount = baseRate + emergencyFee; // Platform fee is internal commission

  const timeSlots = [
    "08:30 AM", "10:00 AM", "11:30 AM", "01:00 PM",
    "02:30 PM", "04:00 PM", "05:30 PM", "07:00 PM",
    "08:30 PM", "10:00 PM"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedServiceId) {
      setErrorMsg('Please select a service.');
      return;
    }

    if (!address.building) {
      setErrorMsg('Please enter your building name or house number.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        serviceId: selectedServiceId,
        providerId: selectedProviderId || null,
        scheduledDate,
        scheduledTime,
        address,
        notes,
        paymentMethod
      };

      const res = await api.createBooking(payload);
      if (res?.data) {
        setBookingSuccess(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit booking request. Please check all fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              Service Request Placed!
            </h1>
            <p className="text-sm text-neutral-600">
              Booking ID: <strong className="font-mono text-neutral-900">{bookingSuccess.bookingNumber}</strong>
            </p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 text-left space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Service:</span>
              <span className="font-bold text-neutral-900">{bookingSuccess.serviceName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Scheduled Date & Time:</span>
              <span className="font-bold text-neutral-900">{bookingSuccess.scheduledDate} at {bookingSuccess.scheduledTime}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Service Location:</span>
              <span className="font-bold text-neutral-900 text-right">
                {bookingSuccess.address.building}, {bookingSuccess.address.area}, Dhaka
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Technician:</span>
              <span className="font-bold text-emerald-800">{bookingSuccess.providerName}</span>
            </div>
            <div className="flex justify-between py-1 pt-2">
              <span className="text-neutral-600 font-semibold text-sm">Total Amount Payable:</span>
              <span className="text-lg font-black text-neutral-900">৳{bookingSuccess.pricing?.totalAmount}</span>
            </div>
          </div>

          <div className="text-xs text-neutral-500 bg-emerald-50 text-emerald-900 p-3.5 rounded-xl border border-emerald-200">
            Payment Method: <strong>{bookingSuccess.payment.method === 'cash_on_delivery' ? 'Cash on Service' : 'Digital Gateway'}</strong>. You will inspect and pay upon job completion.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/dashboard/customer"
              className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
            >
              Track in Customer Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/services"
              className="py-3 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Book Another Service
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Wrench className="w-4 h-4" />
          Shebora Booking Workflow
        </div>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
          Book Doorstep Home Service
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Choose service details, pinpoint your exact Dhaka address on the map, and confirm an available technician.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Select Service & Date */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">1</span>
            Select Service & Appointment Schedule
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Choose Home Service <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — BDT {s.basePrice} / {s.priceUnit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Service Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-neutral-700 mb-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Select Preferred Time Slot:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setScheduledTime(slot)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      scheduledTime === slot
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-emerald-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Dhaka Location & Address Picker with Map */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
            Dhaka Service Address & Map Coordinates
          </h3>

          <AddressLocationPicker
            value={address}
            onChange={(newAddress) => setAddress(newAddress)}
          />
        </div>

        {/* Step 3: Preferred Technician Selection */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">3</span>
            Technician Assignment Preference
          </h3>

          <p className="text-xs text-neutral-500">
            Select an approved technician covering {address.area}, or leave unselected to automatically assign the nearest verified pro.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setSelectedProviderId('')}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                !selectedProviderId
                  ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                  : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/50'
              }`}
            >
              <div className="font-bold text-xs text-neutral-900">⚡ Auto-Match Closest Technician</div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Shebora algorithm automatically dispatches the highest rated verified professional within your neighborhood radius.
              </p>
            </div>

            {eligibleProviders.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedProviderId(p.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  selectedProviderId === p.id
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <img
                  src={p.photo}
                  alt={p.name}
                  className="w-11 h-11 rounded-full object-cover border border-emerald-500 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-neutral-900 truncate">{p.name}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{p.experienceYears}y exp • ⭐ {p.rating || 4.8}</div>
                  <div className="text-[10px] text-neutral-400">Base: {p.location?.area || 'Dhaka'}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Job Description / Issue Notes
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Master bedroom 1.5 ton Inverter AC is not cooling properly..."
              className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Step 4: Transparent Pricing & Payment Method */}
        <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2 pb-3 border-b border-neutral-100">
            <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">4</span>
            Pricing Breakdown & Payment
          </h3>

          <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Standard Service Fee ({selectedService?.name || 'Home Service'}):</span>
              <span className="font-semibold text-neutral-900">৳{baseRate}</span>
            </div>

            {emergencyFee > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>Night Emergency Dispatch (10 PM+):</span>
                <span>+৳{emergencyFee}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-500 pt-1 text-[11px]">
              <span>Platform Quality & Warranty Commission (included):</span>
              <span>৳{platformFee} (10%)</span>
            </div>

            <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-700 text-base">৳{totalAmount}</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-neutral-700">Payment Option:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-500/20'
                  : 'border-neutral-200'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-xs text-neutral-900">Cash on Service (COD)</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Pay the technician in cash after cross-checking work.</div>
                </div>
              </label>

              <label className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer ${
                paymentMethod === 'online_gateway'
                  ? 'border-emerald-600 bg-emerald-50/30 ring-1 ring-emerald-500/20'
                  : 'border-neutral-200'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online_gateway"
                  checked={paymentMethod === 'online_gateway'}
                  onChange={() => setPaymentMethod('online_gateway')}
                  className="mt-0.5 accent-emerald-600"
                />
                <div>
                  <div className="font-bold text-xs text-neutral-900">Digital Gateway (bKash / Card)</div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">Pay securely via SSLCommerz / bKash gateway.</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-800/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? 'Confirming with Dhaka dispatch...' : 'Confirm & Place Booking'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
