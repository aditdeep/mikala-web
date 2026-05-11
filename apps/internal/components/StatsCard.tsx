import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: string; isPositive: boolean };
  gradient?: string;
  glow?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, gradient = 'linear-gradient(135deg, #7c3aed, #4f46e5)', glow = 'rgba(124,58,237,0.3)' }: StatsCardProps) {
  return (
    <div style={{ background:'var(--glass)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid var(--glass-border)', borderRadius:'20px', padding:'20px', boxShadow:'var(--shadow)' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'16px' }}>
        <div style={{ width:'44px', height:'44px', borderRadius:'14px', background:gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${glow}` }}>
          <Icon size={20} color="white" />
        </div>
        {trend && (
          <div style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'8px', background: trend.isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: trend.isPositive ? '#10b981' : '#ef4444', fontSize:'12px', fontWeight:600 }}>
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}
          </div>
        )}
      </div>
      <p style={{ color:'var(--text3)', fontSize:'12px', fontWeight:500, marginBottom:'4px' }}>{title}</p>
      <p style={{ color:'var(--text)', fontSize:'22px', fontWeight:700, lineHeight:1 }}>{value}</p>
    </div>
  );
}
