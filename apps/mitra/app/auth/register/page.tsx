'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ChevronLeft, ChevronRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

// ── Constants ──────────────────────────────────────────────
const PENDIDIKAN = [
  'SMA Negeri / Swasta','SMK / Sekolah Kejuruan Kesehatan','SMK / Sekolah Kejuruan Lainnya',
  'Diploma D1/D2/D3 Kesehatan','Diploma D1/D2/D3 Lainnya',
  'Sarjana S1 Kesehatan','Sarjana S1 Keperawatan','Profesi Nurse','Sarjana S1 Lainnya',
];
const TIPE_PEKERJAAN = [
  'Perawat Homecare','Perawat Lansia / Caregiver','Babysitter',
  'Babysitter New Born Care','Perawat Jiwa','Caregiver / Kaigo (Jepang)',
];
const AGAMA = ['Islam','Kristen Protestan','Kristen Katolik','Hindu','Budha','Konghucu'];

const ISI_KONTRAK = `PERJANJIAN KERJASAMA MITRA
MIKALA GLOBAL MEDIKA

Dengan mendaftar sebagai Mitra Mikala Global Medika ("Mikala"), saya menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan berikut:

PASAL 1 – HUBUNGAN KERJA
Mitra merupakan tenaga kerja independen (bukan karyawan tetap) yang bekerja sama dengan Mikala berdasarkan sistem penugasan per-job.

PASAL 2 – KEWAJIBAN MITRA
1. Menyelesaikan pelatihan wajib yang ditetapkan Mikala sebelum menerima penugasan.
2. Menjaga standar pelayanan dan profesionalisme kepada klien.
3. Melaporkan setiap insiden kepada koordinator Mikala.
4. Tidak mengambil kontak klien secara langsung di luar sistem Mikala.
5. Menjaga kerahasiaan data klien dan informasi internal Mikala.

PASAL 3 – BIAYA PELATIHAN
Mitra wajib mengikuti program pelatihan Mikala. Biaya pelatihan dapat dibayarkan secara:
a) CASH: Dibayar penuh sebelum memulai penugasan pertama.
b) KREDIT: Dicicil dengan sistem potongan otomatis dari setiap pendapatan job yang diterima, sesuai skema yang disepakati bersama Divisi Rekrutmen.

PASAL 4 – PENGHASILAN & PEMBAYARAN
Penghasilan dihitung berdasarkan jumlah job yang diselesaikan dikali rate yang telah ditetapkan. Pembayaran dilakukan melalui transfer bank setiap periode yang ditentukan Mikala.

PASAL 5 – PEMUTUSAN KERJASAMA
Mikala berhak memutus kerjasama apabila Mitra melanggar kode etik, tidak memenuhi kewajiban, atau melakukan tindakan yang merugikan Mikala atau klien.

PASAL 6 – PERSETUJUAN
Dengan mencentang kotak persetujuan, Mitra dianggap telah membaca seluruh isi perjanjian dan menyetujuinya secara elektronik.

Mikala Global Medika
Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi
Telp: 0821-1448-8878 | rekrutmen@mikalaglobalmedika.com`;

// ── Styles ──────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '12px', color: 'white',
  fontSize: '14px', outline: 'none',
  boxSizing: 'border-box' as const,
};
const lbl: React.CSSProperties = {
  fontSize: '12px', fontWeight: 600,
  color: 'rgba(255,255,255,0.6)',
  display: 'block', marginBottom: '6px',
};
const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '16px', padding: '16px', marginBottom: '14px',
};

