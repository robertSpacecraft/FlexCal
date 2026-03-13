import React from 'react';

export default function TimeEntryForm({ pairs, setPairs, isFriday, setIsFriday }) {

  const handleTimeChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };
    setPairs(newPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { in: '', out: '' }]);
  };

  const removePair = (index) => {
    // Only allow removal if there's more than one pair
    if (pairs.length > 1) {
      const newPairs = pairs.filter((_, i) => i !== index);
      setPairs(newPairs);
    }
  };

  return (
    <div className="card form-container">
      <div className="form-header">
        <h2>Fichajes</h2>
        <div className={`friday-selector ${isFriday ? 'active' : ''}`}>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isFriday} 
              onChange={(e) => setIsFriday(e.target.checked)} 
            />
            <span className="slider round"></span>
          </label>
          <span className="friday-text">¡Es viernes!</span>
        </div>
      </div>
      <div className="pairs-list">
        {pairs.map((pair, index) => (
          <div key={index} className="time-pair">
            <div className="time-group">
              <label>Entrada {index + 1}</label>
              <input
                type="time"
                value={pair.in}
                onChange={(e) => handleTimeChange(index, 'in', e.target.value)}
              />
            </div>
            
            <div className="time-group">
              <label>Salida {index + 1}</label>
              <input
                type="time"
                value={pair.out}
                onChange={(e) => handleTimeChange(index, 'out', e.target.value)}
              />
            </div>
            {pairs.length > 1 && (
              <button 
                className="btn-remove" 
                onClick={() => removePair(index)}
                title="Eliminar tramo"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      
      <button className="btn-add" onClick={addPair}>
        + Añadir tramo
      </button>
    </div>
  );
}
