
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.static('public'));

app.get('/extract', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const response = await axios.get(url, { timeout: 15000 });
    const html = response.data;
    const $ = cheerio.load(html);

    const sources = [];

    $('iframe, embed, video, source').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !sources.includes(src)) sources.push(src.startsWith('//') ? 'https:' + src : src);
    });

    const m3u8Matches = html.match(/https?:\/\/[^"']+\.m3u8/g);
    if (m3u8Matches) {
      m3u8Matches.forEach(link => {
        if (!sources.includes(link)) sources.push(link);
      });
    }

    res.json({ url, sources });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URL', detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`IP House Server running on port ${PORT}`);
});
