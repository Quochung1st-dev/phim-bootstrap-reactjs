import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { render } from './dist/server/entry-server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use('/assets', express.static(path.join(__dirname, 'dist/client/assets')));
app.use('/favicon.ico', express.static(path.join(__dirname, 'dist/client/favicon.ico')));

// Read the index.html template
const template = fs.readFileSync(path.join(__dirname, 'dist/client/index.html'), 'utf-8');

app.get('*', async (req, res) => {
  try {
    const { html, head } = await render(req.originalUrl);
    
    // Insert rendered app and meta tags from react-helmet-async
    const headContent = head ? 
      `${head.title.toString()}${head.meta.toString()}${head.link.toString()}${head.style.toString()}${head.script.toString()}` 
      : '';
    
    const finalHtml = template
      .replace('<!--app-head-->', headContent)
      .replace('<!--app-html-->', html);
    
    res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
  } catch (e) {
    console.error(e);
    res.status(500).end('Internal Server Error');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
