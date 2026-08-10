'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@mikala/lib';
import { ArrowLeft, Briefcase, TrendingUp, XCircle, Download } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

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

function exportRowsToXls(filename: string, headers: string[], rows: (string|number)[][]) {
  const esc = (s: any) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let html = '<table><thead><tr>' + headers.map(h => '<th>'+esc(h)+'</th>').join('') + '</tr></thead><tbody>';
  rows.forEach(r => { html += '<tr>' + r.map(c => '<td>'+esc(c)+'</td>').join('') + '</tr>'; });
  html += '</tbody></table>';
  downloadBlob(new Blob(['﻿', html], { type: 'application/vnd.ms-excel' }), filename);
}

function computeMonthlyTrend(leads: any[], months = 6) {
  const now = new Date();
  const buckets: any[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'),
      label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }),
      Leads: 0, Deal: 0, Loss: 0,
    });
  }
  const findBucket = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
    return buckets.find(b => b.key === key) || null;
  };
  leads.forEach((l: any) => {
    const b1 = findBucket(l.created_at); if (b1) b1.Leads++;
    if (l.status === 1) { const b2 = findBucket(l.deal_at || l.created_at); if (b2) b2.Deal++; }
    if (l.status === 2) { const b3 = findBucket(l.batal_at || l.created_at); if (b3) b3.Loss++; }
  });
  return buckets;
}

export default function LaporanCustomerCarePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [leadsRaw, setLeadsRaw] = useState<any[]>([]);
  const [months, setMonths] = useState(6);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiClient.get('/internal/cc/leads/summary'),
      apiClient.get('/internal/cc/leads'),
    ]).then(([s, l]: any) => {
      setSummary(s.data?.data || null);
      setLeadsRaw(Array.isArray(l.data?.data) ? l.data.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const trend = computeMonthlyTrend(leadsRaw, months);
  const dealRate = summary?.total_leads ? Math.round((summary.total_deal / summary.total_leads) * 100) : 0;
  const lossRate = summary?.total_leads ? Math.round((summary.total_loss / summary.total_leads) * 100) : 0;

  const cardStyle = { background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden' };

  const handleExportTrend = () => {
    exportRowsToXls('cc-laporan-tren-'+new Date().toISOString().slice(0,10)+'.xls',
      ['Bulan','Leads','Deal','Loss'],
      trend.map(t => [t.label, t.Leads, t.Deal, t.Loss]));
  };

  const handleExportLayanan = () => {
    const rows = (summary?.by_layanan || []).map((r: any, i: number) => [i+1, r.layanan_nama, r.tier_nama||'-', r.leads, r.deal, r.loss, r.exchange]);
    exportRowsToXls('cc-laporan-layanan-'+new Date().toISOString().slice(0,10)+'.xls', ['No','Jenis Layanan','Tier','Leads','Deal','Loss','Exchange'], rows);
  };

  return (
    <div className="space-y-4">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px' }}>
        <div>
          <button onClick={() => router.back()} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'10px', color:'var(--text2)', fontSize:'13px', fontWeight:600, cursor:'pointer', marginBottom:'10px' }}>
            <ArrowLeft size={15}/>Kembali
          </button>
          <h1 style={{ fontSize:'20px', fontWeight:700, color:'var(--text)' }}>Laporan Customer Care</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px' }}>Ringkasan performa Leads pipeline dari waktu ke waktu</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding:'20px' }}>{[1,2,3].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'10px', height:'80px', marginBottom:'8px' }} />)}</div>
      ) : (
        <>
          {/* Summary cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:'12px' }}>
            {[
              { icon: Briefcase,  label:'Total Leads', value: summary?.total_leads ?? 0, sub: null, gradient:'linear-gradient(135deg, #ec4899, #8b5cf6)' },
              { icon: TrendingUp, label:'Deal',        value: summary?.total_deal ?? 0,  sub: dealRate+'% dari total leads', gradient:'linear-gradient(135deg, #10b981, #059669)' },
              { icon: XCircle,    label:'Loss',        value: summary?.total_loss ?? 0,  sub: lossRate+'% dari total leads', gradient:'linear-gradient(135deg, #ef4444, #b91c1c)' },
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
                      {s.sub && <p style={{ color:'var(--text3)', fontSize:'11px' }}>{s.sub}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trend chart */}
          <div style={cardStyle}>
            <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', borderBottom:'1px solid var(--border)' }}>
              <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Tren Bulanan (Leads / Deal / Loss)</p>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <select value={months} onChange={e => setMonths(Number(e.target.value))} style={{ padding:'6px 10px', background:'var(--bg)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'12px' }}>
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan</option>
                  <option value={12}>12 Bulan</option>
                </select>
                <button onClick={handleExportTrend} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                  <Download size={13}/>.xls
                </button>
              </div>
            </div>
            <div style={{ padding:'20px', height:'320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="label" stroke="var(--text3)" fontSize={12} />
                  <YAxis stroke="var(--text3)" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'10px', fontSize:'12px' }} />
                  <Legend wrapperStyle={{ fontSize:'12px' }} />
                  <Line type="monotone" dataKey="Leads" stroke="#ec4899" strokeWidth={2} />
                  <Line type="monotone" dataKey="Deal" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="Loss" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown per jenis layanan */}
          <div style={cardStyle}>
            <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--border)' }}>
              <p style={{ fontWeight:700, fontSize:'14px', color:'var(--text)' }}>Breakdown per Jenis Layanan</p>
              <button onClick={handleExportLayanan} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text2)', fontSize:'12px', fontWeight:600, cursor:'pointer' }}>
                <Download size={13}/>.xls
              </button>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'600px' }}>
                <thead><tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['No','Jenis Layanan','Tier','Leads','Deal','Loss','Exchange'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {(summary?.by_layanan || []).map((row: any, i: number) => (
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
              {(!summary?.by_layanan || summary.by_layanan.length === 0) && (
                <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>Belum ada data</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
