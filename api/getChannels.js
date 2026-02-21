const crypto = require('crypto');
const axios = require('axios');

const K = "dilse-tv-premium-key-secure-32ch"; 

// Shaheen TV Style Parsing Method
async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 7000 });
        const text = res.data;
        const lines = text.split("\n");
        let channels = [];
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("#EXTINF")) {
                // Shaheen TV method: extract name after comma
                const namePart = lines[i].split(",")[1];
                const name = namePart ? namePart.trim() : "Unknown Channel";
                const stream = lines[i + 1] ? lines[i + 1].trim() : null;
                
                if (stream && stream.startsWith("http")) {
                    channels.push({ name, url: stream, group });
                }
            }
            if (channels.length >= 60) break; // Speed limit
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    const referer = req.headers.referer || "";
    if (!referer.includes('vercel.app') && !referer.includes('localhost')) {
        return res.status(403).json({ error: "Access Denied" });
    }

    try {
        // API Links (Shaheen TV sources + Your JSON)
        const M3U_Kids = "https://iptv-org.github.io/iptv/categories/kids.m3u";
        const M3U_IN = "https://iptv-org.github.io/iptv/countries/in.m3u";
        const M3U_SPORTS = "https://iptv-org.github.io/iptv/categories/sports.m3u";
        const MY_JSON = "https://api.jsonbin.io/v3/b/699204d8ae596e708f2d1de2/latest";

        const mainRes = await axios.get(MY_JSON);
        let allChannels = mainRes.data.record.channels || [];

        // Parallel Fetching like Shaheen TV
        const [kids, india, sports] = await Promise.all([
            fetchM3U(M3U_Kids, "Kids"),
            fetchM3U(M3U_IN, "India"),
            fetchM3U(M3U_SPORTS, "Global")
        ]);

        allChannels = [...allChannels, ...kids, ...india, ...sports];

        // AES Encryption
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(K), iv);
        let encrypted = cipher.update(JSON.stringify(allChannels), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        res.status(200).json({ d: encrypted, i: iv.toString('hex') });
    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
}
