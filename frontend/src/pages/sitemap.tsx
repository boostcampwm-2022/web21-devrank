import { GetServerSidePropsContext } from 'next';
import { ISitemapField, getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const lastmod = new Date().toISOString();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://dreamdev.me';

  const defaultFields: ISitemapField[] = [
    {
      loc: baseUrl,
      changefreq: 'hourly',
      priority: 0.8,
      lastmod,
    },
    {
      loc: `${baseUrl}/about`,
      changefreq: 'daily',
      priority: 0.5,
      lastmod,
    },
    {
      loc: `${baseUrl}/ranking?tier=all&amp;page=1`,
      changefreq: 'hourly',
      priority: 0.8,
      lastmod,
    },
  ];

  return getServerSideSitemap(ctx, defaultFields);
};

export default () => {
  return;
};
