const formatToPHTime = (isoString) => {
  if (!isoString) return '-- / --';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric', month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila'
  }).format(date);
};