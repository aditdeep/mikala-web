'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, authService } from '@mikala/lib';
import { User, Phone, Mail, LogOut, Shield, Edit2, Save, X, MapPin, CreditCard, Home } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mitra, setMitra] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<any>({});
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoUrl, setFotoUrl] = useState('');
  // FIX: foto sebelumnya langsung diupload apa adanya begitu dipilih -- sekarang mampir dulu ke
  // modal crop (PhotoCropModal) supaya mitra bisa pilih area fokus (mis. wajah vs seluruh badan).
  const [cropSrcFile, setCropSrcFile] = useState<File | null>(null);

  useEffect(() => {
    const u = authService.getUser();
    setUser(u);
    apiClient.get('/mitra/profile')
      .then((r: any) => {
        const data = r.data?.data;
        const m = data?.mitra || data?.profile || data;
        setMitra(m);
        setFotoUrl(m?.foto_url || '');
        setForm({
          phone:        u?.phone || '',
          alamat:       m?.alamat || '',
          kota:         m?.kota || '',
          provinsi:     m?.provinsi || '',
          bank_name:    m?.bank_name || '',
          bank_account: m?.bank_account || '',
          bank_account_name: m?.bank_account_name || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await apiClient.patch('/mitra/profile', { ...form, foto_url: fotoUrl });
      const r: any = await apiClient.get('/mitra/profile');
      const data = r.data?.data;
      setMitra(data?.mitra || data?.profile || data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally { setSaving(false); }
  };

  const handleUploadFoto = async (file: File) => {
    setUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'mitra/foto');
      const res: any = await apiClient.post('/mitra/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setFotoUrl(res.data.url);
        await apiClient.patch('/mitra/profile', { foto_url: res.data.url });
      }
    } catch (err: any) {
      alert('Upload gagal: ' + (err.response?.data?.message || err.message));
    } finally { setUploadingFoto(false); }
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push('/auth/login');
  };

  const set = (k: string, v: string) => setForm((p: any) => ({...p, [k]: v}));
  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase() || 'M';
  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text-primary)', fontSize:'13px', outline:'none' };

  const cardStyle: React.CSSProperties = {
    background:'var(--glass)', backdropFilter:'blur(20px)',
    border:'1px solid var(--glass-border)', borderRadius:'24px', overflow:'hidden',
  };

  return (
    <div className="p-4 pt-6 space-y-4" style={{ paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'16px' }}>
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Profil</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'12px', color:'var(--purple-light)', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
            <Edit2 size={14} />Edit
          </button>
        ) : (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => setEditing(false)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text-muted)', fontSize:'13px', cursor:'pointer' }}>
              <X size={14} />Batal
            </button>
            <button onClick={handleSave} disabled={saving} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontSize:'13px', fontWeight:600, cursor:'pointer' }}>
              <Save size={14} />{saving ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan'}
            </button>
          </div>
        )}
      </div>

      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', padding:'10px 14px', color:'#ef4444', fontSize:'13px' }}>{error}</div>}

      {/* Avatar Card */}
      <div style={{ background:'linear-gradient(135deg, #7c3aed 0%, #4f46e5 60%, #ec4899 100%)', borderRadius:'24px', padding:'28px', textAlign:'center', boxShadow:'0 8px 32px rgba(124,58,237,0.4)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'relative', width:'80px', height:'80px', margin:'0 auto 16px' }}>
          {fotoUrl ? (
            <img src={fotoUrl} alt="foto" style={{ width:'80px', height:'80px', borderRadius:'24px', objectFit:'cover', border:'2px solid rgba(255,255,255,0.4)' }} />
          ) : (
            <div style={{ width:'80px', height:'80px', borderRadius:'24px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', fontWeight:700, color:'white', border:'2px solid rgba(255,255,255,0.4)' }}>
              {initials}
            </div>
          )}
          <input type="file" accept="image/*" id="upload-foto-profil" style={{ display:'none' }}
            onChange={e => { if(e.target.files?.[0]) { setCropSrcFile(e.target.files[0]); e.target.value = ''; } }} />
          <label htmlFor="upload-foto-profil" style={{ position:'absolute', bottom:'-4px', right:'-4px', width:'24px', height:'24px', borderRadius:'8px', background:'white', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
            {uploadingFoto ? '⏳' : '📷'}
          </label>
        </div>
        <h2 className="text-white text-xl font-bold">{user?.name || 'Mitra'}</h2>
        <p className="text-purple-200 text-sm mt-1">{user?.email || ''}</p>
        <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', marginTop:'12px', background:'rgba(255,255,255,0.15)', borderRadius:'10px', padding:'6px 14px' }}>
          <Shield size={13} color="white" />
          <span className="text-white text-xs font-medium">{mitra?.status || 'Mitra'}</span>
        </div>
      </div>

      {cropSrcFile && (
        <PhotoCropModal
          file={cropSrcFile}
          onCancel={() => setCropSrcFile(null)}
          onConfirm={(blob) => {
            setCropSrcFile(null);
            const cropped = new File([blob], 'foto-crop.jpg', { type: 'image/jpeg' });
            handleUploadFoto(cropped);
          }}
        />
      )}

      {/* Info Pribadi */}
      <div style={cardStyle}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>Informasi Pribadi</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {/* Read only */}
          {[
            { icon: User, label:'Nama Lengkap', value: user?.name },
            { icon: Mail, label:'Email', value: user?.email },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'var(--purple-light)' }} />
                </div>
                <div>
                  <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p>
                </div>
              </div>
            );
          })}
          {/* Editable */}
          {[
            { key:'phone', icon: Phone, label:'Nomor HP' },
            { key:'alamat', icon: MapPin, label:'Alamat' },
            { key:'kota', icon: Home, label:'Kota' },
            { key:'provinsi', icon: MapPin, label:'Provinsi' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'var(--purple-light)' }} />
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                  {editing ? (
                    <input value={form[item.key] || ''} onChange={e => set(item.key, e.target.value)} style={inp} />
                  ) : (
                    <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{form[item.key] || '-'}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Mitra */}
      <div style={cardStyle}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>Data Mitra</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { icon: User, label:'NIK', value: mitra?.nik },
            { icon: User, label:'Jenis Kelamin', value: mitra?.jenis_kelamin === 'L' ? 'Laki-laki' : mitra?.jenis_kelamin === 'P' ? 'Perempuan' : '-' },
            { icon: User, label:'Pendidikan Terakhir', value: mitra?.pendidikan_terakhir },
            { icon: Shield, label:'Status', value: mitra?.status },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'var(--purple-light)' }} />
                </div>
                <div>
                  <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500, textTransform:'capitalize' }}>{item.value || '-'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Bank */}
      <div style={cardStyle}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text-primary)' }}>Info Bank</p>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'12px' }}>
          {[
            { key:'bank_name', label:'Nama Bank' },
            { key:'bank_account', label:'No. Rekening' },
            { key:'bank_account_name', label:'Atas Nama' },
          ].map(item => (
            <div key={item.key} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:'rgba(124,58,237,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <CreditCard size={15} style={{ color:'var(--purple-light)' }} />
              </div>
              <div style={{ flex:1 }}>
                <p style={{ color:'var(--text-muted)', fontSize:'11px' }}>{item.label}</p>
                {editing ? (
                  <input value={form[item.key] || ''} onChange={e => set(item.key, e.target.value)} style={inp} />
                ) : (
                  <p style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500 }}>{form[item.key] || '-'}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} style={{ width:'100%', padding:'15px', borderRadius:'16px', cursor:'pointer', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', color:'#ef4444', fontWeight:600, fontSize:'15px' }}>
        <LogOut size={18} />Keluar
      </button>
    </div>
  );
}

// ── PhotoCropModal -- crop foto profil sebelum diupload (pilih area fokus, mis. badan/kepala) ──
// Implementasi manual (drag + zoom di atas canvas), tanpa library eksternal.
function PhotoCropModal({ file, onCancel, onConfirm }: { file: File; onCancel: () => void; onConfirm: (blob: Blob) => void }) {
  const FRAME = 260; // ukuran area crop (persegi) di layar, px
  const OUTPUT = 600; // ukuran output foto hasil crop, px
  const [imgSrc, setImgSrc] = useState('');
  const [natSize, setNatSize] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; offX: number; offY: number } | null>(null);

  useEffect(() => {
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

  const onImgLoad = (e: any) => {
    const img = e.currentTarget;
    const w = img.naturalWidth, h = img.naturalHeight;
    setNatSize({ w, h });
    const bs = Math.max(FRAME / w, FRAME / h);
    setOffset({ x: (FRAME - w * bs) / 2, y: (FRAME - h * bs) / 2 });
  };

  const onPointerDown = (e: any) => {
    e.target.setPointerCapture?.(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, offX: offset.x, offY: offset.y };
  };
  const onPointerMove = (e: any) => {
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
      <div style={{ background:'var(--bg)', borderRadius:'20px', padding:'24px', width:'100%', maxWidth:'340px', textAlign:'center', border:'1px solid var(--border)' }}>
        <h3 style={{ color:'var(--text-primary)', fontWeight:700, fontSize:'16px', marginBottom:'4px' }}>Atur Area Foto</h3>
        <p style={{ color:'var(--text-muted)', fontSize:'12px', marginBottom:'14px' }}>Geser & zoom untuk pilih area fokus</p>
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
              // FIX: Tailwind preflight "img { max-width:100%; height:auto }" nge-cap lebar foto
              // max sebesar frame berapa pun zoom-nya -- override eksplisit biar dua dimensi
              // ke-scale proporsional (sebelumnya kelihatan "zoom cuma vertikal").
              style={{ position:'absolute', left:offset.x, top:offset.y, width:dispW || undefined, height:dispH || undefined, maxWidth:'none', maxHeight:'none', userSelect:'none', pointerEvents:'none' } as any}
              alt="crop-preview"
            />
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginTop:'16px' }}>
          <span style={{ color:'var(--text-muted)', fontSize:'11px' }}>Zoom</span>
          <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={e => onZoomChange(parseFloat(e.target.value))} style={{ flex:1 }} />
        </div>
        <div style={{ display:'flex', gap:'10px', justifyContent:'center', marginTop:'20px' }}>
          <button type="button" onClick={onCancel} style={{ padding:'10px 20px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text-muted)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
          <button type="button" onClick={confirm} disabled={!natSize.w} style={{ padding:'10px 24px', background:'linear-gradient(135deg, #7c3aed, #4f46e5)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor: natSize.w ? 'pointer' : 'not-allowed', opacity: natSize.w ? 1 : 0.6 }}>Pakai Foto Ini</button>
        </div>
      </div>
    </div>
  );
}
