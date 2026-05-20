'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ChevronLeft, ChevronRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { SumberMikala } from '@/components/SumberMikala';

const PENDIDIKAN=['SMA Negeri / Swasta','SMK / Sekolah Kejuruan Kesehatan','SMK / Sekolah Kejuruan Lainnya','Diploma D1/D2/D3 Kesehatan','Diploma D1/D2/D3 Lainnya','Sarjana S1 Kesehatan','Sarjana S1 Keperawatan','Profesi Nurse','Sarjana S1 Lainnya'];
const TIPE=['Perawat Homecare','Perawat Lansia / Caregiver','Babysitter','Babysitter New Born Care','Perawat Jiwa','Caregiver / Kaigo (Jepang)'];
const AGAMA=['Islam','Kristen Protestan','Kristen Katolik','Hindu','Budha','Konghucu'];
const KONTRAK=`PERJANJIAN KERJASAMA MITRA — MIKALA GLOBAL MEDIKA

Dengan mendaftar, saya menyatakan telah membaca, memahami, dan menyetujui:

PASAL 1 – HUBUNGAN KERJA
Mitra adalah tenaga kerja independen yang bekerja berdasarkan sistem penugasan per-job.

PASAL 2 – KEWAJIBAN MITRA
1. Menyelesaikan pelatihan wajib sebelum menerima penugasan.
2. Menjaga standar pelayanan dan profesionalisme kepada klien.
3. Melaporkan setiap insiden kepada koordinator Mikala.
4. Tidak mengambil kontak klien di luar sistem Mikala.
5. Menjaga kerahasiaan data klien dan informasi internal.

PASAL 3 – BIAYA PELATIHAN
a) CASH: Dibayar penuh sebelum penugasan pertama.
b) KREDIT: Dicicil dari potongan otomatis setiap pendapatan job, sesuai skema yang disepakati Divisi Rekrutmen.

PASAL 4 – PENGHASILAN
Penghasilan = jumlah job × rate yang ditetapkan, dibayar via transfer bank per periode, setelah dikurangi potongan yang berlaku.

PASAL 5 – PEMUTUSAN
Mikala berhak memutus kerjasama jika Mitra melanggar kode etik, tidak memenuhi kewajiban, atau merugikan Mikala/klien.

PASAL 6 – PERSETUJUAN ELEKTRONIK
Mencentang kotak persetujuan memiliki kekuatan hukum setara tanda tangan di atas materai.

Mikala Global Medika — Jl. Anyelir No. 1-2, Jatibening, Kota Bekasi — 0821-1448-8878`;

