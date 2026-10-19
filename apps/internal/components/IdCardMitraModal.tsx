'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Download } from 'lucide-react';

// ID card mitra -- replika template sistem lama (sis.mikalaglobalmedika.com): latar depan &
// belakang dari /public/idcard (590x1004 px, 2x ukuran tampilan lama 295x502), lalu foto, nama,
// jabatan & NIM digambar di atasnya pada posisi yg sama. Digambar di canvas resolusi penuh,
// jadi pratinjau = file PNG yg diunduh.
const W = 590;
const H = 1004;
const EMAIL = 'mitra@mikalaglobalmedika.com'; // sama spt sistem lama (email umum, bukan email mitra)

// tipe_pekerjaan (pilihan form mitra) -> sebutan jabatan singkat di kartu
const JABATAN: Record<string, string> = {
  'Perawat Lansia / Caregiver': 'CAREGIVER',
  'Caregiver / Kaigo (Jepang)': 'CAREGIVER',
  'Perawat Homecare': 'PERAWAT HOMECARE',
  'Perawat Jiwa': 'PERAWAT JIWA',
  'Babysitter': 'BABYSITTER',
  'Babysitter New Born Care': 'BABYSITTER',
};

function muatGambar(src: string): Promise<HTMLImageElement | null> {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // foto dari Cloudinary -- tanpa ini canvas tidak bisa diunduh
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Teks rata tengah; diperkecil otomatis kalau terlalu lebar (nama panjang). */
function teksTengah(ctx: CanvasRenderingContext2D, teks: string, y: number, size: number, bold = false, maxW = W - 60) {
  let s = size;
  do {
    ctx.font = `${bold ? '700' : '400'} ${s}px Arial, Helvetica, sans-serif`;
    if (ctx.measureText(teks).width <= maxW) break;
    s -= 1;
  } while (s > 14);
  ctx.fillText(teks, W / 2, y);
}

/** Nama: 1 baris (32px, boleh mengecil sampai 24px); terlalu panjang -> 2 baris spy tetap terbaca. */
function tulisNama(ctx: CanvasRenderingContext2D, nama: string, maxW = W - 60) {
  const lebar = (t: string, px: number) => { ctx.font = `700 ${px}px Arial, Helvetica, sans-serif`; return ctx.measureText(t).width; };
  for (let px = 32; px >= 24; px--) {
    if (lebar(nama, px) <= maxW) { ctx.fillText(nama, W / 2, 484 + (32 - px) / 2); return; }
  }
  const kata = nama.split(' ');
  let terbaik = 1, selisih = Infinity; // titik potong yg membuat 2 baris paling seimbang
  for (let i = 1; i < kata.length; i++) {
    const d = Math.abs(lebar(kata.slice(0, i).join(' '), 26) - lebar(kata.slice(i).join(' '), 26));
    if (d < selisih) { selisih = d; terbaik = i; }
  }
  const b1 = kata.slice(0, terbaik).join(' '), b2 = kata.slice(terbaik).join(' ');
  let px = 26;
  while (px > 16 && Math.max(lebar(b1, px), lebar(b2, px)) > maxW) px--;
  lebar(b1, px);
  ctx.fillText(b1, W / 2, 470);
  ctx.fillText(b2, W / 2, 470 + px * 1.15);
}

export default function IdCardMitraModal({ mitra, onClose }: { mitra: any; onClose: () => void }) {
  const depanRef = useRef<HTMLCanvasElement>(null);
  const blkgRef = useRef<HTMLCanvasElement>(null);
  const [nama, setNama] = useState((mitra?.nama_lengkap || mitra?.user?.name || '').toUpperCase());
  const [jabatan, setJabatan] = useState(
    (mitra?.jabatan && mitra.jabatan.length <= 24 ? mitra.jabatan : JABATAN[mitra?.tipe_pekerjaan] || mitra?.tipe_pekerjaan || '').toUpperCase());
  const [nim, setNim] = useState(mitra?.nomor_induk || '');
  const [fotoGagal, setFotoGagal] = useState(false);
  const [siap, setSiap] = useState(false);

  // latar belakang kartu: sekali saja
  useEffect(() => {
    muatGambar('/idcard/id_blkg.png').then(bg => {
      const ctx = blkgRef.current?.getContext('2d');
      if (ctx && bg) ctx.drawImage(bg, 0, 0, W, H);
    });
  }, []);

  // depan: digambar ulang tiap nama/jabatan/NIM diubah
  useEffect(() => {
    let batal = false;
    (async () => {
      const [bg, foto] = await Promise.all([
        muatGambar('/idcard/id_depan.png'),
        mitra?.foto_url ? muatGambar(mitra.foto_url) : Promise.resolve(null),
      ]);
      const ctx = depanRef.current?.getContext('2d');
      if (batal || !ctx) return;
      ctx.clearRect(0, 0, W, H);
      if (bg) ctx.drawImage(bg, 0, 0, W, H);

      // foto bulat: diameter 226, pusat (295, 279) -- = img 113px top:83 di template lama
      const r = 113, cx = W / 2, cy = 166 + r;
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
      if (foto) {
        const s = Math.max((r * 2) / foto.width, (r * 2) / foto.height); // object-fit: cover
        const fw = foto.width * s, fh = foto.height * s;
        ctx.drawImage(foto, cx - fw / 2, cy - fh / 2, fw, fh);
      } else {
        ctx.fillStyle = '#e5e7eb'; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
        ctx.fillStyle = '#9ca3af'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '700 72px Arial, Helvetica, sans-serif';
        ctx.fillText(nama.split(' ').map((n: string) => n[0]).join('').slice(0, 2), cx, cy);
      }
      ctx.restore();
      setFotoGagal(!!mitra?.foto_url && !foto);

      ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      tulisNama(ctx, nama);
      teksTengah(ctx, jabatan, 544, 28);
      teksTengah(ctx, `ID No : ${nim}`, 624, 26);
      teksTengah(ctx, `E-mail : ${EMAIL}`, 664, 24);
      setSiap(true);
    })();
    return () => { batal = true; };
  }, [mitra?.foto_url, nama, jabatan, nim]);

  const unduh = (cv: HTMLCanvasElement | null, sisi: string) => {
    if (!cv) return;
    try {
      cv.toBlob(blob => {
        if (!blob) return;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `ID Card ${nama || 'Mitra'} - ${sisi}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      }, 'image/png');
    } catch {
      alert('Kartu tidak bisa diunduh karena foto mitra tidak mengizinkan akses. Ganti foto mitra lewat Edit Mitra lalu coba lagi.');
    }
  };

  const inp = { width: '100%', padding: '8px 10px', background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text)', fontSize: '13px', outline: 'none' };
  const lbl = { fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', display: 'block' };
  const btn = (bg: string) => ({ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', width: '100%', marginTop: '8px', padding: '9px', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: bg });
  const kartu = { width: '100%', maxWidth: '260px', aspectRatio: `${W} / ${H}`, borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.25)', display: 'block' };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg2, #1a1a2e)', border: '1px solid var(--border)', borderRadius: '20px', padding: '20px', width: '100%', maxWidth: '640px', maxHeight: '95vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text)' }}>ID Card Mitra</h2>
          <button onClick={onClose} style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '10px', padding: '6px', cursor: 'pointer', color: 'var(--text2)', display: 'flex' }}><X size={18} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '14px' }}>
          <div><label style={lbl}>Nama di kartu</label><input style={inp} value={nama} onChange={e => setNama(e.target.value.toUpperCase())} /></div>
          <div><label style={lbl}>Jabatan</label><input style={inp} value={jabatan} onChange={e => setJabatan(e.target.value.toUpperCase())} /></div>
          <div><label style={lbl}>ID No (NIM)</label><input style={inp} value={nim} onChange={e => setNim(e.target.value)} /></div>
        </div>
        {!mitra?.nomor_induk && <p style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '10px' }}>Mitra ini belum punya NIM — isi manual atau lengkapi lewat Edit Mitra.</p>}
        {fotoGagal && <p style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '10px' }}>Foto mitra gagal dimuat — kartu memakai inisial. Ganti foto lewat Edit Mitra.</p>}
        {!mitra?.foto_url && <p style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '10px' }}>Mitra ini belum punya foto — kartu memakai inisial.</p>}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px', maxWidth: '260px' }}>
            <canvas ref={depanRef} width={W} height={H} style={kartu} />
            <button disabled={!siap} onClick={() => unduh(depanRef.current, 'Depan')} style={btn('linear-gradient(135deg,#3b82f6,#2563eb)')}><Download size={14} />Download Depan</button>
          </div>
          <div style={{ flex: '1 1 200px', maxWidth: '260px' }}>
            <canvas ref={blkgRef} width={W} height={H} style={kartu} />
            <button onClick={() => unduh(blkgRef.current, 'Belakang')} style={btn('linear-gradient(135deg,#6b7280,#4b5563)')}><Download size={14} />Download Belakang</button>
          </div>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginTop: '12px' }}>PNG 590 × 1004 px (siap cetak ukuran ID card portrait).</p>
      </div>
    </div>
  );
}
