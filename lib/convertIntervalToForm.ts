type IntervalUnit = "seconds" | "minutes" | "hours" | "days";

function convertIntervalToForm(interval: number): { intervalNumber: number; intervalUnit: IntervalUnit } {
  let intervalNumber = interval;
  let intervalUnit: IntervalUnit = "seconds"; // default

  if (interval % 86400 === 0) { // 1 day = 86400 sec
    intervalNumber = interval / 86400;
    intervalUnit = "days";
  } else if (interval % 3600 === 0) {
    intervalNumber = interval / 3600;
    intervalUnit = "hours";
  } else if (interval % 60 === 0) {
    intervalNumber = interval / 60;
    intervalUnit = "minutes";
  }

  return { intervalNumber, intervalUnit };
}

export default convertIntervalToForm;