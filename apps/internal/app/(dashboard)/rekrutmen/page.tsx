'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { Users, Plus, Search, X, Eye, CheckCircle, XCircle, Clock, Pencil, Trash2, FileText, Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const PENDIDIKAN = ['SMA Negeri / Swasta','MA, MAN, atau Sekolah Keagamaan Lainnya','SMK / Sekolah Kejuruan Kesehatan','SMK / Sekolah Kejuruan Lainnya','Diploma D1/D2/D3 Kesehatan','Diploma D1/D2/D3 Lainnya','Sarjana S1 Kesehatan','Sarjana S1 Keperawatan','Profesi Nurse','Sarjana S1 Lainnya'];
const TIPE_PEKERJAAN = ['Perawat Homecare','Perawat Lansia / Caregiver','Babysitter','Babysitter New Born Care','Perawat Jiwa','Caregiver / Kaigo (Jepang)','Ke Jepang Lainnya'];
const AGAMA = ['Islam','Kristen Protestan','Kristen Katolik','Hindu','Budha','Konghucu'];
const HEWAN = ['Tidak takut semua hewan','Anjing','Kucing','Yang lain'];

// Kolom export/import Excel tabel Data Mitra -- header di sini dipakai juga waktu parse balik
// file yang diimport (biar kolom boleh diacak urutannya pas dirapikan di Excel, dicocokkan by
// nama header, bukan posisi kolom). key 'no_hp' khusus, diambil dari user.phone bukan field mitra.
const EXPORT_FIELDS: { header: string; key: string }[] = [
  { header: 'NIM', key: 'nomor_induk' },
  { header: 'Nama Lengkap', key: 'nama_lengkap' },
  { header: 'NIK', key: 'nik' },
  { header: 'Gender (L/P)', key: 'jenis_kelamin' },
  { header: 'No HP', key: 'no_hp' },
  { header: 'Tempat Lahir', key: 'tempat_lahir' },
  { header: 'Tanggal Lahir (YYYY-MM-DD)', key: 'tanggal_lahir' },
  { header: 'Tipe Pekerjaan', key: 'tipe_pekerjaan' },
  { header: 'Kota', key: 'kota' },
  { header: 'Provinsi', key: 'provinsi' },
  { header: 'Pendidikan Terakhir', key: 'pendidikan_terakhir' },
  { header: 'Suku', key: 'suku' },
  { header: 'Tinggi Badan (cm)', key: 'tinggi_badan' },
  { header: 'Berat Badan (kg)', key: 'berat_badan' },
  { header: 'Agama', key: 'agama' },
  { header: 'Status Pernikahan', key: 'status_nikah' },
  { header: 'Status (available/on_job/inactive)', key: 'status' },
  { header: 'Status Rekrutmen (pending/verified/rejected)', key: 'status_rekrutmen' },
];

// Hitung usia (tahun) dari tanggal lahir, sampai hari ini -- dipakai supaya Usia tidak perlu
// diisi manual lagi dan tidak bisa "basi"/tidak sinkron dengan Tanggal Lahir.
function calcUsia(tanggalLahir: string): number | null {
  if (!tanggalLahir) return null;
  const lahir = new Date(tanggalLahir);
  if (isNaN(lahir.getTime())) return null;
  const now = new Date();
  let usia = now.getFullYear() - lahir.getFullYear();
  const belumUlangTahun = (now.getMonth() < lahir.getMonth()) ||
    (now.getMonth() === lahir.getMonth() && now.getDate() < lahir.getDate());
  if (belumUlangTahun) usia--;
  return usia >= 0 ? usia : null;
}

const inputStyle = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
const labelStyle: React.CSSProperties = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' };
const sectionStyle: React.CSSProperties = { background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'14px', padding:'16px', marginBottom:'12px' };

const emptyForm = {
  name:'', email:'', password:'', phone:'', nik:'', nomor_induk:'', usia:'',
  tempat_lahir:'', tanggal_lahir:'', alamat:'', kelurahan:'', kecamatan:'',
  kota:'', provinsi:'', suku:'', pendidikan:'', jenis_kelamin:'L',
  tinggi:'', berat:'', vaksin:'', status_nikah:'Belum Menikah',
  agama:'Islam', takut_hewan:'Tidak takut semua hewan',
  bisa_memasak:'Bisa', tipe_pekerjaan:'Perawat Homecare',
  pengalaman_pelatihan:'', pengalaman:'',
  // Kemampuan (list bebas, diisi mitra sendiri saat daftar) -- ditampilkan di CV mitra
  kemampuan: [] as string[],
  payment_type: 'cash' as 'cash' | 'kredit',
  sumber_tipe: 'sendiri',
  sumber_detail: '',
  lembaga_id: undefined as number | undefined,
  referrer_mitra_id: undefined as number | undefined,
};

// FIX: data lama (sebelum field ini diubah jadi dropdown Bisa/Tidak Bisa) kesimpen sbg skala
// angka 1-5 ("1".."5") atau kosong -- normalisasi ke 2 opsi baru biar select gak "blank" pas
// buka Edit utk mitra lama: 1 (Tidak bisa) -> "Tidak Bisa", 2-5 (Sedikit..Sangat mahir) -> "Bisa".
function normalizeMemasak(v: string): string {
  const t = (v || '').trim();
  if (t === 'Bisa' || t === 'Tidak Bisa') return t;
  const n = parseInt(t, 10);
  if (!isNaN(n)) return n <= 1 ? 'Tidak Bisa' : 'Bisa';
  return 'Bisa';
}

// Parse balik data yang di-encode ke dalam field `pengalaman` (lihat handleSubmit) supaya
// form Edit tidak menampilkan kosong -- sebelumnya ini menyebabkan data "Data Tambahan"
// (usia, tempat lahir, TB/BB, vaksin, agama, dst) hilang/tertimpa blank tiap kali disimpan ulang.
function parsePengalamanBlob(raw: string) {
  const result: any = {
    pengalaman_pelatihan: '', pengalaman: '',
    usia: '', tempat_lahir: '', tinggi: '', berat: '', vaksin: '',
    agama: 'Islam', status_nikah: 'Belum Menikah', takut_hewan: 'Tidak takut semua hewan',
    bisa_memasak: 'Bisa', tipe_pekerjaan: 'Perawat Homecare', suku: '',
  };
  if (!raw) return result;

  const pelatihanMatch = raw.match(/PELATIHAN:\s*([\s\S]*?)\n\nPENGALAMAN KERJA:/);
  const kerjaMatch = raw.match(/PENGALAMAN KERJA:\s*([\s\S]*?)\n\nDATA TAMBAHAN:/);
  const tambahanMatch = raw.match(/DATA TAMBAHAN:\s*([\s\S]*)$/);

  if (pelatihanMatch) result.pengalaman_pelatihan = pelatihanMatch[1].trim();
  if (kerjaMatch) result.pengalaman = kerjaMatch[1].trim();

  if (tambahanMatch) {
    const tambahan = tambahanMatch[1];
    const grab = (label: string) => {
      const m = tambahan.match(new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ':\\s*([^,]*)'));
      return m ? m[1].trim() : '';
    };
    result.usia = grab('Usia');
    result.tempat_lahir = grab('Tempat Lahir');
    result.tinggi = grab('TB').replace(/cm$/i, '').trim();
    result.berat = grab('BB').replace(/kg$/i, '').trim();
    result.vaksin = grab('Vaksin');
    result.agama = grab('Agama') || 'Islam';
    result.status_nikah = grab('Status Nikah') || 'Belum Menikah';
    result.takut_hewan = grab('Takut Hewan') || 'Tidak takut semua hewan';
    result.bisa_memasak = normalizeMemasak(grab('Memasak').replace(/\/5$/, '').trim());
    result.tipe_pekerjaan = grab('Tipe Pekerjaan') || 'Perawat Homecare';
    result.suku = grab('Suku');
  } else if (!pelatihanMatch && !kerjaMatch) {
    // Format lama / manual, sebelum skema "DATA TAMBAHAN" ada -- anggap semua teks sebagai pengalaman kerja
    result.pengalaman = raw;
  }
  return result;
}

