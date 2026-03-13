export const getTargetMinutes = (isFriday) => isFriday ? 360 : 510; // 6h vs 8h 30m
export const getMinMinutes = (isFriday) => getTargetMinutes(isFriday) - 60; // -1h
export const getMaxMinutes = (isFriday) => getTargetMinutes(isFriday) + 60; // +1h

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMins) {
  if (isNaN(totalMins) || totalMins < 0) return "--:--";
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function isValidTime(timeStr) {
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}

export function formatDuration(totalMins) {
  if (isNaN(totalMins)) return "0h 0m";
  const isNegative = totalMins < 0;
  const absMins = Math.abs(totalMins);
  const hours = Math.floor(absMins / 60);
  const minutes = absMins % 60;
  const sign = isNegative ? "-" : "";
  return `${sign}${hours}h ${minutes}m`;
}

// Validation function that checks if there are overlaps or out-of-order errors
export function validatePairs(pairs) {
  let prevOut = -1;
  const errors = [];

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    
    // Si no es el último y le falta algún dato
    if (i < pairs.length - 1 && (!pair.in || !pair.out)) {
      errors.push(`El tramo ${i + 1} está incompleto y no es el último.`);
      continue;
    }

    if (pair.in) {
      const inMins = timeToMinutes(pair.in);
      if (inMins <= prevOut) {
        errors.push(`La entrada del tramo ${i + 1} solapa con la salida anterior.`);
      }
      if (pair.out) {
        const outMins = timeToMinutes(pair.out);
        if (outMins <= inMins) {
          errors.push(`La salida del tramo ${i + 1} debe ser posterior a su entrada.`);
        }
        prevOut = outMins;
      } else {
        prevOut = inMins; // so future iterations overlap if any
      }
    }
  }

  return errors;
}

export function calculateFlexibility(pairs, isFriday = false) {
  const targetMinutes = getTargetMinutes(isFriday);
  const minMinutes = getMinMinutes(isFriday);
  const maxMinutes = getMaxMinutes(isFriday);

  const result = {
    isFriday,
    targetMinutes,
    isPredictive: false,
    workedAccumulated: 0,
    remainingToTarget: 0,
    predictiveExitTarget: 0,
    remainingToMax: 0,
    predictiveExitMax: 0,
    
    isFinal: false,
    state: '', // 'WITHIN_MARGIN', 'EXCESS_POSITIVE', 'DEFECT_NEGATIVE'
    totalWorked: 0,
    balance: 0,
    extraTime: 0,
    owedTime: 0
  };

  if (!pairs || pairs.length === 0) return result;

  const validPairs = pairs.filter(p => p.in);
  if (validPairs.length === 0) return result;

  const lastPair = validPairs[validPairs.length - 1];
  result.isPredictive = !lastPair.out;
  result.isFinal = !!lastPair.out;

  let workedMins = 0;
  for (let i = 0; i < validPairs.length; i++) {
    const pair = validPairs[i];
    if (pair.in && pair.out) {
      workedMins += timeToMinutes(pair.out) - timeToMinutes(pair.in);
    }
  }

  if (result.isPredictive) {
    const currentInMins = timeToMinutes(lastPair.in);

    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let currentSegmentWorked = 0;
    
    // Si la hora actual es posterior a la hora de entrada de este último tramo,
    // sumamos esos minutos también.
    if (nowMins > currentInMins) {
      currentSegmentWorked = nowMins - currentInMins;
    }

    result.workedAccumulated = workedMins + currentSegmentWorked;
    
    // Los cálculos predictivos se siguen haciendo en base al inicio del último tramo
    // (es decir, el tiempo restante desde que entró última vez)
    result.remainingToTarget = Math.max(0, targetMinutes - workedMins);
    result.predictiveExitTarget = currentInMins + result.remainingToTarget;
    
    result.remainingToMax = Math.max(0, maxMinutes - workedMins);
    result.predictiveExitMax = currentInMins + result.remainingToMax;
  } else {
    result.totalWorked = workedMins;
    result.balance = workedMins - targetMinutes;

    if (workedMins > maxMinutes) {
      result.state = 'EXCESS_POSITIVE';
      result.extraTime = workedMins - maxMinutes;
    } else if (workedMins < minMinutes) {
      result.state = 'DEFECT_NEGATIVE';
      result.owedTime = minMinutes - workedMins;
    } else {
      result.state = 'WITHIN_MARGIN';
    }
  }

  return result;
}
