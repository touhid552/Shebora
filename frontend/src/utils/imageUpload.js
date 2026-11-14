export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function readImageAsDataUrl(file) {
  if (!file) return Promise.resolve('');
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    return Promise.reject(new Error('Choose a JPG, PNG, or WebP image.'));
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Promise.reject(new Error('Image must be 4 MB or smaller.'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected image.'));
    reader.readAsDataURL(file);
  });
}
