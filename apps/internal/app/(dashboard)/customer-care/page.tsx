'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Headphones, Search, Eye, X, Plus, CheckCircle, Clock, AlertCircle, Users, HeartPulse, MessageSquare, BarChart2, UserPlus, Check, Briefcase, TrendingUp, XCircle, Repeat, Download, FileText } from 'lucide-react';
import { usePagination } from '@/lib/usePagination';
import Pagination from '@/components/Pagination';

const statusMap: any = {
  pending:     { label:'Pending',      color:'#f59e0b', bg:'rgba(245,158,11,0.15)',  border:'rgba(245,158,11,0.3)',  icon: Clock },
  confirmed:   { label:'Dikonfirmasi', color:'#3b82f6', bg:'rgba(59,130,246,0.15)',  border:'rgba(59,130,246,0.3)',  icon: CheckCircle },
  in_progress: { label:'Berjalan',     color:'#10b981', bg:'rgba(16,185,129,0.15)',  border:'rgba(16,185,129,0.3)',  icon: CheckCircle },
  completed:   { label:'Selesai',      color:'#6b7280', bg:'rgba(107,114,128,0.15)', border:'rgba(107,114,128,0.3)', icon: CheckCircle },
  cancelled:   { label:'Dibatalkan',   color:'#ef4444', bg:'rgba(239,68,68,0.15)',   border:'rgba(239,68,68,0.3)',   icon: AlertCircle },
  on_hold:     { label:'Ditahan',      color:'#8b5cf6', bg:'rgba(139,92,246,0.15)',  border:'rgba(139,92,246,0.3)',  icon: Clock },
};

const TABS = [
  { key:'layanan',  label:'Layanan',  icon: HeartPulse },
  { key:'leads',    label:'Leads',    icon: Briefcase },
  { key:'klien',    label:'Klien',    icon: Users },
  { key:'pasien',   label:'Pasien',   icon: UserPlus },
  { key:'feedback', label:'Feedback', icon: MessageSquare },
  { key:'report',   label:'Report',   icon: BarChart2 },
];

const leadStatusMap: any = {
  0: { label:'Proses', color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', icon: Clock },
  1: { label:'Deal',   color:'#10b981', bg:'rgba(16,185,129,0.15)', border:'rgba(16,185,129,0.3)', icon: CheckCircle },
  2: { label:'Batal',  color:'#ef4444', bg:'rgba(239,68,68,0.15)',  border:'rgba(239,68,68,0.3)',  icon: XCircle },
};

const CC_SUBTABS = [
  { key:'layanan',  label:'Layanan' },
  { key:'leads',    label:'Leads' },
  { key:'deal',     label:'Deal' },
  { key:'exchange', label:'Exchange' },
];

function buildLeadDetailRows(item: any) {
  return [
    { label:'Jenis Layanan', value: (item.layanan?.nama || '-') + (item.tier_nama ? ' · '+item.tier_nama : '') },
    { label:'Klien Terdaftar', value: item.klien?.nama_lengkap || item.klien?.user?.name || '-' },
    { label:'Nama Leads (Cust/PJ)', value: item.nama_leads || '-' },
    { label:'Kontak', value: item.kontak || '-' },
    { label:'Nama Pasien (Klien)', value: item.nama_pasien || '-' },
    { label:'Sumber', value: item.sumber || '-' },
    { label:'Catatan', value: item.catatan || '-' },
    { label:'Mitra', value: item.mitra?.user?.name || '-' },
    ...(item.status === 1 ? [{ label:'Tanggal Deal', value: item.deal_at ? new Date(item.deal_at).toLocaleString('id-ID') : '-' }] : []),
    ...(item.status === 2 ? [
      { label:'Tanggal Batal', value: item.batal_at ? new Date(item.batal_at).toLocaleString('id-ID') : '-' },
      { label:'Alasan Batal', value: item.alasan_batal || '-' },
    ] : []),
    { label:'Dibuat oleh', value: (item.creator?.name || '-') + (item.created_at ? ' · '+new Date(item.created_at).toLocaleString('id-ID') : '') },
  ];
}

function buildExchangeDetailRows(item: any) {
  return [
    { label:'Leads Terkait', value: (item.lead?.nama_leads || '-') + (item.lead?.nomor ? ' ('+item.lead.nomor+')' : '') },
    { label:'Jenis Layanan', value: (item.lead?.layanan?.nama || '-') + (item.lead?.tier_nama ? ' · '+item.lead.tier_nama : '') },
    { label:'Mitra Lama', value: item.mitra_lama?.user?.name || '-' },
    { label:'Mitra Baru', value: item.mitra_baru?.user?.name || '-' },
    { label:'Alasan Exchange', value: item.alasan || '-' },
    { label:'Tanggal Exchange', value: item.exchanged_at ? new Date(item.exchanged_at).toLocaleString('id-ID') : '-' },
    { label:'Dicatat oleh', value: (item.creator?.name || '-') + (item.created_at ? ' · '+new Date(item.created_at).toLocaleString('id-ID') : '') },
  ];
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function escapePdfText(s: string): string {
  return String(s ?? '').replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapPdfLine(line: string, maxLen: number): string[] {
  if (line.length <= maxLen) return [line];
  const words = line.split(' ');
  const out: string[] = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > maxLen) { if (cur) out.push(cur); cur = w; }
    else { cur = (cur + ' ' + w).trim(); }
  });
  if (cur) out.push(cur);
  return out;
}

function buildSimplePdfBlob(title: string, subtitle: string, rows: { label: string; value: string }[]): Blob {
  const rawLines: string[] = [title, subtitle, ''];
  rows.forEach(r => rawLines.push((r.label + ': ' + (r.value || '-'))));
  rawLines.push('');
  rawLines.push('Dicetak: ' + new Date().toLocaleString('id-ID'));

  const wrapped: string[] = [];
  rawLines.forEach(l => wrapped.push(...wrapPdfLine(l, 90)));

  const startY = 800;
  const lineHeight = 16;
  let ops = 'BT\n/F1 11 Tf\n50 ' + startY + ' Td\n';
  wrapped.forEach((line, i) => {
    const text = escapePdfText(line);
    if (i === 0) ops += '(' + text + ') Tj\n';
    else ops += '0 -' + lineHeight + ' Td\n(' + text + ') Tj\n';
  });
  ops += 'ET';

  const objects: string[] = [];
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  objects[2] = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  objects[3] = '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj\n';
  objects[4] = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  objects[5] = '5 0 obj\n<< /Length ' + ops.length + ' >>\nstream\n' + ops + '\nendstream\nendobj\n';

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (let i = 1; i <= 5; i++) { offsets.push(pdf.length); pdf += objects[i]; }
  const xrefStart = pdf.length;
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefStart + '\n%%EOF';

  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return new Blob([bytes], { type: 'application/pdf' });
}

function exportRowsToXls(filename: string, headers: string[], rows: (string|number)[][]) {
  const esc = (s: any) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let html = '<table><thead><tr>' + headers.map(h => '<th>'+esc(h)+'</th>').join('') + '</tr></thead><tbody>';
  rows.forEach(r => { html += '<tr>' + r.map(c => '<td>'+esc(c)+'</td>').join('') + '</tr>'; });
  html += '</tbody></table>';
  downloadBlob(new Blob(['﻿', html], { type: 'application/vnd.ms-excel' }), filename);
}

