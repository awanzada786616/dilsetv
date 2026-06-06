<?php
// --- CHANNEL DATABASE ---
$myChannels = [
    1 => ["name" => "PTV SPORTS HD", "url" => "https://tvsen5.aynaott.com/Ptvsports/index.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIpl8Di6Y0ONKKp1w-4IapgZV-E6CtajvbTBn60UJ9Sg&s"],
    2 => ["name" => "STAR SPORTS 1", "url" => "http://41.205.93.154/STARSPORTS1/index.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlGuJkNQQLPykMQ4_LcHeZr3j0XOUjHoPYHUC1Dl0fIg&s=10"],
    3 => ["name" => "TEN SPORTS", "url" => "https://cdn07isb.tamashaweb.com:8087/YlUHeDQb7a/157-3H/chunks.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpI59luGfNGakLSDDfhnw_rT1JTlceWOTLSk1HB_0Qsg&s"],
    4 => ["name" => "GEO SUPER", "url" => "https://ml-pull-dvc-myco.io:2096/GEO_SUPER/playlist.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzT98vFXctlaTfaEEj5Bg5-drjTwVZ3iPicpZ2AlQ2UA&s"],
    5 => ["name" => "STAR SPORTS 2", "url" => "https://tvsen5.aynaott.com/cXPB2LKkErN9/index.m3u8", "logo" => "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXcXqKOhd4G2scGO57RNyJcLvycgvo3OdmpKqkxn30Yg&s"]
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DIL SA TV | PREMIUM WHITE</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { --primary-bg: #f8f9fa; --glass-card: rgba(255, 255, 255, 0.8); --accent: #007bff; --text-main: #222; }
        body { background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%); font-family: 'Poppins', sans-serif; margin: 0; user-select: none; }
        .header { text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.5); backdrop-filter: blur(10px); border-bottom: 2px solid #fff; box-shadow: 0 4px 30px rgba(0,0,0,0.05); }
        .header h1 { margin: 0; font-weight: 800; font-size: 2.5rem; background: linear-gradient(45deg, #222, #555); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; }
        .container { max-width: 1100px; margin: 40px auto; padding: 0 20px; }
        .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 25px; }
        .channel-card { background: var(--glass-card); backdrop-filter: blur(10px); border: 1px solid #fff; border-radius: 20px; padding: 20px; text-align: center; text-decoration: none; color: var(--text-main); transition: 0.4s; box-shadow: 0 10px 20px rgba(0,0,0,0.05); display: block; }
        .channel-card:hover { transform: translateY(-8px); background: #fff; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border-color: var(--accent); }
        .img-wrapper { width: 90px; height: 90px; margin: 0 auto 15px; background: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        .img-wrapper img { width: 65px; height: 65px; object-fit: contain; }
        .vip-tag { font-size: 9px; background: #FFD700; padding: 2px 8px; border-radius: 50px; font-weight: bold; margin-bottom: 8px; display: inline-block; }
        @media (max-width: 600px) { .channel-grid { grid-template-columns: repeat(2, 1fr); } }
    </style>
</head>
<body oncontextmenu="return false;">
    <div class="header">
        <h1>DIL SA TV</h1>
        <p style="color: #777; letter-spacing: 2px;">Premium High Quality Stream</p>
    </div>
    <div class="container">
        <div class="channel-grid">
            <?php foreach ($myChannels as $id => $ch): ?>
                <a href="/player?id=<?php echo $id; ?>" class="channel-card">
                    <span class="vip-tag">PREMIUM</span>
                    <div class="img-wrapper">
                        <img src="<?php echo $ch['logo']; ?>" onerror="this.src='https://via.placeholder.com/80'">
                    </div>
                    <h4><?php echo $ch['name']; ?></h4>
                </a>
            <?php endforeach; ?>
        </div>
    </div>
    <script>
        document.onkeydown = function(e) {
            if (e.ctrlKey && (e.keyCode === 85 || e.keyCode === 73 || e.keyCode === 123)) return false;
        };
    </script>
</body>
</html>
