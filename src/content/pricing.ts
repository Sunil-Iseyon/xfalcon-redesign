/**
 * Pricing data - single source of truth for /pricing and the homepage teaser.
 * Numbers match the printed conference materials (trifold + pricing supplement,
 * "xFalcon GTM model, 2026"). Changes here are contract-adjacent: code review, not CMS.
 */

export interface PricingTier {
  name: string;
  scope: string;
  users: string;
  complexity: string;
  perUserMonthly: string;
  installation: { price: string; hours: string };
  maintenance: { price: string; hours: string };
  totalMonthly: string;
  yearOneTotal: string;
  highlighted?: boolean;
}

export const PER_USER_PRICE = '$10';

export const TIERS: PricingTier[] = [
  {
    name: 'Starter',
    scope: '1-2 subject areas',
    users: 'Up to 10 users',
    complexity: '1-2 fact tables, 2-3 data sources',
    perUserMonthly: '$10',
    installation: { price: '$12,000', hours: '80 hrs one-time' },
    maintenance: { price: '$1,200 / mo', hours: '8 hrs / month' },
    totalMonthly: '$1,300',
    yearOneTotal: '$27,600',
  },
  {
    name: 'Growth',
    scope: '3-5 subject areas',
    users: 'Up to 25 users',
    complexity: '3-8 fact tables, 4-6 data sources',
    perUserMonthly: '$10',
    installation: { price: '$18,000', hours: '120 hrs one-time' },
    maintenance: { price: '$2,400 / mo', hours: '16 hrs / month' },
    totalMonthly: '$2,650',
    yearOneTotal: '$49,800',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    scope: 'Unlimited areas',
    users: '100+ users',
    complexity: 'Unlimited fact tables, cross-domain logic',
    perUserMonthly: '$10',
    installation: { price: '$30,000', hours: '200 hrs one-time' },
    maintenance: { price: '$6,000 / mo', hours: '40 hrs / month' },
    totalMonthly: '$7,000',
    yearOneTotal: '$114,000',
  },
];

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

export interface AiModelOption {
  name: string;
  tag: string;
  price: string;
  priceNote: string;
  points: string[];
}

export const AI_MODEL_NOTE =
  'Platform pricing assumes you bring your own AI model key. Prefer not to manage keys? We offer two managed paths.';

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
    price: '~$25',
    priceNote: 'per user / month',
    points: [
      'Iseyon-managed access to Claude, OpenAI, and Gemini',
      'No hardware investment, always current models',
      'Custom pricing for 100+ users',
    ],
  },
  {
    name: 'On-premise server',
    tag: 'OPTION B',
    price: '~$556',
    priceNote: 'per month, 3-yr lease',
    points: [
      'Dedicated GPU server runs open-source models',
      '100% of data stays on premises',
      'Zero per-user AI fees - cost-effective at 22+ users',
    ],
  },
];

export interface TcoRow {
  label: string;
  cost: string;
  costValue: number;
  isXfalcon?: boolean;
  note?: string;
}

export const TCO_HEADING = 'Enterprise BI without the enterprise bill';
export const TCO_SUBHEAD =
  'Estimated two-year total cost for 25 users, all-in. Source: xFalcon GTM model, 2026.';

export const TCO_ROWS: TcoRow[] = [
  { label: 'xFalcon', cost: '$93.6K', costValue: 93.6, isXfalcon: true },
  { label: 'Cloud BI + AI add-on', cost: '$248K', costValue: 248, note: '62% lower with xFalcon' },
  { label: 'Enterprise visualization', cost: '$324K', costValue: 324, note: '71% lower with xFalcon' },
  { label: 'Legacy enterprise BI', cost: '$524K', costValue: 524, note: '82% lower with xFalcon' },
];

export const PRICING_FOOTNOTE =
  'Total monthly = per-user fees + maintenance. Installation is one-time. Tier placement is based on analytical complexity, not just user count. AI model usage billed separately. US pricing shown; regional taxes and hosting may vary.';