// Parse balik alamat gabungan "alamat, kelurahan, kecamatan, kota, provinsi" (lihat handleSubmit)
// supaya kelurahan/kecamatan tidak hilang & tidak terduplikasi tiap kali form Edit disimpan ulang.
function parseAlamatBlob(rawAlamat: string, kota: string, provinsi: string) {
  let sisa = rawAlamat || '';
  const suffix = `, ${kota || ''}, ${provinsi || ''}`;
  if (kota && provinsi && sisa.endsWith(suffix)) {
    sisa = sisa.slice(0, -suffix.length);
  }
  const parts = sisa.split(',').map(p => p.trim());
  return {
    alamat: parts[0] || '',
    kelurahan: parts[1] || '',
    kecamatan: parts[2] || '',
  };
}

// ── Kemampuan Khusus -- input list bebas (tag), ditampilkan di CV mitra ──────
function KemampuanTagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = React.useState('');
  const add = () => {
    const v = draft.trim();
    if (!v || value.includes(v)) { setDraft(''); return; }
    onChange([...value, v]);
    setDraft('');
  };
  return (
    <div>
      <div style={{ display:'flex', gap:'8px' }}>
        <input
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          style={{ ...inputStyle, flex:1 }}
          placeholder="mis. Merawat luka, Injeksi -- Enter utk tambah"
        />
        <button type="button" onClick={add} style={{ padding:'0 16px', borderRadius:'10px', border:'1px solid var(--border)', background:'rgba(124,58,237,0.15)', color:'var(--purple-light)', fontWeight:700, cursor:'pointer' }}>+</button>
      </div>
      {value.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'6px', marginTop:'10px' }}>
          {value.map((k, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'5px 10px', borderRadius:'20px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)', color:'var(--purple-light)', fontSize:'12px' }}>
              {k}
              <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} style={{ background:'none', border:'none', color:'var(--text3)', cursor:'pointer', fontSize:'13px', lineHeight:1, padding:0 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── PhotoCropModal -- crop foto profil sebelum diupload (pilih area fokus, mis. badan/kepala) ──
// Implementasi manual (drag + zoom di atas canvas), tanpa library eksternal supaya gak perlu
// nambah dependency baru yg belum tentu ke-install bersih di semua environment deploy.
function PhotoCropModal({ file, onCancel, onConfirm }: { file: File; onCancel: () => void; onConfirm: (blob: Blob) => void }) {
  const FRAME = 280; // ukuran area crop (persegi) di layar, px
  const OUTPUT = 600; // ukuran output foto hasil crop, px
  const [imgSrc, setImgSrc] = React.useState('');
  const [natSize, setNatSize] = React.useState({ w: 0, h: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const dragRef = React.useRef<{ startX: number; startY: number; offX: number; offY: number } | null>(null);

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setImgSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const baseScale = natSize.w && natSize.h ? Math.max(FRAME / natSize.w, FRAME / natSize.h) : 0;
  const scale = baseScale * zoom;
  const dispW = natSize.w * scale;
  const dispH = natSize.h * scale;

  const clamp = (o: { x: number; y: number }, dW: number, dH: number) => ({
    x: Math.min(0, Math.max(FRAME - dW, o.x)),
    y: Math.min(0, Math.max(FRAME - dH, o.y)),
  });

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const w = img.naturalWidth, h = img.naturalHeight;
    setNatSize({ w, h });
    const bs = Math.max(FRAME / w, FRAME / h);
    setOffset({ x: (FRAME - w * bs) / 2, y: (FRAME - h * bs) / 2 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, offX: offset.x, offY: offset.y };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(clamp({ x: dragRef.current.offX + dx, y: dragRef.current.offY + dy }, dispW, dispH));
  };
  const onPointerUp = () => { dragRef.current = null; };

  const onZoomChange = (z: number) => {
    const newScale = baseScale * z;
    const newDispW = natSize.w * newScale, newDispH = natSize.h * newScale;
    setZoom(z);
    setOffset(o => clamp(o, newDispW, newDispH));
  };

  const confirm = () => {
    const canvas = document.createElement('canvas');
    canvas.width = OUTPUT; canvas.height = OUTPUT;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const sourceX = -offset.x / scale;
      const sourceY = -offset.y / scale;
      const sourceSize = FRAME / scale;
      ctx.drawImage(img, sourceX, sourceY, sourceSize, sourceSize, 0, 0, OUTPUT, OUTPUT);
      canvas.toBlob(blob => { if (blob) onConfirm(blob); }, 'image/jpeg', 0.9);
    };
    img.src = imgSrc;
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div style={{ background:'var(--card, #1a1a2e)', borderRadius:'20px', padding:'24px', width:'100%', maxWidth:'380px', textAlign:'center' }}>
        <h3 style={{ color:'var(--text)', fontWeight:700, fontSize:'16px', marginBottom:'4px' }}>Atur Area Foto</h3>
        <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'14px' }}>Geser & zoom untuk pilih area fokus (mis. wajah atau seluruh badan)</p>
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          style={{ width:FRAME, height:FRAME, margin:'0 auto', borderRadius:'50%', overflow:'hidden', position:'relative', background:'#000', cursor:'grab', border:'2px solid var(--purple-light)', touchAction:'none' }}
        >
          {imgSrc && (
            <img
              src={imgSrc}
              onLoad={onImgLoad}
              draggable={false}
              style={{ position:'absolute', left:offset.x, top:offset.y, width:dispW || undefined, height:dispH || undefined, userSelect:'none', pointerEvents:'none' }}
              alt="crop-preview"
            />
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'16px' }}>
          <span style={{ color:'var(--text3)', fontSize:'11px' }}>Zoom</span>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => onZoomChange(parseFloat(e.target.value))} style={{ flex:1 }} />
        </div>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginTop:'20px' }}>
          <button type="button" onClick={onCancel} style={{ padding:'10px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
          <button type="button" onClick={confirm} disabled={!natSize.w} style={{ padding:'10px 24px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: natSize.w ? 'pointer' : 'not-allowed', opacity: natSize.w ? 1 : 0.6 }}>Pakai Foto Ini</button>
        </div>
      </div>
    </div>
  );
}

// ── SumberInline — komponen inline untuk form rekrutmen ──────────────────────
function SumberInline({ form, setForm }: { form: any; setForm: any }) {
  const [lembagaList, setLembagaList] = React.useState<any[]>([]);
  const [mitraList, setMitraList]     = React.useState<any[]>([]);
  const [loadingL, setLoadingL]       = React.useState(false);
  const [loadingM, setLoadingM]       = React.useState(false);

  React.useEffect(() => {
    if (form.sumber_tipe === 'lembaga' && lembagaList.length === 0) {
      setLoadingL(true);
      apiClient.get('/public/lembaga')
        .then((r: any) => setLembagaList(r.data?.data || []))
        .catch(() => {})
        .finally(() => setLoadingL(false));
    }
    if (form.sumber_tipe === 'orang_terdekat' && mitraList.length === 0) {
      setLoadingM(true);
      apiClient.get('/public/mitra-list')
        .then((r: any) => setMitraList(r.data?.data || []))
        .catch(() => {})
        .finally(() => setLoadingM(false));
    }
  }, [form.sumber_tipe]);

  const s = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const inp2: React.CSSProperties = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const lbl2: React.CSSProperties = { color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px' }}>
        {[
          { v:'sendiri',        emoji:'🔍', label:'Sendiri' },
          { v:'lembaga',        emoji:'🏫', label:'Lembaga' },
          { v:'orang_terdekat', emoji:'👥', label:'Orang Terdekat' },
        ].map(opt => (
          <button key={opt.v} type="button"
            onClick={() => setForm((f: any) => ({ ...f, sumber_tipe: opt.v, sumber_detail:'', lembaga_id: undefined, referrer_mitra_id: undefined }))}
            style={{ padding:'10px 6px', borderRadius:'10px', cursor:'pointer', textAlign:'center' as const, fontSize:'12px', fontWeight:600, border:`2px solid ${form.sumber_tipe===opt.v?'rgba(124,58,237,0.6)':'var(--border)'}`, background: form.sumber_tipe===opt.v?'rgba(124,58,237,0.1)':'transparent', color: form.sumber_tipe===opt.v?'var(--purple-light)':'var(--text3)' }}>
            <div style={{ fontSize:'18px', marginBottom:'3px' }}>{opt.emoji}</div>
            <span style={{ fontSize:'11px' }}>{opt.label}</span>
          </button>
        ))}
      </div>

      {form.sumber_tipe === 'sendiri' && (
        <div>
          <label style={lbl2}>Platform</label>
          <select value={form.sumber_detail||''} onChange={e => s('sumber_detail', e.target.value)} style={inp2}>
            <option value="">-- Pilih platform --</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="website">Website Mikala</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>
      )}

      {form.sumber_tipe === 'lembaga' && (
        <div>
          <label style={lbl2}>Nama Lembaga</label>
          {loadingL ? <p style={{ fontSize:'12px', color:'var(--text3)' }}>Memuat...</p> : (
            <select value={form.lembaga_id||''} onChange={e => { const l=lembagaList.find((x:any)=>x.id===Number(e.target.value)); setForm((f:any)=>({...f,lembaga_id:Number(e.target.value),sumber_detail:l?.nama||''})); }} style={inp2}>
              <option value="">-- Pilih lembaga --</option>
              {lembagaList.map((l:any) => <option key={l.id} value={l.id}>{l.nama}{l.kota?` (${l.kota})`:''}</option>)}
            </select>
          )}
          {lembagaList.length === 0 && !loadingL && <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'4px' }}>Belum ada lembaga. Tambah di menu Lembaga.</p>}
        </div>
      )}

      {form.sumber_tipe === 'orang_terdekat' && (
        <div>
          <label style={lbl2}>Nama Mitra Referrer</label>
          {loadingM ? <p style={{ fontSize:'12px', color:'var(--text3)' }}>Memuat...</p> : (
            <select value={form.referrer_mitra_id||''} onChange={e => { const m=mitraList.find((x:any)=>x.id===Number(e.target.value)); setForm((f:any)=>({...f,referrer_mitra_id:Number(e.target.value),sumber_detail:m?.nama_lengkap||''})); }} style={inp2}>
              <option value="">-- Pilih mitra --</option>
              {mitraList.map((m:any) => <option key={m.id} value={m.id}>{m.nama_lengkap}{m.kota?` - ${m.kota}`:''}</option>)}
            </select>
          )}
        </div>
      )}
    </div>
  );
}