export default function CustomerCarePage() {
  const [activeTab, setActiveTab] = useState('layanan');
  const [layanan, setLayanan] = useState<any[]>([]);
  const [klien, setKlien] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [detail, setDetail] = useState<any>(null);

  // Form klien
  const [showFormKlien, setShowFormKlien] = useState(false);
  const [formKlien, setFormKlien] = useState({ nama:'', email:'', phone:'', alamat:'', kota:'', provinsi:'', tipe:'individu', password:'password123' });
  const [savingKlien, setSavingKlien] = useState(false);
  const [kredensial, setKredensial] = useState<any>(null);

  // Assign mitra state
  const [showAssign, setShowAssign] = useState(false);
  const [assignOrderId, setAssignOrderId] = useState<number|null>(null);
  const [assignMitraId, setAssignMitraId] = useState('');
  const [savingAssign, setSavingAssign] = useState(false);

  // Orders state (dipakai juga oleh tombol Assign di tab Layanan)
  const [orders, setOrders] = useState<any[]>([]);
  const [showFormOrder, setShowFormOrder] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [mitraList, setMitraList] = useState<any[]>([]);
  const [formOrder, setFormOrder] = useState({
    klien_id:'', pasien_id:'', mitra_id:'', layanan_type:'homecare_harian',
    tanggal_mulai:'', tanggal_selesai:'', lokasi:'', harga_per_shift:'0', total_shift:'1', deskripsi:''
  });

  // Leads pipeline dashboard state
  const [ccSubTab, setCcSubTab] = useState('layanan');
  const [leadsSummary, setLeadsSummary] = useState<any>(null);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [cmsLayananList, setCmsLayananList] = useState<any[]>([]);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [loadingLeadsList, setLoadingLeadsList] = useState(false);

  // Form tambah Leads
  const [showFormLead, setShowFormLead] = useState(false);
  const [formLead, setFormLead] = useState({ cms_layanan_id:'', tier_nama:'', klien_id:'', nama_leads:'', kontak:'', nama_pasien:'', sumber:'WhatsApp', catatan:'' });
  const [savingLead, setSavingLead] = useState(false);
  const [klienSearch, setKlienSearch] = useState('');
  const [showKlienResults, setShowKlienResults] = useState(false);

  // Modal Deal
  const [dealTarget, setDealTarget] = useState<any>(null);
  const [dealMitraId, setDealMitraId] = useState('');
  const [savingDeal, setSavingDeal] = useState(false);

  // Modal Batal (Loss)
  const [batalTarget, setBatalTarget] = useState<any>(null);
  const [alasanBatal, setAlasanBatal] = useState('');
  const [savingBatal, setSavingBatal] = useState(false);

  // Deal & Exchange tab
  const [dealLeadsList, setDealLeadsList] = useState<any[]>([]);
  const [loadingDealList, setLoadingDealList] = useState(false);
  const [exchangeList, setExchangeList] = useState<any[]>([]);
  const [loadingExchangeList, setLoadingExchangeList] = useState(false);

  // Modal Log Exchange
  const [exchangeTarget, setExchangeTarget] = useState<any>(null);
  const [exchangeMitraId, setExchangeMitraId] = useState('');
  const [exchangeAlasan, setExchangeAlasan] = useState('');
  const [savingExchange, setSavingExchange] = useState(false);

  // Modal Detail Leads/Deal/Exchange
  const [leadDetail, setLeadDetail] = useState<{ type: 'lead'|'exchange'; item: any }|null>(null);

  // Form pasien
  const [showFormPasien, setShowFormPasien] = useState(false);
  const [formPasien, setFormPasien] = useState({ klien_id:'', nama_lengkap:'', tanggal_lahir:'', jenis_kelamin:'L', golongan_darah:'', alamat:'', riwayat_penyakit:'', alergi:'', kontak_darurat_nama:'', kontak_darurat_phone:'', kontak_darurat_relasi:'keluarga' });
  const [savingPasien, setSavingPasien] = useState(false);
  const [pasienList, setPasienList] = useState<any[]>([]);

  // Feedback
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [showFormFeedback, setShowFormFeedback] = useState(false);
  const [formFeedback, setFormFeedback] = useState({ klien_id:'', rating:'5', catatan:'', tipe:'layanan' });
  const [savingFeedback, setSavingFeedback] = useState(false);

  // Report
  const [report, setReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Pasien expand
  const [expandedKlien, setExpandedKlien] = useState<number|null>(null);
  const [pasienDetail, setPasienDetail] = useState<Record<number,any[]>>({});
  const [loadingPasien, setLoadingPasien] = useState<number|null>(null);

  useEffect(() => { fetchAll(); }, []);
  useEffect(() => {
    if (activeTab === 'pasien') fetchPasien();
    if (activeTab === 'feedback') fetchFeedback();
    if (activeTab === 'report') fetchReport();
    if (activeTab === 'leads') { fetchLeadsSummary(); fetchCmsLayananCatalog(); }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'leads') return;
    if (ccSubTab === 'leads') fetchLeadsList();
    if (ccSubTab === 'deal') fetchDealLeads();
    if (ccSubTab === 'exchange') fetchExchangeList();
  }, [activeTab, ccSubTab]);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/cc/layanan').then((r: any) => setLayanan(Array.isArray(r.data?.data) ? r.data.data : [])),
      apiClient.get('/internal/cc/klien').then((r: any) => {
        const d = r.data?.data;
        setKlien(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
      }),
    ]).finally(() => setLoading(false));
  };

  const fetchOrders = () => {
    apiClient.get('/internal/cc/layanan').then((r: any) => {
      const d = r.data?.data;
      setOrders(Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
    }).catch(() => {});
    apiClient.get('/internal/mitra-list?status=available').then((r: any) => {
      setMitraList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => {});
  };

  const fetchLeadsSummary = () => {
    setLoadingLeads(true);
    apiClient.get('/internal/cc/leads/summary').then((r: any) => {
      setLeadsSummary(r.data?.data || null);
    }).catch(() => setLeadsSummary(null)).finally(() => setLoadingLeads(false));
    if (mitraList.length === 0) fetchOrders();
  };

  const fetchCmsLayananCatalog = () => {
    apiClient.get('/cms/layanan').then((r: any) => {
      setCmsLayananList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => {});
  };

  const fetchLeadsList = () => {
    setLoadingLeadsList(true);
    apiClient.get('/internal/cc/leads').then((r: any) => {
      setLeadsList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => setLeadsList([])).finally(() => setLoadingLeadsList(false));
  };

  const getTiersFor = (cmsLayananId: string | number) => {
    const l = cmsLayananList.find((x: any) => String(x.id) === String(cmsLayananId));
    if (!l || !l.tier_data) return [];
    try {
      const parsed = typeof l.tier_data === 'string' ? JSON.parse(l.tier_data) : l.tier_data;
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLead(true);
    try {
      await apiClient.post('/internal/cc/leads', formLead);
      setShowFormLead(false);
      setFormLead({ cms_layanan_id:'', tier_nama:'', klien_id:'', nama_leads:'', kontak:'', nama_pasien:'', sumber:'WhatsApp', catatan:'' });
      setKlienSearch('');
      setShowKlienResults(false);
      fetchLeadsList();
      fetchLeadsSummary();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menambahkan leads'); }
    finally { setSavingLead(false); }
  };

  const handleMarkDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTarget) return;
    setSavingDeal(true);
    try {
      await apiClient.patch('/internal/cc/leads/'+dealTarget.id+'/deal', { mitra_id: dealMitraId || undefined });
      setDealTarget(null);
      setDealMitraId('');
      fetchLeadsList();
      fetchLeadsSummary();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menandai Deal'); }
    finally { setSavingDeal(false); }
  };

  const handleMarkBatal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batalTarget) return;
    setSavingBatal(true);
    try {
      await apiClient.patch('/internal/cc/leads/'+batalTarget.id+'/batal', { alasan_batal: alasanBatal });
      setBatalTarget(null);
      setAlasanBatal('');
      fetchLeadsList();
      fetchLeadsSummary();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menandai Batal'); }
    finally { setSavingBatal(false); }
  };

  const fetchDealLeads = () => {
    setLoadingDealList(true);
    apiClient.get('/internal/cc/leads?status=1').then((r: any) => {
      setDealLeadsList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => setDealLeadsList([])).finally(() => setLoadingDealList(false));
    if (mitraList.length === 0) fetchOrders();
  };

  const fetchExchangeList = () => {
    setLoadingExchangeList(true);
    apiClient.get('/internal/cc/leads-exchange').then((r: any) => {
      setExchangeList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => setExchangeList([])).finally(() => setLoadingExchangeList(false));
  };

  const handleLogExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeTarget) return;
    setSavingExchange(true);
    try {
      await apiClient.post('/internal/cc/leads/'+exchangeTarget.id+'/exchange', { mitra_baru_id: exchangeMitraId, alasan: exchangeAlasan });
      setExchangeTarget(null);
      setExchangeMitraId('');
      setExchangeAlasan('');
      fetchDealLeads();
      fetchExchangeList();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal mencatat Exchange'); }
    finally { setSavingExchange(false); }
  };

  const handleExportXls = () => {
    const stamp = new Date().toISOString().slice(0,10);
    if (ccSubTab === 'layanan') {
      const rows = (leadsSummary?.by_layanan || []).map((r: any, i: number) => [i+1, r.layanan_nama, r.tier_nama||'-', r.leads, r.deal, r.loss, r.exchange]);
      exportRowsToXls('cc-layanan-'+stamp+'.xls', ['No','Jenis Layanan','Tier','Leads','Deal','Loss','Exchange'], rows);
    } else if (ccSubTab === 'leads') {
      const rows = leadsList.map((item: any, i: number) => [i+1, item.nomor||'-', (item.layanan?.nama||'-')+(item.tier_nama?' · '+item.tier_nama:''), item.nama_leads||'-', item.kontak||'-', item.sumber||'-', (leadStatusMap[item.status]?.label)||'-']);
      exportRowsToXls('cc-leads-'+stamp+'.xls', ['No','Nomor','Jenis Layanan','Nama Leads','Kontak','Sumber','Status'], rows);
    } else if (ccSubTab === 'deal') {
      const rows = dealLeadsList.map((item: any, i: number) => [i+1, item.nomor||'-', (item.layanan?.nama||'-')+(item.tier_nama?' · '+item.tier_nama:''), item.nama_leads||'-', item.mitra?.user?.name||'Belum assign', item.deal_at?new Date(item.deal_at).toLocaleDateString('id-ID'):'-']);
      exportRowsToXls('cc-deal-'+stamp+'.xls', ['No','Nomor','Jenis Layanan','Nama Leads','Mitra','Tgl Deal'], rows);
    } else if (ccSubTab === 'exchange') {
      const rows = exchangeList.map((item: any, i: number) => [i+1, item.nomor||'-', item.lead?.nama_leads||'-', item.mitra_lama?.user?.name||'-', item.mitra_baru?.user?.name||'-', item.alasan||'-', item.exchanged_at?new Date(item.exchanged_at).toLocaleDateString('id-ID'):'-']);
      exportRowsToXls('cc-exchange-'+stamp+'.xls', ['No','Nomor','Leads','Mitra Lama','Mitra Baru','Alasan','Tanggal'], rows);
    }
  };

  const fetchPasien = () => {
    apiClient.get('/internal/cc/klien').then((r: any) => {
      const d = r.data?.data;
      const list = Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
      setPasienList(list);
    }).catch(() => {});
  };

  const fetchFeedback = () => {
    apiClient.get('/internal/cc/feedback').then((r: any) => {
      setFeedbackList(Array.isArray(r.data?.data) ? r.data.data : []);
    }).catch(() => {});
  };

  const fetchReport = () => {
    setLoadingReport(true);
    Promise.all([
      apiClient.get('/internal/cc/report/handling'),
      apiClient.get('/internal/cc/report/deal'),
      apiClient.get('/internal/cc/report/loss'),
    ]).then(([handling, deal, loss]: any) => {
      setReport({
        handling: handling.data?.data,
        deal: deal.data?.data,
        loss: loss.data?.data,
      });
      setLoadingReport(false);
    }).catch(() => setLoadingReport(false));
  };

  const handleAssignMitra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignOrderId) return;
    setSavingAssign(true);
    try {
      await apiClient.patch('/internal/cc/layanan/'+assignOrderId+'/assign', { mitra_id: assignMitraId });
      setShowAssign(false);
      setAssignOrderId(null);
      setAssignMitraId('');
      fetchOrders();
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal assign mitra'); }
    finally { setSavingAssign(false); }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingOrder(true);
    try {
      await apiClient.post('/internal/cc/layanan', formOrder);
      setShowFormOrder(false);
      setFormOrder({ klien_id:'', pasien_id:'', mitra_id:'', layanan_type:'homecare_harian', tanggal_mulai:'', tanggal_selesai:'', lokasi:'', harga_per_shift:'0', total_shift:'1', deskripsi:'' });
      fetchOrders();
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal membuat order'); }
    finally { setSavingOrder(false); }
  };

  const handleRegisterKlien = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKlien(true);
    try {
      await apiClient.post('/internal/cc/registrasi/klien', {
        name: formKlien.nama, email: formKlien.email, phone: formKlien.phone,
        password: formKlien.password, alamat: formKlien.alamat,
        kota: formKlien.kota, provinsi: formKlien.provinsi, tipe: formKlien.tipe,
      });
      setShowFormKlien(false);
      setKredensial({ name: formKlien.nama, email: formKlien.email, password: formKlien.password });
      setFormKlien({ nama:'', email:'', phone:'', alamat:'', kota:'', provinsi:'', tipe:'individu', password:'password123' });
      fetchAll();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal mendaftar klien'); }
    finally { setSavingKlien(false); }
  };

  const handleRegisterPasien = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPasien(true);
    try {
      await apiClient.post('/internal/cc/registrasi/pasien', formPasien);
      setShowFormPasien(false);
      setFormPasien({ klien_id:'', nama_lengkap:'', tanggal_lahir:'', jenis_kelamin:'L', golongan_darah:'', alamat:'', riwayat_penyakit:'', alergi:'', kontak_darurat_nama:'', kontak_darurat_phone:'', kontak_darurat_relasi:'keluarga' });
      alert('Pasien berhasil didaftarkan!');
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal mendaftar pasien'); }
    finally { setSavingPasien(false); }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingFeedback(true);
    try {
      await apiClient.post('/internal/cc/feedback', formFeedback);
      setShowFormFeedback(false);
      setFormFeedback({ klien_id:'', rating:'5', catatan:'', tipe:'layanan' });
      fetchFeedback();
    } catch (err: any) { alert(err.response?.data?.message || 'Gagal menyimpan feedback'); }
    finally { setSavingFeedback(false); }
  };

  const updateLayananStatus = async (id: number, status: string) => {
    try {
      await apiClient.patch('/internal/cc/layanan/' + id + '/status', { status });
      fetchAll();
      if (detail) setDetail({ ...detail, status });
    } catch {}
  };

  const layananFiltered = layanan.filter((l:any) => JSON.stringify(l).toLowerCase().includes(search.toLowerCase()));
  const klienFiltered = klien.filter((k:any) => JSON.stringify(k).toLowerCase().includes(search.toLowerCase()));
  const layananPg = usePagination(layananFiltered, 20, [search, activeTab]);
  const klienPg = usePagination(klienFiltered, 20, [search, activeTab]);

  const inp = { width:'100%', padding:'9px 12px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text)', fontSize:'13px', outline:'none' };
  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };

  const selectedKlienForLead = klien.find((k: any) => String(k.id) === String(formLead.klien_id));
  const klienSearchResults = klienSearch.trim().length >= 2
    ? klien.filter((k: any) => JSON.stringify(k).toLowerCase().includes(klienSearch.trim().toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="space-y-4">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Customer Care</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Kelola layanan, klien & pasien</p>
        </div>
        {activeTab === 'leads' && (
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={() => { setShowFormLead(true); if (cmsLayananList.length === 0) fetchCmsLayananCatalog(); }} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
              <Plus size={15}/>Leads
            </button>
            <button onClick={() => alert('Halaman Laporan akan hadir di update berikutnya.')} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
              <FileText size={15}/>Laporan
            </button>
          </div>
        )}
        {activeTab === 'klien' && (
          <button onClick={() => setShowFormKlien(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Daftarkan Klien
          </button>
        )}
        {activeTab === 'pasien' && (
          <button onClick={() => setShowFormPasien(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Daftarkan Pasien
          </button>
        )}
        {activeTab === 'feedback' && (
          <button onClick={() => setShowFormFeedback(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
            <Plus size={15}/>Tambah Feedback
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'12px' }}>
        {[
          { icon: HeartPulse, label:'Total Layanan', value: layanan.length, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)' },
          { icon: Users, label:'Total Klien', value: klien.length, gradient:'linear-gradient(135deg, #7c3aed, #4f46e5)' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={18} color="white" />
                </div>
                <div>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{s.label}</p>
                  <p style={{ fontWeight:700, fontSize:'20px', color:'var(--text)' }}>{s.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'12px', fontSize:'13px', fontWeight:600, cursor:'pointer', background: activeTab===t.key ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'var(--glass)', color: activeTab===t.key ? 'white' : 'var(--text2)', border: activeTab===t.key ? 'none' : '1px solid var(--border)' }}>
              <Icon size={14}/>{t.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      {['layanan','klien'].includes(activeTab) && (
        <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
          <Search size={16} style={{ color:'var(--text3)' }} />
          <input placeholder={'Cari '+activeTab+'...'} value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
        </div>
      )}

      {/* TAB LAYANAN */}
      {activeTab === 'layanan' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'500px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['No','Tipe Layanan','Klien','Mitra','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {layananPg.paged.map((item: any, i: number) => {
                    const s = statusMap[item.status] || statusMap.pending;
                    const Icon = s.icon;
                    return (
                      <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{(layananPg.page-1)*layananPg.perPage+i+1}</td>
                        <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{item.tipe_layanan?.replace(/_/g,' ')||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.klien?.nama_lengkap||item.klien?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name||'-'}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                            <Icon size={11}/>{s.label}
                          </span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <div style={{ display:'flex', gap:'6px' }}>
                          <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', cursor:'pointer' }}>
                            <Eye size={12}/>Detail
                          </button>
                          {!item.mitra_id && (
                            <button onClick={() => { setAssignOrderId(item.id); setShowAssign(true); fetchOrders(); }} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.2)', borderRadius:'8px', color:'#3b82f6', fontSize:'12px', cursor:'pointer' }}>
                              Assign
                            </button>
                          )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pagination page={layananPg.page} totalPages={layananPg.totalPages} total={layananPg.total} onPageChange={layananPg.setPage} label="layanan" />
              {layanan.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data layanan</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB LEADS (dashboard pipeline: Layanan / Leads / Deal / Exchange) */}
      {activeTab === 'leads' && (
        <div className="space-y-3">
          {/* Summary cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'12px' }}>
            {[
              { icon: Briefcase,  label:'Total Leads', value: leadsSummary?.total_leads ?? 0, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)' },
              { icon: TrendingUp, label:'Deal',        value: leadsSummary?.total_deal ?? 0,  gradient:'linear-gradient(135deg, #10b981, #059669)' },
              { icon: XCircle,    label:'Loss',        value: leadsSummary?.total_loss ?? 0,  gradient:'linear-gradient(135deg, #ef4444, #b91c1c)' },
            ].map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:s.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Icon size={18} color="white" />
                    </div>
                    <div>
                      <p style={{ color:'var(--text3)', fontSize:'11px' }}>{s.label}</p>
                      <p style={{ fontWeight:700, fontSize:'20px', color:'var(--text)' }}>{s.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sub-tabs Layanan / Leads / Deal / Exchange */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
              {CC_SUBTABS.map(t => (
                <button key={t.key} onClick={() => setCcSubTab(t.key)}
                  style={{ padding:'7px 14px', borderRadius:'10px', fontSize:'12px', fontWeight:600, cursor:'pointer', background: ccSubTab===t.key ? 'rgba(236,72,153,0.15)' : 'var(--glass)', color: ccSubTab===t.key ? '#ec4899' : 'var(--text2)', border: ccSubTab===t.key ? '1px solid rgba(236,72,153,0.3)' : '1px solid var(--border)' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={handleExportXls} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text2)', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
              <Download size={13}/>.xls
            </button>
          </div>

          {/* Sub-tab: Layanan (breakdown per jenis layanan x tier) */}
          {ccSubTab === 'layanan' && (
            <div style={cardStyle}>
              {loadingLeads ? (
                <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
                    <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                      {['No','Jenis Layanan','Tier','Leads','Deal','Loss','Exchange'].map(h => (
                        <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {(leadsSummary?.by_layanan || []).map((row: any, i: number) => (
                        <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{i+1}</td>
                          <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>{row.layanan_nama}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{row.tier_nama || '-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{row.leads}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'#10b981', fontWeight:600 }}>{row.deal}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'#ef4444', fontWeight:600 }}>{row.loss}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{row.exchange}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(!leadsSummary?.by_layanan || leadsSummary.by_layanan.length === 0) && (
                    <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data layanan</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab: Leads (daftar leads masuk + aksi Deal/Batal) */}
          {ccSubTab === 'leads' && (
            <div style={cardStyle}>
              {loadingLeadsList ? (
                <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
                    <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                      {['No','Nomor','Jenis Layanan','Nama Leads','Kontak','Sumber','Status','Aksi'].map(h => (
                        <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {leadsList.map((item: any, i: number) => {
                        const s = leadStatusMap[item.status] ?? leadStatusMap[0];
                        const Icon = s.icon;
                        return (
                          <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                            <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{i+1}</td>
                            <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.nomor||'-'}</td>
                            <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>
                              {item.layanan?.nama || '-'}{item.tier_nama ? ' · '+item.tier_nama : ''}
                            </td>
                            <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.nama_leads||'-'}</td>
                            <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.kontak||'-'}</td>
                            <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.sumber||'-'}</td>
                            <td style={{ padding:'12px 16px' }}>
                              <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:s.bg, color:s.color, border:'1px solid '+s.border, borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                                <Icon size={11}/>{s.label}
                              </span>
                            </td>
                            <td style={{ padding:'12px 16px' }}>
                              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                                <button onClick={() => setLeadDetail({ type:'lead', item })} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                                  <Eye size={12}/>Detail
                                </button>
                                {item.status === 0 && (
                                  <>
                                    <button onClick={() => setDealTarget(item)} style={{ padding:'5px 12px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', borderRadius:'8px', color:'#10b981', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                                      Deal
                                    </button>
                                    <button onClick={() => setBatalTarget(item)} style={{ padding:'5px 12px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'8px', color:'#ef4444', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                                      Batal
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {leadsList.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada leads masuk</div>}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab: Deal (leads yang sudah closing) */}
          {ccSubTab === 'deal' && (
            <div style={cardStyle}>
              {loadingDealList ? (
                <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
                    <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                      {['No','Nomor','Jenis Layanan','Nama Leads','Mitra','Tgl Deal','Aksi'].map(h => (
                        <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {dealLeadsList.map((item: any, i: number) => (
                        <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{i+1}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.nomor||'-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>
                            {item.layanan?.nama || '-'}{item.tier_nama ? ' · '+item.tier_nama : ''}
                          </td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.nama_leads||'-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra?.user?.name || <span style={{color:'#f59e0b'}}>Belum assign</span>}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.deal_at ? new Date(item.deal_at).toLocaleDateString('id-ID') : '-'}</td>
                          <td style={{ padding:'12px 16px' }}>
                            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                              <button onClick={() => setLeadDetail({ type:'lead', item })} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                                <Eye size={12}/>Detail
                              </button>
                              <button onClick={() => setExchangeTarget(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(139,92,246,0.1)', border:'1px solid rgba(139,92,246,0.2)', borderRadius:'8px', color:'#8b5cf6', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                                <Repeat size={12}/>Exchange
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {dealLeadsList.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada leads Deal</div>}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab: Exchange (histori tukar mitra) */}
          {ccSubTab === 'exchange' && (
            <div style={cardStyle}>
              {loadingExchangeList ? (
                <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
              ) : (
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'700px' }}>
                    <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                      {['No','Nomor','Leads','Mitra Lama','Mitra Baru','Alasan','Tanggal','Aksi'].map(h => (
                        <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                      ))}
                    </tr></thead>
                    <tbody>
                      {exchangeList.map((item: any, i: number) => (
                        <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{i+1}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.nomor||'-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'13px', fontWeight:600, color:'var(--text)' }}>
                            {item.lead?.nama_leads || '-'} <span style={{color:'var(--text3)', fontWeight:400}}>({item.lead?.nomor||'-'})</span>
                          </td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra_lama?.user?.name || '-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.mitra_baru?.user?.name || '-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.alasan||'-'}</td>
                          <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.exchanged_at ? new Date(item.exchanged_at).toLocaleDateString('id-ID') : '-'}</td>
                          <td style={{ padding:'12px 16px' }}>
                            <button onClick={() => setLeadDetail({ type:'exchange', item })} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                              <Eye size={12}/>Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {exchangeList.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada histori exchange</div>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB KLIEN */}
      {activeTab === 'klien' && (
        <div style={cardStyle}>
          {loading ? (
            <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'52px', marginBottom:'8px' }} />)}</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['No','Nama','Email','Telepon','Tipe','Status','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {klienPg.paged.map((item: any, i: number) => (
                    <tr key={item.id||i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text3)', fontWeight:600 }}>{(klienPg.page-1)*klienPg.perPage+i+1}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(236,72,153,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontSize:'12px', fontWeight:700 }}>
                            {(item.nama_lengkap||item.user?.name||'K')[0].toUpperCase()}
                          </div>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.nama_lengkap||item.user?.name||'-'}</p>
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.user?.email||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)' }}>{item.user?.phone||'-'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{item.tipe||'-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <span style={{ background:'rgba(16,185,129,0.15)', color:'#10b981', border:'1px solid rgba(16,185,129,0.3)', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>
                          {item.status||'Aktif'}
                        </span>
                      </td>
                      <td style={{ padding:'12px 16px' }}>
                        <button onClick={() => setDetail(item)} style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', cursor:'pointer' }}>
                          <Eye size={12}/>Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination page={klienPg.page} totalPages={klienPg.totalPages} total={klienPg.total} onPageChange={klienPg.setPage} label="klien" />
              {klien.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data klien</div>}
            </div>
          )}
        </div>
      )}

      {/* TAB PASIEN */}
      {activeTab === 'pasien' && (
        <div className="space-y-3">
          {pasienList.length === 0 ? (
            <div style={{...cardStyle, textAlign:'center', padding:'40px', color:'var(--text3)'}}>Belum ada data klien</div>
          ) : pasienList.map((item: any) => {
            const isExpanded = expandedKlien === item.id;
            const pasiens = pasienDetail[item.id] || [];
            return (
              <div key={item.id} style={cardStyle}>
                {/* Header klien */}
                <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}
                  onClick={async () => {
                    if (isExpanded) { setExpandedKlien(null); return; }
                    setExpandedKlien(item.id);
                    if (!pasienDetail[item.id]) {
                      setLoadingPasien(item.id);
                      try {
                        const r: any = await apiClient.get('/internal/cc/klien/' + item.id);
                        const p = r.data?.data?.pasien || r.data?.data?.pasiens || [];
                        setPasienDetail(prev => ({...prev, [item.id]: p}));
                      } catch {}
                      setLoadingPasien(null);
                    }
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(236,72,153,0.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontWeight:700, fontSize:'14px' }}>
                      {(item.nama_lengkap||item.user?.name||'K')[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>{item.nama_lengkap||item.user?.name||'-'}</p>
                      <p style={{ color:'var(--text3)', fontSize:'11px', textTransform:'capitalize' }}>{item.tipe||'individu'} · {item.total_pasien||0} pasien</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                    <button onClick={e => { e.stopPropagation(); setFormPasien(p => ({...p, klien_id: item.id})); setShowFormPasien(true); }}
                      style={{ display:'flex', alignItems:'center', gap:'4px', padding:'5px 10px', background:'rgba(236,72,153,0.1)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'8px', color:'#ec4899', fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                      <Plus size={11}/>Tambah
                    </button>
                    <span style={{ color:'var(--text3)', fontSize:'18px', lineHeight:1 }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Daftar pasien */}
                {isExpanded && (
                  <div style={{ borderTop:'1px solid var(--border)' }}>
                    {loadingPasien === item.id ? (
                      <div style={{ padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>Memuat pasien...</div>
                    ) : pasiens.length === 0 ? (
                      <div style={{ padding:'16px', textAlign:'center', color:'var(--text3)', fontSize:'13px' }}>Belum ada pasien terdaftar</div>
                    ) : pasiens.map((p: any, i: number) => (
                      <div key={p.id||i} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px 16px', borderBottom: i < pasiens.length-1 ? '1px solid var(--border)' : 'none', background:'rgba(236,72,153,0.03)' }}>
                        <div style={{ width:'30px', height:'30px', borderRadius:'8px', background:'rgba(236,72,153,0.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#ec4899', fontSize:'12px', fontWeight:700, flexShrink:0 }}>
                          {(p.nama_lengkap||'P')[0].toUpperCase()}
                        </div>
                        <div style={{ flex:1 }}>
                          <p style={{ fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{p.nama_lengkap||'-'}</p>
                          <p style={{ color:'var(--text3)', fontSize:'11px' }}>
                            {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                            {p.tanggal_lahir ? ' · ' + (new Date().getFullYear() - new Date(p.tanggal_lahir).getFullYear()) + ' tahun' : ''}
                            {p.golongan_darah ? ' · Gol. ' + p.golongan_darah : ''}
                          </p>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          {p.riwayat_penyakit && <p style={{ color:'var(--text3)', fontSize:'11px', maxWidth:'120px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.riwayat_penyakit}</p>}
                          {p.alergi && <p style={{ color:'#f59e0b', fontSize:'10px' }}>⚠️ {p.alergi}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB FEEDBACK */}
      {activeTab === 'feedback' && (
        <div style={cardStyle}>
          {feedbackList.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
              <MessageSquare size={36} style={{ opacity:0.3, margin:'0 auto 10px' }}/>
              <p>Belum ada feedback</p>
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'400px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Klien','Rating','Tipe','Catatan'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {feedbackList.map((item: any, i: number) => (
                    <tr key={i} style={{ borderBottom:'1px solid var(--border)' }}>
                      <td style={{ padding:'12px 16px', fontWeight:600, fontSize:'13px', color:'var(--text)' }}>{item.klien?.nama_lengkap||'-'}</td>
                      <td style={{ padding:'12px 16px' }}>
                        <div style={{ display:'flex', gap:'2px' }}>
                          {[1,2,3,4,5].map(s => <span key={s} style={{ color: s<=(item.rating_average||item.rating_kualitas||item.rating||0)?'#f59e0b':'var(--border)', fontSize:'14px' }}>★</span>)}
                        </div>
                      </td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', textTransform:'capitalize' }}>{item.tipe||item.tipe_feedback||'layanan'}</td>
                      <td style={{ padding:'12px 16px', fontSize:'12px', color:'var(--text2)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.komentar||item.catatan||'-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-3">
          {loadingReport ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Memuat report...</div>
          ) : report ? (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'12px' }}>
                {[
                  { label:'Total Klien', value: klien.length, color:'#ec4899' },
                  { label:'Handling', value: report.handling?.total||0, color:'#3b82f6' },
                  { label:'Deal', value: report.deal?.total||0, color:'#10b981' },
                  { label:'Loss', value: report.loss?.total||0, color:'#ef4444' },
                ].map(card => (
                  <div key={card.label} style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                    <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'6px' }}>{card.label}</p>
                    <p style={{ fontWeight:700, fontSize:'28px', color: card.color }}>{card.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:'var(--glass)', border:'1px solid var(--glass-border)', borderRadius:'16px', padding:'16px' }}>
                <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)', marginBottom:'12px' }}>Konversi Rate</p>
                {[
                  { label:'Deal Rate', value: klien.length > 0 ? Math.round(((report.deal?.total||0)/klien.length)*100) : 0, color:'#10b981' },
                  { label:'Loss Rate', value: klien.length > 0 ? Math.round(((report.loss?.total||0)/klien.length)*100) : 0, color:'#ef4444' },
                ].map(item => (
                  <div key={item.label} style={{ marginBottom:'10px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                      <span style={{ fontSize:'12px', color:'var(--text2)', fontWeight:500 }}>{item.label}</span>
                      <span style={{ fontSize:'12px', color:'var(--text3)' }}>{item.value}%</span>
                    </div>
                    <div style={{ height:'6px', background:'var(--border)', borderRadius:'3px', overflow:'hidden' }}>
                      <div style={{ height:'100%', width: item.value+'%', background: item.color, borderRadius:'3px', transition:'width 0.5s' }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Gagal memuat report</div>
          )}
        </div>
      )}

      {/* Modal Kredensial Klien */}
      {kredensial && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--card)', borderRadius:'20px', padding:'28px', width:'100%', maxWidth:'380px' }}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <div style={{ width:'56px', height:'56px', borderRadius:'16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <Check size={28} color="white"/>
              </div>
              <h3 style={{ fontWeight:700, fontSize:'17px', color:'var(--text)' }}>Klien Berhasil Didaftarkan!</h3>
            </div>
            <div style={{ background:'rgba(236,72,153,0.08)', border:'1px solid rgba(236,72,153,0.2)', borderRadius:'14px', padding:'16px', marginBottom:'16px' }}>
              {[{label:'Nama', value: kredensial.name},{label:'Email', value: kredensial.email},{label:'Password', value: kredensial.password}].map(item => (
                <div key={item.label} style={{ marginBottom:'10px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'11px' }}>{item.label}</p>
                  <p style={{ color: item.label==='Password'?'#ec4899':'var(--text)', fontSize:'14px', fontWeight:700 }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)', borderRadius:'10px', padding:'10px 12px', marginBottom:'16px' }}>
              <p style={{ color:'#f59e0b', fontSize:'12px' }}>⚠️ Catat dan bagikan ke klien. Password tidak bisa dilihat lagi.</p>
            </div>
            <button onClick={() => setKredensial(null)} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'14px', cursor:'pointer' }}>
              Sudah Dicatat, Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal Assign Mitra */}
      {showAssign && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'400px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Assign Mitra ke Order #{assignOrderId}</h2>
              <button onClick={() => setShowAssign(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleAssignMitra} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Pilih Mitra *</label>
                <select required value={assignMitraId} onChange={e => setAssignMitraId(e.target.value)} style={inp}>
                  <option value="">-- Pilih Mitra --</option>
                  {mitraList.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.user?.name} ({m.status})</option>
                  ))}
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowAssign(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingAssign} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #3b82f6, #2563eb)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingAssign ? 'Menyimpan...' : 'Assign Mitra'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Tambah Leads */}
      {showFormLead && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Tambah Leads Baru</h2>
              <button onClick={() => setShowFormLead(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleCreateLead} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Jenis Layanan</label>
                  <select value={formLead.cms_layanan_id} onChange={e => setFormLead(f => ({ ...f, cms_layanan_id: e.target.value, tier_nama:'' }))} style={inp}>
                    <option value="">-- Pilih Layanan --</option>
                    {cmsLayananList.map((l: any) => (
                      <option key={l.id} value={l.id}>{l.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tier</label>
                  <select value={formLead.tier_nama} onChange={e => setFormLead(f => ({ ...f, tier_nama: e.target.value }))} style={inp} disabled={!formLead.cms_layanan_id || getTiersFor(formLead.cms_layanan_id).length === 0}>
                    <option value="">-- Tanpa Tier --</option>
                    {getTiersFor(formLead.cms_layanan_id).map((t: any, i: number) => (
                      <option key={i} value={t.nama}>{t.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ position:'relative' }}>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Cari Klien Terdaftar (opsional)</label>
                {selectedKlienForLead ? (
                  <div style={{ ...inp, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ color:'var(--text)', fontWeight:600 }}>
                      {selectedKlienForLead.nama_lengkap || selectedKlienForLead.user?.name} — {selectedKlienForLead.user?.phone || 'no telp -'}
                    </span>
                    <button type="button" onClick={() => setFormLead(f => ({ ...f, klien_id:'' }))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text3)', display:'flex' }}>
                      <X size={14}/>
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      value={klienSearch}
                      onChange={e => { setKlienSearch(e.target.value); setShowKlienResults(true); }}
                      onFocus={() => setShowKlienResults(true)}
                      onBlur={() => setTimeout(() => setShowKlienResults(false), 150)}
                      style={inp}
                      placeholder="Ketik nama atau no. telp klien..."
                    />
                    {showKlienResults && klienSearch.trim().length >= 2 && (
                      <div style={{ position:'absolute', zIndex:20, top:'100%', left:0, right:0, marginTop:'4px', background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'12px', maxHeight:'200px', overflowY:'auto', boxShadow:'0 8px 24px rgba(0,0,0,0.25)' }}>
                        {klienSearchResults.length === 0 ? (
                          <div style={{ padding:'12px', fontSize:'12px', color:'var(--text3)' }}>Klien tidak ditemukan</div>
                        ) : klienSearchResults.map((k: any) => (
                          <div key={k.id}
                            onMouseDown={() => {
                              setFormLead(f => ({ ...f, klien_id: k.id, nama_leads: k.nama_lengkap || k.user?.name || f.nama_leads, kontak: k.user?.phone || f.kontak }));
                              setKlienSearch('');
                              setShowKlienResults(false);
                            }}
                            style={{ padding:'10px 12px', fontSize:'13px', color:'var(--text)', cursor:'pointer', borderBottom:'1px solid var(--border)' }}>
                            <div style={{ fontWeight:600 }}>{k.nama_lengkap || k.user?.name || '-'}</div>
                            <div style={{ fontSize:'11px', color:'var(--text3)' }}>{k.user?.phone || k.user?.email || '-'}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Nama Leads (Cust/PJ) *</label>
                <input required value={formLead.nama_leads} onChange={e => setFormLead(f => ({ ...f, nama_leads: e.target.value }))} style={inp} placeholder="Nama penanggung jawab" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>No. Kontak/WA *</label>
                  <input required value={formLead.kontak} onChange={e => setFormLead(f => ({ ...f, kontak: e.target.value }))} style={inp} placeholder="0812xxxxxxx" />
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Sumber</label>
                  <select value={formLead.sumber} onChange={e => setFormLead(f => ({ ...f, sumber: e.target.value }))} style={inp}>
                    {['WhatsApp','Instagram','Telepon','Website','Referral','Lainnya'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Nama Pasien (Klien)</label>
                <input value={formLead.nama_pasien} onChange={e => setFormLead(f => ({ ...f, nama_pasien: e.target.value }))} style={inp} placeholder="Opsional" />
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Catatan</label>
                <textarea value={formLead.catatan} onChange={e => setFormLead(f => ({ ...f, catatan: e.target.value }))} style={{...inp, minHeight:'70px', resize:'vertical'}} placeholder="Opsional" />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowFormLead(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingLead} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingLead ? 'Menyimpan...' : 'Simpan Leads'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Deal */}
      {dealTarget && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'400px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Tandai Deal — {dealTarget.nama_leads}</h2>
              <button onClick={() => { setDealTarget(null); setDealMitraId(''); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleMarkDeal} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Assign Mitra (opsional)</label>
                <select value={dealMitraId} onChange={e => setDealMitraId(e.target.value)} style={inp}>
                  <option value="">-- Belum Assign --</option>
                  {mitraList.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.user?.name} ({m.status})</option>
                  ))}
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => { setDealTarget(null); setDealMitraId(''); }} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingDeal} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #10b981, #059669)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingDeal ? 'Menyimpan...' : 'Tandai Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Batal (Loss) */}
      {batalTarget && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'400px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Tandai Batal — {batalTarget.nama_leads}</h2>
              <button onClick={() => { setBatalTarget(null); setAlasanBatal(''); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleMarkBatal} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Alasan Batal *</label>
                <textarea required value={alasanBatal} onChange={e => setAlasanBatal(e.target.value)} style={{...inp, minHeight:'80px', resize:'vertical'}} placeholder="Jelaskan alasan leads batal/loss" />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => { setBatalTarget(null); setAlasanBatal(''); }} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingBatal} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ef4444, #b91c1c)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingBatal ? 'Menyimpan...' : 'Tandai Batal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Log Exchange */}
      {exchangeTarget && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'420px', padding:'24px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Exchange Mitra — {exchangeTarget.nama_leads}</h2>
              <button onClick={() => { setExchangeTarget(null); setExchangeMitraId(''); setExchangeAlasan(''); }} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'14px' }}>
              Mitra saat ini: <strong style={{color:'var(--text2)'}}>{exchangeTarget.mitra?.user?.name || 'Belum assign'}</strong>
            </p>
            <form onSubmit={handleLogExchange} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Mitra Baru *</label>
                <select required value={exchangeMitraId} onChange={e => setExchangeMitraId(e.target.value)} style={inp}>
                  <option value="">-- Pilih Mitra Baru --</option>
                  {mitraList.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.user?.name} ({m.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Alasan Exchange *</label>
                <textarea required value={exchangeAlasan} onChange={e => setExchangeAlasan(e.target.value)} style={{...inp, minHeight:'80px', resize:'vertical'}} placeholder="Jelaskan alasan penggantian mitra" />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => { setExchangeTarget(null); setExchangeMitraId(''); setExchangeAlasan(''); }} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingExchange} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #8b5cf6, #7c3aed)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingExchange ? 'Menyimpan...' : 'Catat Exchange'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Leads / Deal / Exchange */}
      {leadDetail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>
                {leadDetail.type === 'exchange' ? 'Detail Exchange' : 'Detail Leads'}
              </h2>
              <button onClick={() => setLeadDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>

            {leadDetail.type === 'lead' ? (() => {
              const item = leadDetail.item;
              const s = leadStatusMap[item.status] ?? leadStatusMap[0];
              return (
                <div>
                  <div style={{ background:'linear-gradient(135deg, #ec4899, #8b5cf6)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
                    <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'11px' }}>Nomor Leads</p>
                    <p style={{ color:'white', fontWeight:700, fontSize:'16px' }}>{item.nomor || '#'+item.id}</p>
                    <span style={{ display:'inline-block', marginTop:'8px', background:'rgba(255,255,255,0.2)', color:'white', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{s.label}</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {buildLeadDetailRows(item).map(row => (
                      <div key={row.label}>
                        <p style={{ color:'var(--text3)', fontSize:'11px' }}>{row.label}</p>
                        <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:600 }}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => downloadBlob(buildSimplePdfBlob('Detail Leads — '+(item.nomor||item.id), 'Mikala Global Medika', buildLeadDetailRows(item)), 'leads-'+(item.nomor||item.id)+'.pdf')}
                    style={{ marginTop:'16px', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                    <Download size={14}/>Download PDF
                  </button>
                </div>
              );
            })() : (() => {
              const item = leadDetail.item;
              return (
                <div>
                  <div style={{ background:'linear-gradient(135deg, #8b5cf6, #7c3aed)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
                    <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'11px' }}>Nomor Exchange</p>
                    <p style={{ color:'white', fontWeight:700, fontSize:'16px' }}>{item.nomor || '#'+item.id}</p>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                    {buildExchangeDetailRows(item).map(row => (
                      <div key={row.label}>
                        <p style={{ color:'var(--text3)', fontSize:'11px' }}>{row.label}</p>
                        <p style={{ color:'var(--text)', fontSize:'13px', fontWeight:600 }}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => downloadBlob(buildSimplePdfBlob('Detail Exchange — '+(item.nomor||item.id), 'Mikala Global Medika', buildExchangeDetailRows(item)), 'exchange-'+(item.nomor||item.id)+'.pdf')}
                    style={{ marginTop:'16px', width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                    <Download size={14}/>Download PDF
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal Form Order */}
      {showFormOrder && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'520px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Buat Order Layanan</h2>
              <button onClick={() => setShowFormOrder(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleCreateOrder} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Klien *</label>
                  <select required value={formOrder.klien_id} onChange={e => setFormOrder(p => ({...p, klien_id: e.target.value}))} style={inp}>
                    <option value="">-- Pilih Klien --</option>
                    {klien.map((k: any) => <option key={k.id} value={k.id}>{k.nama_lengkap||k.user?.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Mitra (opsional)</label>
                  <select value={formOrder.mitra_id} onChange={e => setFormOrder(p => ({...p, mitra_id: e.target.value}))} style={inp}>
                    <option value="">-- Auto assign --</option>
                    {mitraList.map((m: any) => <option key={m.id} value={m.id}>{m.user?.name} ({m.status})</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe Layanan *</label>
                <select required value={formOrder.layanan_type} onChange={e => setFormOrder(p => ({...p, layanan_type: e.target.value}))} style={inp}>
                  {['homecare_harian','homecare_live_in','medical_checkup','konsultasi','fisioterapi','perawatan_luka','vaksinasi','lainnya'].map(t => (
                    <option key={t} value={t}>{t.replace(/_/g,' ')}</option>
                  ))}
                </select>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tanggal Mulai *</label>
                  <input required type="date" value={formOrder.tanggal_mulai} onChange={e => setFormOrder(p => ({...p, tanggal_mulai: e.target.value}))} style={inp} />
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tanggal Selesai</label>
                  <input type="date" value={formOrder.tanggal_selesai} onChange={e => setFormOrder(p => ({...p, tanggal_selesai: e.target.value}))} style={inp} />
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Lokasi</label>
                <input value={formOrder.lokasi} onChange={e => setFormOrder(p => ({...p, lokasi: e.target.value}))} style={inp} placeholder="Alamat layanan" />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Harga/Shift (Rp) *</label>
                  <input required type="number" value={formOrder.harga_per_shift} onChange={e => setFormOrder(p => ({...p, harga_per_shift: e.target.value}))} style={inp} placeholder="150000" />
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Total Shift *</label>
                  <input required type="number" value={formOrder.total_shift} onChange={e => setFormOrder(p => ({...p, total_shift: e.target.value}))} style={inp} placeholder="1" />
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Deskripsi</label>
                <textarea value={formOrder.deskripsi} onChange={e => setFormOrder(p => ({...p, deskripsi: e.target.value}))} style={{...inp, minHeight:'60px', resize:'vertical'}} placeholder="Kebutuhan khusus..." />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowFormOrder(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingOrder} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingOrder ? 'Membuat...' : 'Buat Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Klien */}
      {showFormKlien && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Daftarkan Klien Baru</h2>
              <button onClick={() => setShowFormKlien(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleRegisterKlien} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {[
                { key:'nama', label:'Nama Lengkap *', type:'text', placeholder:'Nama klien' },
                { key:'email', label:'Email *', type:'email', placeholder:'email@contoh.com' },
                { key:'phone', label:'Nomor HP *', type:'text', placeholder:'08xxxxxxxxxx' },
                { key:'password', label:'Password *', type:'password', placeholder:'Min. 8 karakter' },
                { key:'alamat', label:'Alamat *', type:'text', placeholder:'Alamat lengkap' },
                { key:'kota', label:'Kota', type:'text', placeholder:'Jakarta' },
                { key:'provinsi', label:'Provinsi', type:'text', placeholder:'DKI Jakarta' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input type={f.type} value={(formKlien as any)[f.key]} onChange={e => setFormKlien(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                </div>
              ))}
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Tipe Klien</label>
                <select value={formKlien.tipe} onChange={e => setFormKlien(p => ({...p, tipe: e.target.value}))} style={inp}>
                  {['individu','keluarga','rumah_sakit','panti_jompo','klinik'].map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
                </select>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowFormKlien(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingKlien} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingKlien ? 'Mendaftarkan...' : 'Daftarkan Klien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Pasien */}
      {showFormPasien && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', overflowY:'auto' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', margin:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'20px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>Daftarkan Pasien</h2>
              <button onClick={() => setShowFormPasien(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>
            <form onSubmit={handleRegisterPasien} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Klien *</label>
                <select required value={formPasien.klien_id} onChange={e => setFormPasien(p => ({...p, klien_id: e.target.value}))} style={inp}>
                  <option value="">-- Pilih Klien --</option>
                  {klien.map((k: any) => <option key={k.id} value={k.id}>{k.nama_lengkap||k.user?.name}</option>)}
                </select>
              </div>
              {[
                { key:'nama_lengkap', label:'Nama Lengkap *', type:'text', placeholder:'Nama pasien' },
                { key:'tanggal_lahir', label:'Tanggal Lahir *', type:'date', placeholder:'' },
                { key:'alamat', label:'Alamat *', type:'text', placeholder:'Alamat pasien' },
                { key:'riwayat_penyakit', label:'Riwayat Penyakit', type:'text', placeholder:'Penyakit yang pernah diderita' },
                { key:'alergi', label:'Alergi', type:'text', placeholder:'Alergi obat, makanan, dll' },
                { key:'kontak_darurat_nama', label:'Nama Kontak Darurat', type:'text', placeholder:'Nama' },
                { key:'kontak_darurat_phone', label:'HP Kontak Darurat', type:'text', placeholder:'08xxxxxxxxxx' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>{f.label}</label>
                  <input type={f.type} value={(formPasien as any)[f.key]} onChange={e => setFormPasien(p => ({...p, [f.key]: e.target.value}))} placeholder={f.placeholder} style={inp} />
                </div>
              ))}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Jenis Kelamin</label>
                  <select value={formPasien.jenis_kelamin} onChange={e => setFormPasien(p => ({...p, jenis_kelamin: e.target.value}))} style={inp}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'5px' }}>Golongan Darah</label>
                  <select value={formPasien.golongan_darah} onChange={e => setFormPasien(p => ({...p, golongan_darah: e.target.value}))} style={inp}>
                    <option value="">-</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="AB">AB</option>
                    <option value="O">O</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'flex', gap:'10px', marginTop:'4px' }}>
                <button type="button" onClick={() => setShowFormPasien(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingPasien} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:700, fontSize:'13px', cursor:'pointer' }}>
                  {savingPasien ? 'Mendaftarkan...' : 'Daftarkan Pasien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Form Feedback */}
      {showFormFeedback && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', borderRadius:'20px', padding:'24px', width:'100%', maxWidth:'420px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h3 style={{ fontWeight:700, fontSize:'16px', color:'var(--text)' }}>Form Feedback Klien</h3>
              <button onClick={() => setShowFormFeedback(false)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', padding:'6px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={15}/></button>
            </div>
            <form onSubmit={handleSubmitFeedback} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Pilih Klien</label>
                <select required value={formFeedback.klien_id} onChange={e => setFormFeedback(p => ({...p, klien_id: e.target.value}))} style={inp}>
                  <option value="">-- Pilih Klien --</option>
                  {klien.map((k: any) => <option key={k.id} value={k.id}>{k.nama_lengkap||k.user?.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Rating</label>
                <div style={{ display:'flex', gap:'8px' }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setFormFeedback(p => ({...p, rating: String(n)}))}
                      style={{ width:'40px', height:'40px', borderRadius:'10px', border:'1px solid var(--border)', background: Number(formFeedback.rating)>=n?'rgba(245,158,11,0.2)':'var(--glass)', cursor:'pointer', color: Number(formFeedback.rating)>=n?'#f59e0b':'var(--text3)', fontWeight:700 }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Tipe Feedback</label>
                <select value={formFeedback.tipe} onChange={e => setFormFeedback(p => ({...p, tipe: e.target.value}))} style={inp}>
                  <option value="layanan">Layanan</option>
                  <option value="mitra">Mitra</option>
                  <option value="umum">Umum</option>
                </select>
              </div>
              <div>
                <label style={{ color:'var(--text2)', fontSize:'12px', fontWeight:500, display:'block', marginBottom:'6px' }}>Catatan</label>
                <textarea value={formFeedback.catatan} onChange={e => setFormFeedback(p => ({...p, catatan: e.target.value}))} style={{...inp, minHeight:'80px', resize:'vertical'}} placeholder="Catatan feedback..." />
              </div>
              <div style={{ display:'flex', gap:'10px' }}>
                <button type="button" onClick={() => setShowFormFeedback(false)} style={{ flex:1, padding:'10px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'12px', color:'var(--text2)', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>Batal</button>
                <button type="submit" disabled={savingFeedback} style={{ flex:2, padding:'10px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer' }}>
                  {savingFeedback ? 'Menyimpan...' : 'Simpan Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {detail && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'24px', width:'100%', maxWidth:'480px', padding:'24px', maxHeight:'85vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'16px' }}>
              <h2 style={{ fontSize:'17px', fontWeight:700, color:'var(--text)' }}>
                {activeTab === 'layanan' ? 'Detail Order' : 'Detail'}
              </h2>
              <button onClick={() => setDetail(null)} style={{ background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', padding:'7px', cursor:'pointer', color:'var(--text2)', display:'flex' }}><X size={16}/></button>
            </div>

            {(activeTab === 'layanan') ? (
              <div>
                {/* Order header */}
                <div style={{ background:'linear-gradient(135deg, #ec4899, #8b5cf6)', borderRadius:'14px', padding:'14px', marginBottom:'16px' }}>
                  <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'11px' }}>Order Number</p>
                  <p style={{ color:'white', fontWeight:700, fontSize:'16px' }}>{detail.order_number||'#'+detail.id}</p>
                  <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                    {(() => { const cfg = statusMap[detail.status]||statusMap.pending; return (
                      <span style={{ background:'rgba(255,255,255,0.2)', color:'white', borderRadius:'8px', padding:'3px 10px', fontSize:'11px', fontWeight:600 }}>{cfg.label}</span>
                    ); })()}
                  </div>
                </div>

                {[
                  { label:'Klien', value: detail.klien?.nama_lengkap || detail.klien?.user?.name || '-' },
                  { label:'Mitra', value: detail.mitra?.user?.name || detail.mitra?.nama_lengkap || 'Belum assign' },
                  { label:'Pasien', value: detail.pasien?.nama_lengkap || '-' },
                  { label:'Tipe Layanan', value: (detail.tipe_layanan||'-').replace(/_/g,' ') },
                  { label:'Lokasi', value: detail.lokasi || detail.alamat_layanan || '-' },
                  { label:'Tanggal Mulai', value: detail.tanggal_mulai ? new Date(detail.tanggal_mulai).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : '-' },
                  { label:'Tanggal Selesai', value: detail.tanggal_selesai ? new Date(detail.tanggal_selesai).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : 'Ongoing' },
                  { label:'Durasi', value: detail.durasi_hari ? detail.durasi_hari+' hari' : '-' },
                  { label:'Harga/Hari', value: detail.harga_per_hari ? 'Rp '+Number(detail.harga_per_hari).toLocaleString('id') : '-' },
                  { label:'Total', value: 'Rp '+Number(detail.total||detail.total_amount||0).toLocaleString('id') },
                  { label:'Catatan', value: detail.catatan || '-' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px', flexShrink:0 }}>{item.label}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px', fontWeight:500, textTransform:'capitalize' }}>{item.value}</span>
                  </div>
                ))}

                <div style={{ marginTop:'16px' }}>
                  <p style={{ color:'var(--text3)', fontSize:'12px', marginBottom:'8px' }}>Update Status:</p>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                    {Object.entries(statusMap).map(([s,cfg]: any) => (
                      <button key={s} onClick={() => updateLayananStatus(detail.id, s)}
                        style={{ padding:'7px 12px', borderRadius:'10px', border:'1px solid '+cfg.border, background: detail.status===s?cfg.bg:'transparent', color:cfg.color, fontSize:'11px', fontWeight:600, cursor:'pointer' }}>
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {Object.entries(detail).filter(([k]) => !['id','created_at','updated_at','deleted_at','user','klien','mitra','pasien'].includes(k)).map(([k,v]: any) => (
                  <div key={k} style={{ display:'flex', gap:'12px', padding:'8px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:'12px', minWidth:'120px', textTransform:'capitalize', flexShrink:0 }}>{k.replace(/_/g,' ')}</span>
                    <span style={{ color:'var(--text)', fontSize:'13px' }}>{typeof v==='object'?'-':String(v??'-')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
