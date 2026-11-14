import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import AISmartAssistant from '../components/AISmartAssistant.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { defaultServiceImage, resolveServiceImage } from '../utils/serviceImages.js';
import DhakaInteractiveMap from '../components/map/DhakaInteractiveMap.jsx';
import { getServiceStartingOption } from '../../../shared/servicePackages.js';
import { ShieldCheck, Clock, Star, CheckCircle, Search, ArrowRight, Award, Compass, Snowflake, Droplets, Zap, Sparkles, Refrigerator, Paintbrush } from 'lucide-react';

export default function Home() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    { name: "AC Repair", bn: "এসি মেরামত", icon: Snowflake, color: "bg-sky-50 text-sky-700" },
    { name: "Plumbing", bn: "প্লাম্বিং সেবা", icon: Droplets, color: "bg-teal-50 text-teal-700" },
    { name: "Electrical Repair", bn: "ইলেকট্রিক্যাল", icon: Zap, color: "bg-amber-50 text-amber-700" },
    { name: "Home Cleaning", bn: "ডিপ ক্লিনিং", icon: Sparkles, color: "bg-emerald-50 text-emerald-700" },
    { name: "Appliance Repair", bn: "ফ্রিজ ও ওয়াশিং মেশিন", icon: Refrigerator, color: "bg-indigo-50 text-indigo-700" },
    { name: "Painting", bn: "দেয়াল পেইন্টিং", icon: Paintbrush, color: "bg-rose-50 text-rose-700" }
  ];

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner with Dhaka backdrop and search */}
      <section className="home-hero relative overflow-hidden py-12 text-white sm:py-16">
        <img src="/images/services/electrical-hazards.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover object-center opacity-20 lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[52%] lg:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900/55 lg:from-neutral-900 lg:via-neutral-900/95 lg:to-transparent" />
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-slate-300/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-slate-400/5 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Home services across Dhaka
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {lang === 'bn' ? (
                <>আপনার বাসায় অভিজ্ঞ ও বিশ্বস্ত <span className="text-emerald-400">হোম সার্ভিস</span></>
              ) : (
                <>Find help for your <span className="text-emerald-400">home in Dhaka</span></>
              )}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
              Browse local services, compare catalogue details, and choose a booking time that works for you.
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
                <span>Choose from listed services</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Select a convenient time</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Manage bookings in your account</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AISmartAssistant />

      {/* Popular Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              {t('popularCategories')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Explore the services currently listed in Shebora.
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
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${cat.color}`}><cat.icon className="h-5 w-5" aria-hidden="true" /></div>
                <h3 className="font-bold text-sm text-neutral-800 group-hover:text-emerald-700 transition-colors">
                  {lang === 'bn' ? cat.bn : cat.name}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-neutral-100 text-xs font-semibold text-emerald-800">Browse services <ArrowRight className="inline h-3 w-3" /></div>
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
              Service coverage
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Find services around your neighborhood
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 mt-2">
              Explore the service areas shown in the marketplace. Availability depends on the service and booking details.
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
              <span>Browse service locations</span>
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
              Services in the catalogue
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              View service information, starting rates, areas, and booking options.
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
                    src={resolveServiceImage(service.image)}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = defaultServiceImage;
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
                  <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Starting at</span>
                  <span className="text-base font-extrabold text-neutral-900">
                    ৳{getServiceStartingOption(service.category, service.basePrice, service.priceUnit).price.toLocaleString('en-BD')} <span className="text-[11px] font-normal text-neutral-500">/ {getServiceStartingOption(service.category, service.basePrice, service.priceUnit).unit}</span>
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
      <section className="why-choose-section bg-neutral-100/70 border-y border-neutral-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
              {t('whyChooseUs')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Browse services, choose a time, and manage your request from your account.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Browse service options</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Review the service descriptions and catalogue details before choosing an option.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Choose a time</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Select an available date and time when placing a booking request.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Add your location</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Provide a service address and area so your request has the information needed for service.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Track your request</h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Sign in to see booking details and status updates associated with your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking steps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-black tracking-tight text-neutral-900">A simple way to get started</h2>
          <p className="mt-1 text-sm text-neutral-600">Choose a service and submit the details for your home.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['01', 'Choose a service', 'Browse the catalogue or describe the problem to the Smart Assistant.'],
            ['02', 'Share the details', 'Select a service option, location, and a time for your booking request.'],
            ['03', 'Manage your booking', 'Sign in to review the booking and follow its status.']
          ].map(([number, title, description]) => (
            <div key={number} className="surface-card p-5">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-800">{number}</span>
              <h3 className="mt-3 text-sm font-bold text-neutral-900">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-neutral-600">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-800 rounded-3xl p-8 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need help with a home service?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Browse the catalogue and start a booking with your service details and preferred time.
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
