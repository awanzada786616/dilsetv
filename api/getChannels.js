const crypto = require('crypto');
const axios = require('axios');

// Key must be exactly 32 characters
const K = "dilse-tv-premium-key-secure-32ch"; 

async function fetchM3U(url, group) {
    try {
        // Timeout kam rakha hai taake Vercel function crash na ho
        const res = await axios.get(url, { timeout: 4000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length && channels.length < 50; i++) { // Limit to 50 for speed
            if (lines[i].startsWith("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Unknown Channel";
                const stream = lines[i + 1]?.trim();
                if (stream && stream.startsWith("http")) {
                    channels.push({ name, url: stream, group });
                }
            }
        }
        return channels;
    } catch (e) { 
        console.log(`Failed to fetch ${group}`);
        return []; 
    }
}

export default async function handler(req, res) {
    // Basic Security
    const referer = req.headers.referer || "";
    const isAllowed = referer.includes('vercel.app') || referer.includes('localhost') || referer === "";

    try {
        // 1. Main API Data
        const API_LINK = "https://api.jsonbin.io/v3/b/699204d8ae596e708f2d1de2/latest";
        const mainRes = await axios.get(API_LINK);
        let allChannels = mainRes.data.record.channels || [];

        // 2. External M3U Data (Fast Fetch)
        const [kids, sports] = await Promise.all([
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids Zone"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Global")
        ]);

        allChannels = [...allChannels, ...kids, ...sports];

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
        res.status(500).json({ error: "Server Busy" });
    }
}
