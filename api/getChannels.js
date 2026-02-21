const crypto = require('crypto');
const axios = require('axios');

const K = "dilse-tv-premium-key-secure-32ch"; 

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 8000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Unknown";
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
    // UPDATED SECURITY: Mobile browsers ke liye compatible check
    const referer = req.headers.referer || "";
    const origin = req.headers.origin || "";
    
    // Check if request is from your domain or local
    const isAllowed = 
        referer.includes('dilsetv.vercel.app') || 
        origin.includes('dilsetv.vercel.app') ||
        referer.includes('localhost') ||
        process.env.NODE_ENV === 'development';

    if (!isAllowed && referer !== "") { 
        // Agar referer hai aur wo galat hai tab block karein
        return res.status(403).json({ error: "Access Denied" });
    }

    try {
        const API_LINK = "https://api.jsonbin.io/v3/b/699204d8ae596e708f2d1de2/latest";
        const mainRes = await axios.get(API_LINK);
        let allChannels = mainRes.data.record.channels || [];

        const kids = await fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids");
        const india = await fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "India");
        const globalSports = await fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "GlobalSports");

        allChannels = [...allChannels, ...kids, ...india, ...globalSports];

        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(K), iv);
        let encrypted = cipher.update(JSON.stringify(allChannels), 'utf8', 'hex');
        encrypted += cipher.final('hex');

        res.status(200).json({
            d: encrypted,
            i: iv.toString('hex')
        });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
