// Shebora Dhaka Geolocation Utilities
export const DHAKA_CENTER = {
  lat: 23.8103,
  lng: 90.4125,
  name: "Dhaka Central"
};

export const DHAKA_NEIGHBORHOODS = [
  { area: "Gulshan", lat: 23.7925, lng: 90.4167 },
  { area: "Banani", lat: 23.7937, lng: 90.4066 },
  { area: "Dhanmondi", lat: 23.7461, lng: 90.3742 },
  { area: "Uttara", lat: 23.8688, lng: 90.3995 },
  { area: "Mirpur", lat: 23.8223, lng: 90.3654 },
  { area: "Mohammadpur", lat: 23.7658, lng: 90.3584 },
  { area: "Bashundhara", lat: 23.8191, lng: 90.4526 },
  { area: "Badda", lat: 23.7806, lng: 90.4267 },
  { area: "Baridhara", lat: 23.7998, lng: 90.4206 },
  { area: "Motijheel", lat: 23.7330, lng: 90.4172 },
  { area: "Tejgaon", lat: 23.7639, lng: 90.3958 },
  { area: "Lalbagh", lat: 23.7196, lng: 90.3879 },
  { area: "Khilgaon", lat: 23.7547, lng: 90.4286 },
  { area: "Malibagh", lat: 23.7490, lng: 90.4160 },
  { area: "Farmgate", lat: 23.7561, lng: 90.3872 },
  { area: "Mirpur DOHS", lat: 23.8340, lng: 90.3745 }
];

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function isWithinDhaka(lat, lng) {
  return lat >= 23.60 && lat <= 23.98 && lng >= 90.25 && lng <= 90.55;
}

export function getClosestNeighborhood(lat, lng) {
  let closest = DHAKA_NEIGHBORHOODS[0];
  let minDistance = calculateDistanceKm(lat, lng, closest.lat, closest.lng);

  for (let i = 1; i < DHAKA_NEIGHBORHOODS.length; i++) {
    const dist = calculateDistanceKm(lat, lng, DHAKA_NEIGHBORHOODS[i].lat, DHAKA_NEIGHBORHOODS[i].lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = DHAKA_NEIGHBORHOODS[i];
    }
  }

  return {
    area: closest.area,
    distanceKm: minDistance
  };
}
