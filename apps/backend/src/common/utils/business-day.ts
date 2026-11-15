const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Resolves the company's time zone. Serverless hosts (Vercel) run in UTC, so
 * "today" must be computed in the business's own zone or check-ins made shortly
 * after local midnight land on the previous day.
 */
export function businessTimeZone(): string {
  const configured = process.env.APP_TIMEZONE?.trim();
  if (!configured) return 'UTC';
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: configured });
    return configured;
  } catch {
    return 'UTC';
  }
}

/** Returns the calendar day (YYYY-MM-DD) of `instant` in the business time zone. */
export function businessIsoDay(instant: Date = new Date()): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: businessTimeZone(),
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(instant);
}

/**
 * Normalizes to the UTC-midnight Date used as the storage key for a business day.
 * Accepts an explicit YYYY-MM-DD; anything else falls back to today.
 */
export function businessDay(isoDay?: string): Date {
  const day = isoDay && ISO_DAY.test(isoDay) ? isoDay : businessIsoDay();
  return new Date(`${day}T00:00:00.000Z`);
}
