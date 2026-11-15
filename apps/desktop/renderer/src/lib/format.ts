import type { Locale } from '@attendance/shared';

/** Arabic text with Western digits keeps codes, times and counts aligned in tables. */
export function intlLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar-u-nu-latn' : 'en-GB';
}

/**
 * Date-only values (hire dates, holidays, leave ranges, attendance days) are
 * stored as UTC midnight. Format them in UTC or they shift by a day for
 * anyone west of Greenwich.
 */
export function formatDay(
  locale: Locale,
  iso: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { ...options, timeZone: 'UTC' }).format(
    new Date(iso),
  );
}

/** Clock time of a real instant (check-in/out), in the viewer's zone. */
export function formatTime(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
}

/** "1 day" / "5 days" / "يوم واحد" / "5 أيام" with correct plural rules. */
export function formatDayCount(locale: Locale, days: number): string {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'unit',
    unit: 'day',
    unitDisplay: 'long',
  }).format(days);
}

export function formatDateTime(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso));
}

export function formatLongToday(locale: Locale, date = new Date()): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** Local calendar day as YYYY-MM-DD. */
export function localIsoDay(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function shiftIsoDay(isoDay: string, days: number): string {
  const date = new Date(`${isoDay}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Whole days from today's local date to a UTC-midnight day value. */
export function daysUntil(iso: string): number {
  const target = Date.parse(iso.slice(0, 10) + 'T00:00:00.000Z');
  const today = Date.parse(localIsoDay() + 'T00:00:00.000Z');
  return Math.round((target - today) / 86_400_000);
}

export function formatRelativeDays(locale: Locale, days: number): string {
  return new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: 'auto' }).format(days, 'day');
}

/** Inclusive day count of a date range stored as UTC midnights. */
export function inclusiveDays(startIso: string, endIso: string): number {
  const start = Date.parse(startIso.slice(0, 10) + 'T00:00:00.000Z');
  const end = Date.parse(endIso.slice(0, 10) + 'T00:00:00.000Z');
  return Math.max(1, Math.round((end - start) / 86_400_000) + 1);
}

export function formatDuration(locale: Locale, fromIso: string, toIso: string): string {
  const minutes = Math.max(0, Math.round((Date.parse(toIso) - Date.parse(fromIso)) / 60_000));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const unit = locale === 'ar' ? { h: 'س', m: 'د' } : { h: 'h', m: 'm' };
  return `${hours}${unit.h} ${String(rest).padStart(2, '0')}${unit.m}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function matchesSearch(query: string, ...fields: (string | null | undefined)[]): boolean {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return true;
  return fields.some((field) => field?.toLocaleLowerCase().includes(needle));
}
