import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const siteUrl = 'https://www.knowhowindia.in';
const distDirectory = resolve(process.cwd(), 'dist');

const routes = [
  {
    path: 'privacy-policy',
    title: 'Privacy & Cookie Policy | Know How Café',
    description: 'Read how Know How Café collects, uses, stores and protects personal information, cookies, booking details and payment-related data.',
    fallback: '<h1>Privacy & Cookie Policy</h1><p>Know How Café explains how it handles personal information, cookies, booking details and payments.</p>',
  },
  {
    path: 'terms-and-conditions',
    title: 'Terms & Conditions | Know How Café',
    description: 'Read Know How Café terms for workshops, DIY kits, bookings, payments, cancellations, refunds and use of this website.',
    fallback: '<h1>Terms & Conditions</h1><p>Know How Café terms for workshops, DIY kits, bookings, payments, cancellations and refunds.</p>',
  },
  {
    path: 'contact-us',
    title: 'Contact Know How Café | Creative Workshops in Bangalore',
    description: 'Contact Know How Café in Bangalore for creative workshops, group bookings, DIY kits and customer support.',
    fallback: '<h1>Contact Know How Café</h1><p>Get in touch about creative workshops, group bookings, DIY kits and customer support in Bangalore.</p>',
  },
  {
    path: 'cancellations-refunds',
    title: 'Cancellation and Refund Policy | Know How Café',
    description: 'Read Know How Café’s policy for workshop cancellation requests, approved refunds, duplicate payments and DIY kit returns.',
    fallback: '<h1>Cancellation and Refund Policy</h1><p>Know How Café’s policy for workshop cancellations, approved refunds, duplicate payments and DIY kit returns.</p>',
  },
  {
    path: 'shipping-policy',
    title: 'Shipping Policy | Know How Café',
    description: 'Read Know How Café’s DIY kit delivery, address, shipping-charge and order-status policy.',
    fallback: '<h1>Shipping Policy</h1><p>Know How Café’s policy for DIY kit delivery, delivery details and order-status updates.</p>',
  },
];

const replaceMeta = (html, attribute, value, content) => {
  const matcher = new RegExp(`<meta\\s+${attribute}=["']${value}["']\\s+content=["'][^"']*["']\\s*/?>`, 'i');
  const tag = `<meta ${attribute}="${value}" content="${content}" />`;
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
};

const makePage = (html, route) => {
  const canonicalUrl = `${siteUrl}/${route.path}`;
  let page = html.replace(/<title>[^<]*<\/title>/i, `<title>${route.title}</title>`);
  page = replaceMeta(page, 'name', 'description', route.description);
  page = replaceMeta(page, 'property', 'og:title', route.title);
  page = replaceMeta(page, 'property', 'og:description', route.description);
  page = replaceMeta(page, 'property', 'og:url', canonicalUrl);
  page = replaceMeta(page, 'name', 'twitter:title', route.title);
  page = replaceMeta(page, 'name', 'twitter:description', route.description);
  page = page.replace(
    '</head>',
    `    <link rel="canonical" href="${canonicalUrl}" />\n  </head>`,
  );
  // This content is available to non-JavaScript crawlers and users. React takes
  // over the same page normally after the application bundle loads, so no UI or
  // route logic changes for visitors with JavaScript enabled.
  page = page.replace(
    '<div id="root"></div>',
    `<div id="root"></div><noscript><main>${route.fallback}</main></noscript>`,
  );
  return page;
};

const indexHtml = await readFile(resolve(distDirectory, 'index.html'), 'utf8');
await Promise.all(routes.map(async (route) => {
  const routeDirectory = resolve(distDirectory, route.path);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(resolve(routeDirectory, 'index.html'), makePage(indexHtml, route), 'utf8');
}));

console.log(`Created route-specific SEO HTML for ${routes.length} public pages.`);
