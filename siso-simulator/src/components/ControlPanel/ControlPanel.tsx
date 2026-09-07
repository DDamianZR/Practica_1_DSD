import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimStore } from '../../store/simulation';
import {
  RotateCcw,
  Undo2,
  Zap,
  Volume2,
  VolumeX,
  Sparkles,
  Keyboard,
  ChevronDown,
  ChevronRight,
  Play,
  Pause,
  Upload,
} from 'lucide-react';

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-panel p-3 mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left mb-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        <span
          className="font-display text-xs uppercase tracking-widest"
          style={{ letterSpacing: '0.15em' }}
        >
          {title}
        </span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

export function ControlPanel() {
  const {
    dataIn,
    toggleDataIn,
    doClock,
    doReset,
    doStepBack,
    autoClockEnabled,
    toggleAutoClock,
    autoClockFrequency,
    setAutoClockFrequency,
    cycle,
    soundEnabled,
    toggleSound,
    animationsEnabled,
    toggleAnimations,
    animationSpeed,
    setAnimationSpeed,
    isLoadingWord,
    loadingWordProgress,
    loadingWordTotal,
    loadWord,
  } = useSimStore();

  const [wordInput, setWordInput] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const presets = ['1010', '1111', '0110', '10110100'];

  return (
    <div
      className="h-full overflow-y-auto scrollbar-thin p-3"
      style={{ width: 280 }}
    >
      {/* Data Input */}
      <Section title="Entrada de Datos">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDataIn}
            className="relative btn-press rounded-full"
            style={{
              width: 72,
              height: 36,
              background: dataIn ? 'var(--accent-amber)' : 'var(--bg-elevated)',
              border: `2px solid ${dataIn ? 'var(--accent-amber)' : 'var(--border-bright)'}`,
              boxShadow: dataIn
                ? '0 0 15px var(--accent-amber-glow), inset 0 1px 0 rgba(255,255,255,0.2)'
                : 'inset 0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            <motion.div
              className="absolute top-0.5 rounded-full"
              style={{
                width: 28,
                height: 28,
                background: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
              animate={{ x: dataIn ? 38 : 4 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <motion.span
            className="font-mono font-bold"
            style={{
              fontSize: 40,
              color: dataIn ? 'var(--accent-amber)' : 'var(--text-muted)',
              textShadow: dataIn ? '0 0 20px var(--accent-amber-glow)' : 'none',
              lineHeight: 1,
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.2 }}
            key={String(dataIn)}
          >
            {dataIn ? '1' : '0'}
          </motion.span>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          <kbd className="font-mono px-1 py-0.5 rounded text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>SPACE</kbd> para alternar
        </p>
      </Section>

      {/* Clock */}
      <Section title="Reloj">
        <div className="flex flex-col items-center gap-3">
          <motion.button
            onClick={doClock}
            disabled={autoClockEnabled || isLoadingWord}
            className="btn-press rounded-full flex items-center justify-center"
            style={{
              width: 100,
              height: 100,
              background: autoClockEnabled
                ? 'var(--bg-elevated)'
                : 'linear-gradient(135deg, var(--accent-blue), #2563eb)',
              border: '3px solid var(--accent-blue)',
              opacity: autoClockEnabled || isLoadingWord ? 0.4 : 1,
              cursor: autoClockEnabled || isLoadingWord ? 'not-allowed' : 'pointer',
              boxShadow: autoClockEnabled
                ? 'none'
                : '0 0 20px var(--accent-blue-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
            whileTap={
              !autoClockEnabled && !isLoadingWord
                ? { scale: 0.92 }
                : undefined
            }
          >
            <Zap size={36} color="white" />
          </motion.button>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            <kbd className="font-mono px-1 py-0.5 rounded text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>ENTER</kbd> pulso manual
          </p>

          {/* Auto-clock toggle */}
          <div className="w-full flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Auto-clock
            </span>
            <div className="flex items-center gap-2">
              {autoClockEnabled ? (
                <Pause size={14} style={{ color: 'var(--accent-blue)' }} />
              ) : (
                <Play size={14} style={{ color: 'var(--text-muted)' }} />
              )}
              <button
                onClick={toggleAutoClock}
                className="relative rounded-full"
                style={{
                  width: 44,
                  height: 22,
                  background: autoClockEnabled
                    ? 'var(--accent-blue)'
                    : 'var(--bg-elevated)',
                  border: `1.5px solid ${autoClockEnabled ? 'var(--accent-blue)' : 'var(--border-bright)'}`,
                }}
              >
                <motion.div
                  className="absolute top-0.5 rounded-full"
                  style={{
                    width: 16,
                    height: 16,
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                  animate={{ x: autoClockEnabled ? 23 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          </div>

          {/* Frequency slider */}
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <span>0.5 Hz</span>
              <span className="font-mono font-bold" style={{ color: 'var(--accent-blue)' }}>
                {autoClockFrequency.toFixed(1)} Hz
              </span>
              <span>10 Hz</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={autoClockFrequency}
              onChange={(e) => setAutoClockFrequency(Number(e.target.value))}
              className="w-full accent-[var(--accent-blue)]"
              style={{ accentColor: 'var(--accent-blue)' }}
            />
          </div>
        </div>
      </Section>

      {/* Quick Load */}
      <Section title="Carga Rápida">
        <div className="flex gap-1 mb-2 flex-wrap">
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => loadWord(p)}
              disabled={isLoadingWord}
              className="font-mono text-xs px-2 py-1 rounded btn-press"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                opacity: isLoadingWord ? 0.5 : 1,
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            value={wordInput}
            onChange={(e) =>
              setWordInput(e.target.value.replace(/[^01]/g, '').slice(0, 8))
            }
            placeholder="10110100"
            maxLength={8}
            className="flex-1 font-mono text-sm px-2 py-1.5 rounded outline-none"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={() => {
              if (wordInput) loadWord(wordInput);
            }}
            disabled={isLoadingWord || !wordInput}
            className="px-2 py-1.5 rounded btn-press flex items-center gap-1"
            style={{
              background: 'var(--accent-amber)',
              color: '#000',
              opacity: isLoadingWord || !wordInput ? 0.5 : 1,
            }}
          >
            <Upload size={14} />
          </button>
        </div>
        {isLoadingWord && (
          <div className="mt-2">
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--bg-elevated)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--accent-amber)' }}
                initial={{ width: 0 }}
                animate={{
                  width: `${(loadingWordProgress / loadingWordTotal) * 100}%`,
                }}
              />
            </div>
            <p
              className="text-xs mt-1 font-mono"
              style={{ color: 'var(--accent-amber)' }}
            >
              Bit {loadingWordProgress} de {loadingWordTotal}...
            </p>
          </div>
        )}
      </Section>

      {/* Controls */}
      <Section title="Control">
        <div className="flex gap-2">
          <motion.button
            onClick={doReset}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded btn-press"
            style={{
              background: 'var(--accent-red)',
              color: 'white',
              border: 'none',
              fontSize: 13,
              fontWeight: 600,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw size={14} />
            RESET
          </motion.button>
          <motion.button
            onClick={doStepBack}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded btn-press"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              fontSize: 13,
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Undo2 size={14} />
            BACK
          </motion.button>
        </div>
        <div
          className="mt-3 text-center font-mono"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
            CICLOS
          </span>
          <motion.span
            className="font-bold"
            style={{
              fontSize: 32,
              color: 'var(--accent-blue)',
              textShadow: '0 0 10px var(--accent-blue-glow)',
            }}
            key={cycle}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {cycle}
          </motion.span>
        </div>
      </Section>

      {/* Settings */}
      <Section title="Ajustes" defaultOpen={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              Sonido
            </span>
            <button
              onClick={toggleSound}
              className="relative rounded-full"
              style={{
                width: 36,
                height: 18,
                background: soundEnabled
                  ? 'var(--accent-green)'
                  : 'var(--bg-elevated)',
                border: `1.5px solid ${soundEnabled ? 'var(--accent-green)' : 'var(--border-bright)'}`,
              }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  top: 1.5,
                  background: 'white',
                }}
                animate={{ x: soundEnabled ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Sparkles size={14} />
              Animaciones
            </span>
            <button
              onClick={toggleAnimations}
              className="relative rounded-full"
              style={{
                width: 36,
                height: 18,
                background: animationsEnabled
                  ? 'var(--accent-green)'
                  : 'var(--bg-elevated)',
                border: `1.5px solid ${animationsEnabled ? 'var(--accent-green)' : 'var(--border-bright)'}`,
              }}
            >
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 12,
                  height: 12,
                  top: 1.5,
                  background: 'white',
                }}
                animate={{ x: animationsEnabled ? 18 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
              <span>Velocidad</span>
              <span className="font-mono">{animationSpeed}x</span>
            </div>
            <div className="flex gap-1">
              {[0.5, 1, 2].map((s) => (
                <button
                  key={s}
                  onClick={() => setAnimationSpeed(s)}
                  className="flex-1 text-xs py-1 rounded font-mono"
                  style={{
                    background:
                      animationSpeed === s
                        ? 'var(--accent-blue)'
                        : 'var(--bg-elevated)',
                    color:
                      animationSpeed === s ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${animationSpeed === s ? 'var(--accent-blue)' : 'var(--border)'}`,
                  }}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Keyboard Shortcuts */}
      <button
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded text-xs"
        style={{ color: 'var(--text-muted)', background: 'var(--bg-panel-alt)', border: '1px solid var(--glass-border)' }}
      >
        <Keyboard size={14} />
        Atajos de teclado
        {showShortcuts ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>
      {showShortcuts && (
        <div
          className="mt-2 p-3 rounded-lg text-xs space-y-1"
          style={{ background: 'var(--bg-panel-alt)', border: '1px solid var(--glass-border)' }}
        >
          {[
            ['SPACE', 'Toggle dato'],
            ['ENTER', 'Pulso CLK'],
            ['A', 'Auto-clock'],
            ['R', 'Reset'],
            ['←', 'Step back'],
            ['1-4', 'Cambiar tab'],
            ['T', 'Toggle tema'],
            ['M', 'Toggle sonido'],
            ['?', 'Panel educativo'],
          ].map(([key, desc]) => (
            <div key={key} className="flex justify-between">
              <kbd
                className="font-mono px-1.5 py-0.5 rounded"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
              >
                {key}
              </kbd>
              <span style={{ color: 'var(--text-muted)' }}>{desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
