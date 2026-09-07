import { AnimatePresence } from 'framer-motion';
import { useSimStore } from './store/simulation';
import { useKeyboard } from './hooks/useKeyboard';
import { useClock } from './hooks/useClock';
import { Header } from './components/Header/Header';
import { ControlPanel } from './components/ControlPanel/ControlPanel';
import { SchematicView } from './components/Schematic/SchematicView';
import { BreadboardView } from './components/Breadboard/BreadboardView';
import { TimingDiagram } from './components/TimingDiagram/TimingDiagram';
import { StateTable } from './components/StateTable/StateTable';
import { Footer } from './components/Footer/Footer';
import { EducationPanel } from './components/Explanation/EducationPanel';

function MainCanvas() {
  const activeTab = useSimStore((s) => s.activeTab);

  return (
    <div className="flex-1 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {activeTab === 'schematic' && <SchematicView />}
      {activeTab === 'breadboard' && <BreadboardView />}
      {activeTab === 'timing' && <TimingDiagram />}
      {activeTab === 'table' && <StateTable />}
    </div>
  );
}

function App() {
  useKeyboard();
  useClock();
  const showEducation = useSimStore((s) => s.showEducation);

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-base)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div
          style={{
            borderRight: '1px solid var(--border)',
            background: 'var(--bg-panel)',
          }}
        >
          <ControlPanel />
        </div>
        <MainCanvas />
      </div>
      <Footer />
      <AnimatePresence>
        {showEducation && <EducationPanel />}
      </AnimatePresence>
    </div>
  );
}

export default App;
