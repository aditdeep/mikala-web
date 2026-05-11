'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@mikala/lib';
import { Headphones, Search, Plus, ChevronRight } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    apiClient.get('/internal/customer-care/orders')
      .then((res: any) => {
        const d = res.data?.data;
        setData(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => { setData([]); setLoading(false); });
  }, []);

  const filtered = data.filter((item: any) =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontSize:'22px', fontWeight:700, color:'var(--text)' }}>Customer Care</h1>
          <p style={{ color:'var(--text3)', fontSize:'13px', marginTop:'2px' }}>{data.length} total data</p>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', background:'linear-gradient(135deg, #ec4899, #8b5cf6)', border:'none', borderRadius:'12px', color:'white', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 4px 12px rgba(236,72,153,0.3)' }}>
          <Plus size={15} />Tambah
        </button>
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'16px', display:'flex', alignItems:'center', gap:'10px', padding:'11px 16px' }}>
        <Search size={15} style={{ color:'var(--text3)', flexShrink:0 }} />
        <input placeholder="Cari data..." value={search} onChange={e => setSearch(e.target.value)} style={{ background:'transparent', border:'none', outline:'none', color:'var(--text)', fontSize:'13px', width:'100%' }} />
      </div>

      <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        {loading ? (
          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background:'var(--glass)', borderRadius:'12px', height:'56px' }} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {Object.keys(filtered[0] || {}).slice(0,5).map(key => (
                    <th key={key} style={{ padding:'14px 16px', textAlign:'left', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{key}</th>
                  ))}
                  <th style={{ padding:'14px 16px', textAlign:'right', fontSize:'11px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0,20).map((item: any, i: number) => (
                  <tr key={item.id || i} style={{ borderBottom:'1px solid var(--border)', transition:'background 0.15s' }}>
                    {Object.values(item).slice(0,5).map((val: any, vi: number) => (
                      <td key={vi} style={{ padding:'13px 16px', fontSize:'13px', color:'var(--text)', maxWidth:'200px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {typeof val === 'object' ? JSON.stringify(val) : String(val ?? '-')}
                      </td>
                    ))}
                    <td style={{ padding:'13px 16px', textAlign:'right' }}>
                      <button style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'5px 12px', background:'rgba(124,58,237,0.1)', border:'1px solid rgba(124,58,237,0.2)', borderRadius:'8px', color:'var(--purple-light)', fontSize:'12px', fontWeight:500, cursor:'pointer' }}>
                        Detail <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'48px 20px' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'20px', margin:'0 auto 14px', background:'rgba(124,58,237,0.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Headphones size={28} style={{ color:'var(--purple-light)', opacity:0.5 }} />
            </div>
            <p style={{ fontWeight:600, color:'var(--text)', marginBottom:'6px' }}>Belum ada data</p>
            <p style={{ color:'var(--text3)', fontSize:'13px' }}>Data Customer Care akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}
