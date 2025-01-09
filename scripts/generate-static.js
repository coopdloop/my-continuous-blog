// scripts/generate-static.js
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateStaticPages() {
  const browser = await puppeteer.launch();
  const outputDir = path.join(__dirname, '../dist/static');

  const contentDir = path.join(__dirname, '../src/posts');
  const files = await fs.readdir(contentDir);
  const slugs = files.map(f => f.replace('.md', ''));

  console.log('Found posts:', slugs);

  await fs.mkdir(outputDir, { recursive: true });

  for (const slug of slugs) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:4173/post/${slug}`, { waitUntil: 'networkidle0' });
    const html = await page.content();
    await fs.writeFile(path.join(outputDir, `${slug}.html`), html);
    console.log(`Generated static page for: ${slug}`);
  }

  await browser.close();
}

generateStaticPages().catch(console.error);
