import React from 'react';
import { formatDuration, minutesToTime } from '../utils/timeUtils';

export default function ResultsPanel({ calculation }) {
  if (!calculation) return null;

  const {
    isFriday,
    targetMinutes,
    isPredictive,
    workedAccumulated,
    remainingToTarget,
    predictiveExitTarget,
    remainingToMax,
    predictiveExitMax,
    isFinal,
    state,
    totalWorked,
    balance,
    extraTime,
    owedTime
  } = calculation;

  const targetLabel = isFriday ? "6h" : "8h 30m";
  const maxLabel = isFriday ? "7h" : "9h 30m";
  const minLabel = isFriday ? "5h" : "7h 30m";

  return (
    <div className="card results-container">
      <h2>Resultados {isFriday && <span className="friday-badge">🌴 Viernes</span>}</h2>

      {isPredictive && (
        <div className="predictive-results">
          <div className="result-item">
            <span className="label">Trabajo acumulado (incluyendo actual):</span>
            <span className="value">{formatDuration(workedAccumulated)}</span>
          </div>
          
          <div className="result-item highlight">
            <span className="label">Tiempo restante hasta {targetLabel}:</span>
            <span className="value">{formatDuration(remainingToTarget)}</span>
          </div>
          
          <div className="result-item highlight-target">
            <span className="label">Hora para cumplir jornada ({targetLabel}):</span>
            <span className="value time-value">{minutesToTime(predictiveExitTarget)}</span>
          </div>
          
          <div className="result-item">
            <span className="label">Tiempo restante hasta límite ({maxLabel}):</span>
            <span className="value">{formatDuration(remainingToMax)}</span>
          </div>

          <div className="result-item warning-text">
            <span className="label">Hora máxima de salida sin horas extra:</span>
            <span className="value time-value">{minutesToTime(predictiveExitMax)}</span>
          </div>
        </div>
      )}

      {isFinal && (
        <div className="final-results">
          <div className="result-item">
            <span className="label">Tiempo total trabajado:</span>
            <span className="value">{formatDuration(totalWorked)}</span>
          </div>
          
          <div className="result-item">
            <span className="label">Saldo respecto a {targetLabel}:</span>
            <span className="value" data-positive={balance > 0} data-negative={balance < 0}>
              {balance > 0 ? '+' : ''}{formatDuration(balance)}
            </span>
          </div>

          <div className="evaluation-box">
            {state === 'WITHIN_MARGIN' && (
              <div className={balance < 0 ? "status-deficit" : "status-success"}>
                <h3>Dentro del margen de flexibilidad</h3>
                <p>
                  {balance === 0 
                    ? `Has cumplido exactamente tu jornada de ${targetLabel}.` 
                    : balance > 0 
                      ? `Has acumulado ${formatDuration(balance)} de flexibilidad a tu favor.`
                      : `Has perdido ${formatDuration(Math.abs(balance))} de flexibilidad en tu contra.`}
                </p>
              </div>
            )}

            {state === 'EXCESS_POSITIVE' && (
              <div className="status-overtime">
                <h3>Fuera del margen (Exceso)</h3>
                <p>Has superado el límite máximo de flexibilidad diaria ({maxLabel}).</p>
                <div className="action-required">
                  Debes registrar <strong className="overtime-value">{formatDuration(extraTime)}</strong> como hora extra.
                </div>
              </div>
            )}

            {state === 'DEFECT_NEGATIVE' && (
              <div className="status-deficit">
                <h3>Fuera del margen (Defecto)</h3>
                <p>No has cumplido el tiempo mínimo exigido diario ({minLabel}).</p>
                <div className="action-required">
                  Te faltan <strong className="deficit-value">{formatDuration(owedTime)}</strong> para entrar dentro del margen permitido.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
