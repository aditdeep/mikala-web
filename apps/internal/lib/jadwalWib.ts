// Nilai published_at dari API disimpan dalam UTC: model MGM bentuknya "2026-10-05T01:00:00.000000Z",
// tabel MGA mentah "2026-10-05 01:00:00" (tanpa zona, tapi UTC). Input datetime-local di form CMS
// diisi & dibaca backend sbg WIB, jadi waktu buka Edit harus dikonversi UTC -> WIB dulu. Sebelumnya
// cuma di-slice, sehingga jamnya tampil versi UTC dan bergeser 7 jam tiap artikel disimpan ulang.
export function toWibInput(value: unknown): string {
  if (!value) return '';
  const s = String(value);
  const hasZone = /[zZ]$|[+-]\d\d:?\d\d$/.test(s);
  const d = new Date(hasZone ? s : s.replace(' ', 'T') + 'Z');
  if (isNaN(d.getTime())) return '';
  return new Date(d.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 16);
}
