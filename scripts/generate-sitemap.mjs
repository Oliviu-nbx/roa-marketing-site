import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const siteUrl = 'https://roa-marketing.com';
const blogDir = path.join(root, 'src/pages/blog');
const outputPath = path.join(root, 'public/sitemap.xml');

const toDate = (date) => date.toISOString().split('T')[0];

async function getBlogUrls() {
  const entries = await fs.readdir(blogDir);
  const urls = [];
  for (const entry of entries) {
    if (!entry.endsWith('.astro')) continue;
    const slug = entry.replace('.astro', '');
    const stats = await fs.stat(path.join(blogDir, entry));
    urls.push({
      loc: `${siteUrl}/blog/${slug}`,
      lastmod: toDate(stats.mtime)
    });
  }
  return urls;
}

async function buildSitemap() {
  const today = toDate(new Date());
  const urls = [
    { loc: `${siteUrl}/`, lastmod: today, priority: '1.0' }
  ];

  const blogUrls = await getBlogUrls();
  blogUrls.forEach((url) => urls.push({ ...url, priority: '0.7' }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(({ loc, lastmod, priority = '0.7' }) => `\t<url>\n\t\t<loc>${loc}</loc>\n\t\t<lastmod>${lastmod}</lastmod>\n\t\t<priority>${priority}</priority>\n\t</url>`)
      .join('\n') +
    '\n</urlset>\n';

  await fs.writeFile(outputPath, xml, 'utf-8');
  console.log(`generated sitemap with ${urls.length} urls`);
}

buildSitemap().catch((err) => {
  console.error('Failed to generate sitemap', err);
  process.exit(1);
});
