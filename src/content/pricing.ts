/**
 * Pricing data - single source of truth for /pricing and the homepage teaser.
 *
 * The tier tables are the only pricing primitives on the site. Every other
 * figure a visitor sees - tier totals, the two-year TCO chart, every savings
 * percentage - is derived from them by the helpers below, so any number on the
 * page reconciles against the table above it (QA: the old chart hardcoded a
 * $93.6K xFalcon row that no tier produced).
 *
 * The only figures that are NOT derived are the TCO comparator costs, which are
 * external market estimates, and the two AI model list prices. Both are marked.
 *
 * Numbers match the printed conference materials (trifold + pricing supplement,
 * "xFalcon GTM model, 2026"). Changes here are contract-adjacent: code review, not CMS.
 */

/* ---------------------------------------------------------------- formatters */

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 1300 -> '$1,300' */
export function formatUsd(amount: number): string {
  return USD.format(amount);
}

/** 81600 -> '$81.6K', 248000 -> '$248K' - chart-axis voice, one decimal at most. */
export function formatUsdCompact(amount: number): string {
  const thousands = amount / 1000;
  return `$${thousands.toFixed(Number.isInteger(thousands) ? 0 : 1)}K`;
}

/* --------------------------------------------------------------------- tiers */

export const PER_USER_MONTHLY = 10;
export const PER_USER_PRICE = formatUsd(PER_USER_MONTHLY);

export interface PricingTier {
  name: string;
  scope: string;
  /** Display band, e.g. 'Up to 25 users'. */
  users: string;
  /** The seat count the tier's published totals assume - the top of that band. */
  userCount: number;
  complexity: string;
  installation: { amount: number; hours: string };
  /**
   * The fixed monthly component - a platform fee that also buys the support
   * hours shown. Presented as "platform" rather than "maintenance" because the
   * monthly total is derived as (seats x PER_USER_MONTHLY) + this, and a buyer
   * doing that arithmetic needs the fixed part named for what it is (QA R1-05).
   */
  platform: { amount: number; hours: string };
  highlighted?: boolean;
}

export const TIERS: PricingTier[] = [
  {
    name: 'Starter',
    scope: '1-2 subject areas',
    users: 'Up to 10 users',
    userCount: 10,
    complexity: '1-2 fact tables, 2-3 data sources',
    installation: { amount: 12_000, hours: '80 hrs one-time' },
    platform: { amount: 1_200, hours: 'includes 8 hrs / month' },
  },
  {
    name: 'Growth',
    scope: '3-5 subject areas',
    users: 'Up to 25 users',
    userCount: 25,
    complexity: '3-8 fact tables, 4-6 data sources',
    installation: { amount: 18_000, hours: '120 hrs one-time' },
    platform: { amount: 2_400, hours: 'includes 16 hrs / month' },
    highlighted: true,
  },
  {
    name: 'Enterprise',
    scope: 'Unlimited areas',
    users: '100+ users',
    userCount: 100,
    complexity: 'Unlimited fact tables, cross-domain logic',
    installation: { amount: 30_000, hours: '200 hrs one-time' },
    platform: { amount: 6_000, hours: 'includes 40 hrs / month' },
  },
];

export const MONTHS_PER_YEAR = 12;
export const TCO_MONTHS = 24;

/** Platform fee + (seats x per-user). */
export function tierMonthlyTotal(tier: PricingTier): number {
  return tier.platform.amount + tier.userCount * PER_USER_MONTHLY;
}

/** One-time installation + 12 monthly totals. */
export function tierYearOneTotal(tier: PricingTier): number {
  return tier.installation.amount + MONTHS_PER_YEAR * tierMonthlyTotal(tier);
}

/** One-time installation + 24 monthly totals. Excludes AI model usage. */
export function tierTwoYearTotal(tier: PricingTier): number {
  return tier.installation.amount + TCO_MONTHS * tierMonthlyTotal(tier);
}

export interface TierFigures {
  perUser: string;
  installation: string;
  platform: string;
  monthlyTotal: string;
  yearOne: string;
}

/** Everything a tier card renders, formatted. Views never format money themselves. */
export function tierFigures(tier: PricingTier): TierFigures {
  return {
    perUser: PER_USER_PRICE,
    installation: formatUsd(tier.installation.amount),
    platform: formatUsd(tier.platform.amount),
    monthlyTotal: formatUsd(tierMonthlyTotal(tier)),
    yearOne: formatUsd(tierYearOneTotal(tier)),
  };
}

function requireTier(name: string): PricingTier {
  const tier = TIERS.find((candidate) => candidate.name === name);
  if (!tier) throw new Error(`Unknown pricing tier: ${name}`);
  return tier;
}

/* ----------------------------------------------------------------------- poc */

export const POC = {
  price: '$3,500',
  name: 'Proof of concept',
  timeline: '2-4 weeks',
  includes: [
    '2-4 week engagement',
    '1 subject area, 1-2 fact tables',
    'Up to 5 test users',
    'Live demo with your actual data',
    'Full ROI assessment report',
  ],
  guarantee:
    '100% of the POC fee is credited toward installation when you convert to a full deployment.',
};

/* ------------------------------------------------------------------ ai model */

/** List price for Iseyon-managed cloud access (Option A). */
export const MANAGED_CLOUD_PER_USER_MONTHLY = 25;
/** Monthly cost of the dedicated GPU server on a 3-year lease (Option B). */
export const ON_PREM_MONTHLY_LEASE = 556;

/**
 * First whole seat count at which managed cloud per-user fees meet or exceed
 * the flat on-premise lease. Derived, not asserted: the card used to claim
 * "22+ users", which is one seat short of where the lines actually cross.
 */
