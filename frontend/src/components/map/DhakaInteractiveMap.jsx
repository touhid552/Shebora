import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { DHAKA_CENTER, DHAKA_NEIGHBORHOODS } from '../../utils/geo.js';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { MapPin, Navigation, Compass, Star, Phone, ShieldCheck, ExternalLink, Filter } from 'lucide-react';

export default function DhakaInteractiveMap({
  providers = [],
  selectedProvider = null,
  onSelectProvider = null,
  height = '500px',
  showFilters = true,
  userLocation = null,
  onLocationChange = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const radiusCircleRef = useRef(null);

  const { t, lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [geoError, setGeoError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [currentRadiusKm, setCurrentRadiusKm] = useState(8);

  const categories = [
    'All',
    'AC Repair',
    'Plumbing',
    'Electrical Repair',
    'Home Cleaning',
    'Appliance Repair',
    'Painting'
  ];

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || DHAKA_CENTER.lat;
      const initialLng = userLocation?.lng || DHAKA_CENTER.lng;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
        attributionControl: true
      });

      // Standard OpenStreetMap tiles with compliant attribution
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Layer for provider markers
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Click to choose location if callback provided
      if (onLocationChange) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationChange({ lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 });
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update user marker and radius circle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userLocation?.lat && userLocation?.lng) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'custom-user-marker',
          html: `
            <div style="background-color: #059669; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 3px solid white; transform: translate(-50%, -50%);">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          `,
          iconSize: [0, 0]
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          draggable: Boolean(onLocationChange)
        }).addTo(map);

        if (onLocationChange) {
          userMarkerRef.current.on('dragend', (e) => {
            const { lat, lng } = e.target.getLatLng();
            onLocationChange({ lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000 });
          });
        }
      }

      // Draw service radius circle
      if (radiusCircleRef.current) {
        radiusCircleRef.current.setLatLng([userLocation.lat, userLocation.lng]);
        radiusCircleRef.current.setRadius(currentRadiusKm * 1000);
      } else {
        radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          radius: currentRadiusKm * 1000,
          color: '#059669',
          fillColor: '#10b981',
          fillOpacity: 0.1,
          weight: 2,
          dashArray: '4, 4'
        }).addTo(map);
      }
    }
  }, [userLocation, currentRadiusKm, onLocationChange]);

  // Update provider markers when providers or category filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    const filtered = providers.filter(p => {
      if (selectedCategory === 'All') return true;
      return p.categories && p.categories.includes(selectedCategory);
    });

    filtered.forEach(p => {
      const lat = p.lat || p.location?.lat;
      const lng = p.lng || p.location?.lng;
      if (!lat || !lng) return;

      const categoryColor = p.categories?.includes('AC Repair') ? '#0284c7' :
                            p.categories?.includes('Electrical Repair') ? '#d97706' :
                            p.categories?.includes('Plumbing') ? '#0d9488' :
                            p.categories?.includes('Home Cleaning') ? '#059669' : '#6366f1';

      const providerIcon = L.divIcon({
        className: 'custom-provider-marker',
        html: `
          <div style="background-color: ${categoryColor}; color: white; padding: 5px 9px; border-radius: 20px; font-size: 11px; font-weight: bold; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 2px solid white; white-space: nowrap; transform: translate(-50%, -100%); cursor: pointer;">
            <svg style="width: 12px; height: 12px; fill: #fbbf24;" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${p.rating || 4.8}</span>
            <span>•</span>
            <span>${p.name.split(' ')[0]}</span>
          </div>
        `,
        iconSize: [0, 0]
      });

      const marker = L.marker([lat, lng], { icon: providerIcon });

      const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      const osmUrl = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=%3B${lat}%2C${lng}`;

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 220px;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <img src="${p.photo || '/src/assets/why_choose_us/service-1.jpg'}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid #10b981;" />
            <div>
              <div style="font-weight: 700; color: #111827; font-size: 13px;">${p.name}</div>
              <div style="font-size: 11px; color: #059669; font-weight: 600;">${(p.categories || []).join(', ')}</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #4b5563; border-top: 1px solid #e5e7eb; padding-top: 6px; margin-bottom: 8px;">
            <span>📍 ${p.area || p.location?.area || 'Dhaka'}</span>
            <span>⭐ ${p.rating || 4.8} (${p.reviewsCount || 50}+)</span>
          </div>
          ${p.distanceKm !== undefined ? `<div style="font-size: 11px; color: #1e40af; margin-bottom: 6px;">🚗 Distance: <strong>${p.distanceKm} km</strong> from your location</div>` : ''}
          <div style="display: flex; gap: 6px;">
            <a href="/book-service?providerId=${p.id}" style="flex: 1; background: #059669; color: white; text-align: center; padding: 6px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: 600;">Book Now</a>
            <a href="${directionUrl}" target="_blank" rel="noreferrer" style="background: #f3f4f6; color: #374151; padding: 6px 8px; border-radius: 6px; text-decoration: none; font-size: 11px;">Directions</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onSelectProvider) {
          onSelectProvider(p);
        }
      });

      markersLayer.addLayer(marker);
    });
  }, [providers, selectedCategory, onSelectProvider]);

  // "Find Services Near Me" handler with polite geolocation request
  const handleFindNearMe = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser. Please select your area manually.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const coords = {
          lat: Math.round(latitude * 10000) / 10000,
          lng: Math.round(longitude * 10000) / 10000
        };

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 14, { duration: 1.5 });
        }

        if (onLocationChange) {
          onLocationChange(coords);
        }
      },
      (err) => {
        setIsLocating(false);
        let msg = "Could not retrieve your location. Please choose your Dhaka neighborhood from the list.";
        if (err.code === 1) {
          msg = "Location access was denied. You can select your address manually or click anywhere on the Dhaka map.";
        }
        setGeoError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleCenterDhakaArea = (areaName) => {
    const hood = DHAKA_NEIGHBORHOODS.find(n => n.area === areaName);
    if (hood && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([hood.lat, hood.lng], 14, { duration: 1.2 });
      if (onLocationChange) {
        onLocationChange({ lat: hood.lat, lng: hood.lng });
      }
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
      {/* Controls & Filter Bar */}
      {showFilters && (
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Service:
            </span>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:border-emerald-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFindNearMe}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 transition-colors cursor-pointer"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Finding...' : t('findNearMe')}
            </button>
          </div>
        </div>
      )}

      {/* Geolocation status / error alert if any */}
      {geoError && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 text-amber-800 text-xs flex items-center justify-between">
          <span>{geoError}</span>
          <button
            type="button"
            onClick={() => setGeoError(null)}
            className="font-bold underline ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Map Canvas */}
      <div className="relative">
        <div
          ref={mapContainerRef}
          style={{ height }}
          className="w-full z-0"
        />

        {/* Quick Area Jump Dropdown overlay */}
        <div className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-sm shadow-md rounded-lg p-2 border border-neutral-200 max-w-[200px]">
          <label className="block text-[10px] font-semibold uppercase text-neutral-500 mb-1">
            Jump to Dhaka Area
          </label>
          <select
            onChange={(e) => handleCenterDhakaArea(e.target.value)}
            className="w-full text-xs bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">Choose neighborhood...</option>
            {DHAKA_NEIGHBORHOODS.map(n => (
              <option key={n.area} value={n.area}>{n.area}</option>
            ))}
          </select>
        </div>

        {/* Interactive hint overlay */}
        <div className="absolute bottom-3 left-3 z-10 bg-black/75 text-white text-[11px] px-3 py-1.5 rounded-full shadow backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Click any marker to view verified Dhaka technician & book</span>
        </div>
      </div>
    </div>
  );
}
