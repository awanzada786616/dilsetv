<?php
// --- Channel Database ---
$myChannels = [
    1 => ["name" => "PTV SPORTS HD", "url" => "https://tvsen5.aynaott.com/Ptvsports/index.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIpl8Di6Y0ONKKp1w-4IapgZV-E6CtajvbTBn60UJ9Sg&s"],
    2 => ["name" => "STAR SPORTS 1", "url" => "http://41.205.93.154/STARSPORTS1/index.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGuJkNQQLPykMQ4_LcHeZr3j0XOUjHoPYHUC1Dl0fIg&s=10"],
    3 => ["name" => "TEN SPORTS", "url" => "https://cdn07isb.tamashaweb.com:8087/YlUHeDQb7a/157-3H/chunks.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpI59luGfNGakLSDDfhnw_rT1JTlceWOTLSk1HB_0Qsg&s"],
    4 => ["name" => "GEO SUPER", "url" => "https://ml-pull-dvc-myco.io:2096/GEO_SUPER/playlist.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzT98vFXctlaTfaEEj5Bg5-drjTwVZ3iPicpZ2AlQ2UA&s"],
    5 => ["name" => "STAR SPORTS 2", "url" => "https://tvsen5.aynaott.com/cXPB2LKkErN9/index.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXcXqKOhd4G2scGO57RNyJcLvycgvo3OdmpKqkxn30Yg&s"]
];

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if (!isset($myChannels[$id])) { header("Location: /"); exit; }

$currentChannel = $myChannels[$id];
$encodedUrl = base64_encode($currentChannel['url']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DIL SA TV | PREMIUM PLAYER</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&display=swap" rel="stylesheet">
    
    <style>
        :root { --primary: #007bff; --urdu-font: 'Noto Nastaliq Urdu', serif; }
        body { background: #f0f2f5; font-family: 'Poppins', sans-serif; margin: 0; padding: 10px; user-select: none; }
        .player-container { width: 100%; max-width: 850px; background: #fff; border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin: auto; }
        .info-bar { padding: 15px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #eee; }
        .channel-meta { display: flex; align-items: center; gap: 10px; }
        .channel-meta img { width: 40px; height: 40px; border-radius: 8px; }
        .channel-meta h2 { font-size: 1rem; margin: 0; }
        .urdu-ticker-container { background: #1a1a1a; width: 100%; height: 65px; overflow: hidden; position: relative; display: none; border-bottom: 2px solid #ff0000; }
        .ticker-content { white-space: nowrap; position: absolute; display: flex; align-items: center; height: 100%; width: 100%; animation: marqueeToRight 25s linear infinite; }
        .ticker-content p { font-family: var(--urdu-font); font-size: 24px; color: #ffd700; margin: 0; direction: rtl; }
        @keyframes marqueeToRight { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .video-box { background: #000; width: 100%; }
        .controls { display: flex; justify-content: center; align-items: center; gap: 15px; padding: 20px; }
        .btn { background: #f8f9fa; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; transition: 0.3s; font-size: 1.1rem; }
        .btn:hover { background: var(--primary); color: #fff; transform: translateY(-3px); }
        .btn-play { width: 60px; height: 60px; background: var(--primary); color: white; }
        .back-link { display: block; text-align: center; margin-top: 20px; text-decoration: none; color: #888; font-size: 14px; }
    </style>
</head>
<body oncontextmenu="return false;">

    <div class="player-container">
        <div class="info-bar">
            <div class="channel-meta">
                <img src="<?php echo $currentChannel['logo']; ?>">
                <h2><?php echo $currentChannel['name']; ?></h2>
            </div>
            <div style="color: #ffd700;"><i class="fa-solid fa-crown"></i> VIP</div>
        </div>

        <?php if (strpos(strtolower($currentChannel['name']), 'star sports') !== false): ?>
        <div class="urdu-ticker-container" style="display: block;">
            <div class="ticker-content">
                <p>سٹار سپورٹس ایک انڈین چینل ہے اور مکمل 4K کوالٹی میں ہے۔ انٹرنیٹ سلو ہونے یا آئی پی (IP) کے مسئلے کی وجہ سے کبھی کبھی بفرنگ ہو سکتی ہے۔ براہ کرم تھوڑا انتظار کریں!</p>
            </div>
        </div>
        <?php endif; ?>

        <div class="video-box">
            <video id="player" playsinline controls></video>
        </div>

        <div class="controls">
            <button class="btn" onclick="muteToggle()"><i id="muteIcon" class="fa-solid fa-volume-high"></i></button>
            <button class="btn" onclick="volDown()"><i class="fa-solid fa-minus"></i></button>
            <button class="btn btn-play" onclick="playPause()"><i id="playIcon" class="fa-solid fa-play"></i></button>
            <button class="btn" onclick="volUp()"><i class="fa-solid fa-plus"></i></button>
            <button class="btn" onclick="toggleFull()"><i class="fa-solid fa-expand"></i></button>
        </div>
    </div>

    <a href="/" class="back-link"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>

    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script src="https://cdn.plyr.io/3.7.8/plyr.polyfilled.js"></script>

    <script>
        const streamUrl = atob("<?php echo $encodedUrl; ?>");
        const video = document.getElementById('player');
        let player;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                player = new Plyr(video, { controls: ['progress', 'current-time', 'settings', 'pip'] });
            });
        } else {
            video.src = streamUrl;
            player = new Plyr(video);
        }

        function playPause() {
            const icon = document.getElementById('playIcon');
            if (player.paused) { player.play(); icon.classList.replace('fa-play', 'fa-pause'); }
            else { player.pause(); icon.classList.replace('fa-pause', 'fa-play'); }
        }
        function muteToggle() {
            const icon = document.getElementById('muteIcon');
            player.muted = !player.muted;
            if(player.muted) icon.classList.replace('fa-volume-high', 'fa-volume-xmark');
            else icon.classList.replace('fa-volume-xmark', 'fa-volume-high');
        }
        function volUp() { if(player.volume < 1) player.volume += 0.1; }
        function volDown() { if(player.volume > 0) player.volume -= 0.1; }
        function toggleFull() { player.fullscreen.toggle(); }

        video.onplay = () => document.getElementById('playIcon').classList.replace('fa-play', 'fa-pause');
        video.onpause = () => document.getElementById('playIcon').classList.replace('fa-pause', 'fa-play');

        document.onkeydown = function(e) {
            if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 73 || e.keyCode === 123)) return false;
        };
    </script>
</body>
</html>
