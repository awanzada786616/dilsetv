const axios = require('axios');

// Aapka Design aur Branding (Base64 Encrypted)
// Ismein aapka number +994401879953 aur Awais Haider ka naam hai
const UI_LOCK = "Ym9keXtiYWNrZ3JvdW5kOiMwNTA1MDU7Y29sb3I6I2ZmZjtmb250LWZhbWlseTonUG9wcGlucyosc2Fucy1zZXJpZjt0ZXh0LWFsaWduOmNlbnRlcjt9Lmhlcm8taG9tZSB7cGFkZGluZzo0MHB4O2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSxyZ2JhKDAsMCwwLDAuOCksIzA1MDUwNSksdXJsKCdodHRwczovL2ltYWdlcy51bnNwbGFzaC5jb20vcGhvdG8tMTU3NDYyOTgxMDM2MC03ZWZiYmUxOTUwMTgnKTtiYWNrZ3JvdW5kLXNpemU6Y292ZXI7fSNoZXJvLXRpdGxlIHtmb250LWZhbWlseTonUmlnaHRlb3VzJztjb2xvcjojZTUwOTE0O2ZvbnQtc2l6ZTo2MHB4O3RleHQtc2hhZG93OjAgMCAyMHB4IHJnYmEoMjI5LDksMjAsMC41KTt9LnNlYXJjaC1iYXIge3dpZHRoOjkwJTttYXgtd2lkdGg6NTAwcHg7cGFkZGluZzoxNXB4IDMwcHg7Ym9yZGVyLXJhZGl1czo1MHB4O2JvcmRlcjoxcHggc29saWQgI2U1MDkxNDtiYWNrZ3JvdW5kOnJnYmEoMCwwLDAsMC45KTtjb2xvcjojZmZmO291dGxpbmU6bm9uZTttYXJnaW4tdG9wOi0yNXB4O2JveC1zaGFkb3c6MCAxMHB4IDMwcHggcmdiYSgwLDAsMCwwLjgpO30udmlkZW8tYm94IHtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo5NSU7bWF4LXdpZHRoOjk1MHB4O21hcmdpbjoyMHB4IGF1dG87Ym9yZGVyLXJhZGl1czoyMHB4O292ZXJmbG93OmhpZGRlbjtib3JkZXI6MXB4IHNvbGlkICMyMjI7Ym94LXNoYWRvdzowIDAgNDBweCByZ2JhKDIyOSw5LDIwLDAuMSk7fXZpZGVvIHt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO30jc3R5bGlzaC1sb2FkZXIge3Bvc2l0aW9uOmFic29sdXRlO2luc2V0OjA7YmFja2dyb3VuZDojMDAwO2Rpc3BsYXk6bm9uZTthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtmb250LWZhbWlseTonUmlnaHRlb3VzJztjb2xvcjojZTUwOTE0O2ZvbnQtc2l6ZToyNHB4O2xldHRlci1zcGFjaW5nOjRweDthbmltYXRpb246YmxpbmsgMS41cyBpbmZpbml0ZTt6LWluZGV4OjEwO31Aa2V5ZnJhbWVzIGJsaW5rIHs1MCUge29wYWNpdHk6MC4yO319LmdyaWQge2Rpc3BsYXk6Z3JpZDtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KGF1dG8tZmlsbCxtaW5tYXgoMTQwcHgsMWZyKSk7Z2FwOjE1cHg7cGFkZGluZzoyMHB4O21heC13aWR0aDoxMTAwcHg7bWFyZ2luOmF1dG87fS5jYXJkIHtib3JkZXI6MXB4IHNvbGlkICMyMjI7YmFja2dyb3VuZDojMTExO3BhZGRpbmc6MjVweCAxMHB4O2JvcmRlci1yYWRpdXM6MTVweDtjdXJzb3I6cG9pbnRlcjt0cmFuc2l0aW9uOjAuNHM7fS5jYXJkOmhvdmVyIHtib3JkZXItY29sb3I6I2U1MDkxNDt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtNXB4KTtiYWNrZ3JvdW5kOiMxYTAwMDA7fS5jYXJkIGkge2NvbG9yOiNlNTA5MTQ7Zm9udC1zaXplOjI4cHg7bWFyZ2luLWJvdHRvbToxMnB4O2Rpc3BsYXk6bm9uZTtkaXNwbGF5OmJsb2NrO30udGFicyB7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzoyMHB4O292ZXJmbG93LXg6YXV0bzt9LnRhYiB7cGFkZGluZzoxMHB4IDIycHg7Ym9yZGVyLXJhZGl1czoxMnB4O2JvcmRlcjoxcHggc29saWQgIzIyMjtjdXJzb3I6cG9pbnRlcjtjb2xvcjojODg4O2ZvbnQtd2VpZ2h0OjYwMDt3aGl0ZS1zcGFjZTpub3dyYXA7fS50YWIuYWN0aXZlIHtiYWNrZ3JvdW5kOiNlNTA5MTQ7Y29sb3I6I2ZmZjtib3JkZXItY29sb3I6I2U1MDkxNDtib3gtc2hhZG93OjAgNXB4IDE1cHggcmdiYSgyMjksOSwyMCwwLjMpO30uZG90IHtwb3NpdGlvbjphYnNvbHV0ZTtiYWNrZ3JvdW5kOiNmZmY7Ym9yZGVyLXJhZGl1czo1MCU7b3BhY2l0eTowLjI7YW5pbWF0aW9uOmZsb2F0IDRzIGluZmluaXRlIGxpbmVhcjt9QGtleWZyYW1lcyBmbG9hdCB7ZnJvbSB7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMTEwdmgpO30gdG8ge3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xMHZoKTt9fSNoYWNrLWJhZGdlIHtwb3NpdGlvbjpmaXhlZDtib3R0b206MTBweDtyaWdodDoxMHB4O2JhY2tncm91bmQ6IzAwMDtjb2xvcjpyZWQ7cGFkZGluZzo4cHggMTZweDtib3JkZXI6MXB4IHNvbGlkICMzMzM7Zm9udC1zaXplOjExcHg7Zm9udC13ZWlnaHQ6ODAwO2JvcmRlci1yYWRpdXM6NXB4O3otaW5kZXg6OTk5OTk7Ym94LXNoYWRvdzowIDAgMTBweCByZWQ7fQ==";

async function fetchM3U(url, group) {
    try {
        const res = await axios.get(url, { timeout: 8000 });
        const lines = res.data.split('\n');
        let channels = [];
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes("#EXTINF")) {
                const name = lines[i].split(",")[1]?.trim() || "Live TV";
                const stream = lines[i + 1]?.trim();
                if (stream && stream.startsWith("http")) channels.push({ name, url: stream, group });
            }
            if (channels.length >= 300) break;
        }
        return channels;
    } catch (e) { return []; }
}

export default async function handler(req, res) {
    try {
        const [s, k, n] = await Promise.all([
            fetchM3U("https://iptv-org.github.io/iptv/categories/sports.m3u", "Sports"),
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids"),
            fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "Entertainment")
        ]);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            channels: [...s, ...k, ...n],
            ui: UI_LOCK, // CSS backend se ja rahi hai
            dev: "RGV2ZWxvcGVkIGJ5IEF3YWlzIEhhaWRlciB8IFdoYXRzQXBwOiArOTk0NDAxODc5OTUz" 
        });
    } catch (e) { res.status(500).json({ error: "API Failed" }); }
}
