const axios = require('axios');

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 5000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Live TV";
                const stream = lines[i + 1]?.trim();
                if (stream && stream.startsWith("http")) {
                    channels.push({ name, url: stream, group });
                }
            }
            if (channels.length >= 50) break; // Sirf 50 channels taake load fast ho
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    try {
        // 1. PTV & TEN SPORTS (Hardcoded for 100% guarantee)
        let sportsFix = [
            { name: "PTV Sports HD", url: "https://m-c16-n.top-streaming.com/ptv/ptvsports/playlist.m3u8", group: "Sports" },
            { name: "Ten Sports HD", url: "https://m-c16-n.top-streaming.com/ten/tensports/playlist.m3u8", group: "Sports" },
            { name: "Geo Super", url: "https://m-c16-n.top-streaming.com/geo/geosuper/playlist.m3u8", group: "Sports" }
        ];

        // 2. Fetching other categories
        const [kids, entertainment, global] = await Promise.all([
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids"),
            fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "Entertainment"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Global")
        ]);

        const allData = [...sportsFix, ...kids, ...entertainment, ...global];

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(allData); // Direct Plain JSON
    } catch (error) {
        res.status(500).json({ error: "Failed to load data" });
    }
}
