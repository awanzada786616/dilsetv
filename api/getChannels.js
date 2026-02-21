const axios = require('axios');

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 6000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length && channels.length < 200; i++) {
            if (lines[i].includes("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Live TV";
                const stream = lines[i + 1]?.trim();
                if (stream && stream.startsWith("http")) channels.push({ name, url: stream, group });
            }
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    try {
        // Parallel fetching for speed
        const [s, k, n] = await Promise.all([
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Sports"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids Zone"),
            fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "Entertainment")
        ]);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json([...s, ...k, ...n]);
    } catch (e) { res.status(500).json([]); }
}
