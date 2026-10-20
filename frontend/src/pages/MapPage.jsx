import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api.js';
import DhakaInteractiveMap from '../components/map/DhakaInteractiveMap.jsx';
import { DHAKA_CENTER, DHAKA_NEIGHBORHOODS } from '../utils/geo.js';
import { MapPin, Navigation, Star, Phone, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [userLocation, setUserLocation] = useState(DHAKA_CENTER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProviders() {
      setLoading(true);
      try {
        const params = {
          lat: userLocation.lat,
          lng: userLocation.lng
        };
        if (categoryParam) params.category = categoryParam;

        const res = await api.getApprovedProviders(params);
        if (res?.data) {
          setProviders(res.data);
          if (res.data.length > 0) {
            setSelectedProvider(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching map providers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProviders();
  }, [userLocation, categoryParam]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            Dhaka Metropolitan Service Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            Interactive Technician Coverage Map
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            View active, approved home service specialists across Dhaka. Click any marker or neighborhood.
          </p>
        </div>

        <Link
          to="/book-service"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-colors self-start sm:self-auto"
        >
          Book An Appointment
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Map Layout: Left Map, Right Technicians List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <DhakaInteractiveMap
            providers={providers}
            selectedProvider={selectedProvider}
            onSelectProvider={(p) => setSelectedProvider(p)}
            userLocation={userLocation}
            onLocationChange={(coords) => setUserLocation(coords)}
            height="560px"
            showFilters={true}
          />
        </div>

        {/* Nearby Technicians Panel */}
        <div className="space-y-4 flex flex-col h-[560px]">
          <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-neutral-900">Active Approved Technicians</h3>
              <p className="text-[11px] text-neutral-500">{providers.length} available near selected location</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {providers.map((p) => {
              const isSelected = selectedProvider?.id === p.id;
              const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat || 23.81},${p.lng || 90.41}`;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProvider(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer bg-white space-y-3 ${
                    isSelected
                      ? 'border-emerald-600 shadow-md ring-1 ring-emerald-500/20'
                      : 'border-neutral-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={p.photo || '/src/assets/why_choose_us/service-1.jpg'}
                      alt={p.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-neutral-900 truncate">{p.name}</h4>
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{p.rating || 4.8}</span>
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold truncate mt-0.5">
                        {(p.categories || []).join(', ')}
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-1 flex items-center gap-2">
                        <span>📍 {p.area || 'Dhaka'}</span>
                        {p.distanceKm !== undefined && (
                          <span className="text-blue-700 font-semibold">• {p.distanceKm} km away</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                    <span className="text-[11px] text-neutral-500">
                      Coverage: <strong>{p.serviceRadiusKm || 10} km radius</strong>
                    </span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={directionUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded bg-neutral-100 text-[11px]"
                        title="Directions"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <Link
                        to={`/book-service?providerId=${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-bold"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
