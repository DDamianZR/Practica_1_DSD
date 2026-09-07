import { useSimStore } from '../../store/simulation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronRight, BookOpen, Cpu, Clock, Binary } from 'lucide-react';
import { useState } from 'react';

function Collapsible({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-3" style={{ borderBottom: '1px solid var(--glass-border)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 py-2 text-left"
        style={{ color: 'var(--text-secondary)' }}
      >
        {icon}
        <span className="flex-1 text-sm font-medium">{title}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function EducationPanel() {
  const toggleEducation = useSimStore((s) => s.toggleEducation);
  const animation = useSimStore((s) => s.animation);

  const contextMessage = animation.clockPulseActive
    ? 'El flanco de subida del reloj hace que cada flip-flop capture el valor presente en su entrada D. Los datos se desplazan una posición hacia la derecha simultáneamente.'
    : animation.resetWave
    ? 'El reset asíncrono (CLR) fuerza todas las salidas Q a 0, independientemente del estado del reloj.'
    : 'Presiona el botón de reloj o usa ENTER para generar un pulso. Cada pulso desplaza los datos una posición.';

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto scrollbar-thin"
      style={{
        width: 380,
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border)',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.3)',
      }}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display text-sm uppercase tracking-widest"
            style={{ color: 'var(--accent-blue)', letterSpacing: '0.15em' }}
          >
            Panel Educativo
          </h2>
          <button onClick={toggleEducation} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Context message */}
        <div
          className="glass-panel p-3 mb-4"
          style={{ borderLeft: '3px solid var(--accent-blue)' }}
        >
          <p className="text-sm" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {contextMessage}
          </p>
        </div>

        {/* Theory sections */}
        <Collapsible
          title="¿Qué es un registro SISO?"
          icon={<BookOpen size={16} style={{ color: 'var(--accent-green)' }} />}
          defaultOpen
        >
          <div className="text-xs space-y-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p>
              Un registro de corrimiento <strong>SISO (Serial In – Serial Out)</strong> es un
              circuito secuencial formado por flip-flops conectados en cascada. Los datos
              entran en serie por un extremo y salen en serie por el otro, desplazándose
              una posición con cada pulso de reloj.
            </p>
            <p>
              En esta implementación se utilizan <strong>4 flip-flops tipo D</strong> (74LS74),
              donde la salida Q de cada uno se conecta a la entrada D del siguiente.
            </p>
            <p>
              <strong>Aplicaciones:</strong> líneas de retardo digital, conversión de formatos de
              datos, generadores de secuencias, comunicaciones seriales.
            </p>
          </div>
        </Collapsible>

        <Collapsible
          title="Flip-Flop tipo D (74LS74)"
          icon={<Cpu size={16} style={{ color: 'var(--accent-amber)' }} />}
        >
          <div className="text-xs space-y-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p>
              El flip-flop D captura el valor de la entrada D en el <strong>flanco de subida</strong> del
              reloj y lo mantiene en la salida Q hasta el siguiente flanco.
            </p>
            <p><strong>Ecuación característica:</strong></p>
            <div
              className="font-mono text-center py-2 px-3 rounded my-2"
              style={{ background: 'var(--bg-elevated)', color: 'var(--accent-green)', fontSize: 14 }}
            >
              Q(t+1) = D(t)
            </div>
            <p><strong>Tabla de verdad:</strong></p>
            <table className="w-full text-xs font-mono" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="py-1 px-2" style={{ color: 'var(--text-muted)' }}>CLK</th>
                  <th className="py-1 px-2" style={{ color: 'var(--text-muted)' }}>D</th>
                  <th className="py-1 px-2" style={{ color: 'var(--text-muted)' }}>Q(t+1)</th>
                  <th className="py-1 px-2" style={{ color: 'var(--text-muted)' }}>Q̄(t+1)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 px-2 text-center" style={{ color: 'var(--accent-blue)' }}>↑</td>
                  <td className="py-1 px-2 text-center">0</td>
                  <td className="py-1 px-2 text-center">0</td>
                  <td className="py-1 px-2 text-center">1</td>
                </tr>
                <tr>
                  <td className="py-1 px-2 text-center" style={{ color: 'var(--accent-blue)' }}>↑</td>
                  <td className="py-1 px-2 text-center" style={{ color: 'var(--accent-green)' }}>1</td>
                  <td className="py-1 px-2 text-center" style={{ color: 'var(--accent-green)' }}>1</td>
                  <td className="py-1 px-2 text-center">0</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">
              El 74LS74 contiene <strong>2 flip-flops D</strong> independientes con entradas
              asíncronas PRE (preset) y CLR (clear), activas en bajo.
            </p>
          </div>
        </Collapsible>

        <Collapsible
          title="Funcionamiento del reloj"
          icon={<Clock size={16} style={{ color: 'var(--accent-blue)' }} />}
        >
          <div className="text-xs space-y-2" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <p>
              El registro opera con <strong>flancos de subida</strong> (transición de 0 a 1) del
              reloj. En cada flanco:
            </p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Q₃ (último FF) entrega su valor como salida serial</li>
              <li>Cada FF captura el valor de la entrada D</li>
              <li>Como D_n = Q_(n-1), los datos se desplazan a la derecha</li>
              <li>Q₀ captura el nuevo dato de entrada serial</li>
            </ol>
            <p>
              Todos los flip-flops conmutan <strong>simultáneamente</strong> porque
              comparten la misma señal de reloj.
            </p>
          </div>
        </Collapsible>

        <Collapsible
          title="Preguntas de la práctica"
          icon={<Binary size={16} style={{ color: 'var(--accent-amber)' }} />}
        >
          <div className="text-xs space-y-4" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                1. ¿Cuántos pulsos de reloj se necesitan para cargar completamente el registro?
              </p>
              <p>
                Se necesitan <strong>N pulsos</strong> para un registro de N bits.
                En nuestro caso, <strong>4 pulsos</strong> para cargar los 4 bits completamente.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                2. ¿Cuántos pulsos tarda un bit en recorrer todo el registro?
              </p>
              <p>
                Un bit introducido en la entrada serial tarda exactamente <strong>4 pulsos</strong> en
                aparecer en la salida serial (Q₃), ya que debe atravesar los 4 flip-flops.
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                3. ¿Qué sucede con los datos después de N+1 pulsos?
              </p>
              <p>
                Después de 4 pulsos, cada pulso adicional <strong>expulsa un bit</strong> por la
                salida serial. Si no se introducen nuevos datos (D=0), el registro se vacía
                completamente después de <strong>8 pulsos totales</strong> (4 para llenar + 4 para vaciar).
              </p>
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                4. ¿Cuál es la diferencia entre SISO, SIPO, PISO y PIPO?
              </p>
              <p>
                <strong>SISO:</strong> Serial In, Serial Out — entrada y salida en serie.<br />
                <strong>SIPO:</strong> Serial In, Parallel Out — entrada en serie, lectura paralela de todos los Q.<br />
                <strong>PISO:</strong> Parallel In, Serial Out — carga paralela, salida en serie.<br />
                <strong>PIPO:</strong> Parallel In, Parallel Out — carga y lectura en paralelo.
              </p>
            </div>
          </div>
        </Collapsible>

        {/* 74LS74 Pinout */}
        <Collapsible title="Pinout 74LS74" icon={<Cpu size={16} style={{ color: 'var(--accent-green)' }} />}>
          <div className="flex justify-center">
            <svg viewBox="0 0 200 160" width={200} height={160}>
              <rect x={40} y={10} width={120} height={140} rx={6} fill="#1a1a2e" stroke="var(--border-bright)" strokeWidth={1.5} />
              <circle cx={100} cy={20} r={6} fill="none" stroke="var(--border-bright)" strokeWidth={1} />
              <text x={100} y={85} textAnchor="middle" fill="var(--text-muted)" fontSize={9} fontFamily="'JetBrains Mono', monospace">74LS74</text>
              {[
                ['1-CLR₁', '14-VCC'],
                ['2-D₁', '13-CLR₂'],
                ['3-CLK₁', '12-D₂'],
                ['4-PRE₁', '11-CLK₂'],
                ['5-Q₁', '10-PRE₂'],
                ['6-Q̄₁', '9-Q₂'],
                ['7-GND', '8-Q̄₂'],
              ].map(([left, right], i) => (
                <g key={i}>
                  <circle cx={35} cy={28 + i * 18} r={3} fill="#c0c0c0" />
                  <text x={30} y={31 + i * 18} textAnchor="end" fill="var(--text-muted)" fontSize={7} fontFamily="'JetBrains Mono', monospace">
                    {left}
                  </text>
                  <circle cx={165} cy={28 + i * 18} r={3} fill="#c0c0c0" />
                  <text x={170} y={31 + i * 18} textAnchor="start" fill="var(--text-muted)" fontSize={7} fontFamily="'JetBrains Mono', monospace">
                    {right}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </Collapsible>
      </div>
    </motion.div>
  );
}
