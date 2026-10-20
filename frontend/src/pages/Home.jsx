import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import DhakaInteractiveMap from '../components/map/DhakaInteractiveMap.jsx';
import {
  Wrench,
  ShieldCheck,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Search,
  ArrowRight,
  Phone,
  Flame,
  Award,
  Users,
  Compass
} from 'lucide-react';

export default function Home() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [srvRes, prvRes] = await Promise.all([
          api.getServices(),
          api.getApprovedProviders()
        ]);
        if (srvRes?.data) setServices(srvRes.data);
        if (prvRes?.data) setProviders(prvRes.data);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/services?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/services');
    }
  };

  const serviceCategories = [
    { name: "AC Repair", bn: "এসি মেরামত", icon: "❄️", price: 1200, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { name: "Plumbing", bn: "প্লাম্বিং সেবা", icon: "🔧", price: 800, color: "bg-teal-50 text-teal-700 border-teal-200" },
    { name: "Electrical Repair", bn: "ইলেকট্রিক্যাল", icon: "⚡", price: 650, color: "bg-amber-50 text-amber-700 border-amber-200" },
    { name: "Home Cleaning", bn: "ডিপ ক্লিনিং", icon: "✨", price: 2500, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { name: "Appliance Repair", bn: "ফ্রিজ ও ওয়াশিং মেশিন", icon: "🧰", price: 950, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    { name: "Painting", bn: "দেয়াল পেইন্টিং", icon: "🎨", price: 4500, color: "bg-purple-50 text-purple-700 border-purple-200" }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner with Dhaka backdrop and search */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-neutral-900 to-neutral-950 text-white overflow-hidden py-16 lg:py-24">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Verified Doorstep Technicians Across Dhaka
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>আপনার বাসায় অভিজ্ঞ ও বিশ্বস্ত <span className="text-emerald-400">হোম সার্ভিস</span></>
              ) : (
                <>Professional & Verified <span className="text-emerald-400">Home Services</span> in Dhaka</>
              )}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Book certified specialists for AC servicing, emergency plumbing, electrical repairs, and deep home cleaning. Transparent BDT pricing, GPS neighborhood dispatch, and 30-day warranty.
            </p>

            {/* Quick search bar */}
            <form onSubmit={handleSearchSubmit} className="pt-2 flex flex-col sm:flex-row items-stretch gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 bg-white text-neutral-900 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Find Service
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Trust Pillars */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>NID Verified Technicians</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>60-Min Emergency Response</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>30-Day Work Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {t('popularCategories')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Select from Dhaka's most requested household services with transparent starting rates.
            </p>
          </div>
          <Link
            to="/services"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 group"
          >
            Explore all categories
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {serviceCategories.map((cat) => (
            <Link
              key={cat.name}
              to={`/services?category=${encodeURIComponent(cat.name)}`}
              className="bg-white p-4 rounded-xl border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl mb-2">{cat.icon}</div>
                <h3 className="font-bold text-sm text-neutral-800 group-hover:text-emerald-700 transition-colors">
                  {lang === 'bn' ? cat.bn : cat.name}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-baseline justify-between">
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Starts</span>
                <span className="text-xs font-extrabold text-neutral-900">৳{cat.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Dhaka Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-3xl p-6 lg:p-8 shadow-xl overflow-hidden relative">
          <div className="max-w-2xl mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              Live Dhaka Service Radar
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Approved Technicians Near Your Neighborhood
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2">
              Locate background-verified technicians in Gulshan, Dhanmondi, Uttara, Mirpur, and surrounding zones. Click on any technician pin to book directly or test service radius.
            </p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden text-neutral-900">
            <DhakaInteractiveMap
              providers={providers}
              height="440px"
              showFilters={true}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-4">
              <span>● <strong className="text-neutral-200">16+</strong> Dhaka Zones Covered</span>
              <span>● <strong className="text-neutral-200">No Advance</strong> Payment Required</span>
            </div>
            <Link
              to="/map"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Open Fullscreen Dhaka Map
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Top Booked Services
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Guaranteed doorstep service with genuine replacement parts and transparent invoicing.
            </p>
          </div>
          <Link to="/services" className="text-xs font-bold text-emerald-700 hover:underline">
            View All ({services.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-44 w-full relative overflow-hidden bg-neutral-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/src/assets/why_choose_us/service-1.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-bold text-neutral-800 shadow-sm">
                    {service.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-neutral-900/80 backdrop-blur-xs px-2 py-0.5 rounded text-xs font-semibold text-white flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-neutral-400 text-[10px]">({service.reviewsCount})</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-base text-neutral-900 group-hover:text-emerald-700 transition-colors">
                    {lang === 'bn' && service.categoryBn ? service.categoryBn : service.name}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 flex flex-wrap gap-1.5">
                    {(service.serviceAreas || []).slice(0, 4).map((area) => (
                      <span key={area} className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                        📍 {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-neutral-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Fixed Rate</span>
                  <span className="text-base font-extrabold text-neutral-900">
                    ৳{service.basePrice} <span className="text-[11px] font-normal text-neutral-500">/ {service.priceUnit}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/service-details/${service.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/book-service?serviceId=${service.id}`}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
                  >
                    {t('bookNow')}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Shebora Section (Reusing original assets) */}
      <section className="bg-neutral-100/70 border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              We eliminate Dhaka's common home repair headaches with verified standards and customer protections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">NID & Police Verified</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every service professional undergoes national ID verification, background checks, and trade skill assessment before deployment.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">30-Day Service Guarantee</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                If the repaired appliance or fixture acts up within 30 days, we send a technician back to inspect and resolve it free of charge.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Punctual Arrival</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Technicians are dispatched from your nearest Dhaka zone so you don't spend hours waiting in traffic jams.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Transparent BDT Billing</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                No arbitrary bargaining on your doorstep. Detailed digital invoices with itemized labor and genuine parts cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Dhaka Customer Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Verified Dhaka Homeowner Feedback
          </div>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
            What Customers Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed italic">
              "Rafiqul bhai arrived at our Uttara apartment within 45 minutes for our master bedroom AC leak. Fixed the drainage and checked the compressor pressure. Very professional behavior."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                TA
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900">Tanvir Ahmed</div>
                <div className="text-[11px] text-neutral-400">Sector 3, Uttara</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed italic">
              "We booked deep kitchen cleaning through Shebora before Eid. Nusrat apa's crew brought proper steam machines and degreasers. The kitchen tiles look brand new."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs">
                FK
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900">Farhana Karim</div>
                <div className="text-[11px] text-neutral-400">Road 11, Banani</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
            </div>
            <p className="text-xs text-neutral-700 leading-relaxed italic">
              "Had a major water line valve burst in Dhanmondi. Khorshed Alam bhai came with the replacement brass fittings and fixed it cleanly without damaging tiles."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                MR
              </div>
              <div>
                <div className="font-bold text-xs text-neutral-900">Mahmudur Rahman</div>
                <div className="text-[11px] text-neutral-400">Road 8A, Dhanmondi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 rounded-3xl p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need quick home repair in Dhaka right now?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Pin your location on our live map or select an available slot. Technicians available 7 days a week.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/book-service"
              className="px-6 py-3 bg-white text-emerald-900 font-bold text-sm rounded-xl shadow hover:bg-emerald-50 transition-colors"
            >
              Book Service Now
            </Link>
            <Link
              to="/map"
              className="px-5 py-3 bg-emerald-700 text-white border border-emerald-600 font-semibold text-sm rounded-xl hover:bg-emerald-600 transition-colors"
            >
              View Dhaka Map
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
