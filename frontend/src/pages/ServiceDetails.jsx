import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  Wrench,
  ShieldCheck,
  Star,
  CheckCircle,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadService() {
      setLoading(true);
      try {
        const res = await api.getServiceById(id);
        if (res?.data) {
          setService(res.data);
        }
      } catch (err) {
        console.error('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    }
    loadService();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-sm text-neutral-400">Loading service details...</div>;
  }

  if (!service) {
    return (
      <div className="py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-neutral-800">Service Not Found</h2>
        <Link to="/services" className="text-emerald-700 font-semibold text-xs hover:underline">
          Back to all services
        </Link>
      </div>
    );
  }

  const faqs = [
    {
      q: "Can I reschedule or cancel my booking?",
      a: "Yes, you can easily reschedule or cancel your appointment free of charge at least 2 hours before the technician is dispatched."
    },
    {
      q: "Does the service price include spare parts?",
      a: "The displayed starting price includes standard diagnostics, labor, and water-jet servicing. Any required physical replacement components (capacitors, valves, gas refill) are billed at official market rates with itemized receipts."
    },
    {
      q: "What is covered under the 30-day warranty?",
      a: "If the exact same issue reoccurs within 30 days of service completion, a senior technician is dispatched free of charge to inspect and correct it."
    },
    {
      q: "Do I have to pay in advance?",
      a: "No advance payment is needed! You can inspect the technician's completed work and pay Cash on Service (or via bKash/Card) upon full satisfaction."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Link to="/" className="hover:text-emerald-700">Home</Link>
        <span>/</span>
        <Link to="/services" className="hover:text-emerald-700">Services</Link>
        <span>/</span>
        <span className="text-neutral-800 font-semibold">{service.name}</span>
      </div>

      {/* Main Hero & Purchase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-neutral-100 relative shadow-sm">
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/src/assets/why_choose_us/service-1.jpg';
              }}
            />
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold text-neutral-900 shadow">
              {service.category}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {service.rating} ({service.reviewsCount} verified reviews)
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {service.warrantyDays}-Day Warranty Included
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {lang === 'bn' && service.categoryBn ? service.categoryBn : service.name}
            </h1>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 flex gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Overview & Features
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Reviews ({service.reviews?.length || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              className={`pb-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'faq'
                  ? 'border-emerald-700 text-emerald-800'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              FAQs & Guidelines
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'overview' && (
            <div className="space-y-6 pt-2">
              <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
                <h3 className="font-bold text-sm text-neutral-900">What is included in this service:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(service.features || []).map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200 space-y-2">
                <h4 className="font-bold text-xs text-neutral-800 uppercase tracking-wider">
                  Dhaka Neighborhoods Served:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {(service.serviceAreas || []).map(area => (
                    <span key={area} className="text-xs bg-white text-neutral-700 border border-neutral-200 px-2.5 py-1 rounded-md">
                      📍 {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 pt-2">
              {(!service.reviews || service.reviews.length === 0) ? (
                <div className="p-8 text-center text-xs text-neutral-400 bg-white rounded-xl border border-neutral-200">
                  No customer reviews yet. Be the first to book and share your feedback!
                </div>
              ) : (
                service.reviews.map(r => (
                  <div key={r.id} className="bg-white p-4 rounded-xl border border-neutral-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-neutral-900">{r.customerName}</div>
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-neutral-800">{r.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-600 italic">"{r.comment}"</p>
                    <div className="text-[10px] text-neutral-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3 pt-2">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-4 text-left font-semibold text-xs text-neutral-800 flex items-center justify-between cursor-pointer hover:bg-neutral-50"
                  >
                    <span>{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openFaq === i && (
                    <div className="p-4 pt-0 text-xs text-neutral-600 border-t border-neutral-100 bg-neutral-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Booking Action Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border-2 border-emerald-600/30 shadow-md space-y-5 sticky top-24">
            <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-xs text-neutral-400 block font-medium">Standard Service Rate</span>
                <span className="text-3xl font-black text-neutral-900">৳{service.basePrice}</span>
                <span className="text-xs text-neutral-500 font-normal"> / {service.priceUnit}</span>
              </div>
              <div className="text-right">
                <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  No Advance Needed
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Estimated duration: <strong>{service.estimatedDuration}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Warranty: <strong>{service.warrantyDays} days guarantee</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Payment: <strong>Cash on Service or bKash / Card</strong></span>
              </div>
            </div>

            <Link
              to={`/book-service?serviceId=${service.id}`}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
            >
              Book Service Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to={`/map?category=${encodeURIComponent(service.category)}`}
              className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Locate Nearby {service.category} on Map
            </Link>

            <div className="p-3 bg-neutral-50 rounded-lg text-[11px] text-neutral-500 leading-relaxed">
              💡 <strong>Shebora Guarantee:</strong> You only pay after cross-checking the technician's completed work on your premises.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
