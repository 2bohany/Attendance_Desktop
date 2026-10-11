import { describe, it, expect } from 'vitest';
import { API_PREFIX } from '@attendance/config';

describe('Backend foundation', () => {
  it('should use correct API prefix', () => {
    expect(API_PREFIX).toBe('/api');
  });
});
