import { afterEach, describe, expect, it } from 'vitest';
import { businessDay, businessIsoDay, businessTimeZone } from './business-day';

describe('business day', () => {
  const original = process.env.APP_TIMEZONE;
  afterEach(() => {
    if (original === undefined) delete process.env.APP_TIMEZONE;
    else process.env.APP_TIMEZONE = original;
  });

  it('defaults to UTC and ignores invalid zones', () => {
    delete process.env.APP_TIMEZONE;
    expect(businessTimeZone()).toBe('UTC');
    process.env.APP_TIMEZONE = 'Not/AZone';
    expect(businessTimeZone()).toBe('UTC');
  });

  it('uses the configured zone around midnight', () => {
    // 22:30 UTC on Nov 15 is already Nov 16 in Cairo (UTC+2).
    const instant = new Date('2026-11-15T22:30:00.000Z');
    process.env.APP_TIMEZONE = 'Africa/Cairo';
    expect(businessIsoDay(instant)).toBe('2026-11-16');
    delete process.env.APP_TIMEZONE;
    expect(businessIsoDay(instant)).toBe('2026-11-15');
  });

  it('normalizes explicit days to UTC midnight and rejects malformed input', () => {
    expect(businessDay('2026-01-05').toISOString()).toBe('2026-01-05T00:00:00.000Z');
    expect(businessDay('garbage').toISOString()).toMatch(/T00:00:00\.000Z$/);
  });
});
