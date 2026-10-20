import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { DHAKA_CENTER, DHAKA_NEIGHBORHOODS, getClosestNeighborhood } from '../../utils/geo.js';
import { MapPin, Navigation, Info, CheckCircle2 } from 'lucide-react';

export default function AddressLocationPicker({
  value = {},
  onChange,
  disabled = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [lat, setLat] = useState(value.lat || DHAKA_CENTER.lat);
  const [lng, setLng] = useState(value.lng || DHAKA_CENTER.lng);
  const [area, setArea] = useState(value.area || 'Gulshan');
  const [road, setRoad] = useState(value.road || '');
  const [building, setBuilding] = useState(value.building || '');
  const [apartment, setApartment] = useState(value.apartment || '');
  const [landmarks, setLandmarks] = useState(value.landmarks || '');
  const [locationStatus, setLocationStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // Sync internal state with external value changes
  useEffect(() => {
    if (value.lat) setLat(value.lat);
    if (value.lng) setLng(value.lng);
    if (value.area) setArea(value.area);
    if (value.road) setRoad(value.road);
    if (value.building) setBuilding(value.building);
    if (value.apartment) setApartment(value.apartment);
    if (value.landmarks) setLandmarks(value.landmarks);
  }, [value]);

  // Push updates to parent
  const notifyChange = (updated) => {
    if (onChange) {
      onChange({
        area,
        road,
        building,
        apartment,
        landmarks,
        lat,
        lng,
        ...updated
      });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: 'custom-picker-marker',
        html: `
          <div style="background-color: #059669; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });

      const marker = L.marker([lat, lng], {
        icon: pinIcon,
        draggable: !disabled
      }).addTo(map);

      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        handleCoordinatesChange(newPos.lat, newPos.lng);
      });

      map.on('click', (e) => {
        if (!disabled) {
          const { lat: newLat, lng: newLng } = e.latlng;
          marker.setLatLng([newLat, newLng]);
          handleCoordinatesChange(newLat, newLng);
        }
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleCoordinatesChange = (newLat, newLng) => {
    const roundedLat = Math.round(newLat * 10000) / 10000;
    const roundedLng = Math.round(newLng * 10000) / 10000;
    setLat(roundedLat);
    setLng(roundedLng);

    const closest = getClosestNeighborhood(roundedLat, roundedLng);
    setArea(closest.area);
    notifyChange({ lat: roundedLat, lng: roundedLng, area: closest.area });
  };

  const handleAreaSelect = (chosenArea) => {
    setArea(chosenArea);
    const hood = DHAKA_NEIGHBORHOODS.find(n => n.area === chosenArea);
    if (hood) {
      setLat(hood.lat);
      setLng(hood.lng);
      if (markerRef.current) {
        markerRef.current.setLatLng([hood.lat, hood.lng]);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([hood.lat, hood.lng], 14);
      }
      notifyChange({ area: chosenArea, lat: hood.lat, lng: hood.lng });
    } else {
      notifyChange({ area: chosenArea });
    }
  };

  const handleDeviceGeolocation = () => {
    setLocationStatus('');
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 15);
        }
        handleCoordinatesChange(latitude, longitude);
        setLocationStatus('Location detected successfully.');
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('Location access was denied or timed out. You can manually enter your address below.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-4">
      {/* Map location picker banner */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Pick Exact Service Location on Map
          </h4>
          <p className="text-xs text-neutral-500">
            Click on the map or drag the pin to your building entrance in Dhaka.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDeviceGeolocation}
          disabled={isLocating || disabled}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Locating...' : 'Use My Current Location'}
        </button>
      </div>

      {locationStatus && (
        <div className="p-2.5 rounded-lg bg-neutral-100 text-xs text-neutral-700 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          <span>{locationStatus}</span>
        </div>
      )}

      {/* Map Canvas */}
      <div className="rounded-xl overflow-hidden border border-neutral-300 relative shadow-inner">
        <div ref={mapContainerRef} style={{ height: '260px' }} className="w-full z-0" />
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-neutral-700 shadow-sm border border-neutral-200">
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)} ({area})
        </div>
      </div>

      {/* Detailed Address Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Dhaka Neighborhood / Zone <span className="text-red-500">*</span>
          </label>
          <select
            value={area}
            onChange={(e) => handleAreaSelect(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {DHAKA_NEIGHBORHOODS.map(n => (
              <option key={n.area} value={n.area}>{n.area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Road / Sector / Block
          </label>
          <input
            type="text"
            value={road}
            placeholder="e.g. Road 11, Sector 4, Block C"
            onChange={(e) => {
              setRoad(e.target.value);
              notifyChange({ road: e.target.value });
            }}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Building Name & House No. <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={building}
            placeholder="e.g. House 42, Green Heritage"
            onChange={(e) => {
              setBuilding(e.target.value);
              notifyChange({ building: e.target.value });
            }}
            disabled={disabled}
            required
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Apartment / Flat / Floor
          </label>
          <input
            type="text"
            value={apartment}
            placeholder="e.g. Flat 5-B (5th Floor)"
            onChange={(e) => {
              setApartment(e.target.value);
              notifyChange({ apartment: e.target.value });
            }}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Nearby Landmark / Directions for Technician
          </label>
          <input
            type="text"
            value={landmarks}
            placeholder="e.g. Opposite to DCC Market, beside Dutch Bangla Bank ATM"
            onChange={(e) => {
              setLandmarks(e.target.value);
              notifyChange({ landmarks: e.target.value });
            }}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
}
