import { getServerSideSitemap } from 'next-sitemap';
import * as nextDynamic from '@/next.dynamic.mjs';
import * as nextConstants from '@/next.constants.mjs';

// This is the production base domain. For the Node.js Website
// @todo: We might store the "baseDomain" in the next constants and use it across the website
const baseDomain = `https://nodejs.org${nextConstants.BASE_PATH}`;

// This method populates and generates the Website Sitemap by using `next-sitemap` SSR functionality
// @see https://nextjs.org/docs/app/building-your-application/routing/router-handlers
export const GET = () => {
  // Retrieves all the dynamic generated paths
  const dynamicRoutes = nextConstants.DYNAMIC_GENERATED_ROUTES();

  // Retrieves all the static paths (from next.dynamic.mjs)
  const staticPaths = [...nextDynamic.allPaths.values()]
    .flat()
    .filter(route => nextConstants.STATIC_ROUTES_IGNORES.every(e => !e(route)))
    .map(route => route.routeWithLocale);

  // The current date of this request
  const currentDate = new Date().toISOString();

  return getServerSideSitemap(
    [...dynamicRoutes, ...staticPaths].sort().map(route => ({
      loc: `${baseDomain}/${route}`,
      lastmod: currentDate,
      changefreq: 'always',
    }))
  );
};

// Enforces that this route is used as static rendering
// @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
export const dynamic = 'error';
