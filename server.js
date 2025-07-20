
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/extract', async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const results = [];

    $('iframe').each((_, el) => results.push($(el).attr('src')));
    $('video').each((_, el) => results.push($(el).attr('src')));
    $('source').each((_, el) => results.push($(el).attr('src')));

    const htmlText = $.html();
    const m3u8Regex = /(https?:\/\/[^\s"'<>]+\.m3u8)/g;
    const m3u8Matches = htmlText.match(m3u8Regex);
    if (m3u8Matches) results.push(...m3u8Matches);

    const unique = [...new Set(results)].filter(Boolean);
    res.json({ sources: unique });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse URL.' });
  }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
