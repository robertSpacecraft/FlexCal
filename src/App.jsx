import { useState, useMemo } from 'react'
import TimeEntryForm from './components/TimeEntryForm'
import ResultsPanel from './components/ResultsPanel'
import { calculateFlexibility, validatePairs } from './utils/timeUtils'

function App() {
  const [isFriday, setIsFriday] = useState(false);
  const [pairs, setPairs] = useState([
    { in: '', out: '' },
    { in: '', out: '' }
  ]);

  const errors = useMemo(() => validatePairs(pairs), [pairs]);

  const calculation = useMemo(() => {
    if (errors.length > 0) return null;
    return calculateFlexibility(pairs, isFriday);
  }, [pairs, errors, isFriday]);

  return (
    <div className="app-container">
      <header>
        <h1>FlexCal</h1>
        <p>Esta herramienta permite calcular tu jornada diaria a partir de los fichajes de entrada y salida. Introduce tus horas y la aplicación te indicará cuánto has trabajado, tu saldo de flexibilidad y la hora máxima a la que puedes salir sin generar horas extra.</p>
      </header>

      <main>
        <div className="left-panel">
          <TimeEntryForm
            pairs={pairs}
            setPairs={setPairs}
            isFriday={isFriday}
            setIsFriday={setIsFriday}
          />
          {errors.length > 0 && (
            <div className="error-messages">
              {errors.map((err, i) => (
                <div key={i} className="error-item">⚠️ {err}</div>
              ))}
            </div>
          )}
        </div>

        <div className="right-panel">
          <ResultsPanel calculation={calculation} />
        </div>
      </main>
    </div>
  )
}

export default App
