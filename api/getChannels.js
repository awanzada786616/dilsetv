const crypto = require('crypto');
const axios = require('axios');

const K = "dilse-tv-premium-key-secure-32ch"; // 32 chars

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 6000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length && channels.length < 50; i++) {
            if (lines[i].includes("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Live TV";
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
    // Security: Only allow your vercel domain
    const referer = req.headers.referer || "";
    if (!referer.includes('vercel.app') && !referer.includes('localhost') && referer !== "") {
        return res.status(403).json({ error: "Access Denied" });
    }

    try {
        // 1. Static Channels (Ye hamesha show honge)
        let allChannels = [
            { name: "PTV Sports HD", url: "https://m-c16-n.top-streaming.com/ptv/ptvsports/playlist.m3u8", group: "Sports" },
            { name: "Ten Sports HD", url: "https://m-c16-n.top-streaming.com/ten/tensports/playlist.m3u8", group: "Sports" },
            { name: "Geo Super", url: "https://m-c16-n.top-streaming.com/geo/geosuper/playlist.m3u8", group: "Sports" }
        ];

        // 2. Parallel Fetching
        const [kids, india, global] = await Promise.all([
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids"),
            fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "India"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Global")
        ]);

        allChannels = [...allChannels, ...kids, ...india, ...global];

        // 3. Encryption
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(K), iv);
        let encrypted = cipher.update(JSON.stringify(allChannels), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        res.status(200).json({
            d: encrypted,
            i: iv.toString('hex')
        });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}
