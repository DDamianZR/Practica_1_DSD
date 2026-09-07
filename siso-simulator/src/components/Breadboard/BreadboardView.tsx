import { useSimStore } from '../../store/simulation';
import { useState } from 'react';
import { motion } from 'framer-motion';

const BOARD_W = 900;
const BOARD_H = 500;
const PIN_R = 4;
const CHIP_W = 80;
const CHIP_H = 140;

type PinInfo = { name: string; func: string; value?: boolean };

const chip1Pins: PinInfo[] = [
  { name: '1', func: 'CLR₁ (Reset FF0)' },
  { name: '2', func: 'D₁ (Data FF0)' },
  { name: '3', func: 'CLK₁ (Clock FF0)' },
  { name: '4', func: 'PRE₁ (Preset FF0)' },
  { name: '5', func: 'Q₁ (Output FF0)' },
  { name: '6', func: 'Q̄₁ (Inv. Output FF0)' },
  { name: '7', func: 'GND' },
  { name: '8', func: 'Q̄₂ (Inv. Output FF1)' },
  { name: '9', func: 'Q₂ (Output FF1)' },
  { name: '10', func: 'PRE₂ (Preset FF1)' },
  { name: '11', func: 'CLK₂ (Clock FF1)' },
  { name: '12', func: 'D₂ (Data FF1)' },
  { name: '13', func: 'CLR₂ (Reset FF1)' },
  { name: '14', func: 'VCC (+5V)' },
];

const chip2Pins: PinInfo[] = [
  { name: '1', func: 'CLR₃ (Reset FF2)' },
  { name: '2', func: 'D₃ (Data FF2)' },
  { name: '3', func: 'CLK₃ (Clock FF2)' },
  { name: '4', func: 'PRE₃ (Preset FF2)' },
  { name: '5', func: 'Q₃ (Output FF2)' },
  { name: '6', func: 'Q̄₃ (Inv. Output FF2)' },
  { name: '7', func: 'GND' },
  { name: '8', func: 'Q̄₄ (Inv. Output FF3)' },
  { name: '9', func: 'Q₄ (Output FF3)' },
  { name: '10', func: 'PRE₄ (Preset FF3)' },
  { name: '11', func: 'CLK₄ (Clock FF3)' },
  { name: '12', func: 'D₄ (Data FF3)' },
  { name: '13', func: 'CLR₄ (Reset FF3)' },
  { name: '14', func: 'VCC (+5V)' },
];

type Wire = {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
  label: string;
  active?: boolean;
};

