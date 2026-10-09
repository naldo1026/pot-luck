import { describe, expect, it } from 'vitest';
import { normalisePasscode, passcodeMatches } from './passcode';

describe('passcode', () => {
  it('ignores separators, spaces and case', () => {
    expect(normalisePasscode(' 14/02/23 ')).toBe('140223');
    expect(passcodeMatches('14.02.23', '140223')).toBe(true);
    expect(passcodeMatches('14-02-23', '14/02/23')).toBe(true);
    expect(passcodeMatches('Northampton', 'northampton')).toBe(true);
  });

  it('rejects wrong or empty answers', () => {
    expect(passcodeMatches('150223', '140223')).toBe(false);
    expect(passcodeMatches('', '')).toBe(false);
    expect(passcodeMatches(' / ', '')).toBe(false);
  });
});
