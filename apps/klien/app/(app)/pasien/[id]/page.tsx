'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, User, Phone, MapPin, Heart, AlertCircle, FileText } from 'lucide-react';

export default function DetailPasienPage() {
  const params = useParams();
  const router = useRouter();
  const [pasien, setPasien] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/klien/pasien')
      .then((r: any) => {
        const d = r.data?.data;
        const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
        const found = list.find((p: any) => String(p.id) === String(params.id));
        setPasien(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'400px' }}>
      <p style={{ color:'var(--text3)' }}>Memuat data...</p>
    </div>
  );

  if (!pasien) return (
    <div style={{ textAlign:'center', padding:'40px' }}>
      <p style={{ color:'var(--text3)' }}>Data pasien tidak ditemukan</p>
      <button onClick={() => router.back()} style={{ marginTop:'16px', padding:'8px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text2)', cursor:'pointer' }}>Kembali</button>
    </div>
  );

  const usia = pasien.tanggal_lahir ? new Date().getFullYear() - new Date(pasien.tanggal_lahir).getFullYear() : null;
  const tglLahir = pasien.tanggal_lahir ? new Date(pasien.tanggal_lahir).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' }) : '-';

  return (
    <div style={{ padding:'16px', paddingBottom:'80px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px', paddingTop:'8px' }}>
        <button onClick={() => router.back()} style={{ width:'36px', height:'36px', borderRadius:'12px', background:'var(--glass)', border:'1px solid var(--border)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text2)' }}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Detail Pasien</h1>
      </div>

      {/* Avatar */}
      <div style={{ background:'linear-gradient(135deg, #10b981, #059669)', borderRadius:'20px', padding:'24px', textAlign:'center', marginBottom:'16px', boxShadow:'0 8px 24px rgba(16,185,129,0.4)' }}>
        <div style={{ width:'64px', height:'64px', borderRadius:'20px', margin:'0 auto 12px', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', fontWeight:700, color:'white' }}>
          {pasien.nama_lengkap?.[0]?.toUpperCase() || 'P'}
        </div>
        <h2 style={{ color:'white', fontWeight:700, fontSize:'18px' }}>{pasien.nama_lengkap}</h2>
        <p style={{ color:'rgba(255,255,255,0.8)', fontSize:'13px', marginTop:'4px' }}>
          {pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} {usia ? `• ${usia} tahun` : ''}
        </p>
      </div>

      {/* Data Pribadi */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', marginBottom:'12px' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Data Pribadi</p>
        </div>
        {[
          { icon: User, label:'Nama Lengkap', value: pasien.nama_lengkap },
          { icon: User, label:'Tanggal Lahir', value: tglLahir },
          { icon: User, label:'Jenis Kelamin', value: pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
          { icon: MapPin, label:'Alamat', value: pasien.alamat },
          { icon: User, label:'Golongan Darah', value: pasien.golongan_darah || '-' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(16,185,129,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} style={{ color:'#10b981' }} />
              </div>
              <div>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Medis */}
      <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', marginBottom:'12px' }}>
        <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
          <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Riwayat Medis</p>
        </div>
        {[
          { icon: Heart, label:'Riwayat Penyakit', value: pasien.riwayat_penyakit },
          { icon: AlertCircle, label:'Alergi', value: pasien.alergi },
          { icon: FileText, label:'Obat Rutin', value: pasien.obat_rutin },
          { icon: FileText, label:'Catatan Khusus', value: pasien.catatan_khusus },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(239,68,68,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Icon size={15} style={{ color:'#ef4444' }} />
              </div>
              <div>
                <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kontak Darurat */}
      {pasien.kontak_darurat_nama && (
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--border)' }}>
            <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Kontak Darurat</p>
          </div>
          {[
            { icon: User, label:'Nama', value: pasien.kontak_darurat_nama },
            { icon: Phone, label:'Nomor HP', value: pasien.kontak_darurat_phone },
            { icon: User, label:'Relasi', value: pasien.kontak_darurat_relasi },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} style={{ display:'flex', gap:'12px', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'rgba(59,130,246,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Icon size={15} style={{ color:'#3b82f6' }} />
                </div>
                <div>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:500 }}>{item.value || '-'}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
