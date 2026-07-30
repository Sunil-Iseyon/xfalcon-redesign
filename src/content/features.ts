/**
 * Features page content - single source of truth for /features.
 * Copy is sourced from the produced demo videos and the platform repo;
 * keep it brief (claim + proof, no overexplaining) per the brand skill.
 */

export interface FeatureVideoAsset {
  /** Slug used for analytics events and asset paths */
  slug: string;
  src: string;
  poster: string;
}

export interface Feature {
  title: string;
  description: string;
  isNew?: boolean;
  /** Small chips rendered under the description (e.g. warehouse names) */
  chips?: string[];
  video?: FeatureVideoAsset;
}

export interface FeatureGroup {
  slug: string;
  eyebrow: string;
  heading: string;
  features: Feature[];
}

export const FEATURES_HERO = {
  eyebrow: 'PLATFORM',
  heading: 'Everything xFalcon does',
  subhead:
    'From your warehouse to a decision you can defend - connected, governed, and ready to present.',
};

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    slug: 'trust',
    eyebrow: 'CONNECT AND TRUST',
    heading: 'Built on your data, governed by your team',
    features: [
      {
        title: 'Works on your warehouse',
        description:
          'Read-only connections to the databases you already run. No migration, no data movement.',
        chips: ['Snowflake', 'Databricks', 'BigQuery', 'Postgres', 'Redshift', 'SQL Server'],
      },
      {
        title: 'File-upload analytics',
        description:
          'Upload CSV and Excel files - gigabyte scale - and query them in plain English alongside your warehouse.',
        isNew: true,
      },
      {
        title: 'Verified data models',
        description:
          'Conceptual, logical, and physical models from one prompt - verified against live data, not just redrawn from the catalog.',
        video: {
          slug: 'data-models',
          src: '/features/videos/data-models.mp4',
          poster: '/features/posters/data-models.jpg',
        },
      },
      {
        title: 'Three learning systems',
        description:
          "Memory keeps corrections forever. Annotations carry your data team's guardrails. Self-correction checks every query before and after it runs.",
      },
      {
        title: 'Governed catalog',
        description:
          'xFalcon sees only the tables your data stewards register - read-only, row-limited, fully audited.',
      },
      {
        title: 'Secure architecture',
        description:
          'Encrypted end to end on AWS - single sign-on, role-based access, row-level security, and a full audit trail.',
      },
    ],
  },
  {
    slug: 'insight',
    eyebrow: 'ASK AND ANALYZE',
    heading: 'Ask like a leader, dig in like an analyst',
    features: [
      {
        title: 'Interactive query',
        description:
          'Ask in plain English, answered straight from your warehouse - with drill-through to the tables, rules, and rows behind every number.',
      },
      {
        title: 'One-prompt dashboards',
        description:
          'A branded, governed portal from a single prompt - live the same afternoon, not after a 12-week BI backlog.',
        video: {
          slug: 'one-prompt-dashboards',
          src: '/features/videos/one-prompt-dashboards.mp4',
          poster: '/features/posters/one-prompt-dashboards.jpg',
        },
      },
      {
        title: 'AutoExplore',
        description:
          'Autonomous overnight exploration. It generates hypotheses, tests them, fact-checks itself, and delivers a ranked briefing by morning.',
        video: {
          slug: 'autoexplore',
          src: '/features/videos/autoexplore.mp4',
          poster: '/features/posters/autoexplore.jpg',
        },
      },
      {
        title: 'Saved, refreshable reports',
        description:
          'Save any dashboard as a report that re-runs live on open, with date ranges like last 30 days, MTD, and YTD.',
        isNew: true,
      },
      {
        title: 'xFalcon Chat',
        description:
          "A ready-to-use chat app for teams that don't use claude.ai - same governed answers, zero setup.",
        isNew: true,
      },
    ],
  },
  {
    slug: 'deliver',
    eyebrow: 'DELIVER',
    heading: 'Ready before the meeting',
    features: [
      {
        title: 'xFalcon News',
        description:
          'Your morning brief, built from your data - not a template. Five AI-ranked priorities, every claim backed by live warehouse numbers, in your inbox at 7am.',
        video: {
          slug: 'xfalcon-news',
          src: '/features/videos/xfalcon-news.mp4',
          poster: '/features/posters/xfalcon-news.jpg',
        },
      },
      {
        title: 'QBR decks',
        description: 'Board-ready QBR decks with the narrative already written. Minutes, not weeks.',
      },
      {
        title: 'Excel Edition',
        description:
          'Board-ready Excel workbooks from one request - native slicers, every number reconciled to source before delivery.',
      },
    ],
  },
  {
    slug: 'enterprise',
    eyebrow: 'ENTERPRISE',
    heading: 'Run it your way',
    features: [
      {
        title: 'Admin console',
        description:
          'One console for memories, annotations, data sources, and users - full control over what the AI knows.',
      },
      {
        title: 'SSO and role-based access',
        description: 'OIDC single sign-on with Okta, Azure AD, and more. Per-tool permissions.',
      },
      {
        title: 'Production-grade cloud',
        description:
          'A SOC 2-designed environment: encrypted everywhere, multi-AZ, cross-region disaster recovery, zero-downtime deploys.',
      },
      {
        title: 'On-premise and air-gapped',
        description:
          'A signed installer runs the full platform inside your network - fully offline if you need it.',
        isNew: true,
      },
    ],
  },
];
