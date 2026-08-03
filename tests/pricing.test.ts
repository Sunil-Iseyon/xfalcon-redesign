import { describe, expect, it } from 'vitest';
import {
  ON_PREM_BREAKEVEN_USERS,
  ON_PREM_MONTHLY_LEASE,
  MANAGED_CLOUD_PER_USER_MONTHLY,
  TCO_CLOSING,
  TCO_ROWS,
  TCO_SAVINGS_RANGE,
  TCO_SUBHEAD,
  TCO_TIER,
  TCO_XFALCON_COST,
  TIERS,
  formatUsd,
  formatUsdCompact,
  onPremBreakevenUsers,
  percentLower,
  tierMonthlyTotal,
  tierTwoYearTotal,
  tierYearOneTotal,
} from '@/content/pricing';

function tier(name: string) {
  const found = TIERS.find((candidate) => candidate.name === name);
  if (!found) throw new Error(`Missing tier: ${name}`);
  return found;
}

/**
 * The published contract - these are the figures on the printed pricing
 * supplement and they must survive any refactor of the derivation helpers.
 */
const PUBLISHED = [
  { name: 'Starter', monthly: 1_300, yearOne: 27_600 },
  { name: 'Growth', monthly: 2_650, yearOne: 49_800 },
  { name: 'Enterprise', monthly: 7_000, yearOne: 114_000 },
];

describe('tier derivations', () => {
  it.each(PUBLISHED)('$name reproduces the published monthly and year-one totals', (published) => {
    const subject = tier(published.name);
    expect(tierMonthlyTotal(subject)).toBe(published.monthly);
    expect(tierYearOneTotal(subject)).toBe(published.yearOne);
  });

  it('formats money the way the cards render it', () => {
    expect(formatUsd(1_300)).toBe('$1,300');
    expect(formatUsd(114_000)).toBe('$114,000');
    expect(formatUsdCompact(81_600)).toBe('$81.6K');
    expect(formatUsdCompact(248_000)).toBe('$248K');
  });
});

describe('two-year TCO', () => {
  it('bases the xFalcon row on the Growth tier at 25 users', () => {
    expect(TCO_TIER.name).toBe('Growth');
    expect(TCO_TIER.userCount).toBe(25);
  });

  it('computes the Growth two-year total as 81600', () => {
    expect(tierTwoYearTotal(tier('Growth'))).toBe(81_600);
    expect(TCO_XFALCON_COST).toBe(81_600);
  });

  it('renders the xFalcon row and its derivation from the tier table', () => {
    const xfalcon = TCO_ROWS.find((row) => row.isXfalcon);
    expect(xfalcon?.cost).toBe('$81.6K');
    expect(xfalcon?.derivation).toBe('Growth tier: $18,000 installation + $2,650 / mo x 24 months');
  });

  it('derives every comparator note from the same xFalcon cost', () => {
    const notes = TCO_ROWS.filter((row) => !row.isXfalcon).map((row) => row.note);
    expect(notes).toEqual([
      '67% lower with xFalcon',
      '75% lower with xFalcon',
      '84% lower with xFalcon',
    ]);
  });

  it('closes with the range the rows actually show', () => {
    expect(TCO_SAVINGS_RANGE).toEqual({ min: 67, max: 84 });
    expect(TCO_CLOSING).toBe('67-84% lower over two years, depending on what you are replacing.');
  });

  it('states the build-up rather than claiming an all-in figure', () => {
    expect(TCO_SUBHEAD).toContain('$18,000 installation plus $2,650 / mo x 24 months');
    expect(TCO_SUBHEAD).toContain('AI model usage billed separately');
    expect(TCO_SUBHEAD).not.toContain('all-in');
  });

  it('rounds percentages to whole numbers', () => {
    expect(percentLower(248_000, 81_600)).toBe(67);
    expect(Number.isInteger(percentLower(324_000, 81_600))).toBe(true);
  });
});

describe('on-premise AI breakeven', () => {
  it('is the first whole seat count where managed cloud meets the lease', () => {
    expect(ON_PREM_BREAKEVEN_USERS).toBe(23);

    const below = (ON_PREM_BREAKEVEN_USERS - 1) * MANAGED_CLOUD_PER_USER_MONTHLY;
    const at = ON_PREM_BREAKEVEN_USERS * MANAGED_CLOUD_PER_USER_MONTHLY;
    expect(below).toBeLessThan(ON_PREM_MONTHLY_LEASE);
    expect(at).toBeGreaterThanOrEqual(ON_PREM_MONTHLY_LEASE);
  });

  it('treats exact equality as breakeven', () => {
    expect(onPremBreakevenUsers(25, 500)).toBe(20);
  });
});
