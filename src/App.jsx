import { useState, useMemo } from 'react'
import TimeEntryForm from './components/TimeEntryForm'
import ResultsPanel from './components/ResultsPanel'
import { calculateFlexibility, validatePairs } from './utils/timeUtils'

function App() {
  const [pairs, setPairs] = useState([
    { in: '', out: '' },
    { in: '', out: '' }
  ]);

  const errors = useMemo(() => validatePairs(pairs), [pairs]);
  
  const calculation = useMemo(() => {
    if (errors.length > 0) return null;
    return calculateFlexibility(pairs);
  }, [pairs, errors]);

  return (
    <div className="app-container">
      <header>
        <h1>FlexCal</h1>
        <p>Calculadora de Flexibilidad de Jornada</p>
      </header>
      
      <main>
        <div className="left-panel">
          <TimeEntryForm pairs={pairs} setPairs={setPairs} />
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
