export const formatCurrency = (value) => {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatCompactNumber = (value) =>
  new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value ?? 0));

export const formatDate = (value, options = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return 'TBD';
  return new Intl.DateTimeFormat('en-IN', options).format(new Date(value));
};

export const formatDateRange = (start, end) => {
  if (!start && !end) return 'Dates flexible';
  if (!start) return `Until ${formatDate(end)}`;
  if (!end) return `From ${formatDate(start)}`;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  const startLabel = new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(startDate);

  const endLabel = new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(endDate);

  return `${startLabel} – ${endLabel}`;
};

export const getTripDuration = (start, end) => {
  if (!start || !end) return null;
  const diff = Math.round((new Date(end) - new Date(start)) / 86400000) + 1;
  if (Number.isNaN(diff) || diff <= 0) return null;
  return diff === 1 ? '1 day' : `${diff} days`;
};

export const deriveStatus = (start, end, referenceDate = new Date()) => {
  if (!start || !end) return 'Draft';
  const today = new Date(referenceDate.toDateString());
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (today < startDate) return 'Upcoming';
  if (today > endDate) return 'Completed';
  return 'Ongoing';
};

export const toPercent = (value, total) => {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
};
