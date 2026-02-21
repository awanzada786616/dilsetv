const axios = require('axios');

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 7000 });
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
            if (channels.length >= 100) break; 
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    try {
        const API_LINK = "https://api.jsonbin.io/v3/b/699204d8ae596e708f2d1de2/latest";
        const [mainRes, kids, india, sports] = await Promise.all([
            axios.get(API_LINK),
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids Zone"),
            fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "India"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Global")
        ]);

        const apiChannels = mainRes.data.record.channels || [];
        const finalData = [...apiChannels, ...kids, ...india, ...sports];

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(finalData);
    } catch (error) {
        res.status(500).json([]);
    }
}
