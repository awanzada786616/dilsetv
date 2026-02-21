const axios = require('axios');

// --- POISON CSS (Design backend se frontend mein inject hoga) ---
const UI_POISON = "Ym9keXtiYWNrZ3JvdW5kOiMwNTA1MDU7Y29sb3I6I2ZmZjtmb250LWZhbWlseTonUG9wcGlucyosc2Fucy1zZXJpZjt0ZXh0LWFsaWduOmNlbnRlcjttYXJnaW46MDt9Lmhlcm8taG9tZSB7cGFkZGluZzo1MHB4IDIwcHg7YmFja2dyb3VuZDpsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLHJnYmEoMCwwLDAsMC43KSwjMDUwNTA1KSx1cmwoJ2h0dHBzOi8vaW1hZ2VzLnVuc3BsYXNoLmNvbS9waG90by0xNTA0NDUwNzU4NDgxLTczMzhlYmE3NTI0YScpO2JhY2tncm91bmQtc2l6ZTpjb3Zlcjt9I2hlcm8tdGl0bGUge2ZvbnQtZmFtaWx5OidSaWdodGVvdXMnO2NvbG9yOiNlNTA5MTQ7Zm9udC1zaXplOjUwcHg7bWFyZ2luOjA7fS5zZWFyY2gtYmFyIHt3aWR0aDo5MCU7bWF4LXdpZHRoOjUwMHB4O3BhZGRpbmc6MTZweCAzMHB4O2JvcmRlci1yYWRpdXM6NTBweDtib3JkZXI6MXB4IHNvbGlkICNlNTA5MTQ7YmFja2dyb3VuZDojMDAwO2NvbG9yOiNmZmY7b3V0bGluZTpub25lO21hcmdpbi10b3A6LTIwcHg7fS5wbGF5ZXItYm94IHttYXgtd2lkdGg6OTAwcHg7bWFyZ2luOjMwcHggYXV0bztib3JkZXI6MXB4IHNvbGlkICMyMjI7Ym9yZGVyLXJhZGl1czoyMHB4O292ZXJmbG93OmhpZGRlbjtib3gtc2hhZG93OjAgMCAzMHB4IHJnYmEoMjI5LDksMjAsMC4xKTt9dmlkZW8ge3dpZHRoOjEwMCU7YXNwZWN0LXJhdGlvOjE2Lzk7YmFja2dyb3VuZDojMDAwO30uZ3JpZCB7ZGlzcGxheTpncmlkO2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoYXV0by1maWxsLG1pbm1heCgxMzBweCwxZnIpKTtnYXA6MTVweDtwYWRkaW5nOjIwcHg7bWF4LXdpZHRoOjExMDBweDttYXJnaW46YXV0bzt9LmNhcmQge2JhY2tncm91bmQ6IzExMTtib3JkZXI6MXB4IHNvbGlkICMyMjI7cGFkZGluZzoyNXB4IDEwcHg7Ym9yZGVyLXJhZGl1czoxNXB4O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246MC4zczt9LmNhcmQ6aG92ZXIge2JvcmRlci1jb2xvcjojZTUwOTE0O3RyYW5zZm9ybTp0cmFuc2xhdGVZKC01cHgpO30uY2FyZCBpIHtjb2xvcjojZTUwOTE0O2ZvbnQtc2l6ZToyOHB4O21hcmdpbi1ib3R0b206MTBweDtkaXNwbGF5OmJsb2NrO30udGFicyB7ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXI7Z2FwOjEwcHg7cGFkZGluZzoyMHB4O292ZXJmbG93LXg6YXV0bztzY3JvbGxiYXItd2lkdGg6bm9uZTt9LnRhYiB7cGFkZGluZzoxMHB4IDIycHg7Ym9yZGVyLXJhZGl1czoxMHB4O2JhY2tncm91bmQ6IzExMTtib3JkZXI6MXB4IHNvbGlkICMyMjI7Y3Vyc29yOnBvaW50ZXI7Y29sb3I6Izg4ODt3aGl0ZS1zcGFjZTpub3dyYXA7fS50YWIuYWN0aXZlIHtiYWNrZ3JvdW5kOiNlNTA5MTQ7Y29sb3I6I2ZmZjtib3JkZXItY29sb3I6I2U1MDkxNDt9LmRvdCB7cG9zaXRpb246YWJzb2x1dGU7YmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjIpO2JvcmRlci1yYWRpdXM6NTAlO2FuaW1hdGlvbjpmbG9hdCA0cyBpbmZpbml0ZSBsaW5lYXI7fUBrZXlmcmFtZXMgZmxvYXQge2Zyb20ge3RyYW5zZm9ybTp0cmFuc2xhdGVZKDEwNXZoKTt9IHRvIHt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMTB2aCk7fX0jbG9hZGVyLXN0eWxlIHtwb3NpdGlvbjphYnNvbHV0ZTtpbnNldDowO2JhY2tncm91bmQ6IzAwMDtkaXNwbGF5Om5vbmU7YWxpZ24taXRlbXM6Y2VudGVyO2p1c3RpZnktY29udGVud:Y2VudGVyO2ZvbnQtZmFtaWx5OidSaWdodGVvdXMnO2NvbG9yOiNlNTA5MTQ7ei1pbmRleDoxMDt9I2F3LWRldi1iYWRnZSB7cG9zaXRpb246Zml4ZWQ7Ym90dG9tOjEwcHg7cmlnaHQ6MTBweDtiYWNrZ3JvdW5kOiMwMDA7Y29sb3I6cmVkO3BhZGRpbmc6NXB4IDEycHg7Ym9yZGVyOjFweCBzb2xpZCAjMzMzO2ZvbnQtc2l6ZToxMHB4O2ZvbnQtd2VpZ2h0Ojh0MDtib3JkZXItcmFkaXVzOjVweDt6LWluZGV4Ojk5OTk5O2JveC1zaGFkb3c6MCAwIDhweCByZWQ7fQ==";

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
            fetchM3U("https://iptv-org.github.io/iptv/categories/kids.m3u", "Kids Zone"),
            fetchM3U("https://iptv-org.github.io/iptv/countries/in.m3u", "Entertainment")
        ]);
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({
            channels: [...s, ...k, ...n],
            style: UI_POISON, // CSS Backend se
            dev: "RGV2ZWxvcGVkIGJ5IEF3YWlzIEhhaWRlciB8IFdoYXRzQXBwOiArOTk0NDAxODc5OTUz" 
        });
    } catch (e) { res.status(500).json([]); }
}