export function BreadboardView() {
  const flipFlops = useSimStore((s) => s.flipFlops);
  const dataIn = useSimStore((s) => s.dataIn);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [showLabels, setShowLabels] = useState(true);

  const chip1X = 250;
  const chip1Y = 160;
  const chip2X = 530;
  const chip2Y = 160;

  function renderBreadboardHoles() {
    const holes: React.JSX.Element[] = [];
    for (let row = 0; row < 30; row++) {
      for (let col = 0; col < 5; col++) {
        const x = 100 + col * 14;
        const y = 80 + row * 14;
        holes.push(
          <circle
            key={`top-${row}-${col}`}
            cx={x}
            cy={y}
            r={2.5}
            fill="var(--bg-elevated)"
            stroke="var(--border)"
            strokeWidth={0.5}
          />
        );
        const x2 = 100 + (col + 6) * 14;
        holes.push(
          <circle
            key={`bot-${row}-${col}`}
            cx={x2}
            cy={y}
            r={2.5}
            fill="var(--bg-elevated)"
            stroke="var(--border)"
            strokeWidth={0.5}
          />
        );
      }
    }
    return holes;
  }

  function renderChip(
    x: number,
    y: number,
    label: string,
    pins: PinInfo[],
    ffValues: [boolean, boolean]
  ) {
    const pinSpacing = CHIP_H / 8;
    return (
      <g>
        {/* Chip body */}
        <rect
          x={x}
          y={y}
          width={CHIP_W}
          height={CHIP_H}
          rx={4}
          fill="#1a1a2e"
          stroke="var(--border-bright)"
          strokeWidth={1.5}
        />
        {/* Notch */}
        <circle
          cx={x + CHIP_W / 2}
          cy={y + 8}
          r={5}
          fill="none"
          stroke="var(--border-bright)"
          strokeWidth={1}
        />
        {/* Chip label */}
        <text
          x={x + CHIP_W / 2}
          y={y + CHIP_H / 2 + 4}
          textAnchor="middle"
          fill="var(--text-muted)"
          fontSize={10}
          fontFamily="'JetBrains Mono', monospace"
          fontWeight={600}
        >
          {label}
        </text>

        {/* Left pins (1-7) */}
        {pins.slice(0, 7).map((pin, i) => {
          const px = x - 8;
          const py = y + 16 + i * pinSpacing;
          return (
            <g key={`l-${i}`}>
              <circle
                cx={px}
                cy={py}
                r={PIN_R}
                fill="#c0c0c0"
                stroke="#888"
                strokeWidth={1}
                onMouseEnter={() =>
                  setTooltip({ x: px, y: py - 20, text: `Pin ${pin.name} — ${pin.func}` })
                }
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: 'pointer' }}
              />
              {showLabels && (
                <text
                  x={px - 10}
                  y={py + 3}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize={7}
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {pin.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Right pins (14-8, top to bottom) */}
        {pins
          .slice(7)
          .reverse()
          .map((pin, i) => {
            const px = x + CHIP_W + 8;
            const py = y + 16 + i * pinSpacing;
            return (
              <g key={`r-${i}`}>
                <circle
                  cx={px}
                  cy={py}
                  r={PIN_R}
                  fill="#c0c0c0"
                  stroke="#888"
                  strokeWidth={1}
                  onMouseEnter={() =>
                    setTooltip({ x: px, y: py - 20, text: `Pin ${pin.name} — ${pin.func}` })
                  }
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: 'pointer' }}
                />
                {showLabels && (
                  <text
                    x={px + 10}
                    y={py + 3}
                    textAnchor="start"
                    fill="var(--text-muted)"
                    fontSize={7}
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {pin.name}
                  </text>
                )}
              </g>
            );
          })}

        {/* FF value indicators */}
        {ffValues.map((val, fi) => {
          const ledX = x + CHIP_W / 2 + (fi === 0 ? -15 : 15);
          const ledY = y - 20;
          return (
            <motion.circle
              key={`led-${fi}`}
              cx={ledX}
              cy={ledY}
              r={8}
              fill={val ? 'var(--led-on)' : 'var(--led-off)'}
              animate={{
                filter: val
                  ? 'drop-shadow(0 0 6px var(--led-on-glow))'
                  : 'none',
              }}
            />
          );
        })}
      </g>
    );
  }

  const wires: Wire[] = [
    // VCC rails
    { x1: 60, y1: 50, x2: BOARD_W - 60, y2: 50, color: '#ef4444', label: 'VCC +5V', active: true },
    // GND rails
    { x1: 60, y1: BOARD_H - 30, x2: BOARD_W - 60, y2: BOARD_H - 30, color: '#1f2937', label: 'GND', active: false },
    // Data input to Chip1 D1
    { x1: 120, y1: chip1Y + 16 + 17.5, x2: chip1X - 8, y2: chip1Y + 16 + 17.5, color: '#f59e0b', label: 'D_IN', active: dataIn },
    // CLK bus
    { x1: 100, y1: BOARD_H - 60, x2: BOARD_W - 100, y2: BOARD_H - 60, color: '#3b82f6', label: 'CLK', active: true },
    // Q0 → D1 (chip1 pin5 → chip1 pin12)
    { x1: chip1X - 8, y1: chip1Y + 16 + 4 * 17.5, x2: chip1X + CHIP_W + 30, y2: chip1Y + 16 + 4 * 17.5, color: '#10b981', label: 'Q₀→D₁', active: flipFlops[0] },
    // Q1 → D2 (chip1 pin9 → chip2 pin2)
    { x1: chip1X + CHIP_W + 8, y1: chip1Y + 16 + 2 * 17.5, x2: chip2X - 8, y2: chip2Y + 16 + 17.5, color: '#34d399', label: 'Q₁→D₂', active: flipFlops[1] },
    // Q2 → D3 (chip2 pin5 → chip2 pin12)
    { x1: chip2X - 8, y1: chip2Y + 16 + 4 * 17.5, x2: chip2X + CHIP_W + 30, y2: chip2Y + 16 + 4 * 17.5, color: '#6ee7b7', label: 'Q₂→D₃', active: flipFlops[2] },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center overflow-auto scrollbar-thin p-4">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-display text-xs uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Vista Breadboard — 2× 74LS74
        </span>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="text-xs px-2 py-0.5 rounded"
          style={{
            background: showLabels ? 'var(--accent-blue)' : 'var(--bg-elevated)',
            color: showLabels ? 'white' : 'var(--text-muted)',
            border: '1px solid var(--border)',
          }}
        >
          {showLabels ? 'Labels ON' : 'Labels OFF'}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
        className="w-full h-full"
        style={{ maxWidth: BOARD_W, maxHeight: BOARD_H }}
      >
        {/* Board background */}
        <rect
          x={40}
          y={30}
          width={BOARD_W - 80}
          height={BOARD_H - 60}
          rx={8}
          fill="#f5f0e0"
          stroke="#d4c9a8"
          strokeWidth={2}
        />

        {/* Power rails */}
        <rect x={50} y={38} width={BOARD_W - 100} height={12} rx={2} fill="#ef444422" stroke="#ef4444" strokeWidth={0.5} />
        <rect x={50} y={BOARD_H - 50} width={BOARD_W - 100} height={12} rx={2} fill="#3b82f622" stroke="#3b82f6" strokeWidth={0.5} />

        {/* Center channel */}
        <rect
          x={50}
          y={BOARD_H / 2 - 5}
          width={BOARD_W - 100}
          height={10}
          fill="#e8e0c8"
        />

        {/* Breadboard holes */}
        {renderBreadboardHoles()}

        {/* Chips */}
        {renderChip(chip1X, chip1Y, '74LS74', chip1Pins, [flipFlops[0], flipFlops[1]])}
        {renderChip(chip2X, chip2Y, '74LS74', chip2Pins, [flipFlops[2], flipFlops[3]])}

        {/* Wires */}
        {wires.map((w, i) => (
          <motion.line
            key={i}
            x1={w.x1}
            y1={w.y1}
            x2={w.x2}
            y2={w.y2}
            stroke={w.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={w.active ? 1 : 0.4}
            animate={{
              filter: w.active ? `drop-shadow(0 0 4px ${w.color}66)` : 'none',
            }}
          />
        ))}

        {/* Wire labels */}
        {showLabels &&
          wires.map((w, i) => (
            <text
              key={`wl-${i}`}
              x={(w.x1 + w.x2) / 2}
              y={(w.y1 + w.y2) / 2 - 8}
              textAnchor="middle"
              fill={w.color}
              fontSize={8}
              fontFamily="'JetBrains Mono', monospace"
              fontWeight={600}
            >
              {w.label}
            </text>
          ))}

        {/* Pushbuttons */}
        <g>
          <rect x={80} y={chip1Y + 10} width={24} height={24} rx={3} fill="#333" stroke="#555" strokeWidth={1} />
          <circle cx={92} cy={chip1Y + 22} r={6} fill="#666" stroke="#888" strokeWidth={1} />
          {showLabels && (
            <text x={92} y={chip1Y + 50} textAnchor="middle" fill="var(--accent-amber)" fontSize={8} fontFamily="'JetBrains Mono', monospace">
              DATA
            </text>
          )}
        </g>
        <g>
          <rect x={80} y={BOARD_H - 90} width={24} height={24} rx={3} fill="#333" stroke="#555" strokeWidth={1} />
          <circle cx={92} cy={BOARD_H - 78} r={6} fill="#4488ff" stroke="#6699ff" strokeWidth={1} />
          {showLabels && (
            <text x={92} y={BOARD_H - 55} textAnchor="middle" fill="var(--accent-blue)" fontSize={8} fontFamily="'JetBrains Mono', monospace">
              CLK
            </text>
          )}
        </g>

        {/* Output LEDs with resistors */}
        {flipFlops.map((val, i) => {
          const lx = BOARD_W - 160 + i * 32;
          const ly = 90;
          return (
            <g key={`output-led-${i}`}>
              <rect x={lx - 5} y={ly + 20} width={10} height={20} rx={2} fill="#886644" stroke="#aa8866" strokeWidth={0.5} />
              <text x={lx} y={ly + 52} textAnchor="middle" fill="var(--text-muted)" fontSize={6} fontFamily="'JetBrains Mono', monospace">
                330Ω
              </text>
              <motion.circle
                cx={lx}
                cy={ly}
                r={8}
                fill={val ? 'var(--led-on)' : 'var(--led-off)'}
                stroke={val ? 'var(--led-on)' : '#555'}
                strokeWidth={1}
                animate={{
                  filter: val ? 'drop-shadow(0 0 8px var(--led-on-glow))' : 'none',
                }}
              />
              {showLabels && (
                <text x={lx} y={ly - 14} textAnchor="middle" fill="var(--text-muted)" fontSize={7} fontFamily="'JetBrains Mono', monospace">
                  Q{i}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 60}
              y={tooltip.y - 8}
              width={120}
              height={16}
              rx={4}
              fill="var(--bg-panel)"
              stroke="var(--accent-blue)"
              strokeWidth={1}
            />
            <text
              x={tooltip.x}
              y={tooltip.y + 3}
              textAnchor="middle"
              fill="var(--text-primary)"
              fontSize={8}
              fontFamily="'JetBrains Mono', monospace"
            >
              {tooltip.text}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
