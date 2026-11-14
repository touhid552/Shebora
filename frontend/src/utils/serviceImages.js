export const defaultServiceImage = '/images/services/ac-repair.jpg';

// These files are shipped from dist/images/services and served from /images/services.
const serviceImageByLegacyName = {
  'all.jpg': 'appliance-repair.jpg',
  'service-1.jpg': 'painting.jpg',
  'service-2.jpg': 'plumbing.jpg',
  'service-3.jpg': 'electrical.jpg',
  'service-4.jpg': 'home-cleaning.jpg',
};

const availableImages = new Set([
  'ac-repair.jpg',
  'appliance-repair.jpg',
  'electrical.jpg',
  'home-cleaning.jpg',
  'painting.jpg',
  'plumbing.jpg',
]);

export function resolveServiceImage(image) {
  if (!image || typeof image !== 'string') {
    return defaultServiceImage;
  }

  const requestedFilename = image.replace(/\\/g, '/').split('/').pop();
  const filename = serviceImageByLegacyName[requestedFilename] || requestedFilename;

  if (availableImages.has(filename)) {
    return `/images/services/${filename}`;
  }

  return defaultServiceImage;
}
