import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { DHAKA_NEIGHBORHOODS } from '../../../backend/src/services/geoService.js';
import { Search, Filter, Star, ShieldCheck, MapPin, ArrowUpDown, Check } from 'lucide-react';

export default function Services() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('searchTerm') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedArea, setSelectedArea] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(5000);

  const categories = [
    'All',
    'AC Repair',
    'Plumbing',
    'Electrical Repair',
    'Home Cleaning',
    'Appliance Repair',
    'Painting'
  ];

  useEffect(() => {
    fetchServices();
  }, [selectedCategory, selectedArea, sortBy, maxPrice]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.searchTerm = searchTerm.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedArea !== 'All') params.area = selectedArea;
      if (sortBy) params.sortBy = sortBy;
      if (maxPrice < 5000) params.maxPrice = maxPrice;

      const res = await api.getServices(params);
      if (res?.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          Dhaka Home Service Catalog
        </div>
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
          All Household & Repair Services
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
          Browse verified doorstep technicians across 16+ Dhaka zones with transparent BDT pricing and 30-day warranty.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by service name, appliance type, or symptom..."
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams(cat === 'All' ? {} : { category: cat });
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Detailed Secondary Filters */}
        <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-neutral-500 font-semibold mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Filter by Dhaka Area:
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="All">All Dhaka Neighborhoods</option>
              {DHAKA_NEIGHBORHOODS.map(n => (
                <option key={n.area} value={n.area}>{n.area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-500 font-semibold mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="popular">Most Popular & Recommended</option>
              <option value="rating">Highest Rated (★ 4.8+)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-neutral-500 font-semibold mb-1">
              <span>Max Budget:</span>
              <span className="text-neutral-900 font-bold">৳{maxPrice}</span>
            </div>
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Services List */}
      {loading ? (
        <div className="py-20 text-center text-sm text-neutral-400">
          Loading verified Dhaka services...
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-800">No Services Found</h3>
          <p className="text-xs text-neutral-500">
            No services matched your current filters. Try resetting the search or choosing another Dhaka neighborhood.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedArea('All');
              setMaxPrice(5000);
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
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

                  <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                    {(service.features || []).slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-1.5">
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
      )}
    </div>
  );
}
