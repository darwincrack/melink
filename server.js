import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post('/api/metadata', async (req, res) => {
  try {
    const { url } = req.body;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text() || 
                 $('meta[property="og:title"]').attr('content') || 
                 'Unknown Title';

    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       'No description available';
    
    let favicon = $('link[rel="icon"]').attr('href') || 
                 $('link[rel="shortcut icon"]').attr('href') || 
                 '/favicon.ico';

    // Make favicon URL absolute if it's relative
    if (favicon && !favicon.startsWith('http')) {
      const urlObj = new URL(url);
      favicon = new URL(favicon, urlObj.origin).toString();
    }

    res.json({
      title: title.trim(),
      description: description.trim(),
      favicon
    });
  } catch (error) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({
      title: 'Unknown Title',
      description: 'No description available',
      favicon: ''
    });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});