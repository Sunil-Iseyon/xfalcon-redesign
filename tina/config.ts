import { defineConfig } from 'tinacms';

const branch =
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || '',
  token: process.env.TINA_TOKEN || '',
  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: '',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'landing',
        label: 'Landing Page Content',
        path: 'src/content',
        format: 'json',
        match: {
          include: 'landing',
        },
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: 'object',
            name: 'hero',
            label: 'Hero Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'subhead', label: 'Subhead', required: true, ui: { component: 'textarea' } },
              {
                type: 'object',
                name: 'primaryCta',
                label: 'Primary CTA',
                fields: [
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'string', name: 'href', label: 'Link', required: true },
                ],
              },
              {
                type: 'object',
                name: 'secondaryCta',
                label: 'Secondary CTA',
                fields: [
                  { type: 'string', name: 'label', label: 'Label', required: true },
                  { type: 'string', name: 'href', label: 'Link', required: true },
                ],
              },
              { type: 'string', name: 'statPills', label: 'Stat Pills', list: true },
            ],
          },
          {
            type: 'object',
            name: 'whatYouGet',
            label: 'What You Get Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              {
                type: 'object',
                name: 'items',
                label: 'Items',
                list: true,
                fields: [
                  { type: 'string', name: 'title', label: 'Title', required: true },
                  { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
                ],
              },
            ],
          },
          {
            type: 'object',
            name: 'demosTeaser',
            label: 'Demos Teaser Section',
            fields: [
              { type: 'string', name: 'eyebrow', label: 'Eyebrow' },
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'subheading', label: 'Subheading', ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'CTA Label', required: true },
            ],
          },
          {
            type: 'object',
            name: 'cta',
            label: 'Contact CTA Section',
            fields: [
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              { type: 'string', name: 'ctaLabel', label: 'CTA Label', required: true },
            ],
          },
          {
            type: 'object',
            name: 'contactInfo',
            label: 'Contact Info',
            fields: [{ type: 'string', name: 'email', label: 'Email', required: true }],
          },
          {
            type: 'object',
            name: 'footer',
            label: 'Footer',
            fields: [
              { type: 'string', name: 'description', label: 'Description', required: true, ui: { component: 'textarea' } },
              { type: 'string', name: 'copyright', label: 'Copyright', required: true },
            ],
          },
        ],
      },
      {
        name: 'demos',
        label: 'Demo Cards',
        path: 'content/demos',
        format: 'md',
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true },
          {
            type: 'string',
            name: 'description',
            label: 'Description',
            required: true,
            ui: { component: 'textarea' },
          },
          {
            type: 'string',
            name: 'path',
            label: 'Demo Path',
            required: true,
            description: 'Use a folder path like /demos/demo1/; it will resolve to index.html automatically.',
          },
          {
            type: 'string',
            name: 'slug',
            label: 'Public Slug',
            description:
              'Kebab-case URL the demo is linked as, e.g. rush-energy -> /demos/rush-energy/. Derived from the title when left blank. After changing this, run: node scripts/generate-demo-slug-map.mjs',
          },
          { type: 'image', name: 'thumbnail', label: 'Thumbnail' },
          { type: 'string', name: 'category', label: 'Category' },
          { type: 'boolean', name: 'featured', label: 'Featured' },
          { type: 'number', name: 'order', label: 'Order' },
        ],
      },
      {
        name: 'legalPages',
        label: 'Legal Pages',
        path: 'src/content/legal',
        format: 'json',
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          { type: 'string', name: 'title', label: 'Title', required: true },
          { type: 'string', name: 'lastUpdated', label: 'Last Updated', required: true },
          {
            type: 'string',
            name: 'intro',
            label: 'Intro Paragraph',
            ui: { component: 'textarea' },
          },
          {
            type: 'object',
            name: 'sections',
            label: 'Sections',
            list: true,
            fields: [
              { type: 'string', name: 'heading', label: 'Heading', required: true },
              {
                type: 'string',
                name: 'body',
                label: 'Body',
                required: true,
                ui: { component: 'textarea' },
              },
            ],
          },
        ],
      },
    ],
  },
});
