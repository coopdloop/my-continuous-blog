// scripts/generate-static.ts
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { getAllPosts } from '../utils/markdown-loader';

async function generateStaticPages() {
  const browser = await puppeteer.launch();
  const posts = getAllPosts();
  const outputDir = path.join(process.cwd(), 'dist/static');

  await fs.mkdir(outputDir, { recursive: true });

  for (const post of posts) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:4173/post/${post.slug}`);
    await page.waitForSelector('.blog-post-content');
    const html = await page.content();
    await fs.writeFile(path.join(outputDir, `${post.slug}.html`), html);
  }

  await browser.close();
}

generateStaticPages();