const i:React.CSSProperties={width:'100%',padding:'12px 14px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'white',fontSize:'14px',outline:'none',boxSizing:'border-box'};
const l:React.CSSProperties={fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.6)',display:'block',marginBottom:'6px'};
const STEPS=['Akun','Data Diri','Keahlian','Pembayaran','Kontrak'];

export default function RegisterPage(){
  const router=useRouter();
  const [step,setStep]=useState(0);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [showPass,setShowPass]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  const [form,setForm]=useState({
    name:'',email:'',password:'',phone:'',
    nik:'',tanggal_lahir:'',jenis_kelamin:'P',alamat:'',kota:'',provinsi:'',
    status_nikah:'Belum Menikah',agama:'Islam',tinggi:'',berat:'',
    pendidikan:'',tipe_pekerjaan:'Perawat Homecare',pengalaman_pelatihan:'',pengalaman:'',vaksin:'',
    payment_type:'cash' as 'cash'|'kredit',contract_agreed:false,
    sumber_tipe:'sendiri',sumber_detail:'',lembaga_id:undefined as number|undefined,referrer_mitra_id:undefined as number|undefined,
  });
  const s=(k:string,v:any)=>setForm(f=>({...f,[k]:v}));

  const next=()=>{
    setError('');
    if(step===0){if(!form.name||!form.email||!form.password||!form.phone){setError('Semua field wajib diisi');return;}if(form.password.length<8){setError('Password minimal 8 karakter');return;}}
    if(step===1){if(!form.nik||!form.tanggal_lahir||!form.alamat||!form.kota){setError('Semua field wajib diisi');return;}}
    if(step===2){if(!form.pendidikan||!form.pengalaman_pelatihan||!form.pengalaman){setError('Semua field wajib diisi');return;}}
    setStep(x=>x+1);
  };

  const submit=async()=>{
    if(!form.contract_agreed){setError('Setujui kontrak terlebih dahulu');return;}
    setLoading(true);setError('');
    try{
      await apiClient.post('/auth/mitra/register',{
        name:form.name,email:form.email,password:form.password,phone:form.phone,
        nik:form.nik,tanggal_lahir:form.tanggal_lahir,jenis_kelamin:form.jenis_kelamin,
        alamat:form.alamat,kota:form.kota,provinsi:form.provinsi,
        pendidikan:form.pendidikan,tipe_pekerjaan:form.tipe_pekerjaan,
        pengalaman:`PELATIHAN: ${form.pengalaman_pelatihan}\nPENGALAMAN: ${form.pengalaman}`,
        vaksin:form.vaksin,tinggi:form.tinggi,berat:form.berat,
        payment_type:form.payment_type,contract_agreed:true,
        sumber_tipe:form.sumber_tipe,sumber_detail:form.sumber_detail,
        lembaga_id:form.lembaga_id,referrer_mitra_id:form.referrer_mitra_id,
      });
      router.push('/auth/register/success');
    }catch(err:any){
      const msg=err.response?.data?.errors?Object.values(err.response.data.errors).flat().join(', '):err.response?.data?.message||'Pendaftaran gagal';
      setError(msg);
    }finally{setLoading(false);}
  };

  const bg='linear-gradient(135deg,#0f0c29,#302b63,#24243e)';
  return(
    <div style={{minHeight:'100vh',background:bg,display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 16px',boxSizing:'border-box'}}>
      <div style={{textAlign:'center',marginBottom:'20px'}}>
        <img src="https://res.cloudinary.com/djgtchmsx/image/upload/v1779019648/logo_MGM_remake_-_w_font_xtgtt0.png" alt="Mikala" style={{height:'34px',marginBottom:'4px'}}/>
        <p style={{color:'rgba(255,255,255,0.45)',fontSize:'12px'}}>Pendaftaran Mitra</p>
      </div>

      {/* Steps indicator */}
      <div style={{display:'flex',alignItems:'center',width:'100%',maxWidth:'420px',marginBottom:'20px'}}>
        {STEPS.map((t,idx)=>(
          <div key={idx} style={{display:'flex',alignItems:'center',flex:idx<STEPS.length-1?1:0}}>
            <div style={{width:'26px',height:'26px',borderRadius:'50%',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'11px',fontWeight:700,background:idx<step?'#7c3aed':idx===step?'white':'rgba(255,255,255,0.1)',color:idx<step?'white':idx===step?'#302b63':'rgba(255,255,255,0.4)'}}>
              {idx<step?<CheckCircle2 size={13}/>:idx+1}
            </div>
            {idx<STEPS.length-1&&<div style={{flex:1,height:'2px',background:idx<step?'#7c3aed':'rgba(255,255,255,0.1)'}}/>}
          </div>
        ))}
      </div>

      <div style={{width:'100%',maxWidth:'420px',background:'rgba(255,255,255,0.06)',backdropFilter:'blur(20px)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'20px',padding:'24px'}}>
        <h2 style={{color:'white',fontSize:'18px',fontWeight:700,marginBottom:'2px'}}>{STEPS[step]}</h2>
        <p style={{color:'rgba(255,255,255,0.4)',fontSize:'12px',marginBottom:'18px'}}>Langkah {step+1} dari {STEPS.length}</p>

        {error&&<div style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'10px',padding:'10px 14px',marginBottom:'14px',color:'#fca5a5',fontSize:'13px'}}>{error}</div>}

        {step===0&&<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div><label style={l}>Nama Lengkap *</label><input value={form.name} onChange={e=>s('name',e.target.value)} style={i} placeholder="Sesuai KTP"/></div>
          <div><label style={l}>Email *</label><input type="email" value={form.email} onChange={e=>s('email',e.target.value)} style={i} placeholder="email@contoh.com"/></div>
          <div><label style={l}>Password *</label>
            <div style={{position:'relative'}}>
              <input type={showPass?'text':'password'} value={form.password} onChange={e=>s('password',e.target.value)} style={{...i,paddingRight:'42px'}} placeholder="Min. 8 karakter"/>
              <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',display:'flex'}}>
                {showPass?<EyeOff size={15}/>:<Eye size={15}/>}
              </button>
            </div>
          </div>
          <div><label style={l}>Nomor HP *</label><input value={form.phone} onChange={e=>s('phone',e.target.value)} style={i} placeholder="08xxxxxxxxxx"/></div>
        </div>}

        {step===1&&<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div><label style={l}>NIK *</label><input value={form.nik} onChange={e=>s('nik',e.target.value)} style={i} placeholder="16 digit" maxLength={16}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <div><label style={l}>Tgl Lahir *</label><input type="date" value={form.tanggal_lahir} onChange={e=>s('tanggal_lahir',e.target.value)} style={i}/></div>
            <div><label style={l}>Kelamin *</label><select value={form.jenis_kelamin} onChange={e=>s('jenis_kelamin',e.target.value)} style={i}><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
          </div>
          <div><label style={l}>Alamat *</label><input value={form.alamat} onChange={e=>s('alamat',e.target.value)} style={i} placeholder="Alamat lengkap"/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <div><label style={l}>Kota *</label><input value={form.kota} onChange={e=>s('kota',e.target.value)} style={i}/></div>
            <div><label style={l}>Provinsi</label><input value={form.provinsi} onChange={e=>s('provinsi',e.target.value)} style={i}/></div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <div><label style={l}>Tinggi (cm)</label><input type="number" value={form.tinggi} onChange={e=>s('tinggi',e.target.value)} style={i} placeholder="165"/></div>
            <div><label style={l}>Berat (kg)</label><input type="number" value={form.berat} onChange={e=>s('berat',e.target.value)} style={i} placeholder="55"/></div>
          </div>
        </div>}

        {step===2&&<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div><label style={l}>Pendidikan *</label><select value={form.pendidikan} onChange={e=>s('pendidikan',e.target.value)} style={i}><option value="">-- Pilih --</option>{PENDIDIKAN.map(p=><option key={p}>{p}</option>)}</select></div>
          <div><label style={l}>Tipe Pekerjaan *</label><select value={form.tipe_pekerjaan} onChange={e=>s('tipe_pekerjaan',e.target.value)} style={i}>{TIPE.map(t=><option key={t}>{t}</option>)}</select></div>
          <div><label style={l}>Vaksin *</label><input value={form.vaksin} onChange={e=>s('vaksin',e.target.value)} style={i} placeholder="Covid, Hepatitis B"/></div>
          <div><label style={l}>Pelatihan Non-Formal *</label><textarea value={form.pengalaman_pelatihan} onChange={e=>s('pengalaman_pelatihan',e.target.value)} style={{...i,minHeight:'70px',resize:'vertical'as const}} placeholder="Pelatihan diikuti, atau 'Tidak ada'"/></div>
          <div><label style={l}>Pengalaman Kerja *</label><textarea value={form.pengalaman} onChange={e=>s('pengalaman',e.target.value)} style={{...i,minHeight:'70px',resize:'vertical'as const}} placeholder="Pengalaman kerja, atau 'Belum ada'"/></div>
        </div>}

        {step===3&&<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <p style={{color:'rgba(255,255,255,0.6)',fontSize:'13px',lineHeight:'1.6'}}>Pilih metode pembayaran biaya pelatihan wajib.</p>
          {[{v:'cash',emoji:'💵',title:'Cash',desc:'Bayar penuh sebelum mulai penugasan.'},{v:'kredit',emoji:'💳',title:'Kredit',desc:'Cicil dari pendapatan job otomatis.'}].map(opt=>(
            <button key={opt.v} type="button" onClick={()=>s('payment_type',opt.v)} style={{padding:'14px',borderRadius:'14px',cursor:'pointer',textAlign:'left'as const,border:`2px solid ${form.payment_type===opt.v?(opt.v==='cash'?'#10b981':'#ec4899'):'rgba(255,255,255,0.15)'}`,background:form.payment_type===opt.v?(opt.v==='cash'?'rgba(16,185,129,0.1)':'rgba(236,72,153,0.1)'):'rgba(255,255,255,0.04)'}}>
              <p style={{fontSize:'15px',fontWeight:700,color:'white',marginBottom:'3px'}}>{opt.emoji} {opt.title}</p>
              <p style={{fontSize:'12px',color:'rgba(255,255,255,0.5)'}}>{opt.desc}</p>
            </button>
          ))}
          {form.payment_type==='kredit'&&<div style={{background:'rgba(236,72,153,0.08)',border:'1px solid rgba(236,72,153,0.2)',borderRadius:'10px',padding:'10px',fontSize:'12px',color:'#f9a8d4'}}>ℹ️ Besaran cicilan ditentukan tim Rekrutmen saat verifikasi.</div>}
        </div>}

        {step===5&&<div>
          <div onScroll={e=>{const el=e.currentTarget;if(el.scrollHeight-el.scrollTop<=el.clientHeight+40)setScrolled(true);}} style={{height:'240px',overflowY:'auto',background:'rgba(0,0,0,0.25)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'14px',marginBottom:'12px',fontSize:'12px',color:'rgba(255,255,255,0.7)',lineHeight:'1.75',whiteSpace:'pre-line'as const,fontFamily:'monospace'}}>
            {KONTRAK}
          </div>
          {!scrolled&&<p style={{fontSize:'12px',color:'#fbbf24',marginBottom:'10px'}}>↕ Scroll sampai bawah untuk aktifkan persetujuan</p>}
          <label style={{display:'flex',alignItems:'flex-start',gap:'12px',padding:'14px',borderRadius:'12px',cursor:scrolled?'pointer':'not-allowed',border:`2px solid ${form.contract_agreed?'#7c3aed':'rgba(255,255,255,0.15)'}`,background:form.contract_agreed?'rgba(124,58,237,0.1)':'rgba(255,255,255,0.03)',opacity:scrolled?1:0.5}}>
            <input type="checkbox" disabled={!scrolled} checked={form.contract_agreed} onChange={e=>s('contract_agreed',e.target.checked)} style={{marginTop:'2px',accentColor:'#7c3aed',width:'16px',height:'16px'}}/>
            <span style={{fontSize:'13px',color:'rgba(255,255,255,0.8)',lineHeight:'1.5'}}>Saya telah membaca, memahami, dan <strong style={{color:'white'}}>menyetujui</strong> seluruh isi Perjanjian Kerjasama Mitra Mikala Global Medika.</span>
          </label>
          {form.contract_agreed&&<p style={{fontSize:'11px',color:'#86efac',marginTop:'8px'}}>✓ Tercatat: {new Date().toLocaleString('id-ID')}</p>}
        </div>}

        <div style={{display:'flex',gap:'10px',marginTop:'22px'}}>
          {step>0&&<button onClick={()=>{setStep(x=>x-1);setError('');}} style={{padding:'12px 16px',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'12px',color:'white',fontWeight:600,fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}}><ChevronLeft size={15}/>Kembali</button>}
          {step<STEPS.length-1
            ?<button onClick={next} style={{flex:1,padding:'12px',background:'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',borderRadius:'12px',color:'white',fontWeight:700,fontSize:'14px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>Lanjut <ChevronRight size={15}/></button>
            :<button onClick={submit} disabled={loading||!form.contract_agreed} style={{flex:1,padding:'12px',background:loading||!form.contract_agreed?'rgba(124,58,237,0.4)':'linear-gradient(135deg,#7c3aed,#4f46e5)',border:'none',borderRadius:'12px',color:'white',fontWeight:700,fontSize:'14px',cursor:loading||!form.contract_agreed?'not-allowed':'pointer'}}>{loading?'Mendaftar...':'🚀 Daftar Sekarang'}</button>}
        </div>
        {step===0&&<p style={{textAlign:'center',marginTop:'14px',fontSize:'13px',color:'rgba(255,255,255,0.4)'}}>Sudah punya akun? <button onClick={()=>router.push('/auth/login')} style={{background:'none',border:'none',color:'#a78bfa',fontWeight:600,cursor:'pointer',fontSize:'13px'}}>Masuk</button></p>}
      </div>
      <p style={{color:'rgba(255,255,255,0.3)',fontSize:'12px',marginTop:'20px'}}>© 2026 Mikala Global Medika</p>
    </div>
  );
}
