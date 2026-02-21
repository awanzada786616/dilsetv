const axios = require('axios');

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 8000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("#EXTINF")) {
                // Extract name correctly
                const namePart = lines[i].split(",")[1];
                const name = namePart ? namePart.trim() : "Live Channel";
                const stream = lines[i + 1] ? lines[i + 1].trim() : null;
                
                if (stream && stream.startsWith("http")) {
                    channels.push({ name, url: stream, group });
                }
            }
            // Limit to 500 channels per category for stability on Vercel
            if (channels.length >= 500) break;
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    try {
        const JSON_BIN = "https://api.jsonbin.io/v3/b/699204d8ae596e708f2d1de2/latest";
        const M3U_SPORTS = "https://iptv-org.github.io/iptv/categories/sports.m3u";
        const M3U_KIDS = "https://iptv-org.github.io/iptv/categories/kids.m3u";
        const M3U_INDIA = "https://iptv-org.github.io/iptv/countries/in.m3u";

        // Fetching all sources in parallel
        const [jsonRes, sportsData, kidsData, indiaData] = await Promise.all([
            axios.get(JSON_BIN).catch(() => ({ data: { record: { channels: [] } } })),
            fetchM3U(M3U_SPORTS, "Sports"),
            fetchM3U(M3U_KIDS, "Kids Zone"),
            fetchM3U(M3U_INDIA, "Entertainment")
        ]);

        const customChannels = jsonRes.data.record.channels || [];
        
        // Merge everything
        const allData = [...customChannels, ...sportsData, ...kidsData, ...indiaData];

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json(allData);
    } catch (error) {
        res.status(500).json({ error: "Data Fetch Error" });
    }
}
