import { useSimStore } from '../../store/simulation';
import { TimingDiagram } from '../TimingDiagram/TimingDiagram';
import { StateTable } from '../StateTable/StateTable';

export function Footer() {
  const setActiveTab = useSimStore((s) => s.setActiveTab);

  return (
    <div
      className="flex w-full"
      style={{
        height: 180,
        borderTop: '1px solid var(--border)',
        background: 'var(--bg-panel)',
      }}
    >
      {/* Mini timing diagram */}
      <div
        className="flex-1 cursor-pointer overflow-hidden"
        onClick={() => setActiveTab('timing')}
        style={{ borderRight: '1px solid var(--border)' }}
        title="Click para expandir diagrama de tiempos"
      >
        <TimingDiagram compact />
      </div>

      {/* Mini state table */}
      <div className="overflow-hidden" style={{ width: 420 }}>
        <StateTable compact />
      </div>
    </div>
  );
}
