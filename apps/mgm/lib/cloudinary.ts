// Menyisipkan transformasi Cloudinary (format & kualitas otomatis + lebar minimum)
// agar gambar tetap tajam di layar Retina/HiDPI dan tidak "pecah" saat di-stretch
// oleh object-fit: cover pada elemen besar seperti hero banner.
export function cldOptimize(url: string, width = 1920): string {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  // Sudah ada transformasi (mis. sudah diproses sebelumnya) -> jangan dobel
  if (/\/upload\/[^/]*\b(f_auto|q_auto|w_\d+)\b/.test(url)) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto:best,w_${width},dpr_auto/`);
}
