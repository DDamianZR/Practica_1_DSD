import { useSimStore } from '../../store/simulation';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

export function StateTable({ compact = false }: { compact?: boolean }) {
  const history = useSimStore((s) => s.history);

  const displayHistory = compact ? history.slice(-10) : history;

  function exportCSV() {
    const headers = ['Ciclo', 'D_in', 'Q0', 'Q1', 'Q2', 'Q3', 'S_OUT'];
    const rows = history.map((h) => [
      h.cycle,
      h.dataIn ? 1 : 0,
      ...h.q.map((v) => (v ? 1 : 0)),
      h.serialOut ? 1 : 0,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'siso-history.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const BitCell = ({ value, color }: { value: boolean; color?: string }) => (
    <td
      className="font-mono font-bold text-center px-2 py-1.5"
      style={{
        color: value
          ? color || 'var(--accent-green)'
          : 'var(--text-muted)',
        fontSize: compact ? 13 : 16,
        textShadow: value ? `0 0 8px ${color || 'var(--accent-green-glow)'}` : 'none',
      }}
    >
      {value ? '1' : '0'}
    </td>
  );

  return (
    <div className="h-full flex flex-col">
      {!compact && (
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <span
            className="font-display text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}
          >
            Tabla de Estados
          </span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded btn-press"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            <Download size={12} />
            CSV
          </button>
        </div>
      )}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Ciclo', 'D_in', 'Q₀', 'Q₁', 'Q₂', 'Q₃', 'S_OUT'].map(
                (h) => (
                  <th
                    key={h}
                    className="font-mono text-xs px-2 py-1.5 sticky top-0"
                    style={{
                      color: 'var(--text-muted)',
                      background: 'var(--bg-panel)',
                      fontWeight: 600,
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {displayHistory.map((h, i) => {
              const isLast = i === displayHistory.length - 1;
              return (
                <motion.tr
                  key={h.cycle}
                  style={{
                    borderBottom: '1px solid var(--glass-border)',
                  }}
                  initial={{ backgroundColor: isLast ? 'rgba(59,130,246,0.2)' : 'transparent' }}
                  animate={{ backgroundColor: isLast ? 'rgba(59,130,246,0.08)' : 'transparent' }}
                  transition={{ duration: 0.5 }}
                >
                  <td
                    className="font-mono text-center px-2 py-1.5"
                    style={{ color: 'var(--text-secondary)', fontSize: compact ? 12 : 14 }}
                  >
                    {h.cycle}
                  </td>
                  <BitCell value={h.dataIn} color="var(--accent-amber)" />
                  <BitCell value={h.q[0]} />
                  <BitCell value={h.q[1]} />
                  <BitCell value={h.q[2]} />
                  <BitCell value={h.q[3]} />
                  <BitCell value={h.serialOut} color="var(--led-on)" />
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
