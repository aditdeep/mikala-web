'use client';
import React from 'react';

interface Props {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (p: number) => void;
  label?: string;
}

export default function Pagination({ page, totalPages, total, onPageChange, label = 'data' }: Props) {
  if (total === 0) return null;
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderTop:'1px solid var(--border)', flexWrap:'wrap', gap:'10px' }}>
      <span style={{ fontSize:'12px', color:'var(--text3)' }}>Hal {page} dari {totalPages} · {total} {label}</span>
      <div style={{ display:'flex', gap:'8px' }}>
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1}
          style={{ padding:'6px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>‹ Prev</button>
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          style={{ padding:'6px 14px', background:'var(--glass)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text)', fontSize:'13px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>Next ›</button>
      </div>
    </div>
  );
}
