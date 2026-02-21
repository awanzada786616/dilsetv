const crypto = require('crypto');
const axios = require('axios');

const K = "dilse-tv-premium-key-secure-32ch"; 

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 5000 });
        const lines = res.data.split('\n');
        let channels = [];
        // Sirf pehle 40 channels fetch karein taake speed fast rahe
        for (let i = 0; i < lines.length && channels.length < 40; i++) {
            if (lines[i].startsWith("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Live Channel";
                const stream = lines[i + 1]?.trim();
                if (stream && stream.startsWith("http")) {
                    channels.push({ name, url: stream, group });
                }
            }
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    try {
        // 1. Hardcoded Channels (Taake website kabhi khali na dikhe)
        let allChannels = [
            { name: "PTV Sports", url: "https://m-c16-n.top-streaming.com/ptv/ptvsports/playlist.m3u8", group: "Sports" },
            { name: "Ten Sports", url: "https://m-c16-n.top-streaming.com/ten/tensports/playlist.m3u8", group: "Sports" }
        ];

        // 2. Fetch from External JSON (Your JSONBin)
        try {
            const mainRes = await axios.get("https://api.jsonbin.io/v3/b/699204d8ae596e708f2d1de2/latest", { timeout: 3000 });
            const apiData = mainRes.data.record.channels || [];
            allChannels = [...allChannels, ...apiData];
        } catch (e) { console.log("JSONBin Skip"); }

        // 3. Fetch External M3U (Promise.all for speed)
        const [kids, global] = await Promise.all([
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Global")
        ]);

        allChannels = [...allChannels, ...kids, ...global];

        // 4. Encryption logic
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(K), iv);
        let encrypted = cipher.update(JSON.stringify(allChannels), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ d: encrypted, i: iv.toString('hex') });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}
