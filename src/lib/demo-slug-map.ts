/**
 * GENERATED FILE - DO NOT EDIT BY HAND.
 * Run `node scripts/generate-demo-slug-map.mjs` after changing
 * content/demos/*.md or the folder layout under public/demos/.
 *
 * Maps the public demo slug to the real static files under public/demos:
 *   html - the document served for /demos/<slug>/
 *   dir  - the folder every /demos/<slug>/<asset> request resolves against
 *
 * Consumed by src/proxy.ts, which cannot read the filesystem at request time.
 */

export interface DemoSlugTarget {
  /** URL path of the demo's own HTML document, percent-encoded. */
  html: string;
  /** URL path of the folder that HTML document lives in, percent-encoded. */
  dir: string;
}

export const DEMO_SLUG_TARGETS: Record<string, DemoSlugTarget> = {
  'beverage-manufacturing': {
    html: '/demos/demo3/Falcon%20Manufacturing%20Bev%20-%20Green%20One/index.html',
    dir: '/demos/demo3/Falcon%20Manufacturing%20Bev%20-%20Green%20One',
  },
  'falcon-auto': {
    html: '/demos/demo7/index.html',
    dir: '/demos/demo7',
  },
  'falcon-car-manufacturing': {
    html: '/demos/demo16/Falcon%20Car%20Manufacturing/Falcon%20Car%20Manufacturing/xfalcon-falcon-car-mfg-kit/index.html',
    dir: '/demos/demo16/Falcon%20Car%20Manufacturing/Falcon%20Car%20Manufacturing/xfalcon-falcon-car-mfg-kit',
  },
  'falcon-consumer-data-platform': {
    html: '/demos/demo18/Falcon%20CDP/Falcon%20Consumer/index.html',
    dir: '/demos/demo18/Falcon%20CDP/Falcon%20Consumer',
  },
  'falcon-defense-aerospace': {
    html: '/demos/demo20/Falcon%20Defense%20%26%20Aerospace/Falcon%20Defense%20%26%20Aerospace/xfalcon-falcon-defense-kit/index.html',
    dir: '/demos/demo20/Falcon%20Defense%20%26%20Aerospace/Falcon%20Defense%20%26%20Aerospace/xfalcon-falcon-defense-kit',
  },
  'falcon-finance': {
    html: '/demos/demo11/Falcon%20Finance/xfalcon-falcon-finance-kit/index.html',
    dir: '/demos/demo11/Falcon%20Finance/xfalcon-falcon-finance-kit',
  },
  'falcon-food-snacks': {
    html: '/demos/demo14/Falcon%20Food%20%26%20Snacks/xfalcon-food-snacks-kit/index.html',
    dir: '/demos/demo14/Falcon%20Food%20%26%20Snacks/xfalcon-food-snacks-kit',
  },
  'falcon-health': {
    html: '/demos/demo1/Falcon%20Health/index.html',
    dir: '/demos/demo1/Falcon%20Health',
  },
  'falcon-hospitality': {
    html: '/demos/demo8/Falcon%20Hospitality/index.html',
    dir: '/demos/demo8/Falcon%20Hospitality',
  },
  'falcon-hr-analytics': {
    html: '/demos/demo12/Falcon%20HR%20Analytics/xfalcon-hr-analytics-kit/index.html',
    dir: '/demos/demo12/Falcon%20HR%20Analytics/xfalcon-hr-analytics-kit',
  },
  'falcon-ipl-analytics': {
    html: '/demos/demo13/xFalcon%20IPL%20Demo/xfalcon-ipl-analytics-kit/index.html',
    dir: '/demos/demo13/xFalcon%20IPL%20Demo/xfalcon-ipl-analytics-kit',
  },
  'falcon-marketing-analytics': {
    html: '/demos/demo21/Falcon%20Marketing/Falcon%20Marketing/xfalcon-falcon-marketing-kit/index.html',
    dir: '/demos/demo21/Falcon%20Marketing/Falcon%20Marketing/xfalcon-falcon-marketing-kit',
  },
  'falcon-pmr': {
    html: '/demos/demo6/Falcon%20PMR/pmr-dashboard.html',
    dir: '/demos/demo6/Falcon%20PMR',
  },
  'falcon-real-estate': {
    html: '/demos/demo10/Falcon%20Real%20Estate/xfalcon-falcon-re-kit/index.html',
    dir: '/demos/demo10/Falcon%20Real%20Estate/xfalcon-falcon-re-kit',
  },
  'falcon-retail': {
    html: '/demos/demo2/Falcon%20Retail/index.html',
    dir: '/demos/demo2/Falcon%20Retail',
  },
  'falcon-semiconductor': {
    html: '/demos/demo22/Falcon%20Semiconductor/Falcon%20Semiconductor/xfalcon-falcon-semi-kit/index.html',
    dir: '/demos/demo22/Falcon%20Semiconductor/Falcon%20Semiconductor/xfalcon-falcon-semi-kit',
  },
  'falcon-soccer-analytics': {
    html: '/demos/demo17/Falcon%20Soccer/Falcon%20Soccer%20Demo/xfalcon-worldcup360-kit/index.html',
    dir: '/demos/demo17/Falcon%20Soccer/Falcon%20Soccer%20Demo/xfalcon-worldcup360-kit',
  },
  'falcon-spirits-alcohol': {
    html: '/demos/demo9/Falcon%20Spirits%20%26%20Alcohol/index.html',
    dir: '/demos/demo9/Falcon%20Spirits%20%26%20Alcohol',
  },
  'falcon-telecom': {
    html: '/demos/demo15/Falcon%20Telecom/Falcon%20Telecom/xfalcon-falcon-telecom-kit/index.html',
    dir: '/demos/demo15/Falcon%20Telecom/Falcon%20Telecom/xfalcon-falcon-telecom-kit',
  },
  'falcon-telecom-media': {
    html: '/demos/demo19/Falcon%20Telecom%20and%20Media/Falcon%20Telecom%20%26%20Media/xfalcon-falcon-tm-kit/index.html',
    dir: '/demos/demo19/Falcon%20Telecom%20and%20Media/Falcon%20Telecom%20%26%20Media/xfalcon-falcon-tm-kit',
  },
  'pop-lab': {
    html: '/demos/demo5/Falcon%20Manufacturing%20Bev%20-%20The%20Yellow%20One/index.html',
    dir: '/demos/demo5/Falcon%20Manufacturing%20Bev%20-%20The%20Yellow%20One',
  },
  'rush-energy': {
    html: '/demos/demo4/Falcon%20Manufacturing%20Bev%20-%20Red%20One/index.html',
    dir: '/demos/demo4/Falcon%20Manufacturing%20Bev%20-%20Red%20One',
  },
};