export function onPremBreakevenUsers(
  managedPerUser: number = MANAGED_CLOUD_PER_USER_MONTHLY,
  leaseMonthly: number = ON_PREM_MONTHLY_LEASE,
): number {
  return Math.ceil(leaseMonthly / managedPerUser);
}

export const ON_PREM_BREAKEVEN_USERS = onPremBreakevenUsers();

export interface AiModelOption {
  name: string;
  tag: string;
  price: string;
  priceNote: string;
  points: string[];
}

/**
 * Reads forward: this section sits above the tier tables, so the note points
 * down into them rather than back at pricing the visitor has already seen.
 */
export const AI_MODEL_NOTE =
  'The platform pricing below assumes you bring your own AI model key. Prefer not to manage keys? We offer two managed paths.';

export const AI_MODEL_OPTIONS: AiModelOption[] = [
  {
    name: 'Bring your own key',
    tag: 'DEFAULT',
    price: 'Included',
    priceNote: 'in platform pricing',
    points: [
      'Use your existing Claude, OpenAI, or Gemini account',
      'You control the provider relationship and spend',
      'Switch models any time',
    ],
  },
  {
    name: 'Managed cloud AI',
    tag: 'OPTION A',
    price: `~${formatUsd(MANAGED_CLOUD_PER_USER_MONTHLY)}`,
    priceNote: 'per user / month',
    points: [
      'Iseyon-managed access to Claude, OpenAI, and Gemini',
      'No hardware investment, always current models',
      'Custom pricing for 100+ users',
    ],
  },
  {
    name: 'Managed on-prem AI',
    tag: 'OPTION B',
    price: `~${formatUsd(ON_PREM_MONTHLY_LEASE)}`,
    priceNote: 'per month, 3-yr lease, plus your infrastructure',
    points: [
      'Dedicated GPU server running open-source models, deployed into your environment',
      'You provide the hosting, power, and network; we plug our model stack in',
      '100% of data stays on premises',
      `Zero per-user AI fees - costs less than managed cloud at ${ON_PREM_BREAKEVEN_USERS}+ users`,
    ],
  },
];

/* ----------------------------------------------------------------------- tco */

/** The chart's xFalcon row is this tier at its published seat count. */
export const TCO_TIER = requireTier('Growth');
export const TCO_XFALCON_COST = tierTwoYearTotal(TCO_TIER);

export interface TcoComparator {
  label: string;
  cost: number;
}

/**
 * External market estimates - the only costs on this page not derived from
 * TIERS, hence the explicit source line in TCO_SUBHEAD.
 */
export const TCO_COMPARATORS: TcoComparator[] = [
  { label: 'Cloud BI + AI add-on', cost: 248_000 },
  { label: 'Enterprise visualization', cost: 324_000 },
  { label: 'Legacy enterprise BI', cost: 524_000 },
];

/** Whole-number percent by which xFalcon undercuts a comparator. */
export function percentLower(comparatorCost: number, xfalconCost: number): number {
  return Math.round((1 - xfalconCost / comparatorCost) * 100);
}

/** '$18,000 installation <joiner> $2,650 / mo x 24 months' - the whole claim, shown. */
function tcoBuildUp(joiner: string): string {
  return [
    formatUsd(TCO_TIER.installation.amount),
    'installation',
    joiner,
    formatUsd(tierMonthlyTotal(TCO_TIER)),
    `/ mo x ${TCO_MONTHS} months`,
  ].join(' ');
}

export interface TcoRow {
  label: string;
  cost: string;
  costValue: number;
  isXfalcon?: boolean;
  /** Shown under the xFalcon bar - ties the chart back to the tier table. */
  derivation?: string;
  note?: string;
}

export const TCO_HEADING = 'Enterprise BI without the enterprise bill';

export const TCO_SUBHEAD = `Estimated two-year total for ${TCO_TIER.userCount} users on the ${TCO_TIER.name} tier: ${tcoBuildUp('plus')}. AI model usage billed separately. Comparator figures: xFalcon GTM model, 2026.`;

export const TCO_ROWS: TcoRow[] = [
  {
    label: 'xFalcon',
    cost: formatUsdCompact(TCO_XFALCON_COST),
    costValue: TCO_XFALCON_COST,
    isXfalcon: true,
    derivation: `${TCO_TIER.name} tier: ${tcoBuildUp('+')}`,
  },
  ...TCO_COMPARATORS.map((comparator) => ({
    label: comparator.label,
    cost: formatUsdCompact(comparator.cost),
    costValue: comparator.cost,
    note: `${percentLower(comparator.cost, TCO_XFALCON_COST)}% lower with xFalcon`,
  })),
];

const TCO_SAVINGS = TCO_COMPARATORS.map((comparator) =>
  percentLower(comparator.cost, TCO_XFALCON_COST),
);

export const TCO_SAVINGS_RANGE = {
  min: Math.min(...TCO_SAVINGS),
  max: Math.max(...TCO_SAVINGS),
};

/**
 * Must track TCO_ROWS, so it is generated from them. It once read "75-93%
 * lower" directly under a table showing 62-82% (QA R1-10).
 */
export const TCO_CLOSING = `${TCO_SAVINGS_RANGE.min}-${TCO_SAVINGS_RANGE.max}% lower over two years, depending on what you are replacing.`;

/* ------------------------------------------------------------------ footnote */

export const PRICING_FOOTNOTE = `Total monthly = platform fee + (users x ${PER_USER_PRICE}). Installation is one-time. Tier placement is based on analytical complexity, not just user count. AI model usage billed separately. US pricing shown; regional taxes and hosting may vary.`;