export default function RekrutmenPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetail, setShowDetail] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('semua');
  const [page, setPage] = useState(1);
  const perPage = 20;
  const [errorMsg, setErrorMsg] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null);
  const [showKredensial, setShowKredensial] = useState<any>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [fotoUrl, setFotoUrl] = useState('');
  const [cvUrl, setCvUrl] = useState('');
  // FIX: foto sebelumnya langsung diupload apa adanya begitu dipilih -- sekarang mampir dulu ke
  // modal crop (PhotoCropModal) supaya admin bisa milih area fokus (mis. wajah vs seluruh badan)
  // sebelum benar2 di-upload ke Cloudinary. cropSrcFile nyimpen file mentah menunggu di-crop.
  const [cropSrcFile, setCropSrcFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const importFileRef = React.useRef<HTMLInputElement>(null);

  // State untuk verifikasi
  const [priceRateInput, setPriceRateInput] = useState('');
  const [jabatanInput, setJabatanInput] = useState('');
  const [gajiBulananInput, setGajiBulananInput] = useState('');
  const [gajiConfig, setGajiConfig] = useState<any[]>([]);
  const [totalBiayaInput, setTotalBiayaInput] = useState('');
  const [cicilanInput, setCicilanInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => { fetchData(); fetchGajiConfig(); }, []);
  const fetchGajiConfig = async () => {
    try { const res = await apiClient.get('/internal/rekrutmen/gaji-config'); setGajiConfig(res.data?.data || []); } catch {}
  };

  const fetchData = () => {
    setLoading(true);
    apiClient.get('/internal/rekrutmen/mitra?per_page=1000')
      .then((res: any) => { setData(Array.isArray(res.data?.data) ? res.data.data : []); setLoading(false); })
      .catch(() => { setData([]); setLoading(false); });
  };

  const handleUpload = async (file: File, folder: string, setter: (url: string) => void, setUploading: (v: boolean) => void) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      const res: any = await apiClient.post('/internal/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (res.data?.success) { setter(res.data.url); alert('Upload berhasil!'); }
      else alert('Upload gagal: ' + res.data?.message);
    } catch (err: any) {
      alert('Upload error: ' + (err.response?.data?.message || err.message));
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    try {
      const payload = {
        foto_url: fotoUrl || undefined,
        ktp_file: cvUrl || undefined,
        name: form.name, email: form.email,
        password: form.password || 'password123',
        phone: form.phone, nik: form.nik, nomor_induk: form.nomor_induk || undefined,
        alamat: `${form.alamat}, ${form.kelurahan}, ${form.kecamatan}, ${form.kota}, ${form.provinsi}`,
        kota: form.kota, provinsi: form.provinsi,
        tanggal_lahir: form.tanggal_lahir,
        jenis_kelamin: form.jenis_kelamin,
        pendidikan: form.pendidikan,
        payment_type: form.payment_type,
        sumber_tipe: form.sumber_tipe,
        sumber_detail: form.sumber_detail,
        lembaga_id: form.lembaga_id,
        referrer_mitra_id: form.referrer_mitra_id,
        // FIX: field2 ini dulu digabung jadi satu blob teks di kolom `pengalaman` lalu di-parse
        // balik pakai regex saat Edit dibuka -- rapuh & gampang gagal. Sekarang dikirim sbg field
        // terpisah, masing2 punya kolom asli sendiri di backend (lihat RekrutmenController).
        pengalaman_pelatihan: form.pengalaman_pelatihan,
        pengalaman: form.pengalaman,
        kemampuan: form.kemampuan,
        tempat_lahir: form.tempat_lahir,
        tinggi: form.tinggi,
        berat: form.berat,
        vaksin: form.vaksin,
        agama: form.agama,
        status_nikah: form.status_nikah,
        takut_hewan: form.takut_hewan,
        bisa_memasak: form.bisa_memasak,
        tipe_pekerjaan: form.tipe_pekerjaan,
        suku: form.suku,
      };
      if (editItem) {
        await apiClient.patch(`/internal/rekrutmen/mitra/${editItem.id}`, payload);
      } else {
        await apiClient.post('/internal/rekrutmen/mitra', payload);
      }
      setShowModal(false);
      setEditItem(null);
      if (!editItem) setShowKredensial({ email: form.email, password: form.password || 'password123', name: form.name });
      setForm({ ...emptyForm });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal menyimpan data');
    } finally { setSaving(false); }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    const user = item.user || {};
    // FIX: tinggi/berat/vaksin/tipe_pekerjaan/dll sekarang punya kolom asli sendiri di backend
    // (lihat migration split_pengalaman_blob_fields_on_mitra + RekrutmenController). Utamakan
    // kolom asli itu; fallback ke parse blob lama HANYA kalau kolomnya belum keisi -- jaga2 utk
    // record lama yg belum sempat ke-backfill migration.
    const parsedPengalaman = parsePengalamanBlob(item.pengalaman || '');
    const parsedAlamat = parseAlamatBlob(item.alamat || '', item.kota || '', item.provinsi || '');
    setForm({
      ...emptyForm,
      ...parsedPengalaman,
      name: item.nama_lengkap || user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      nik: item.nik || '',
      nomor_induk: item.nomor_induk || '',
      pendidikan: item.pendidikan_terakhir || '',
      kota: item.kota || '',
      provinsi: item.provinsi || '',
      alamat: parsedAlamat.alamat,
      kelurahan: parsedAlamat.kelurahan,
      kecamatan: parsedAlamat.kecamatan,
      tanggal_lahir: item.tanggal_lahir?.split('T')[0] || '',
      jenis_kelamin: item.jenis_kelamin || 'L',
      payment_type: item.payment_type || 'cash',
      sumber_tipe: item.sumber_tipe || 'sendiri',
      sumber_detail: item.sumber_detail || '',
      lembaga_id: item.lembaga_id ?? undefined,
      referrer_mitra_id: item.referrer_mitra_id ?? undefined,
      // Kolom asli (prioritas) -- baru fallback ke hasil parse blob kalau masih kosong
      pengalaman: item.pengalaman || parsedPengalaman.pengalaman,
      pengalaman_pelatihan: item.pengalaman_pelatihan || parsedPengalaman.pengalaman_pelatihan,
      tempat_lahir: item.tempat_lahir || parsedPengalaman.tempat_lahir,
      tinggi: item.tinggi_badan || parsedPengalaman.tinggi,
      berat: item.berat_badan || parsedPengalaman.berat,
      vaksin: item.vaksin || parsedPengalaman.vaksin,
      agama: item.agama || parsedPengalaman.agama,
      status_nikah: item.status_nikah || parsedPengalaman.status_nikah,
      takut_hewan: item.takut_hewan || parsedPengalaman.takut_hewan,
      bisa_memasak: normalizeMemasak(item.bisa_memasak || parsedPengalaman.bisa_memasak),
      tipe_pekerjaan: item.tipe_pekerjaan || parsedPengalaman.tipe_pekerjaan,
      suku: item.suku || parsedPengalaman.suku,
      kemampuan: (() => {
        if (Array.isArray(item.kemampuan)) return item.kemampuan;
        if (typeof item.kemampuan === 'string' && item.kemampuan.trim()) {
          try { const p = JSON.parse(item.kemampuan); if (Array.isArray(p)) return p; } catch {}
        }
        return [];
      })(),
    });
    setShowModal(true);
    setErrorMsg('');
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/internal/rekrutmen/mitra/${id}`);
      setShowDeleteConfirm(null);
      // Hapus dari local state langsung (tidak perlu tunggu fetch)
      setData(prev => prev.filter((d: any) => d.id !== id));
      // Fetch ulang untuk sinkronisasi
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menghapus data');
    }
  };

  const handleTerima = async () => {
    // price_rate sekarang opsional, akan diset setelah mitra lulus training
    if (showDetail?.payment_type === 'kredit' && (!totalBiayaInput || !cicilanInput)) {
      alert('Isi total biaya dan cicilan per job untuk metode kredit'); return;
    }
    setVerifying(true);
    try {
      await apiClient.post(`/internal/rekrutmen/mitra/${showDetail.id}/terima`, {
        price_rate: priceRateInput,
        total_biaya: totalBiayaInput || undefined,
        cicilan_per_job: cicilanInput || undefined,
      });
      alert('✅ Mitra berhasil diterima dan diaktifkan!');
      setShowDetail(null);
      setPriceRateInput('');
      setTotalBiayaInput('');
      setCicilanInput('');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal');
    } finally { setVerifying(false); }
  };

  const handleTolak = async () => {
    const catatan = prompt('Alasan penolakan (wajib diisi):');
    if (!catatan) return;
    try {
      await apiClient.post(`/internal/rekrutmen/mitra/${showDetail.id}/tolak`, { catatan_rekrutmen: catatan });
      alert('Mitra ditolak');
      setShowDetail(null);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal');
    }
  };

  // FIX: sebelumnya diketik ketat (v: string) -- Vercel build gagal begitu dipakai utk simpan
  // field baru "kemampuan" yg nilainya string[] (bukan string), lolos di local ts.transpileModule
  // karena itu cuma syntax check (bukan type-check penuh kayak next build).
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const filtered = data.filter((d: any) => {
    const matchTab = activeTab === 'semua' || d.status === activeTab;
    return matchTab && JSON.stringify(d).toLowerCase().includes(search.toLowerCase());
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  useEffect(() => { setPage(1); }, [activeTab, search]);

  const counts = {
    semua: data.length,
    pending: data.filter((d: any) => d.status === 'pending').length,
    training: data.filter((d: any) => d.status === 'training').length,
    available: data.filter((d: any) => d.status === 'available').length,
    on_job: data.filter((d: any) => d.status === 'on_job').length,
  };

  // Export tabel Data Mitra (sesuai filter tab/search aktif) ke .xlsx, biar bisa dirapikan
  // datanya di Excel lalu di-import balik lewat tombol Import.
  const handleExportMitra = () => {
    const rows = filtered.map((item: any) => {
      const row: any = {};
      EXPORT_FIELDS.forEach(f => {
        row[f.header] = f.key === 'no_hp' ? (item.user?.phone || '') : (item[f.key] ?? '');
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(rows, { header: EXPORT_FIELDS.map(f => f.header) });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Mitra');
    const stamp = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `data-mitra-${stamp}.xlsx`);
  };

  // Import file Excel yang sudah dirapikan: cocokkan tiap baris ke mitra by NIM, kolom yang
  // kosong di Excel TIDAK menimpa data yang sudah ada (lihat RekrutmenController::importXlsx).
  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const headerToKey: Record<string, string> = {};
      EXPORT_FIELDS.forEach(f => { headerToKey[f.header] = f.key; });
      const rows = json.map(r => {
        const out: any = {};
        Object.keys(r).forEach(h => {
          const key = headerToKey[h.trim()];
          if (key) out[key] = String(r[h] ?? '').trim();
        });
        return out;
      }).filter(r => r.nomor_induk);

      if (rows.length === 0) {
        alert('Tidak ada baris dengan kolom NIM terisi. Pastikan header kolom NIM tidak diubah/dihapus.');
        return;
      }
      const res: any = await apiClient.post('/internal/rekrutmen/mitra-import', { rows });
      const { updated, not_found, errors } = res.data || {};
      let msg = `Berhasil update ${updated || 0} mitra.`;
      if (not_found?.length) msg += `\n\nNIM tidak ditemukan (${not_found.length}): ${not_found.slice(0, 10).join(', ')}${not_found.length > 10 ? ', ...' : ''}`;
      if (errors?.length) msg += `\n\nError (${errors.length}): ${errors.slice(0, 5).join('; ')}`;
      alert(msg);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal import file');
    } finally {
      setImporting(false);
      if (importFileRef.current) importFileRef.current.value = '';
    }
  };

  const statusBadge = (s: string) => {
    const map: any = {
      pending:     { color:'#94a3b8', bg:'rgba(148,163,184,0.15)', border:'rgba(148,163,184,0.3)', label:'Pending',    icon: Clock },
      training:    { color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)',  label:'Training',  icon: Clock },
      available:   { color:'#10b981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)',  label:'Tersedia',  icon: CheckCircle },
      on_job:      { color:'#3b82f6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  label:'On Job',    icon: CheckCircle },
      inactive:    { color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)',   label:'Nonaktif',  icon: XCircle },
      re_training: { color:'#8b5cf6', bg:'rgba(139,92,246,0.15)', border:'rgba(139,92,246,0.3)', label:'Re-Training',icon: Clock },
    };
    return map[s] || map.pending;
  };

  const rekrutmenBadge = (s: string) => {
    const map: any = {
      pending:   { color:'#f59e0b', bg:'rgba(245,158,11,0.1)',  label:'Pending' },
      in_review: { color:'#3b82f6', bg:'rgba(59,130,246,0.1)', label:'Review' },
      verified:  { color:'#10b981', bg:'rgba(16,185,129,0.1)', label:'Diterima' },
      rejected:  { color:'#ef4444', bg:'rgba(239,68,68,0.1)',  label:'Ditolak' },
    };
    return map[s] || map.pending;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Rekrutmen Mitra</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>{data.length} total pelamar terdaftar</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
          <button onClick={handleExportMitra} title="Export tabel Data Mitra (sesuai filter/tab aktif) ke Excel"
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Download size={15} />Export Excel
          </button>
          <input ref={importFileRef} type="file" accept=".xlsx,.xls" style={{ display:'none' }} onChange={handleImportFileChange} />
          <button onClick={() => importFileRef.current?.click()} disabled={importing} title="Import Excel yang sudah dirapikan (cocokkan by NIM, kolom kosong tidak menimpa)"
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor: importing ? 'default' : 'pointer', opacity: importing ? 0.6 : 1 }}>
            <Upload size={15} />{importing ? 'Mengimpor...' : 'Import Excel'}
          </button>
          <button onClick={() => { setShowModal(true); setEditItem(null); setForm({...emptyForm}); setErrorMsg(''); setFotoUrl(''); setCvUrl(''); }}
            style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(124,58,237,0.35)' }}>
            <Plus size={15} />Tambah Pelamar
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {(['semua','pending','training','available','on_job'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'6px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer',
            background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : 'var(--glass)',
            color: activeTab === tab ? 'white' : 'var(--text2)',
            border: activeTab === tab ? 'none' : '1px solid var(--border)',
          }}>
            {tab === 'semua' ? 'Semua' : tab === 'pending' ? 'Pending' : tab === 'training' ? 'Training' : tab === 'available' ? 'Tersedia' : 'On Job'} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(16px)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
        <Search size={16} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari nama, email, kota..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      {/* Table */}
      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px' }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'750px' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['No','NIM','Nama','Email','Pendidikan','Kota','Status','Rekrutmen','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((item: any, i: number) => {
                  const badge = statusBadge(item.status);
                  const rbadge = rekrutmenBadge(item.status_rekrutmen || 'pending');
                  const Icon = badge.icon;
                  const user = item.user || item;
                  return (
                    <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{(page - 1) * perPage + i + 1}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', whiteSpace:'nowrap' }}>{item.nomor_induk || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(79,70,229,0.2))', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--purple-light)', fontSize:'13px', fontWeight:700, flexShrink:0, overflow:'hidden' }}>
                            {item.foto_url
                              ? <img src={item.foto_url} alt="foto" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                              : (item.nama_lengkap || user.name)?.[0]?.toUpperCase() || 'M'}
                          </div>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.nama_lengkap || user.name || '-'}</p>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{user.email || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'130px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.pendidikan_terakhir || '-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.kota || '-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:badge.bg, color:badge.color, border:`1px solid ${badge.border}`, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          <Icon size={11} />{badge.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 8px', borderRadius:'8px', background:rbadge.bg, color:rbadge.color }}>
                          {rbadge.label}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                          <button onClick={() => { setShowDetail(item); setPriceRateInput(item.price_rate || ''); }} title="Detail"
                            style={{ padding:'5px 8px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
                            <Eye size={13} />
                          </button>
                          <button onClick={() => handleEdit(item)} title="Edit"
                            style={{ padding:'5px 8px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => router.push(`/rekrutmen/cv/${item.id}`)} title="CV"
                            style={{ padding:'5px 8px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center', gap:'3px' }}>
                            <FileText size={13} />CV
                          </button>
                          <button onClick={() => setShowDeleteConfirm(item)} title="Hapus"
                            style={{ padding:'5px 8px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', fontSize:'12px', cursor:'pointer', display:'flex', alignItems:'center' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderTop:'1px solid var(--border)', flexWrap:'wrap', gap:'10px' }}>
            <span style={{ fontSize:'12px', color:'var(--text3)' }}>Hal {page} dari {totalPages} · {filtered.length} data</span>
            <div style={{ display:'flex', gap:'8px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding:'6px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>‹ Prev</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ padding:'6px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>Next ›</button>
            </div>
          </div>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'20px', margin:'0 auto 14px', background:'rgba(124,58,237,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Users size={28} style={{ color:'var(--purple-light)', opacity:0.5 }} />
            </div>
            <p style={{ fontWeight:600, color:'var(--text)' }}>Belum ada data pelamar</p>
          </div>
        )}
      </div>

      {/* ── DETAIL MODAL ─────────────────────────────────────── */}
      {showDetail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'520px', padding:'24px', maxHeight:'90vh', overflowY:'auto' }}>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Detail Pelamar</h2>
              <div style={{ display:'flex', gap:'6px' }}>
                <button onClick={() => { setShowDetail(null); router.push(`/rekrutmen/cv/${showDetail.id}`); }}
                  style={{ display:'flex', alignItems:'center', gap:'4px', padding:'7px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'10px', color:'#10b981', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                  <FileText size={14} />CV
                </button>
                <button onClick={() => setShowDetail(null)}
                  style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Avatar */}
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'64px', height:'64px', borderRadius:'18px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', overflow:'hidden', fontSize:'22px', fontWeight:700, color:'white' }}>
                {showDetail.foto_url
                  ? <img src={showDetail.foto_url} alt="foto" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : (showDetail.nama_lengkap || showDetail.user?.name)?.[0]?.toUpperCase() || 'M'}
              </div>
              <p style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>{showDetail.nama_lengkap || showDetail.user?.name}</p>
              <p style={{ color:'var(--text3)', fontSize:'13px' }}>{showDetail.user?.email}</p>
              <div style={{ display:'inline-flex', gap:'6px', marginTop:'6px' }}>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'6px', background: showDetail.payment_type === 'kredit' ? 'rgba(236,72,153,0.1)' : 'rgba(16,185,129,0.1)', color: showDetail.payment_type === 'kredit' ? '#ec4899' : '#10b981' }}>
                  {showDetail.payment_type === 'kredit' ? '💳 Kredit' : '💵 Cash'}
                </span>
                <span style={{ fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'6px', background: rekrutmenBadge(showDetail.status_rekrutmen || 'pending').bg, color: rekrutmenBadge(showDetail.status_rekrutmen || 'pending').color }}>
                  {rekrutmenBadge(showDetail.status_rekrutmen || 'pending').label}
                </span>
              </div>
            </div>

            {/* Data rows */}
            {[
              { label:'Telepon',    val: showDetail.user?.phone },
              { label:'CV/Dok',     val: showDetail.cv_file ? '✓ Ada' : '-' },
              { label:'NIM',        val: showDetail.nomor_induk },
              { label:'NIK',        val: showDetail.nik },
              { label:'Tgl Lahir',  val: showDetail.tanggal_lahir },
              { label:'Usia',       val: calcUsia(showDetail.tanggal_lahir) != null ? `${calcUsia(showDetail.tanggal_lahir)} tahun` : '-' },
              { label:'Kelamin',    val: showDetail.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
              { label:'Kota',       val: showDetail.kota },
              { label:'Pendidikan', val: showDetail.pendidikan_terakhir },
              { label:'Tipe Pekerjaan', val: showDetail.tipe_pekerjaan },
              { label:'Status',     val: showDetail.status },
              { label:'Pengalaman', val: showDetail.pengalaman },
            ].map(f => (
              <div key={f.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'80px', flexShrink:0 }}>{f.label}</span>
                <span style={{ color:'var(--text)', fontSize:'12px', fontWeight:500, wordBreak:'break-word' }}>{f.val || '-'}</span>
              </div>
            ))}

            {/* Status buttons */}
            <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
              {[
                { s:'training',  label:'Training',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)' },
                { s:'available', label:'Tersedia',  color:'#10b981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)' },
                { s:'inactive',  label:'Nonaktif',  color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)' },
              ].map(({ s, label, color, bg, border }) => (
                <button key={s} onClick={async () => {
                  try {
                    await apiClient.patch(`/internal/rekrutmen/mitra/${showDetail.id}`, { status: s });
                    setShowDetail({ ...showDetail, status: s });
                    fetchData();
                  } catch {}
                }} style={{ flex:1, padding:'8px', borderRadius:'10px', border:`1px solid ${border}`, background: showDetail.status === s ? bg : 'transparent', color, fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                  {label}
                </button>
              ))}
            </div>

            {/* ── VERIFIKASI REKRUTMEN ── */}
            {(showDetail.status_rekrutmen === 'pending' || showDetail.status_rekrutmen === 'in_review' || !showDetail.status_rekrutmen) && (
              <div style={{ marginTop:'16px', background:'rgba(124,58,237,0.05)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'14px', padding:'16px' }}>
                <p style={{ fontSize:'13px', fontWeight:700, color:'var(--purple-light)', marginBottom:'12px' }}>🔍 Verifikasi Rekrutmen</p>

                <div style={{ marginBottom:'10px' }}>
                  <label style={labelStyle}>Price Rate per Job (opsional, set setelah lulus training)</label>
                  <input
                    type="number"
                    value={priceRateInput}
                    onChange={e => setPriceRateInput(e.target.value)}
                    placeholder="contoh: 150000"
                    style={inputStyle}
                  />
                </div>

                {showDetail.payment_type === 'kredit' && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'10px' }}>
                    <div>
                      <label style={labelStyle}>Total Biaya Pelatihan *</label>
                      <input
                        type="number"
                        value={totalBiayaInput}
                        onChange={e => setTotalBiayaInput(e.target.value)}
                        placeholder="2000000"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Cicilan per Job *</label>
                      <input
                        type="number"
                        value={cicilanInput}
                        onChange={e => setCicilanInput(e.target.value)}
                        placeholder="50000"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                  <button
                    onClick={handleTerima}
                    disabled={verifying}
                    style={{ flex:1, padding:'10px', background:'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'10px', color:'white', fontWeight:700, fontSize:'13px', cursor: verifying ? 'not-allowed' : 'pointer', opacity: verifying ? 0.7 : 1 }}>
                    {verifying ? 'Memproses...' : '✓ Terima Mitra'}
                  </button>
                  <button
                    onClick={handleTolak}
                    style={{ flex:1, padding:'10px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'10px', color:'#ef4444', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                    ✗ Tolak
                  </button>
                </div>
              </div>
            )}

            {showDetail.status_rekrutmen === 'verified' && (
              <div style={{ marginTop:'16px', background:'rgba(16,185,129,0.05)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'14px', padding:'14px', textAlign:'center' }}>
                <CheckCircle size={28} style={{ color:'#10b981', margin:'0 auto 8px' }} />
                <p style={{ fontWeight:700, color:'#10b981', fontSize:'14px' }}>Mitra Telah Diterima</p>
                {/* Set Price Rate setelah lulus training */}
                {showDetail.status_lulus === 'lulus' && (
                  <div style={{ marginTop:'12px', padding:'12px', background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'10px' }}>
                    <p style={{ fontSize:'12px', fontWeight:700, color:'#10b981', marginBottom:'8px' }}>🏆 Mitra LULUS — Set Jabatan & Gaji</p>

                    {/* Dropdown Jabatan */}
                    <label style={{ fontSize:'11px', color:'var(--text3)', display:'block', marginBottom:'4px' }}>Jabatan</label>
                    <select
                      value={jabatanInput}
                      onChange={e => {
                        const jb = e.target.value;
                        setJabatanInput(jb);
                        const cfg = gajiConfig.find((c:any) => c.jabatan === jb);
                        if (cfg) {
                          setGajiBulananInput(String(Number(cfg.gaji_default)));
                          setPriceRateInput(String(Number(cfg.rate_harian_default)));
                        }
                      }}
                      style={{ width:'100%', padding:'8px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', outline:'none', marginBottom:'8px' }}
                    >
                      <option value="">— Pilih Jabatan —</option>
                      {gajiConfig.map((c:any) => (
                        <option key={c.jabatan} value={c.jabatan}>{c.label}</option>
                      ))}
                    </select>

                    {/* Input Gaji Bulanan */}
                    <label style={{ fontSize:'11px', color:'var(--text3)', display:'block', marginBottom:'4px' }}>Gaji Bulanan (untuk layanan live-in/kontrak)</label>
                    <input
                      type="number"
                      placeholder="Rp gaji bulanan"
                      value={gajiBulananInput}
                      onChange={e => setGajiBulananInput(e.target.value)}
                      style={{ width:'100%', padding:'8px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', outline:'none', marginBottom:'8px', boxSizing:'border-box' }}
                    />

                    {/* Input Price Rate Harian */}
                    <label style={{ fontSize:'11px', color:'var(--text3)', display:'block', marginBottom:'4px' }}>Tarif Harian (untuk layanan harian)</label>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <input
                        type="number"
                        placeholder="Rp per hari"
                        value={priceRateInput}
                        onChange={e => setPriceRateInput(e.target.value)}
                        style={{ flex:1, padding:'8px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', outline:'none' }}
                      />
                      <button onClick={async () => {
                        if (!priceRateInput || Number(priceRateInput) <= 0) { alert('Isi tarif harian dengan angka valid'); return; }
                        try {
                          await apiClient.post(`/internal/rekrutmen/mitra/${showDetail.id}/price-rate`, {
                            price_rate: priceRateInput,
                            jabatan: jabatanInput,
                            gaji_bulanan: gajiBulananInput,
                          });
                          alert('✅ Jabatan & gaji berhasil di-set! Mitra siap menerima job.');
                          fetchData();
                          setShowDetail(null);
                        } catch (e: any) {
                          alert('Error: ' + (e?.response?.data?.message || 'Gagal'));
                        }
                      }} style={{ background:'#10b981', border:'none', borderRadius:'8px', padding:'8px 14px', color:'white', fontWeight:700, fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap' }}>
                        Set Gaji
                      </button>
                    </div>
                  </div>
                )}
                {showDetail.status_lulus === 'training' && !showDetail.price_rate && (
                  <p style={{ fontSize:'11px', color:'var(--text3)', marginTop:'8px' }}>
                    ⏳ Menunggu mitra menyelesaikan training (price rate akan di-set setelah lulus)
                  </p>
                )}
                {showDetail.status_lulus === 'tidak_lulus' && (
                  <p style={{ fontSize:'11px', color:'#ef4444', marginTop:'8px', fontWeight:600 }}>
                    ❌ Mitra tidak lulus training — perlu re-training
                  </p>
                )}
                {showDetail.price_rate && (
                  <p style={{ fontSize:'12px', color:'var(--text3)', marginTop:'4px' }}>
                    Rate: Rp {Number(showDetail.price_rate).toLocaleString('id-ID')}/job
                  </p>
                )}
              </div>
            )}

            {showDetail.status_rekrutmen === 'rejected' && (
              <div style={{ marginTop:'16px', background:'rgba(239,68,68,0.05)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'14px', padding:'14px' }}>
                <p style={{ fontWeight:700, color:'#ef4444', fontSize:'13px', marginBottom:'4px' }}>✗ Ditolak</p>
                {showDetail.catatan_rekrutmen && (
                  <p style={{ fontSize:'12px', color:'var(--text3)' }}>{showDetail.catatan_rekrutmen}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {showDeleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'20px', padding:'24px', maxWidth:'360px', width:'100%', textAlign:'center' }}>
            <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'rgba(239,68,68,0.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <Trash2 size={24} style={{ color:'#ef4444' }} />
            </div>
            <h3 style={{ fontSize:'16px', fontWeight:700, color:'var(--text)', marginBottom:'8px' }}>Hapus Data Mitra?</h3>
            <p style={{ fontSize:'13px', color:'var(--text3)', marginBottom:'20px' }}>
              Data <strong>{showDeleteConfirm.nama_lengkap || showDeleteConfirm.user?.name}</strong> akan dinonaktifkan.
            </p>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
              <button onClick={() => handleDelete(showDeleteConfirm.id)} style={{ flex:1, padding:'10px', background:'linear-gradient(135deg, #ef4444, #dc2626)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT FORM MODAL ── */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, overflowY:'auto', padding:'20px' }} onClick={e => { if(e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'700px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
              <div>
                <h2 style={{ fontSize:'18px', fontWeight:700, color:'var(--text)' }}>{editItem ? 'Edit Data Mitra' : 'Form Pendaftaran Mitra'}</h2>
                <p style={{ color:'var(--text3)', fontSize:'13px' }}>Isi data pelamar dengan lengkap dan benar</p>
              </div>
              <button onClick={() => { setShowModal(false); setEditItem(null); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}>
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'12px', padding:'12px 16px', marginBottom:'16px', color:'#ef4444', fontSize:'13px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Akun */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>🔐 Data Akun</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Email {!editItem && '*'}</label>
                    <input required={!editItem} type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="email@contoh.com" disabled={!!editItem} />
                  </div>
                  {!editItem && (
                    <div>
                      <label style={labelStyle}>Password *</label>
                      <input required type="password" value={form.password} onChange={e => set('password', e.target.value)} style={inputStyle} placeholder="Min. 8 karakter" minLength={8} />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Nomor HP *</label>
                    <input required value={form.phone} onChange={e => set('phone', e.target.value)} style={inputStyle} placeholder="08xxxxxxxxxx" />
                  </div>
                </div>
              </div>

              {/* Biaya Pelatihan */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💳 Biaya Pelatihan</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <button type="button" onClick={() => set('payment_type','cash')}
                    style={{ padding:'14px', borderRadius:'12px', border:`2px solid ${form.payment_type==='cash'?'#10b981':'var(--border)'}`, background: form.payment_type==='cash'?'rgba(16,185,129,0.08)':'transparent', cursor:'pointer', textAlign:'left' as const }}>
                    <p style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>💵 Cash</p>
                    <p style={{ fontSize:'11px', color:'var(--text3)' }}>Bayar penuh sebelum mulai</p>
                  </button>
                  <button type="button" onClick={() => set('payment_type','kredit')}
                    style={{ padding:'14px', borderRadius:'12px', border:`2px solid ${form.payment_type==='kredit'?'#ec4899':'var(--border)'}`, background: form.payment_type==='kredit'?'rgba(236,72,153,0.08)':'transparent', cursor:'pointer', textAlign:'left' as const }}>
                    <p style={{ fontSize:'14px', fontWeight:700, color:'var(--text)', marginBottom:'4px' }}>💳 Kredit</p>
                    <p style={{ fontSize:'11px', color:'var(--text3)' }}>Cicil dari pendapatan job</p>
                  </button>
                </div>
                {form.payment_type === 'kredit' && (
                  <div style={{ marginTop:'10px', background:'rgba(236,72,153,0.06)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'10px', padding:'10px 12px', fontSize:'12px', color:'#ec4899' }}>
                    ℹ️ Besaran cicilan per-job akan ditentukan oleh Rekrutmen saat verifikasi.
                  </div>
                )}
              </div>

              {/* Sumber Informasi */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>📡 Tahu Mikala dari</p>
                <SumberInline form={form} setForm={setForm} />
              </div>

              {/* Data Pribadi */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>📋 Data Pribadi</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div style={{ gridColumn:'1/-1' }}>
                    <label style={labelStyle}>Nama Lengkap (sesuai KTP) *</label>
                    <input required value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} />
                  </div>
                  <div><label style={labelStyle}>NIK *</label><input required value={form.nik} onChange={e => set('nik', e.target.value)} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>NIM {editItem ? '' : '(kosongkan = auto-generate)'}</label>
                    <input value={form.nomor_induk||''} onChange={e => set('nomor_induk', e.target.value)} placeholder="mis. CG.03.26-001" style={inputStyle} />
                  </div>
                  <div><label style={labelStyle}>Tempat Lahir *</label><input required value={form.tempat_lahir} onChange={e => set('tempat_lahir', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Tanggal Lahir *</label><input required type="date" value={form.tanggal_lahir} onChange={e => set('tanggal_lahir', e.target.value)} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>Usia (otomatis dari Tanggal Lahir)</label>
                    <input readOnly value={calcUsia(form.tanggal_lahir) ?? ''} placeholder="-- isi Tanggal Lahir --" style={{ ...inputStyle, opacity:0.75, cursor:'not-allowed' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Jenis Kelamin *</label>
                    <select value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)} style={inputStyle}>
                      <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Status Pernikahan</label>
                    <select value={form.status_nikah} onChange={e => set('status_nikah', e.target.value)} style={inputStyle}>
                      <option>Menikah</option><option>Belum Menikah</option>
                    </select>
                  </div>
                  <div style={{ gridColumn:'1/-1' }}><label style={labelStyle}>Alamat *</label><input required value={form.alamat} onChange={e => set('alamat', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Kelurahan</label><input value={form.kelurahan} onChange={e => set('kelurahan', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Kecamatan</label><input value={form.kecamatan} onChange={e => set('kecamatan', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Kota *</label><input required value={form.kota} onChange={e => set('kota', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Provinsi *</label><input required value={form.provinsi} onChange={e => set('provinsi', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Suku</label><input value={form.suku} onChange={e => set('suku', e.target.value)} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>Agama *</label>
                    <select value={form.agama} onChange={e => set('agama', e.target.value)} style={inputStyle}>
                      {AGAMA.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Data Fisik */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💪 Data Fisik</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div><label style={labelStyle}>Tinggi (cm) *</label><input required type="number" value={form.tinggi} onChange={e => set('tinggi', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Berat (kg) *</label><input required type="number" value={form.berat} onChange={e => set('berat', e.target.value)} style={inputStyle} /></div>
                  <div><label style={labelStyle}>Vaksin *</label><input required value={form.vaksin} onChange={e => set('vaksin', e.target.value)} style={inputStyle} /></div>
                  <div>
                    <label style={labelStyle}>Takut Hewan *</label>
                    <select value={form.takut_hewan} onChange={e => set('takut_hewan', e.target.value)} style={inputStyle}>
                      {HEWAN.map(h => <option key={h}>{h}</option>)}
                    </select>
                  </div>
                  <div>
                    {/* FIX: sebelumnya dropdown 1-5 (skala kemampuan) padahal yg dibutuhin cuma
                        biner bisa/gak -- diganti dropdown 2 opsi biar konsisten sama gimana CV
                        (rekrutmen/cv/[id]/page.tsx) & role mitra (apps/mitra, apps/mitra-expo)
                        nampilinnya sekarang: "Bisa" / "Tidak Bisa" (bukan skor angka lagi). */}
                    <label style={labelStyle}>Kemampuan Memasak</label>
                    <select value={form.bisa_memasak} onChange={e => set('bisa_memasak', e.target.value)} style={inputStyle}>
                      <option value="Bisa">Bisa</option>
                      <option value="Tidak Bisa">Tidak Bisa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pendidikan -- FIX: field "Pelatihan / Pendidikan non-formal" digeser ke sini
                  (di bawah Pendidikan Terakhir), sebelumnya nyempil di grup "Pengalaman" yg
                  harusnya cuma isi Pengalaman Kerja/Magang aja. */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>🎓 Pendidikan & Pekerjaan</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Pendidikan Terakhir *</label>
                    <select required value={form.pendidikan} onChange={e => set('pendidikan', e.target.value)} style={inputStyle}>
                      <option value="">-- Pilih --</option>
                      {PENDIDIKAN.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Pelatihan / Pendidikan non-formal *</label>
                    <textarea required value={form.pengalaman_pelatihan} onChange={e => set('pengalaman_pelatihan', e.target.value)} style={{ ...inputStyle, minHeight:'70px', resize:'vertical' }} placeholder="Tulis pelatihan, atau 'Tidak ada'" />
                  </div>
                  <div>
                    <label style={labelStyle}>Tipe Pekerjaan *</label>
                    <select value={form.tipe_pekerjaan} onChange={e => set('tipe_pekerjaan', e.target.value)} style={inputStyle}>
                      {TIPE_PEKERJAAN.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Upload */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>📎 Foto & Dokumen</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Foto Profil</label>
                    {fotoUrl && <img src={fotoUrl} alt="foto" style={{ width:'72px', height:'72px', borderRadius:'10px', objectFit:'cover', marginBottom:'8px', display:'block' }} />}
                    <input type="file" accept="image/*" onChange={e => { if(e.target.files?.[0]) { setCropSrcFile(e.target.files[0]); e.target.value = ''; } }} style={{ display:'none' }} id="upload-foto" />
                    <label htmlFor="upload-foto" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'7px 14px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.3)', borderRadius:'10px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer', fontWeight:600 }}>
                      {uploadingFoto ? 'Uploading...' : fotoUrl ? '✓ Ganti Foto' : '+ Upload Foto'}
                    </label>
                  </div>
                  <div>
                    <label style={labelStyle}>CV / Dokumen</label>
                    {cvUrl && <a href={cvUrl} target="_blank" rel="noreferrer" style={{ display:'block', color:'#10b981', fontSize:'12px', marginBottom:'8px' }}>✓ Lihat CV</a>}
                    <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={e => { if(e.target.files?.[0]) handleUpload(e.target.files[0],'mitra/cv',setCvUrl,setUploadingCV); }} style={{ display:'none' }} id="upload-cv" />
                    <label htmlFor="upload-cv" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'7px 14px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'10px', color:'#10b981', fontSize:'12px', cursor:'pointer', fontWeight:600 }}>
                      {uploadingCV ? 'Uploading...' : cvUrl ? '✓ Ganti CV' : '+ Upload CV'}
                    </label>
                  </div>
                </div>
              </div>

              {cropSrcFile && (
                <PhotoCropModal
                  file={cropSrcFile}
                  onCancel={() => setCropSrcFile(null)}
                  onConfirm={(blob) => {
                    setCropSrcFile(null);
                    const cropped = new File([blob], 'foto-crop.jpg', { type: 'image/jpeg' });
                    handleUpload(cropped, 'mitra/foto', setFotoUrl, setUploadingFoto);
                  }}
                />
              )}

              {/* Pengalaman */}
              <div style={sectionStyle}>
                <p style={{ fontWeight:700, color:'var(--purple-light)', fontSize:'13px', marginBottom:'14px' }}>💼 Pengalaman</p>
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <div>
                    <label style={labelStyle}>Pengalaman Kerja / Magang *</label>
                    <textarea required value={form.pengalaman} onChange={e => set('pengalaman', e.target.value)} style={{ ...inputStyle, minHeight:'70px', resize:'vertical' }} placeholder="Tulis pengalaman, atau 'Tidak ada'" />
                  </div>
                  <div>
                    <label style={labelStyle}>Kemampuan Khusus (opsional)</label>
                    <KemampuanTagInput value={form.kemampuan} onChange={(v: string[]) => set('kemampuan', v)} />
                  </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:'10px', justifyContent:'flex-end' }}>
                <button type="button" onClick={() => { setShowModal(false); setEditItem(null); }} style={{ padding:'10px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={saving} style={{ padding:'10px 24px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Menyimpan...' : editItem ? 'Update Data' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── KREDENSIAL MODAL ── */}
      {showKredensial && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--card)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'400px' }}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #10b981, #059669)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:'24px' }}>✓</div>
              <h3 style={{ fontWeight:700, fontSize:'18px', color:'var(--text)' }}>Mitra Berhasil Didaftarkan!</h3>
              <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'4px' }}>Simpan kredensial login berikut</p>
            </div>
            <div style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'16px' }}>
              {[{ label:'Nama', val: showKredensial.name }, { label:'Email', val: showKredensial.email }, { label:'Password', val: showKredensial.password }].map(f => (
                <div key={f.label} style={{ marginBottom:'10px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{f.label}</p>
                  <p style={{ color: f.label==='Password'?'#10b981':'var(--text)', fontSize: f.label==='Password'?'18px':'14px', fontWeight:700, letterSpacing: f.label==='Password'?'2px':'normal' }}>{f.val}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', marginBottom:'16px' }}>
              <p style={{ color:'#f59e0b', fontSize:'12px' }}>⚠️ Catat dan bagikan ke mitra. Password tidak bisa dilihat lagi.</p>
            </div>
            <button onClick={() => setShowKredensial(null)} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              Sudah Dicatat, Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
