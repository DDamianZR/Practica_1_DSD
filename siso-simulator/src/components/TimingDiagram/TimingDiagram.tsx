import { useSimStore } from '../../store/simulation';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Download } from 'lucide-react';

const ROW_HEIGHT = 44;
const STEP_WIDTH = 60;
const LABEL_WIDTH = 80;
const WAVE_HEIGHT = 28;
const PADDING_TOP = 30;

type Signal = {
  label: string;
  color: string;
  values: boolean[];
};

export function TimingDiagram({ compact = false }: { compact?: boolean }) {
  const history = useSimStore((s) => s.history);
  const [hoveredCycle, setHoveredCycle] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const maxCycles = compact ? Math.min(history.length, 12) : history.length;
  const displayHistory = compact
    ? history.slice(-maxCycles)
    : history;

  const signals: Signal[] = [
    {
      label: 'CLK',
      color: 'var(--accent-blue)',
      values: displayHistory.map((_, i) => i % 2 === 1),
    },
    {
      label: 'D_IN',
      color: 'var(--accent-amber)',
      values: displayHistory.map((h) => h.dataIn),
    },
    {
      label: 'Q₀',
      color: 'var(--accent-green)',
      values: displayHistory.map((h) => h.q[0]),
    },
    {
      label: 'Q₁',
      color: '#34d399',
      values: displayHistory.map((h) => h.q[1]),
    },
    {
      label: 'Q₂',
      color: '#6ee7b7',
      values: displayHistory.map((h) => h.q[2]),
    },
    {
      label: 'Q₃',
      color: '#a7f3d0',
      values: displayHistory.map((h) => h.q[3]),
    },
    {
      label: 'S_OUT',
      color: '#fbbf24',
      values: displayHistory.map((h) => h.serialOut),
    },
  ];

  const displayCount = compact ? 7 : signals.length;
  const visibleSignals = signals.slice(0, displayCount);

  const width = LABEL_WIDTH + displayHistory.length * STEP_WIDTH + 20;
  const height = PADDING_TOP + visibleSignals.length * ROW_HEIGHT + 20;

  function renderWave(signal: Signal, rowIndex: number) {
    const y = PADDING_TOP + rowIndex * ROW_HEIGHT;
    const highY = y + 4;
    const lowY = y + WAVE_HEIGHT;
    const isClock = signal.label === 'CLK';

    let path = '';
    signal.values.forEach((val, i) => {
      const x = LABEL_WIDTH + i * STEP_WIDTH;
      const nextX = x + STEP_WIDTH;

      if (isClock) {
        if (i === 0) {
          path += `M ${x} ${lowY}`;
        }
        path += ` L ${x} ${lowY} L ${x} ${highY} L ${x + STEP_WIDTH / 2} ${highY} L ${x + STEP_WIDTH / 2} ${lowY} L ${nextX} ${lowY}`;
      } else {
        const yPos = val ? highY : lowY;
        if (i === 0) {
          path += `M ${x} ${yPos}`;
        } else {
          const prevVal = signal.values[i - 1];
          if (prevVal !== val) {
            path += ` L ${x} ${prevVal ? highY : lowY} L ${x} ${yPos}`;
          }
        }
        path += ` L ${nextX} ${yPos}`;
      }
    });

    return (
      <g key={signal.label}>
        {/* Background stripe */}
        <rect
          x={LABEL_WIDTH}
          y={y - 2}
          width={width - LABEL_WIDTH}
          height={ROW_HEIGHT}
          fill={rowIndex % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
        />
        {/* Label */}
        <text
          x={LABEL_WIDTH - 8}
          y={y + WAVE_HEIGHT / 2 + 5}
          textAnchor="end"
          fill={signal.color}
          fontSize={compact ? 10 : 12}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight={600}
        >
          {signal.label}
        </text>
        {/* Waveform */}
        <path
          d={path}
          fill="none"
          stroke={signal.color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  function handleExportPNG() {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(2, 2);
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = 'timing-diagram.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  }

  return (
    <div className={`w-full ${compact ? 'h-full' : 'h-full'} flex flex-col`}>
      {!compact && (
        <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <span
            className="font-display text-xs uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.15em' }}
          >
            Diagrama de Tiempos
          </span>
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded btn-press"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            <Download size={12} />
            PNG
          </button>
        </div>
      )}
      <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-thin">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          width={Math.max(width, 600)}
          height={height}
          style={{ minWidth: width }}
        >
          {/* Grid lines */}
          {displayHistory.map((h, i) => {
            const x = LABEL_WIDTH + i * STEP_WIDTH;
            return (
              <g key={i}>
                <line
                  x1={x}
                  y1={PADDING_TOP - 5}
                  x2={x}
                  y2={height - 10}
                  stroke="var(--border)"
                  strokeWidth={0.5}
                  strokeDasharray="2,4"
                />
                <text
                  x={x + STEP_WIDTH / 2}
                  y={PADDING_TOP - 10}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize={9}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {h.cycle}
                </text>
              </g>
            );
          })}

          {/* Waveforms */}
          {visibleSignals.map((s, i) => renderWave(s, i))}

          {/* Current cycle cursor */}
          {!compact && displayHistory.length > 0 && (
            <motion.line
              x1={LABEL_WIDTH + (displayHistory.length - 1) * STEP_WIDTH + STEP_WIDTH}
              y1={PADDING_TOP - 5}
              x2={LABEL_WIDTH + (displayHistory.length - 1) * STEP_WIDTH + STEP_WIDTH}
              y2={height - 10}
              stroke="var(--accent-blue)"
              strokeWidth={2}
              opacity={0.6}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {/* Hover areas */}
          {!compact &&
            displayHistory.map((h, i) => {
              const x = LABEL_WIDTH + i * STEP_WIDTH;
              return (
                <g key={`hover-${i}`}>
                  <rect
                    x={x}
                    y={PADDING_TOP - 5}
                    width={STEP_WIDTH}
                    height={height - PADDING_TOP}
                    fill={hoveredCycle === i ? 'rgba(59,130,246,0.08)' : 'transparent'}
                    onMouseEnter={() => setHoveredCycle(i)}
                    onMouseLeave={() => setHoveredCycle(null)}
                    style={{ cursor: 'crosshair' }}
                  />
                  {hoveredCycle === i && (
                    <g>
                      <rect
                        x={x + STEP_WIDTH / 2 - 55}
                        y={height - 16}
                        width={110}
                        height={14}
                        rx={3}
                        fill="var(--bg-panel)"
                        stroke="var(--border)"
                      />
                      <text
                        x={x + STEP_WIDTH / 2}
                        y={height - 6}
                        textAnchor="middle"
                        fill="var(--text-secondary)"
                        fontSize={8}
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        C{h.cycle} D={h.dataIn ? 1 : 0} Q={h.q.map((v) => (v ? 1 : 0)).join('')}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
}
