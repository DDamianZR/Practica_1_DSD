import { useSimStore, type ViewTab } from '../../store/simulation';
import { motion } from 'framer-motion';
import { Sun, Moon, HelpCircle, CircuitBoard, Cpu, Activity, Table2 } from 'lucide-react';

const tabs: { id: ViewTab; label: string; icon: React.ReactNode; key: string }[] = [
  { id: 'schematic', label: 'Esquemático', icon: <Cpu size={16} />, key: '1' },
  { id: 'breadboard', label: 'Breadboard', icon: <CircuitBoard size={16} />, key: '2' },
  { id: 'timing', label: 'Timing', icon: <Activity size={16} />, key: '3' },
  { id: 'table', label: 'Tabla', icon: <Table2 size={16} />, key: '4' },
];

export function Header() {
  const { activeTab, setActiveTab, theme, toggleTheme, toggleEducation, flipFlops } =
    useSimStore();

  return (
    <header
      className="flex items-center px-4 py-2 gap-4"
      style={{
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        height: 56,
      }}
    >
      {/* Logo / Title */}
      <div className="flex items-center gap-3 mr-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-green))',
            boxShadow: '0 0 12px var(--accent-blue-glow)',
          }}
        >
          <Cpu size={18} color="white" />
        </div>
        <div>
          <h1
            className="font-display text-sm font-bold uppercase"
            style={{ color: 'var(--text-primary)', letterSpacing: '0.12em', lineHeight: 1.2 }}
          >
            SISO Register
          </h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1 }}>
            4-bit Shift Register — 74LS74
          </p>
        </div>
      </div>

      {/* Register state display */}
      <div className="flex items-center gap-1 mr-2">
        {flipFlops.map((v, i) => (
          <motion.span
            key={i}
            className="font-mono font-bold"
            style={{
              fontSize: 20,
              width: 26,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              background: v ? 'var(--accent-green)' : 'var(--bg-elevated)',
              color: v ? '#000' : 'var(--text-muted)',
              boxShadow: v ? '0 0 8px var(--accent-green-glow)' : 'none',
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.15 }}
          >
            {v ? '1' : '0'}
          </motion.span>
        ))}
      </div>

      {/* Tab bar */}
      <nav className="flex items-center gap-1 flex-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative"
            style={{
              color:
                activeTab === tab.id
                  ? 'var(--accent-blue)'
                  : 'var(--text-muted)',
              background:
                activeTab === tab.id
                  ? 'rgba(59,130,246,0.1)'
                  : 'transparent',
            }}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
            <kbd
              className="font-mono text-[10px] ml-1 px-1 rounded hidden lg:inline"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-muted)',
              }}
            >
              {tab.key}
            </kbd>
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                style={{ background: 'var(--accent-blue)' }}
              />
            )}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}
          title="Toggle tema (T)"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={toggleEducation}
          className="p-2 rounded-lg"
          style={{
            color: 'var(--accent-blue)',
            background: 'rgba(59,130,246,0.1)',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
          title="Panel educativo (?)"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
}
