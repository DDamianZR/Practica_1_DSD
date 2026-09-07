import { motion } from 'framer-motion';

type LEDProps = {
  on: boolean;
  size?: number;
  label?: string;
  color?: string;
};

export function LED({ on, size = 40, label, color }: LEDProps) {
  const onColor = color || 'var(--led-on)';
  const glowColor = color
    ? `${color}99`
    : 'var(--led-on-glow)';

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        animate={{
          backgroundColor: on ? onColor : 'var(--led-off)',
          boxShadow: on
            ? `0 0 ${size * 0.5}px ${onColor}, 0 0 ${size}px ${glowColor}, inset 0 -2px 4px rgba(0,0,0,0.3)`
            : 'inset 0 2px 4px rgba(0,0,0,0.4)',
          scale: on ? 1 : 0.92,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: `2px solid ${on ? onColor : 'var(--border-bright)'}`,
        }}
      />
      {label && (
        <span
          className="font-mono text-xs"
          style={{ color: 'var(--text-muted)', fontSize: Math.max(10, size * 0.28) }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
