import { useSimStore } from '../../store/simulation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const FF_WIDTH = 160;
const FF_HEIGHT = 130;
const FF_GAP = 100;
const FF_Y = 160;
const LED_R = 18;
const START_X = 120;

function getFFX(index: number) {
  return START_X + index * (FF_WIDTH + FF_GAP);
}

function FlipFlopBlock({
  index,
  value,
  changed,
  clockPulse,
  resetWave,
}: {
  index: number;
  value: boolean;
  changed: boolean;
  clockPulse: boolean;
  resetWave: boolean;
}) {
  const x = getFFX(index);
  const y = FF_Y;

  return (
    <g>
      {/* FF body */}
      <motion.rect
        x={x}
        y={y}
        width={FF_WIDTH}
        height={FF_HEIGHT}
        rx={8}
        fill="var(--bg-panel)"
        stroke={changed && clockPulse ? 'var(--accent-green)' : 'var(--border-bright)'}
        strokeWidth={changed && clockPulse ? 2.5 : 1.5}
        animate={{
          filter: changed && clockPulse
            ? `drop-shadow(0 0 8px var(--accent-green-glow))`
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      />

      {/* D input label */}
      <text
        x={x - 4}
        y={y + 35}
        textAnchor="end"
        fill="var(--text-muted)"
        fontSize={11}
        fontFamily="'JetBrains Mono', monospace"
      >
        D
      </text>
      <line
        x1={x - 2}
        y1={y + 30}
        x2={x}
        y2={y + 30}
        stroke="var(--border-bright)"
        strokeWidth={1.5}
      />

      {/* CLK input */}
      <polygon
        points={`${x},${y + 75} ${x + 10},${y + 65} ${x},${y + 55}`}
        fill="none"
        stroke="var(--accent-blue)"
        strokeWidth={1.5}
      />
      <text
        x={x - 4}
        y={y + 70}
        textAnchor="end"
        fill="var(--accent-blue)"
        fontSize={10}
        fontFamily="'JetBrains Mono', monospace"
      >
        CLK
      </text>

      {/* Clock pulse ripple */}
      <AnimatePresence>
        {clockPulse && (
          <motion.circle
            cx={x + 5}
            cy={y + 65}
            r={5}
            fill="none"
            stroke="var(--accent-blue)"
            strokeWidth={2}
            initial={{ r: 5, opacity: 0.8 }}
            animate={{ r: 30, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Q output label */}
      <text
        x={x + FF_WIDTH + 5}
        y={y + 35}
        textAnchor="start"
        fill="var(--text-muted)"
        fontSize={11}
        fontFamily="'JetBrains Mono', monospace"
      >
        Q
      </text>
      <line
        x1={x + FF_WIDTH}
        y1={y + 30}
        x2={x + FF_WIDTH + 3}
        y2={y + 30}
        stroke="var(--border-bright)"
        strokeWidth={1.5}
      />

      {/* Q̄ output */}
      <text
        x={x + FF_WIDTH + 5}
        y={y + 105}
        textAnchor="start"
        fill="var(--text-muted)"
        fontSize={11}
        fontFamily="'JetBrains Mono', monospace"
      >
        Q̄
      </text>

      {/* PRE / CLR labels */}
      <text
        x={x + FF_WIDTH / 2}
        y={y - 4}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize={9}
        fontFamily="'JetBrains Mono', monospace"
      >
        PRE
      </text>
      <text
        x={x + FF_WIDTH / 2}
        y={y + FF_HEIGHT + 12}
        textAnchor="middle"
        fill="var(--text-muted)"
        fontSize={9}
        fontFamily="'JetBrains Mono', monospace"
      >
        CLR
      </text>

      {/* Value inside FF */}
      <motion.text
        x={x + FF_WIDTH / 2}
        y={y + FF_HEIGHT / 2 + 20}
        textAnchor="middle"
        fontFamily="'JetBrains Mono', monospace"
        fontSize={56}
        fontWeight={700}
        fill={value ? 'var(--accent-green)' : 'var(--text-muted)'}
        animate={{
          scale: changed && clockPulse ? [1, 1.15, 1] : 1,
          filter: value
            ? `drop-shadow(0 0 12px var(--accent-green-glow))`
            : 'none',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {value ? '1' : '0'}
      </motion.text>

      {/* FF label */}
      <text
        x={x + FF_WIDTH / 2}
        y={FF_Y - 50}
        textAnchor="middle"
        fill="var(--text-secondary)"
        fontSize={13}
        fontFamily="'Orbitron', sans-serif"
        fontWeight={600}
        letterSpacing={2}
      >
        {`Q${index}`}
      </text>

      {/* LED above */}
      <motion.circle
        cx={x + FF_WIDTH / 2}
        cy={FF_Y - 28}
        r={LED_R}
        fill={value ? 'var(--led-on)' : 'var(--led-off)'}
        stroke={value ? 'var(--led-on)' : 'var(--border)'}
        strokeWidth={2}
        animate={{
          filter: value
            ? `drop-shadow(0 0 ${LED_R}px var(--led-on-glow)) drop-shadow(0 0 ${LED_R * 2}px var(--led-on-glow))`
            : 'none',
        }}
        transition={{ duration: 0.15 }}
      />
      <text
        x={x + FF_WIDTH / 2}
        y={FF_Y - 23}
        textAnchor="middle"
        fontSize={14}
        fontFamily="'JetBrains Mono', monospace"
        fontWeight={700}
        fill={value ? '#000' : 'var(--text-muted)'}
      >
        {value ? '1' : '0'}
      </text>

      {/* Reset wave */}
      <AnimatePresence>
        {resetWave && (
          <motion.rect
            x={x}
            y={y}
            width={FF_WIDTH}
            height={FF_HEIGHT}
            rx={8}
            fill="var(--accent-red)"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
          />
        )}
      </AnimatePresence>
    </g>
  );
}

function CableWithParticle({
  fromIndex,
  traveling,
  bitValue,
}: {
  fromIndex: number;
  traveling: boolean;
  bitValue: boolean;
}) {
  const x1 = getFFX(fromIndex) + FF_WIDTH + 3;
  const x2 = getFFX(fromIndex + 1) - 2;
  const y = FF_Y + 30;
  const pathId = `cable-${fromIndex}`;

  return (
    <g>
      <path
        id={pathId}
        d={`M ${x1} ${y} L ${x2} ${y}`}
        fill="none"
        stroke={bitValue ? 'var(--accent-green)' : 'var(--border)'}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <AnimatePresence>
        {traveling && (
          <motion.circle
            r={5}
            fill={bitValue ? 'var(--accent-green)' : 'var(--text-muted)'}
            initial={{ cx: x1, cy: y, opacity: 1, scale: 1.5 }}
            animate={{ cx: x2, cy: y, opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {bitValue && (
              <animate
                attributeName="opacity"
                values="1;0.6;1"
                dur="0.3s"
                repeatCount="1"
              />
            )}
          </motion.circle>
        )}
      </AnimatePresence>
    </g>
  );
}

export function SchematicView() {
  const flipFlops = useSimStore((s) => s.flipFlops);
  const dataIn = useSimStore((s) => s.dataIn);
  const serialOut = useSimStore((s) => s.serialOut);
  const animation = useSimStore((s) => s.animation);
  const cycle = useSimStore((s) => s.cycle);
  const droppedBits = useSimStore((s) => s.droppedBits);
  const [showSerialOutPulse, setShowSerialOutPulse] = useState(false);

  const totalWidth = getFFX(3) + FF_WIDTH + 140;
  const totalHeight = FF_Y + FF_HEIGHT + 100;

  useEffect(() => {
    if (animation.clockPulseActive) {
      setShowSerialOutPulse(true);
      const t = setTimeout(() => setShowSerialOutPulse(false), 500);
      return () => clearTimeout(t);
    }
  }, [animation.clockPulseActive, cycle]);

  const clockBusY = FF_Y + FF_HEIGHT + 40;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-auto scrollbar-thin">
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight + 30}`}
        className="w-full h-full"
        style={{ maxWidth: totalWidth, maxHeight: totalHeight + 30 }}
      >
        <defs>
          <filter id="glow-green">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Data Input indicator */}
        <g>
          <text
            x={40}
            y={FF_Y - 50}
            textAnchor="middle"
            fill="var(--accent-amber)"
            fontSize={12}
            fontFamily="'Orbitron', sans-serif"
            fontWeight={600}
            letterSpacing={1}
          >
            D_IN
          </text>
          <motion.rect
            x={15}
            y={FF_Y + 10}
            width={50}
            height={40}
            rx={6}
            fill={dataIn ? 'var(--accent-amber)' : 'var(--bg-elevated)'}
            stroke={dataIn ? 'var(--accent-amber)' : 'var(--border-bright)'}
            strokeWidth={2}
            animate={{
              filter: dataIn
                ? `drop-shadow(0 0 10px var(--accent-amber-glow))`
                : 'none',
            }}
          />
          <motion.text
            x={40}
            y={FF_Y + 38}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize={24}
            fontWeight={700}
            fill={dataIn ? '#000' : 'var(--text-muted)'}
          >
            {dataIn ? '1' : '0'}
          </motion.text>
          {/* Cable from D_IN to FF0 D */}
          <line
            x1={65}
            y1={FF_Y + 30}
            x2={START_X - 2}
            y2={FF_Y + 30}
            stroke={dataIn ? 'var(--accent-amber)' : 'var(--border)'}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <AnimatePresence>
            {animation.bitTraveling && (
              <motion.circle
                r={5}
                fill={dataIn ? 'var(--accent-amber)' : 'var(--text-muted)'}
                initial={{ cx: 65, cy: FF_Y + 30, opacity: 1 }}
                animate={{ cx: START_X - 2, cy: FF_Y + 30, opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>
        </g>

        {/* Flip-Flops */}
        {flipFlops.map((val, i) => (
          <FlipFlopBlock
            key={i}
            index={i}
            value={val}
            changed={animation.changedFlipFlops[i]}
            clockPulse={animation.clockPulseActive}
            resetWave={animation.resetWave}
          />
        ))}

        {/* Cables between FFs with particles */}
        {[0, 1, 2].map((i) => (
          <CableWithParticle
            key={i}
            fromIndex={i}
            traveling={animation.bitTraveling}
            bitValue={animation.previousFlipFlops[i]}
          />
        ))}

        {/* Clock bus (horizontal) */}
        <line
          x1={START_X - 20}
          y1={clockBusY}
          x2={getFFX(3) + FF_WIDTH + 20}
          y2={clockBusY}
          stroke="var(--accent-blue)"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.7}
        />
        <text
          x={START_X - 30}
          y={clockBusY + 5}
          textAnchor="end"
          fill="var(--accent-blue)"
          fontSize={12}
          fontFamily="'Orbitron', sans-serif"
          fontWeight={600}
          letterSpacing={1}
        >
          CLK
        </text>

        {/* Clock bus vertical taps */}
        {[0, 1, 2, 3].map((i) => {
          const cx = getFFX(i) + 5;
          return (
            <g key={`clk-tap-${i}`}>
              <line
                x1={cx}
                y1={FF_Y + FF_HEIGHT}
                x2={cx}
                y2={clockBusY}
                stroke="var(--accent-blue)"
                strokeWidth={1.5}
                opacity={0.5}
              />
              <circle
                cx={cx}
                cy={clockBusY}
                r={3}
                fill="var(--accent-blue)"
              />
              <AnimatePresence>
                {animation.clockPulseActive && (
                  <motion.circle
                    cx={cx}
                    cy={clockBusY}
                    r={3}
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth={2}
                    initial={{ r: 3, opacity: 0.9 }}
                    animate={{ r: 20, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.05, ease: 'easeOut' }}
                  />
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* Serial Output */}
        <g>
          {/* Cable from FF3 Q to serial out */}
          <line
            x1={getFFX(3) + FF_WIDTH + 3}
            y1={FF_Y + 30}
            x2={getFFX(3) + FF_WIDTH + 80}
            y2={FF_Y + 30}
            stroke={serialOut ? 'var(--accent-green)' : 'var(--border)'}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
          <AnimatePresence>
            {showSerialOutPulse && (
              <motion.circle
                r={5}
                fill={animation.previousFlipFlops[3] ? 'var(--accent-green)' : 'var(--text-muted)'}
                initial={{ cx: getFFX(3) + FF_WIDTH + 3, cy: FF_Y + 30, opacity: 1 }}
                animate={{ cx: getFFX(3) + FF_WIDTH + 80, cy: FF_Y + 30, opacity: 0.7 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </AnimatePresence>

          <text
            x={getFFX(3) + FF_WIDTH + 100}
            y={FF_Y - 50}
            textAnchor="middle"
            fill="var(--accent-green)"
            fontSize={12}
            fontFamily="'Orbitron', sans-serif"
            fontWeight={600}
            letterSpacing={1}
          >
            S_OUT
          </text>

          {/* Serial out LED */}
          <motion.circle
            cx={getFFX(3) + FF_WIDTH + 100}
            cy={FF_Y - 28}
            r={LED_R}
            fill={serialOut ? 'var(--led-on)' : 'var(--led-off)'}
            stroke={serialOut ? 'var(--led-on)' : 'var(--border)'}
            strokeWidth={2}
            animate={{
              filter: serialOut
                ? `drop-shadow(0 0 ${LED_R}px var(--led-on-glow)) drop-shadow(0 0 ${LED_R * 2}px var(--led-on-glow))`
                : 'none',
            }}
          />
          <text
            x={getFFX(3) + FF_WIDTH + 100}
            y={FF_Y - 23}
            textAnchor="middle"
            fontSize={14}
            fontFamily="'JetBrains Mono', monospace"
            fontWeight={700}
            fill={serialOut ? '#000' : 'var(--text-muted)'}
          >
            {serialOut ? '1' : '0'}
          </text>

          {/* Serial out value box */}
          <motion.rect
            x={getFFX(3) + FF_WIDTH + 75}
            y={FF_Y + 10}
            width={50}
            height={40}
            rx={6}
            fill={serialOut ? 'var(--accent-green)' : 'var(--bg-elevated)'}
            stroke={serialOut ? 'var(--accent-green)' : 'var(--border-bright)'}
            strokeWidth={2}
            animate={{
              filter: serialOut
                ? `drop-shadow(0 0 10px var(--accent-green-glow))`
                : 'none',
            }}
          />
          <motion.text
            x={getFFX(3) + FF_WIDTH + 100}
            y={FF_Y + 38}
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize={24}
            fontWeight={700}
            fill={serialOut ? '#000' : 'var(--text-muted)'}
          >
            {serialOut ? '1' : '0'}
          </motion.text>

          {/* Dropped bits counter */}
          <text
            x={getFFX(3) + FF_WIDTH + 100}
            y={FF_Y + 72}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize={10}
            fontFamily="'JetBrains Mono', monospace"
          >
            {droppedBits.filter(Boolean).length} bits out
          </text>
        </g>

        {/* Title */}
        <text
          x={totalWidth / 2}
          y={24}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize={14}
          fontFamily="'Orbitron', sans-serif"
          fontWeight={600}
          letterSpacing={3}
          opacity={0.6}
        >
          SISO SHIFT REGISTER — 4 BIT — 74LS74
        </text>
      </svg>
    </div>
  );
}
