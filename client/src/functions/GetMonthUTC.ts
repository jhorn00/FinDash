import moment from 'moment';

// Returns the short utc month string
// Accepts utc date/time string
function getShortMonthUTC(utcString: string) {
  const momentDate = moment.utc(utcString);
  
  // Check if the date is valid
  if (!momentDate.isValid()) {
    return '';
  }

  // Get short month string from momentDate
  const monthName = momentDate.format('MMM');
  return monthName;
}

export default getShortMonthUTC;
