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
  if (!url) return res.status(400).json({ error: 'URL missing' });

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const sources = [];

    $('video, source, iframe, embed, script').each((_, el) => {
      const src = $(el).attr('src');
      if (src && /\.(m3u8|mp4|mpd|mov|avi|webm)/.test(src)) {
        sources.push(src);
      }
    });

    res.json({ sources });
  } catch (error) {
    res.status(500).json({ error: 'Extraction failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