const STEPS = ['Akun', 'Data Diri', 'Keahlian', 'Pembayaran', 'Kontrak'];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [contractScrolled, setContractScrolled] = useState(false);

  const [form, setForm] = useState({
    // Step 0 - Akun
    name: '', email: '', password: '', phone: '',
    // Step 1 - Data Diri
    nik: '', tanggal_lahir: '', jenis_kelamin: 'P',
    alamat: '', kota: '', provinsi: '',
    status_nikah: 'Belum Menikah', agama: 'Islam',
    tinggi: '', berat: '',
    // Step 2 - Keahlian
    pendidikan: '', tipe_pekerjaan: 'Perawat Homecare',
    pengalaman_pelatihan: '', pengalaman: '',
    vaksin: '',
    // Step 3 - Pembayaran
    payment_type: 'cash' as 'cash' | 'kredit',
    // Step 4 - Kontrak
    contract_agreed: false,
  });

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const nextStep = () => {
    setError('');
    // Validasi per step
    if (step === 0) {
      if (!form.name || !form.email || !form.password || !form.phone) {
        setError('Semua field wajib diisi'); return;
      }
      if (form.password.length < 8) { setError('Password minimal 8 karakter'); return; }
    }
    if (step === 1) {
      if (!form.nik || !form.tanggal_lahir || !form.alamat || !form.kota) {
        setError('Semua field wajib diisi'); return;
      }
    }
    if (step === 2) {
      if (!form.pendidikan || !form.pengalaman_pelatihan || !form.pengalaman) {
        setError('Semua field wajib diisi'); return;
      }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!form.contract_agreed) { setError('Anda harus menyetujui kontrak terlebih dahulu'); return; }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/mitra/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        nik: form.nik,
        tanggal_lahir: form.tanggal_lahir,
        jenis_kelamin: form.jenis_kelamin,
        alamat: form.alamat,
        kota: form.kota,
        provinsi: form.provinsi,
        pendidikan: form.pendidikan,
        tipe_pekerjaan: form.tipe_pekerjaan,
        pengalaman: `PELATIHAN: ${form.pengalaman_pelatihan}\nPENGALAMAN: ${form.pengalaman}`,
        vaksin: form.vaksin,
        tinggi: form.tinggi,
        berat: form.berat,
        payment_type: form.payment_type,
        contract_agreed: true,
      });
      router.push('/auth/register/success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pendaftaran gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px', boxSizing: 'border-box' as const,
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png"
          alt="Mikala" style={{ height: '40px', marginBottom: '8px' }} />
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Pendaftaran Mitra</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '28px', width: '100%', maxWidth: '400px' }}>
        {STEPS.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 0 }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
              background: i < step ? '#7c3aed' : i === step ? 'white' : 'rgba(255,255,255,0.1)',
              color: i < step ? 'white' : i === step ? '#302b63' : 'rgba(255,255,255,0.4)',
            }}>
              {i < step ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: '2px', background: i < step ? '#7c3aed' : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '420px',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '20px', padding: '24px',
      }}>
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>
          {STEPS[step]}
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>
          Langkah {step + 1} dari {STEPS.length}
        </p>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* ── STEP 0: Akun ─────────────────────────────── */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>Nama Lengkap *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} style={inp} placeholder="Sesuai KTP" />
            </div>
            <div>
              <label style={lbl}>Email *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} style={inp} placeholder="email@contoh.com" />
            </div>
            <div>
              <label style={lbl}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} style={{ ...inp, paddingRight: '44px' }} placeholder="Min. 8 karakter" />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label style={lbl}>Nomor HP *</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} style={inp} placeholder="08xxxxxxxxxx" />
            </div>
          </div>
        )}

        {/* ── STEP 1: Data Diri ─────────────────────── */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>NIK (16 digit) *</label>
              <input value={form.nik} onChange={e => set('nik', e.target.value)} style={inp} placeholder="1234567890123456" maxLength={16} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Tanggal Lahir *</label>
                <input type="date" value={form.tanggal_lahir} onChange={e => set('tanggal_lahir', e.target.value)} style={inp} />
              </div>
              <div>
                <label style={lbl}>Jenis Kelamin *</label>
                <select value={form.jenis_kelamin} onChange={e => set('jenis_kelamin', e.target.value)} style={inp}>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>Alamat *</label>
              <input value={form.alamat} onChange={e => set('alamat', e.target.value)} style={inp} placeholder="Alamat lengkap sesuai KTP" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Kota *</label>
                <input value={form.kota} onChange={e => set('kota', e.target.value)} style={inp} placeholder="Jakarta" />
              </div>
              <div>
                <label style={lbl}>Provinsi</label>
                <input value={form.provinsi} onChange={e => set('provinsi', e.target.value)} style={inp} placeholder="DKI Jakarta" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Status Nikah</label>
                <select value={form.status_nikah} onChange={e => set('status_nikah', e.target.value)} style={inp}>
                  <option>Belum Menikah</option>
                  <option>Menikah</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Agama</label>
                <select value={form.agama} onChange={e => set('agama', e.target.value)} style={inp}>
                  {AGAMA.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lbl}>Tinggi (cm)</label>
                <input type="number" value={form.tinggi} onChange={e => set('tinggi', e.target.value)} style={inp} placeholder="165" />
              </div>
              <div>
                <label style={lbl}>Berat (kg)</label>
                <input type="number" value={form.berat} onChange={e => set('berat', e.target.value)} style={inp} placeholder="55" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Keahlian ─────────────────────── */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lbl}>Pendidikan Terakhir *</label>
              <select value={form.pendidikan} onChange={e => set('pendidikan', e.target.value)} style={inp}>
                <option value="">-- Pilih pendidikan --</option>
                {PENDIDIKAN.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Tipe Pekerjaan yang Dilamar *</label>
              <select value={form.tipe_pekerjaan} onChange={e => set('tipe_pekerjaan', e.target.value)} style={inp}>
                {TIPE_PEKERJAAN.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Vaksin yang Dimiliki *</label>
              <input value={form.vaksin} onChange={e => set('vaksin', e.target.value)} style={inp} placeholder="Covid, Hepatitis B, dll" />
            </div>
            <div>
              <label style={lbl}>Pelatihan / Pendidikan Non-Formal *</label>
              <textarea value={form.pengalaman_pelatihan} onChange={e => set('pengalaman_pelatihan', e.target.value)}
                style={{ ...inp, minHeight: '80px', resize: 'vertical' as const }}
                placeholder="Sebutkan pelatihan yang pernah diikuti, atau tulis 'Tidak ada'" />
            </div>
            <div>
              <label style={lbl}>Pengalaman Kerja *</label>
              <textarea value={form.pengalaman} onChange={e => set('pengalaman', e.target.value)}
                style={{ ...inp, minHeight: '80px', resize: 'vertical' as const }}
                placeholder="Ceritakan pengalaman kerja, atau tulis 'Belum ada'" />
            </div>
          </div>
        )}

        {/* ── STEP 3: Pembayaran ───────────────────── */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.6' }}>
              Pilih metode pembayaran untuk biaya pelatihan wajib Mikala. Besaran biaya akan dikonfirmasi oleh tim Rekrutmen.
            </p>

            {/* Cash */}
            <button type="button" onClick={() => set('payment_type', 'cash')} style={{
              padding: '16px', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' as const,
              border: `2px solid ${form.payment_type === 'cash' ? '#10b981' : 'rgba(255,255,255,0.15)'}`,
              background: form.payment_type === 'cash' ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
            }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>💵 Cash</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Bayar penuh biaya pelatihan sebelum mulai penugasan pertama. Tidak ada potongan dari pendapatan job.
              </p>
            </button>

            {/* Kredit */}
            <button type="button" onClick={() => set('payment_type', 'kredit')} style={{
              padding: '16px', borderRadius: '14px', cursor: 'pointer', textAlign: 'left' as const,
              border: `2px solid ${form.payment_type === 'kredit' ? '#ec4899' : 'rgba(255,255,255,0.15)'}`,
              background: form.payment_type === 'kredit' ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.04)',
            }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>💳 Kredit</p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Cicil biaya pelatihan dari pendapatan job. Setiap kali mendapat penugasan, sebagian penghasilan dipotong otomatis hingga lunas.
              </p>
            </button>

            {form.payment_type === 'kredit' && (
              <div style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#f9a8d4' }}>
                ℹ️ Besaran cicilan per-job akan ditentukan oleh Divisi Rekrutmen saat proses verifikasi.
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Kontrak ──────────────────────── */}
        {step === 4 && (
          <div>
            {/* Kontrak scroll box */}
            <div
              onScroll={e => {
                const el = e.currentTarget;
                if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) setContractScrolled(true);
              }}
              style={{
                height: '260px', overflowY: 'auto',
                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', padding: '14px', marginBottom: '14px',
                fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7',
                whiteSpace: 'pre-line' as const, fontFamily: 'monospace',
              }}>
              {ISI_KONTRAK}
            </div>

            {!contractScrolled && (
              <p style={{ fontSize: '12px', color: '#fbbf24', marginBottom: '12px' }}>
                ↕ Scroll hingga bawah untuk mengaktifkan persetujuan
              </p>
            )}

            {/* Checkbox */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px',
              borderRadius: '12px', cursor: contractScrolled ? 'pointer' : 'not-allowed',
              border: `2px solid ${form.contract_agreed ? '#7c3aed' : 'rgba(255,255,255,0.15)'}`,
              background: form.contract_agreed ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
              opacity: contractScrolled ? 1 : 0.5,
            }}>
              <input
                type="checkbox"
                disabled={!contractScrolled}
                checked={form.contract_agreed}
                onChange={e => set('contract_agreed', e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#7c3aed', width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>
                Saya telah membaca, memahami, dan <strong style={{ color: 'white' }}>menyetujui</strong> seluruh isi Perjanjian Kerjasama Mitra Mikala Global Medika.
              </span>
            </label>

            {form.contract_agreed && (
              <p style={{ fontSize: '11px', color: '#86efac', marginTop: '8px' }}>
                ✓ Persetujuan tercatat pada {new Date().toLocaleString('id-ID')}
              </p>
            )}
          </div>
        )}

        {/* ── Navigation Buttons ─────────────────── */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
          {step > 0 && (
            <button onClick={() => { setStep(s => s - 1); setError(''); }}
              style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronLeft size={16} /> Kembali
            </button>
          )}

          {step < STEPS.length - 1 ? (
            <button onClick={nextStep}
              style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              Lanjut <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading || !form.contract_agreed}
              style={{ flex: 1, padding: '12px', background: loading || !form.contract_agreed ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #4f46e5)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 700, fontSize: '14px', cursor: loading || !form.contract_agreed ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Mendaftar...' : '🚀 Daftar Sekarang'}
            </button>
          )}
        </div>

        {/* Login link */}
        {step === 0 && (
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Sudah punya akun?{' '}
            <button onClick={() => router.push('/auth/login')} style={{ background: 'none', border: 'none', color: '#a78bfa', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
              Masuk
            </button>
          </p>
        )}
      </div>

      {/* Footer */}
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '24px' }}>
        © 2026 Mikala Global Medika
      </p>
    </div>
  );
}
