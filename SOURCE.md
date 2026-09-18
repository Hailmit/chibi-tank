# Mã nguồn CHIBI TANK CITY: ENDLESS

Toàn bộ mã nguồn tự viết, theo đường dẫn. Bản Three.js 0.170.0 nguyên gốc và giấy phép nằm tại `vendor/` trong ZIP; không lặp thư viện minify trong tài liệu này.


## index.html

```html
<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#edf0e4">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Chibi Tank City">
  <meta name="description" content="Thành phố tí hon. Trận chiến bất tận. Game xe tăng 3D sinh tồn với địa hình biến đổi, chạy ngay trong trình duyệt.">
  <title>Chibi Tank City — Endless</title>
  <link rel="icon" href="./favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="./apple-touch-icon.png">
  <link rel="manifest" href="./site.webmanifest">
  <link rel="stylesheet" href="./style.css">
  <script type="importmap">{"imports":{"three":"./vendor/three.module.min.js"}}</script>
</head>
<body>
  <canvas id="game" aria-label="Đấu trường xe tăng 3D"></canvas>
  <div class="vignette"></div>
  <main id="menu" class="menu-screen">
    <div class="intro">
      <div class="eyebrow"><span></span> MỘT THÀNH PHỐ. VÔ HẠN THỬ THÁCH.</div>
      <h1>CHIBI<br>TANK <span class="title-star">✳</span><br>CITY<span class="title-dot">.</span></h1>
      <div class="endless-label"><span>ENDLESS</span><i></i><span class="infinity">∞</span></div>
      <p class="intro-description">Lái xe tí hon. Đương đầu hỗn loạn.<br>Mỗi trận một thành phố khác để chinh phục.</p>
      <button id="play" class="primary-button"><span>CHƠI NGAY</span><span class="button-arrow">↗</span></button>
      <div class="play-note"><span class="live-dot"></span> Không tải xuống · Không đăng nhập</div>
      <div class="best-card"><div class="trophy">♜</div><div><span>KỶ LỤC CỦA BẠN</span><strong id="menu-best">000000</strong></div><span class="local-tag">CỤC BỘ</span></div>
    </div>
    <div class="scene-label"><span class="live-dot"></span> KHU PHỐ 01 <span>—</span> <span id="seed-label">MINT DISTRICT</span></div>
    <div class="scene-note"><span class="note-icon">✦</span><div><strong>Mỗi trận là một thành phố khác.</strong><p>Phá công trình để mở lối đi mới.</p></div></div>
    <div class="field-label">XE TĂNG CỦA BẠN <span>↙</span></div>
  </main>

  <section id="hud" hidden aria-label="Thông tin trận đấu">
    <div class="status-panel" aria-label="Giáp và năng lượng"><div class="status-orbs"><div id="hp-ring" class="status-orb hp-orb"><span>GIÁP</span><strong id="hp-value">100</strong></div><div id="stamina-ring" class="status-orb stamina-orb"><span>NL</span><strong id="stamina-value">100</strong></div></div></div>
    <div id="weapon-status" class="weapon-status" hidden aria-live="polite"><span id="weapon-symbol">R</span><b id="weapon-name">ROCKET</b><strong id="weapon-ammo">8</strong></div>
    <div class="score-panel" aria-label="Điểm, combo và thời gian"><strong id="score" title="Điểm">000000</strong><span id="combo" title="Combo">×1</span><span id="time" title="Thời gian">00:00</span></div>
    <div id="elite" class="elite-panel" hidden><div id="elite-ring" class="elite-orb"><span>ĐẠI ÚY</span><b id="elite-value">100%</b></div></div>
    <div class="hud-center"><div id="day-cycle" class="day-cycle"><span id="day-icon">☀</span><div><small id="day-label">BAN NGÀY</small><b id="day-timer">01:00</b></div></div></div>
    <div id="touch-controls" class="touch-controls" hidden aria-label="Điều khiển cảm ứng">
      <button id="move-stick" class="touch-stick move-stick" type="button" aria-label="Kéo để di chuyển">
        <span class="stick-knob"></span><b>DI CHUYỂN</b>
      </button>
      <button id="dash-button" class="dash-button" type="button" aria-label="Lướt né"><span>↯</span><b>LƯỚT</b></button>
      <button id="aim-stick" class="touch-stick aim-stick" type="button" aria-label="Kéo để ngắm và bắn">
        <span class="stick-knob"></span><b id="aim-label">NGẮM · BẮN</b>
      </button>
    </div>
  </section>

  <footer class="control-bar"><div class="control"><span class="key-group"><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span><span>Di chuyển <small>/ Phím mũi tên</small></span></div><div class="control"><span class="mouse-icon"></span><span>Ngắm & bắn</span></div><div class="control"><kbd class="wide-key">SPACE</kbd><span>Lướt né</span></div><div class="control"><kbd>ESC</kbd><span>Tạm dừng</span></div><div class="footer-note">CỨ TIẾP TỤC. <span>THÊM MỘT CHÚT NỮA.</span> ↗</div></footer>

  <button id="fullscreen-button" class="fullscreen-button" type="button" aria-label="Bật toàn màn hình" title="Toàn màn hình">
    <svg class="fullscreen-enter" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>
    <svg class="fullscreen-exit" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>
  </button>

  <div id="overlay" class="overlay" hidden>
    <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div class="eyebrow" id="dialog-eyebrow">HÍT THỞ MỘT CHÚT</div>
      <h2 id="dialog-title">Tạm dừng<span>.</span></h2>
      <p id="dialog-description">Thành phố có thể đợi bạn.</p>
      <div id="results" hidden><div class="result-score"><span>ĐIỂM CỦA BẠN</span><strong id="final-score">0</strong></div><div class="result-grid"><div><span>Kỷ lục</span><b id="final-best"></b></div><div><span>Sống sót</span><b id="final-time"></b></div><div><span>Hạ gục</span><b id="final-kills"></b></div><div><span>Combo cao nhất</span><b id="final-combo"></b></div></div></div>
      <button id="resume" class="primary-button"><span>TIẾP TỤC</span><span>→</span></button>
      <button id="restart" class="primary-button" hidden><span>THỬ LẠI NÀO</span><span>↻</span></button>
      <button id="home" class="text-button">Về màn hình chính</button>
    </section>
  </div>
  <div id="toast" class="toast" role="status"></div>
  <div class="rotate-notice" role="status"><span>↻</span><strong>Xoay ngang thiết bị để chơi</strong></div>
  <div id="popups" aria-hidden="true"></div><div id="hit-flash"></div>
  <div id="loading"><span class="loader-tank">▰</span><span>ĐANG LẮP RÁP THÀNH PHỐ…</span></div>
  <div id="error" hidden><h2>Chưa thể khởi động game</h2><p id="error-message"></p><p>Hãy mở bằng máy chủ HTTP và dùng trình duyệt có WebGL 2.</p><button onclick="location.reload()">Thử lại</button></div>
  <script type="module" src="./src/main.js"></script>
  <script>window.addEventListener('error',e=>{if(!document.getElementById('loading').hidden){document.getElementById('loading').hidden=true;document.getElementById('error').hidden=false;document.getElementById('error-message').textContent=e.message||'Không tải được tài nguyên. Kiểm tra máy chủ và đường dẫn.';}});</script>
</body>
</html>
```


## style.css

```css
:root{--ink:#243e35;--muted:#7c8779;--paper:#f3f4ea;--orange:#e88454;--line:#d9dfd0;--mint:#a9d9b9}*{box-sizing:border-box}html,body{width:100%;height:100%;margin:0;overflow:hidden}body{font-family:Arial,Helvetica,sans-serif;color:var(--ink);background:#e5ecdb}button,input{font:inherit}button,a,input{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid var(--orange);outline-offset:5px}[hidden]{display:none!important}#game{position:fixed;inset:0;width:100%;height:100%;display:block;outline:none}.vignette{position:fixed;inset:0;pointer-events:none;background:linear-gradient(90deg,#edf0e4 0%,#edf0e4f5 23%,#edf0e420 49%,transparent 66%)}.topbar{position:fixed;z-index:5;top:0;left:0;right:0;height:94px;margin:0 44px;border-bottom:1px solid #a9b7a64d;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;gap:12px;text-decoration:none;align-items:center;color:var(--ink);font-size:14px;font-weight:900;letter-spacing:.7px}.brand-mark{background:var(--ink);color:#d1e8b5;border-radius:10px;width:43px;height:43px;display:grid;place-items:center;transform:rotate(-5deg)}.brand-mark svg{width:31px;height:31px}.brand-sub{display:block;font-size:8px;font-weight:600;letter-spacing:1.8px;margin-top:7px;color:#73806b}.top-center{font-size:9px;letter-spacing:1.6px;display:flex;align-items:center;gap:11px;font-weight:700}.top-center>span:last-child{font-weight:400;color:var(--muted)}.divider{margin:0 9px;color:#a6b29d}.live-dot{width:6px;height:6px;border-radius:50%;background:#71997a;display:inline-block;box-shadow:0 0 0 3px #71997a16}.top-actions{display:flex;gap:10px}.icon-button{border:1px solid #b4beac;background:#eff2e691;width:37px;height:37px;border-radius:50%;font-size:20px;color:var(--ink);transition:.2s}.icon-button:hover{background:#fff9e8;transform:rotate(-8deg)}.menu-screen{position:fixed;inset:94px 0 89px;pointer-events:none}.intro{position:absolute;left:7.2%;top:8%;width:350px;pointer-events:auto}.eyebrow{font-size:9px;letter-spacing:1.6px;font-weight:700;display:flex;gap:9px;align-items:center}.eyebrow>span{width:18px;height:2px;background:var(--orange)}h1{font-size:clamp(64px,6.4vw,103px);line-height:.9;letter-spacing:-5px;margin:27px 0 19px;font-weight:950}.title-star{font-size:.67em;display:inline-block;vertical-align:middle;color:var(--orange);font-weight:400;position:relative;top:-5px}.title-dot{color:var(--orange)}.endless-label{display:flex;align-items:center;gap:16px;max-width:287px;color:var(--orange)}.endless-label>span:first-child{font-size:16px;font-weight:800;letter-spacing:8px}.endless-label i{height:1px;flex:1;background:#e1a37b}.infinity{font-size:33px;line-height:20px}.intro-description{font-size:13px;line-height:1.9;color:#748071;margin:25px 0 23px}.primary-button{background:var(--orange);border:1px solid #d27446;color:#fffaf0;box-shadow:0 4px 0 #c16b43;padding:18px 22px;display:flex;width:286px;align-items:center;justify-content:space-between;border-radius:8px;font-size:12px;font-weight:800;letter-spacing:1.7px;transition:transform .15s,background .15s}.primary-button:hover{background:#ef9362;transform:translateY(-2px)}.primary-button:active{transform:translateY(3px);box-shadow:none}.button-arrow{font-size:23px;line-height:14px}.play-note{font-size:9px;color:#86907f;margin:18px 0 27px;display:flex;align-items:center;gap:8px;letter-spacing:.3px}.play-note .live-dot{width:4px;height:4px}.best-card{border-top:1px solid var(--line);border-bottom:1px solid var(--line);width:286px;display:flex;align-items:center;padding:16px 0;gap:14px}.trophy{font-size:27px;color:#9f9878}.best-card div>span{display:block;font-size:8px;letter-spacing:1.3px;color:#7e8877;font-weight:700}.best-card strong{font-size:24px;letter-spacing:2px;display:block;margin-top:4px;font-variant-numeric:tabular-nums}.local-tag{margin-left:auto;font-size:7px;letter-spacing:1px;border:1px solid #c8d0bd;padding:5px;border-radius:3px;color:#8a937f}.scene-label{position:absolute;top:35px;right:6%;font-size:9px;letter-spacing:1.4px;display:flex;gap:12px;align-items:center}.scene-label>span:last-child{color:#7e8f7b}.scene-note{position:absolute;bottom:37px;right:6%;display:flex;align-items:center;gap:14px;background:#f4f5e4b8;backdrop-filter:blur(10px);padding:17px 22px;border-radius:9px;border:1px solid #f9fced}.note-icon{font-size:31px;font-weight:300;color:#7e9a76}.scene-note strong{font-size:11px;font-weight:700}.scene-note p{font-size:10px;color:#7b8874;margin:6px 0 0}.field-label{position:absolute;left:63%;top:54%;font-size:8px;letter-spacing:1.4px;background:#f6f6eae6;padding:10px 12px;border-radius:4px;transform:rotate(-5deg);box-shadow:0 3px 8px #3d604b0c}.field-label span{position:absolute;left:8px;top:30px;font-size:21px;color:#4c705a}.control-bar{position:fixed;bottom:0;left:44px;right:44px;height:89px;display:flex;align-items:center;gap:30px;border-top:1px solid #a9b7a64d;z-index:4}.control{display:flex;align-items:center;gap:10px;font-size:10px;white-space:nowrap}.control small{display:block;font-size:8px;color:#8b9582;margin-top:5px}.key-group{display:flex;gap:3px}kbd{display:inline-grid;place-items:center;min-width:23px;height:26px;padding:0 5px;border:1px solid #b9c4ae;border-radius:4px;box-shadow:0 2px 0 #c7d0bf;background:#f5f6eb8c;font:9px Arial,sans-serif;color:#5b7258}.wide-key{padding:0 12px;font-size:8px;letter-spacing:.7px}.mouse-icon{display:block;width:18px;height:26px;border:1.5px solid #9aac91;border-radius:9px;position:relative}.mouse-icon:after{content:'';position:absolute;top:3px;left:7px;width:2px;height:7px;background:#78946f}.footer-note{margin-left:auto;font-size:8px;font-weight:700;letter-spacing:1px}.footer-note span{color:#8a9680;font-weight:400}.status-panel,.score-panel{position:fixed;top:116px;background:#f4f5e9ee;border:1px solid #faffec;border-radius:10px;box-shadow:0 6px 25px #2544370b;padding:19px 22px}.status-panel{left:44px;width:270px}.pilot-heading{display:flex;align-items:center;gap:7px;font-size:11px;letter-spacing:1px;font-weight:800;margin-bottom:22px}.pilot-dot{background:#76b895;width:7px;height:7px;border-radius:50%}.pilot-heading>span:last-child{margin-left:auto;font-size:7px;letter-spacing:.7px;color:#69947b}.meter-label{display:flex;justify-content:space-between;font-size:8px;letter-spacing:1px;margin-bottom:7px}.meter-label strong{font-size:9px;letter-spacing:0}.meter{height:9px;border-radius:3px;background:#dce1d2;overflow:hidden}.meter i{display:block;width:100%;height:100%;background:#7ab69a;transition:width .12s}.stamina-label{margin-top:12px}.stamina{height:5px}.stamina i{background:#d4ac5e}.buffs{font-size:8px;color:#8e6d38;line-height:1.7;margin-top:8px}.score-panel{right:44px;width:180px;text-align:right}.score-panel>span{font-size:8px;letter-spacing:1.3px;color:#7f8b76}.score-panel>strong{display:block;font-size:32px;letter-spacing:2px;font-variant-numeric:tabular-nums;margin:7px 0 9px}.score-panel>div{display:flex;justify-content:space-between;font-size:12px;font-variant-numeric:tabular-nums}#combo{color:#d47f51;font-weight:bold}.score-panel small{display:block;font-size:8px;color:#8b947f;margin-top:14px;letter-spacing:1px}.elite-panel{position:fixed;top:112px;left:50%;transform:translateX(-50%);width:300px;text-align:center}.elite-panel>span{font-size:10px;letter-spacing:2px}.elite-panel .meter{margin-top:9px;height:7px}.elite-panel i{background:#d5647f}#minimap{position:fixed;right:44px;bottom:113px;width:130px;height:130px;border:5px solid #f6f6ea;border-radius:8px;box-shadow:0 3px 18px #28442f1a;opacity:.9}.overlay{position:fixed;inset:0;background:#243d354d;backdrop-filter:blur(8px);z-index:10;display:grid;place-items:center}.dialog{width:410px;max-width:90vw;border-radius:17px;padding:36px;background:var(--paper);box-shadow:0 25px 100px #17352e38}.dialog .eyebrow{color:#8a957e;font-size:8px}.dialog h2{font-size:42px;line-height:1.1;letter-spacing:-2px;margin:18px 0 8px}.dialog h2 span{color:var(--orange)}.dialog>p{font-size:12px;color:#86917a;line-height:1.7;margin-bottom:23px}.dialog .primary-button{width:100%;margin-top:24px}.dialog label{display:flex;align-items:center;justify-content:space-between;font-size:12px;padding:15px 0;border-bottom:1px solid var(--line)}input[type=range]{width:140px;accent-color:#80ac8d}input[type=checkbox]{accent-color:#80ac8d;width:17px;height:17px}.text-button{border:0;background:transparent;color:#7a8a70;display:block;font-size:11px;margin:22px auto 0}.result-score{border-top:1px solid var(--line);padding-top:20px}.result-score span{font-size:9px;letter-spacing:2px}.result-score strong{display:block;font-size:54px;letter-spacing:-2px;margin:5px 0 20px}.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.result-grid span{display:block;font-size:10px;color:#8b927d;margin-bottom:6px}.result-grid b{font-size:19px}.toast{position:fixed;z-index:7;left:50%;top:25%;transform:translate(-50%,-10px);opacity:0;transition:.2s;background:#284337ed;color:#f7f1cf;border:1px solid #b2cda166;padding:14px 23px;border-radius:7px;font-size:12px;max-width:80vw;text-align:center;pointer-events:none}.toast.visible{opacity:1;transform:translate(-50%,0)}#popups{position:fixed;inset:0;pointer-events:none;z-index:6}.score-popup{position:absolute;top:0;left:0;font-size:14px;font-weight:800;white-space:nowrap;text-shadow:0 2px 2px #254432,1px 0 2px #254432}#hit-flash{position:fixed;inset:0;box-shadow:inset 0 0 100px #e2765a80;opacity:0;pointer-events:none;transition:opacity .12s;z-index:6}#hit-flash.active{opacity:1}#loading{position:fixed;inset:0;z-index:20;background:var(--paper);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;font-size:10px;letter-spacing:2px}.loader-tank{font-size:55px;color:#80b493;animation:pulse 1s infinite alternate}#error{position:fixed;inset:20%;background:var(--paper);padding:40px;z-index:30;border-radius:15px}#error p{line-height:1.8}body.playing .vignette{display:none}body.playing #game{cursor:url('./crosshair.png') 16 16,crosshair}body.playing .topbar{height:78px}body.playing .control-bar{height:75px}body.playing .field-label{display:none}@keyframes pulse{to{transform:translateX(15px)}}@media(min-height:900px){.intro{top:12%}.intro-description{margin:32px 0}.best-card{margin-top:32px}}@media(max-height:760px){.intro{top:5%}h1{font-size:73px;margin:20px 0 14px}.intro-description{margin:17px 0;font-size:12px}.play-note{margin:14px 0 18px}.best-card{padding:12px 0}.primary-button{padding:15px 20px}.scene-note{bottom:20px}}@media(max-width:1100px){.top-center{display:none}.intro{left:6%;width:310px}h1{font-size:77px}.control-bar{gap:20px}.footer-note{display:none}.field-label{left:68%}.scene-note{right:4%}.topbar{margin:0 30px}.control-bar{left:30px;right:30px}.eyebrow{font-size:8px;letter-spacing:1px}}@media(max-width:720px){.topbar{margin:0 20px;height:76px}.brand{font-size:11px}.brand-sub{font-size:7px}.intro{left:25px;top:25px}.menu-screen{top:76px}.intro h1{font-size:64px;letter-spacing:-3px}.intro-description{font-size:11px}.primary-button,.best-card{width:250px}.scene-label,.scene-note,.field-label{display:none}.vignette{background:linear-gradient(90deg,#edf0e4f5 0%,#edf0e4db 40%,#edf0e455 100%)}.control-bar{left:20px;right:20px;gap:18px;height:73px;flex-wrap:wrap;align-content:center;row-gap:12px}.control{font-size:8px}.control small{display:none}.control:last-of-type{display:none}.status-panel{left:15px;top:95px;width:205px;padding:14px}.score-panel{right:15px;top:95px;width:130px;padding:14px}.score-panel>strong{font-size:24px}.pilot-heading>span:last-child{font-size:6px}#minimap{right:15px;bottom:100px;width:95px;height:95px}.elite-panel{top:255px;width:240px}.dialog{padding:26px}#error{inset:15px}.top-actions{gap:5px}}

/* Touch layout */
body{overscroll-behavior:none}
#game{touch-action:none}
.touch-controls,.rotate-notice{display:none}
.touch-controls{position:fixed;inset:0;z-index:8;pointer-events:none;touch-action:none;user-select:none;-webkit-user-select:none}
.touch-stick{position:absolute;bottom:max(26px,calc(env(safe-area-inset-bottom) + 18px));width:116px;height:116px;padding:0;border:1px solid #eff9e999;border-radius:50%;background:#29453c42;box-shadow:inset 0 0 0 14px #eff6e629;color:#fff;pointer-events:auto;touch-action:none}
.touch-stick:before{content:'';position:absolute;inset:28px;border:1px solid #f8fff099;border-radius:50%}
.touch-stick b{position:absolute;left:50%;bottom:-17px;transform:translateX(-50%);font-size:8px;letter-spacing:1px;white-space:nowrap;text-shadow:0 1px 5px #16362f}
.stick-knob{position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px;border-radius:50%;background:#f4f4dfdd;border:2px solid #fff;box-shadow:0 4px 16px #173d3566;transition:transform .06s}
.touch-stick.active .stick-knob{background:#fff4c9;box-shadow:0 0 0 7px #f2aa6555,0 4px 16px #173d3566}
.move-stick{left:max(22px,env(safe-area-inset-left))}.aim-stick{right:max(22px,env(safe-area-inset-right))}
.dash-button{position:absolute;right:max(152px,calc(env(safe-area-inset-right) + 152px));bottom:max(42px,calc(env(safe-area-inset-bottom) + 34px));width:68px;height:68px;border-radius:50%;border:2px solid #fff8d1;background:#d99a55dd;color:#fff;box-shadow:0 5px 0 #a9673e,0 8px 25px #193d3566;pointer-events:auto;touch-action:none;display:grid;place-items:center;align-content:center;gap:1px}
.dash-button span{font-size:25px;line-height:22px}.dash-button b{font-size:8px;letter-spacing:1px}.dash-button.ready{animation:dash-ready 1.5s ease-in-out infinite}.dash-button.pressed{transform:translateY(4px);box-shadow:0 1px 0 #a9673e}.dash-button:disabled{filter:saturate(.15);opacity:.55;animation:none}
@keyframes dash-ready{50%{box-shadow:0 5px 0 #a9673e,0 0 0 7px #fff1b933,0 8px 25px #193d3566}}

@media (pointer:coarse){
  button{min-height:44px}.icon-button{width:44px;height:44px}
  body.touch[data-state="playing"] .touch-controls{display:block}
  body.touch .control-bar{display:none}
  body.touch.playing #game{cursor:default}
  body.touch .topbar{height:60px;margin:0 max(12px,env(safe-area-inset-right)) 0 max(12px,env(safe-area-inset-left));pointer-events:none}
  body.touch .brand{font-size:10px;gap:8px}.brand-mark{width:36px;height:36px}.brand-mark svg{width:25px}.brand-sub{display:none}
  body.touch .top-center{display:none}.top-actions{margin-left:auto;pointer-events:auto}
  body.touch.playing .brand{display:none}
  body.touch .status-panel{top:max(67px,calc(env(safe-area-inset-top) + 56px));left:max(12px,env(safe-area-inset-left));width:185px;padding:10px 12px;border-radius:8px}
  body.touch .pilot-heading{font-size:10px;margin-bottom:9px}.pilot-heading>span:last-child{font-size:7px}.meter-label{font-size:8px;margin-bottom:4px}.stamina-label{margin-top:7px}.buffs{margin-top:4px}
  body.touch .score-panel{top:max(67px,calc(env(safe-area-inset-top) + 56px));right:max(12px,env(safe-area-inset-right));width:128px;padding:10px 12px;border-radius:8px}.score-panel>strong{font-size:23px;margin:4px 0}.score-panel small{display:none}
  
  body.touch #minimap{display:none}.elite-panel{top:max(125px,calc(env(safe-area-inset-top) + 114px));width:min(240px,35vw)}
  body.touch .toast{top:29%;font-size:11px;padding:10px 16px;max-width:52vw}
  body.touch .dialog{max-height:calc(100dvh - 24px);overflow:auto;padding:24px}.dialog h2{font-size:34px;margin:12px 0 6px}.dialog>p{margin-bottom:12px}.dialog label{padding:10px 0}.dialog .primary-button{margin-top:16px}
  body.touch .score-popup{font-size:12px}
}

@media (pointer:coarse) and (orientation:landscape){
  .menu-screen{inset:60px 0 0}.intro{left:max(24px,calc(env(safe-area-inset-left) + 18px));top:2%;width:270px}.intro h1{font-size:clamp(44px,12vh,64px);line-height:.86;margin:10px 0 8px}.endless-label{max-width:240px}.endless-label>span:first-child{font-size:12px}.infinity{font-size:26px}.intro-description{font-size:10px;line-height:1.5;margin:8px 0}.primary-button,.best-card{width:240px}.primary-button{min-height:44px;padding:11px 16px}.play-note{margin:8px 0}.best-card{padding:7px 0}.best-card strong{font-size:18px}.scene-label,.scene-note,.field-label{display:none}
  body.touch .vignette{background:linear-gradient(90deg,#edf0e4f5 0%,#edf0e4db 30%,#edf0e430 56%,transparent 74%)}
}

@media (pointer:coarse) and (orientation:portrait){
  body.touch[data-state="playing"] .rotate-notice{display:flex}
  .rotate-notice{position:fixed;inset:0;z-index:30;background:#edf0e4f5;align-items:center;justify-content:center;flex-direction:column;gap:16px;text-align:center;padding:30px;color:var(--ink)}.rotate-notice span{font-size:52px;color:var(--orange);animation:rotate-phone 1.4s ease-in-out infinite alternate}.rotate-notice strong{font-size:14px;letter-spacing:1px}
  @keyframes rotate-phone{to{transform:rotate(90deg)}}
  body.touch .intro{left:24px;right:24px;top:6%;width:auto}.intro h1{font-size:min(17vw,68px)}.intro-description{font-size:12px}.scene-label,.scene-note,.field-label{display:none}
}

@media (pointer:coarse) and (orientation:landscape) and (max-height:430px){
  body.touch .topbar{height:50px}.brand-mark{width:32px;height:32px}.icon-button{width:42px;height:42px}
  body.touch .status-panel,body.touch .score-panel{top:max(55px,calc(env(safe-area-inset-top) + 49px))}
  .touch-stick{width:100px;height:100px}.stick-knob{width:42px;height:42px;margin:-21px}.touch-stick:before{inset:24px}.dash-button{right:max(132px,calc(env(safe-area-inset-right) + 132px));width:60px;height:60px;bottom:max(37px,calc(env(safe-area-inset-bottom) + 29px))}
  .intro{top:0}.intro h1{font-size:45px}.intro-description{display:none}.best-card{display:none}
}

/* Day and night cycle */
.day-cycle{position:fixed;z-index:5;left:50%;top:104px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;min-width:146px;padding:10px 14px;border:1px solid #faffec;background:#f4f5e9e8;border-radius:9px;box-shadow:0 6px 25px #25443712;font-variant-numeric:tabular-nums}
.day-cycle>span{font-size:25px;line-height:1;color:#d99745}.day-cycle div{display:flex;flex-direction:column;gap:3px}.day-cycle small{font-size:7px;letter-spacing:1.2px;font-weight:800}.day-cycle b{font-size:12px;letter-spacing:1px}.day-cycle.is-night{background:#233941e8;border-color:#5d7d76;color:#e8f2d8}.day-cycle.is-night>span{color:#b9d8ff;text-shadow:0 0 12px #b9d8ff88}.day-cycle.is-night small{color:#a9df79}
.elite-panel{top:164px}
.vignette{transition:background 2s ease}
body.night.playing .vignette{background:radial-gradient(ellipse at center,#0e293000 35%,#081c276e 100%)}
body.night.playing .topbar{border-color:#9fb6b633}
body.night.playing .brand,body.night.playing .top-center,body.night.playing .footer-note{color:#e7efdd}
body.night.playing .brand-sub,body.night.playing .top-center>span:last-child,body.night.playing .footer-note span{color:#aebfb6}
body.night.playing .icon-button{color:#e7efdd;border-color:#a5b9ae77;background:#233c3a88}
body.night.playing .control-bar{border-color:#9fb6b633;color:#e4eee0}
body.night.playing kbd{color:#e4eee0;border-color:#95aaa088;background:#243d3a99;box-shadow:0 2px 0 #162d2c}
body.night.playing .mouse-icon{border-color:#b5c9bc}body.night.playing .mouse-icon:after{background:#b5c9bc}
body.night.playing #minimap{border-color:#d7e1d1}

@media (pointer:coarse){
  body.touch .day-cycle{top:max(55px,calc(env(safe-area-inset-top) + 49px));min-width:124px;padding:7px 10px;gap:8px}.day-cycle>span{font-size:21px}.day-cycle b{font-size:10px}
  
  body.touch .elite-panel{top:max(141px,calc(env(safe-area-inset-top) + 135px))}
}
@media (pointer:coarse) and (orientation:landscape) and (max-height:430px){
  body.touch .day-cycle{top:max(49px,calc(env(safe-area-inset-top) + 44px))}
  
  body.touch .elite-panel{top:max(125px,calc(env(safe-area-inset-top) + 120px))}
}

/* Mobile HUD refinement */
@media (pointer:coarse){
  body.touch #dash-status{display:none}
  
  
  
  body.touch .toast{top:max(128px,calc(env(safe-area-inset-top) + 122px));width:max-content;max-width:min(52vw,440px);line-height:1.35}
  body.touch .dialog label{min-height:44px}
  body.touch .text-button{min-height:44px;padding:10px 14px;margin-top:12px}
}
@media (pointer:coarse) and (orientation:landscape) and (max-width:700px){
  body.touch .status-panel{width:170px;padding:9px 11px}
  body.touch .score-panel{width:112px;padding:9px 10px}
  body.touch .score-panel>span{font-size:7px;letter-spacing:.8px}
  body.touch .score-panel>strong{font-size:20px;letter-spacing:1px}
  body.touch .pilot-heading{margin-bottom:7px}
  body.touch .toast{max-width:300px}
}
@media (pointer:coarse) and (orientation:landscape) and (max-width:600px){
  body.touch .status-panel{left:max(8px,env(safe-area-inset-left));width:155px}
  body.touch .score-panel{right:max(8px,env(safe-area-inset-right));width:105px}
  body.touch .toast{max-width:240px;font-size:10px;padding:9px 12px}
  .move-stick{left:max(14px,env(safe-area-inset-left))}.aim-stick{right:max(14px,env(safe-area-inset-right))}
}
@media (pointer:coarse) and (orientation:landscape) and (max-height:350px){
  body.touch .status-panel,body.touch .score-panel{top:max(49px,calc(env(safe-area-inset-top) + 45px))}
  body.touch .day-cycle{top:max(45px,calc(env(safe-area-inset-top) + 41px));padding:5px 9px}
  
  body.touch .toast{top:max(112px,calc(env(safe-area-inset-top) + 108px))}
  .touch-stick{bottom:max(20px,calc(env(safe-area-inset-bottom) + 14px))}
  .dash-button{bottom:max(31px,calc(env(safe-area-inset-bottom) + 25px))}
}

/* Compact touch dialogs */
@media (pointer:coarse) and (orientation:landscape) and (max-height:430px){
  body.touch .dialog{width:min(410px,calc(100vw - 24px));max-height:calc(100dvh - 16px);padding:16px 24px;overflow:auto}
  body.touch .dialog .eyebrow{font-size:7px}
  body.touch .dialog h2{font-size:28px;margin:5px 0 2px}
  body.touch .dialog>p{font-size:10px;line-height:1.3;margin:0 0 5px}
  body.touch .dialog label{padding:4px 0}
  body.touch .dialog .primary-button{min-height:44px;margin-top:7px;padding:9px 16px}
  body.touch .text-button{margin-top:3px}
  body.touch .result-score{padding-top:7px}
  body.touch .result-score strong{font-size:36px;margin:2px 0 7px}
  body.touch .result-grid{gap:6px 12px}
  body.touch .result-grid span{font-size:9px;margin-bottom:2px}
  body.touch .result-grid b{font-size:16px}
}

@media (pointer:coarse) and (orientation:portrait){
  .rotate-notice{background:#edf0e4}
}

/* Lightweight circular HUD */
.status-panel{width:286px;padding:16px 18px}
.pilot-heading{margin-bottom:12px}
.status-orbs{display:flex;align-items:center;justify-content:space-between;gap:9px}
.status-orb,.elite-orb{--angle:0deg;--ring:#79b99a;position:relative;isolation:isolate;border-radius:50%;background:conic-gradient(var(--ring) var(--angle),#dce1d2 0);display:grid;place-items:center;align-content:center;text-align:center;font-variant-numeric:tabular-nums}
.status-orb{width:72px;height:72px}
.status-orb:before,.elite-orb:before{content:'';position:absolute;inset:6px;z-index:-1;border-radius:50%;background:#f4f5e9}
.status-orb span{font-size:6px;line-height:1;letter-spacing:.7px;color:#718074;font-weight:800;max-width:55px}
.status-orb strong{font-size:14px;line-height:1.25;margin-top:3px}
.stamina-orb{--ring:#d4ac5e}
.buffs{text-align:center;min-height:0}
.elite-panel{width:82px;display:grid;place-items:center}.elite-orb{--ring:#d5647f;width:72px;height:72px;color:#76394d;background:conic-gradient(var(--ring) var(--angle),#d8d7cb 0)}
.elite-orb span{font-size:7px;font-weight:900;letter-spacing:.8px}.elite-orb b{font-size:12px;margin-top:2px}
.icon-button,.primary-button,.stick-knob,.vignette{transition:none}
.dash-button.ready{animation:none}

@media (pointer:coarse){
  body.touch .status-panel{width:176px;padding:9px 10px}
  body.touch .pilot-heading{margin-bottom:7px}
  body.touch .status-orbs{gap:5px}
  body.touch .status-orb{width:48px;height:48px}
  body.touch .status-orb:before{inset:4px}
  body.touch .status-orb span{font-size:5px;letter-spacing:.3px;max-width:40px}
  body.touch .status-orb strong{font-size:10px;margin-top:1px}
  body.touch .buffs{font-size:7px}
  body.touch .elite-panel{width:58px}
  body.touch .elite-orb{width:52px;height:52px}
  body.touch .elite-orb:before{inset:4px}
  body.touch .elite-orb span{font-size:5px}.elite-orb b{font-size:9px}
}
@media (pointer:coarse) and (orientation:landscape) and (max-width:600px){body.touch .status-panel{width:158px}.status-orbs{gap:3px}body.touch .status-orb{width:44px;height:44px}}
@media (pointer:coarse){body.touch .status-panel{width:170px}}

/* Minimal in-game HUD */
.status-panel{top:18px;left:18px;width:auto;padding:5px;border-radius:999px;box-shadow:none}
.status-orbs{gap:4px}
.status-orb{width:44px;height:44px}
.status-orb:before{inset:4px}
.status-orb span{font-size:5px;letter-spacing:.35px;max-width:34px}
.status-orb strong{font-size:10px;line-height:1.1;margin-top:1px}
body.touch .status-panel{top:max(8px,env(safe-area-inset-top));left:max(8px,env(safe-area-inset-left));width:auto;padding:4px}
body.touch .status-orbs{gap:3px}
body.touch .status-orb{width:40px;height:40px}
body.touch .status-orb strong{font-size:9px}
.score-panel{top:18px;right:18px;width:auto;height:56px;min-width:0;padding:0 13px;border-radius:999px;box-shadow:none;display:flex;align-items:center;gap:10px;text-align:left;font-variant-numeric:tabular-nums}
.score-panel>strong{display:block;font-size:18px;line-height:1;letter-spacing:1.5px;margin:0}
.score-panel>span{font-size:10px;line-height:1;letter-spacing:.2px;color:var(--ink)}
.score-panel #combo{color:#d47f51;font-size:11px}
body.touch .score-panel{top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));width:auto;height:50px;padding:0 10px;gap:7px}
body.touch .score-panel>strong{font-size:16px;letter-spacing:1px}
body.touch .score-panel>span{font-size:9px}
.hud-center{position:fixed;z-index:5;top:18px;left:50%;transform:translateX(-50%);height:56px;display:flex;align-items:stretch;gap:8px}
.hud-center .day-cycle{position:static;inset:auto;transform:none;height:56px;box-shadow:none;border:1px solid #faffec;border-radius:999px;background:#f4f5e9e8}
.hud-center .day-cycle{min-width:124px;padding:0 11px;gap:8px}
.hud-center .day-cycle>span{font-size:20px}
.hud-center .day-cycle.is-night{background:#233941e8;border-color:#5d7d76;color:#e8f2d8}


.elite-panel{top:82px}
body.touch .hud-center{top:max(8px,env(safe-area-inset-top));height:50px;gap:6px}
body.touch .hud-center .day-cycle{position:static;inset:auto;transform:none;height:50px}
body.touch .hud-center .day-cycle{min-width:98px;padding:0 8px;gap:5px}
body.touch .hud-center .day-cycle>span{font-size:18px}
body.touch .hud-center .day-cycle small{font-size:6px;letter-spacing:.7px}
body.touch .hud-center .day-cycle b{font-size:9px}
.weapon-status{--weapon-color:#e88d5e;position:fixed;z-index:6;top:78px;left:18px;height:31px;padding:3px 9px 3px 4px;display:flex;align-items:center;gap:7px;border:1px solid #faffec;border-radius:999px;background:#f4f5e9ed;color:var(--ink);box-shadow:0 4px 14px #25443714;pointer-events:none;font-variant-numeric:tabular-nums}
.weapon-status span{width:22px;height:22px;display:grid;place-items:center;border-radius:50%;background:var(--weapon-color);color:white;font-size:11px;font-weight:900}.weapon-status b{font-size:9px;letter-spacing:.6px}.weapon-status strong{font-size:12px;color:var(--weapon-color)}
.weapon-status[data-weapon="shotgun"]{--weapon-color:#c69139}.weapon-status[data-weapon="flame"]{--weapon-color:#e06e43}.weapon-status[data-weapon="electric"]{--weapon-color:#398eaa}
body.touch .weapon-status{top:max(62px,calc(env(safe-area-inset-top) + 54px));left:max(8px,env(safe-area-inset-left));height:27px;gap:5px;padding:2px 7px 2px 3px}.weapon-status span{flex:none}body.touch .weapon-status span{width:20px;height:20px;font-size:10px}body.touch .weapon-status b{font-size:8px}body.touch .weapon-status strong{font-size:10px}



body.touch .elite-panel{top:max(66px,calc(env(safe-area-inset-top) + 58px))}

/* Fullscreen control */
.fullscreen-button{position:fixed;z-index:9;top:max(18px,env(safe-area-inset-top));right:max(18px,env(safe-area-inset-right));width:44px;height:44px;padding:11px;border:1px solid #b8c6b5;border-radius:50%;background:#f4f5e9e8;color:var(--ink);box-shadow:0 4px 18px #25443718;display:grid;place-items:center}
.fullscreen-button svg{grid-area:1/1;width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.fullscreen-button .fullscreen-exit,.fullscreen-button.is-fullscreen .fullscreen-enter{display:none}
.fullscreen-button.is-fullscreen .fullscreen-exit{display:block}
.fullscreen-button:hover{background:#fff9e8}
html:fullscreen,html:-webkit-full-screen{width:100%;height:100%;background:#e5ecdb}
body.playing .fullscreen-button{top:24px;right:190px}
body.night.playing .fullscreen-button{color:#e7efdd;border-color:#a5b9ae77;background:#233c3ae8}
@media (pointer:coarse){
  .fullscreen-button{top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));width:44px;height:44px;padding:10px}
  body.touch.playing .fullscreen-button{top:max(11px,calc(env(safe-area-inset-top) + 3px));right:max(146px,calc(env(safe-area-inset-right) + 146px))}
}
```


## favicon.svg

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#25483e"/><path fill="#ade0b8" d="M7 27h32v11H7zM13 18h20v14H13zM21 12h10v12H21zM28 13h16v6H28z"/><path stroke="#e8f2d1" stroke-width="3" d="M13 34h20"/></svg>
```


## site.webmanifest

```json
{
  "id": "./",
  "name": "Chibi Tank City: Endless",
  "short_name": "Chibi Tank",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "landscape",
  "background_color": "#e5ecdb",
  "theme_color": "#e5ecdb",
  "icons": [
    { "src": "./apple-touch-icon.png", "sizes": "192x192", "type": "image/png" }
  ]
}
```


## .nojekyll

```text

```


## .gitignore

```text
node_modules/
__pycache__/
artifacts/
*.zip
```


## package.json

```json
{"name":"chibi-tank-city-endless","private":true,"type":"module","scripts":{"test":"node --test tests/core.test.js"}}
```


## README.md

````markdown
# CHIBI TANK CITY: ENDLESS

Game xe tăng 3D sinh tồn, giao diện tiếng Việt, bản đồ ngẫu nhiên mỗi trận và không tái cấu trúc giữa trận. Bản đồ tập trung vào khu đô thị với nhà ở, cao tầng và dãy hàng quán; công trình bị bắn sập sẽ thành đống đổ nát mở lối mới. Ngày và đêm luân phiên mỗi 60 giây; ban đêm biến địch thành xe tăng zombie có lượng máu ×2. Nhặt rocket, shotgun, lửa hoặc điện để đổi lối đánh trong thời gian ngắn. HTML/CSS/JavaScript ES Modules, Three.js **0.170.0** đóng gói tại `vendor/`. Không build, backend, tài khoản, CDN, model, texture hay audio tải ngoài. Nhạc và hiệu ứng âm thanh gốc được tổng hợp bằng Web Audio sau thao tác người chơi.

## Chạy tại máy

Cần Python 3 và trình duyệt desktop hỗ trợ WebGL 2, import maps.

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Mở **http://127.0.0.1:8000/**. Không mở `index.html` bằng `file://` vì ES Modules cần HTTP. Nhấn **CHƠI NGAY**. Dùng `?seed=2026` để tái tạo địa hình ban đầu; seed không cố định hành vi do thao tác hoặc VFX. Game hỗ trợ bàn phím/chuột và cảm ứng ngang màn hình.

## Điều khiển

| Thao tác | Điều khiển |
| --- | --- |
| Di chuyển theo màn hình | WASD hoặc phím mũi tên |
| Ngắm, bắn liên tục | Chuột, giữ nút trái |
| Lướt né | Space, tốn 30 stamina |
| Cảm ứng | Cần trái di chuyển, cần phải ngắm/bắn, nút **LƯỚT** để né |
| Tạm dừng / tiếp tục | Esc |
| Chơi lại sau khi bị hạ | R |
| Toàn màn hình | Nút bốn góc ở góc phải; bấm lại hoặc dùng Esc để thoát |

Thân xe xoay theo di chuyển; tháp pháo xoay riêng theo điểm chuột chiếu xuống mặt đất. Người chơi có thể giữ cò để bắn liên tục theo tốc độ bắn hiện tại, không có nhiệt nòng hoặc khóa cò. Đạn người chơi có lõi xanh sáng và viền tối, khác đạn hồng của địch. Tâm ngắm desktop dùng cursor gốc của trình duyệt, không còn bị giới hạn bởi nhịp cập nhật HUD 5 Hz; phép chiếu điểm ngắm không đọc layout mỗi tick. Dash có 0,12 giây bất tử trong 0,18 giây di chuyển. Nhận sát thương có 0,65 giây bảo vệ. Dùng vật cản để cắt đường đạn. Nút toàn màn hình hỗ trợ API chuẩn của Chrome, Edge và Safari mới, đồng thời có nhánh WebKit/Microsoft cho trình duyệt cũ; khi chơi bằng cảm ứng, game cũng thử khóa ngang màn hình. Mất focus hoặc đổi tab sẽ xóa phím đang giữ và tạm dừng; trở lại bằng Esc hoặc nút Tiếp tục.

Nhạc theme ở menu và nhạc chiến đấu là hai bản gốc khác nhau, được tổng hợp một lần vào bộ nhớ rồi phát lặp bằng Web Audio; chuyển trạng thái có fade ngắn, tạm dừng thì nhạc dừng. Tiếng pháo gồm tiếng nổ đầu nòng, thân trầm và đuôi vang nhẹ; tiếng bắn của địch nhỏ dần theo khoảng cách và giới hạn tần suất để tránh chồng âm. Trình duyệt chỉ cho phát âm thanh sau thao tác đầu tiên, nên menu ban đầu im lặng cho đến khi người chơi chạm, bấm phím hoặc click.

Vũ khí đặc biệt rơi từ địch và tự trang bị khi nhặt. **Rocket** bay chậm, nổ diện rộng và phá công trình; **shotgun** bắn sáu viên tỏa quạt, hiệu quả ở gần; **lửa** quét hình nón ngắn và đốt mục tiêu; **điện** giật lan tối đa bốn mục tiêu gần nhau, làm chúng khựng lại. Rocket có đầu đạn hai màu, khói và vòng nổ cam riêng; shotgun có viên sáng và lóe nòng hình quạt; lửa tạo luồng ba sắc độ; điện dùng tia răng cưa có lõi trắng, viền lam và chớp tại điểm trúng. Nhặt cùng loại sẽ nạp thêm đạn đến giới hạn; nhặt loại khác sẽ thay vũ khí hiện tại. Khi hết đạn đặc biệt, xe tự trở về pháo thường không giới hạn đạn. HUD chỉ hiện tên và số đạn khi đang dùng vũ khí đặc biệt.

Trên iPhone, Safari trong tab không cho trang game gọi Fullscreen API. Game có manifest `display: standalone`, biểu tượng riêng và cấu hình Home Screen. Nếu đã thêm game, hãy **mở từ biểu tượng trên Màn hình chính**, không mở lại tab Safari; lúc đó game nhận biết chế độ ứng dụng và ẩn nút fullscreen vô tác dụng. Nếu biểu tượng cũ vẫn mở tab, hãy tạo lại biểu tượng và bật **Mở dưới dạng ứng dụng** khi iOS hiển thị tùy chọn đó. iOS có thể vẫn giữ thanh trạng thái/thanh điều hướng hệ thống; trang web không thể ép ẩn các phần này.

## Triển khai GitHub Pages

1. Đưa các tệp trong thư mục dự án lên repository, giữ `index.html` tại gốc. Không cần đưa `artifacts/` và ZIP lên.
2. Vào **Settings → Pages → Build and deployment**.
3. Chọn **Deploy from a branch**, nhánh chứa mã nguồn, thư mục **/(root)**, rồi Save.
4. Mở địa chỉ Pages được GitHub hiển thị sau khi triển khai thành công.

Các đường dẫn tài nguyên đều tương đối, gồm import map trỏ tới `./vendor/three.module.min.js`. Có `.nojekyll`. Phù hợp cả domain gốc và `/repository-name/`. Repository này chưa được xuất bản lên một tài khoản GitHub.

Tài liệu nền tảng: [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [Three.js](https://threejs.org/docs/).

## Cấu trúc

```text
chibi-tank-city/
├── index.html              Màn chính, HUD, pause, Game Over, import map
├── style.css               Giao diện responsive tiếng Việt
├── favicon.svg
├── crosshair.png           Cursor desktop tương phản cao
├── apple-touch-icon.png    Biểu tượng ứng dụng iOS
├── site.webmanifest        Home Screen ở chế độ standalone
├── .nojekyll
├── .gitignore
├── package.json            ES Modules; kiểm thử Node tùy chọn
├── README.md
├── TESTING.md              Kết quả thực chạy và giới hạn
├── SOURCE.md               Toàn bộ mã nguồn tự viết, theo đường dẫn
├── src/
│   ├── config.js           Toàn bộ thông số cân bằng
│   ├── core.js             Grid, RNG, flood-fill, BFS, swept collision, storage
│   ├── main.js             State machine, camera, fixed timestep, vòng render
│   ├── input.js            Bàn phím, chuột, raycast, focus
│   ├── player.js           Di chuyển, dash, stamina, sát thương
│   ├── enemies.js          AI, director, spawn, elite
│   ├── combat.js           Pool đạn, bốn vũ khí nhặt được, vật phẩm và nổ dây chuyền
│   ├── world.js            Địa hình phá hủy được, bóng, instancing
│   ├── models.js           Mô hình xe và thành phố từ geometry
│   ├── effects.js          Pool particle/debris, shockwave, popup
│   ├── audio.js            Web Audio, chuyển nhạc và hiệu ứng chiến đấu
│   ├── music.js            Hai vòng nhạc gốc được dựng một lần trong bộ nhớ
│   └── ui.js               HUD tối giản, pause và hiển thị kỷ lục
├── vendor/
│   ├── three.module.min.js Three.js 0.170.0, bản phân phối nguyên gốc
│   └── THREE-LICENSE.txt   Giấy phép MIT của Three.js
├── tools/package.py        Tạo SOURCE.md, manifest SHA-256 và ZIP
└── tests/
    ├── core-suite.js       Bộ kiểm thử dùng chung cho browser/Node
    ├── core.test.js        Node test runner
    ├── integration-suite.js Kiểm tra chiến đấu và địa hình trong browser
    ├── results/            Kết quả JSON của lần kiểm thử bàn giao
    └── browser_runner.py   Chrome CDP, screenshot, smoke và stress test
```

## Các thông số chính

Chỉnh trực tiếp tại `src/config.js`; tải lại trang sau khi sửa.

| Nhóm / trường | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `step` | 1/30 s | Bước mô phỏng cố định; delta mỗi frame giới hạn 0,1 s |
| `world.size / cell` | 25 / 2,4 | Lưới nội bộ 25×25 dùng cho va chạm và tìm đường; hình phố không theo ô chunk cố định |
| `world.phaseDuration` | 60 s | Thời lượng mỗi pha ngày hoặc đêm |
| `player.hp / stamina` | 100 / 100 | Giáp và năng lượng tối đa |
| `player.speed / radius` | 6 / 0,62 | Tốc độ, bán kính va chạm |
| `player.fireInterval / damage` | 0,25 s / 28 | Tốc độ bắn, sát thương |
| `player.dashCost / dashDuration` | 30 / 0,18 s | Chi phí và thời lượng dash |
| `player.dashInvulnerability` | 0,12 s | Thời gian bất tử khi dash |
| `player.dashSpeed / dashCooldown` | 22 / 0,5 s | Tốc độ, hồi chiêu dash |
| `player.staminaRegen / hurtGrace` | 23 mỗi giây / 0,65 s | Hồi năng lượng, bảo vệ sau trúng đạn |
| `director.maxEnemies` | 16 | Bao gồm cả địch đang được báo spawn; giữ tải AI ổn định trên CPU cũ |
| `director.spawnStart / spawnMin` | 4,2 / 1,35 s | Khoảng spawn ban đầu / thấp nhất |
| `director.safeRadius / spawnWarning` | 11 / 1,5 s | Khoảng cách và cảnh báo spawn |
| `director.eliteEvery` | 90 s | Chu kỳ elite, tối đa một elite đang sống/đang spawn |
| `director.assaultFirst / assaultBase / assaultMin` | 24 / 38 / 28 s | Đợt tấn công đầu, khoảng cơ sở và khoảng thấp nhất |
| `director.assaultGap` | 0,6 s | Khoảng cách giữa từng xe trong một đợt dồn quân |
| `combat.maxBullets / maxMortars` | 180 / 12 | Sức chứa pool |
| `weapons` | Rocket 8, shotgun 20, lửa 50, điện 18 | Đạn mỗi lần nhặt, giới hạn nạp và nhịp bắn riêng từng loại |
| `combat.bulletSpeed / enemyBulletSpeed` | 25 / 10 | Tốc độ đạn ban đầu |
| `combat.comboWindow / maxCombo` | 4 s / ×5 | Combo hết khi quá hạn hoặc nhận sát thương |
| `combat.survivalScore` | 5/giây | Điểm thời gian |
| `combat.maxPickups` | 16 | Vật phẩm cùng lúc, tự hết sau 18 giây |
| `effects.high / popups` | 96 / 16 | Pool particle/debris và popup có giới hạn cố định |
| `performance.softwareFPS / highFPS` | 24 / 60 | Trần khung hình cho SwiftShader và WebGL phần cứng; menu/pause chạy 4 FPS |
| `colors` | Mint, trời, vàng, san hô | Bảng màu chính |
| `ENEMIES` | Scout / Gunner / Heavy / Mortar / Elite | HP, tốc độ, silhouette, điểm và chu kỳ bắn từng loại |

Director tăng HP tối đa 70%, tốc độ đạn tối đa 45%, tăng tỷ trọng đối thủ mạnh và hành vi đánh vòng theo thời gian. 12 giây đầu chỉ có Scout; Gunner, Heavy và Mortar được mở dần trong 45 giây đầu để người mới học điều khiển. Từ giây 24, các đợt tấn công đưa 3–5 xe vào trận cách nhau 0,6 giây; ban đêm có thêm một zombie. Tổng địch và spawn chờ bị giới hạn ở 16. Điểm tiêu diệt: Scout 100, Gunner 180, Heavy 350, Mortar 250, Elite 1800, nhân combo. Các mốc sống sót 30/60/120 giây có điểm thưởng. Không có điểm từ công trình.

Trên thiết bị cảm ứng, game vẫn dùng cấu hình đồ họa cao, phóng camera gần hơn và dùng trợ ngắm nhẹ trong một góc hẹp theo hướng kéo; vật cản vẫn chặn khóa mục tiêu. Giao diện yêu cầu xoay ngang để giữ đủ không gian cho hai cần điều khiển.

Game dùng một cấu hình hình ảnh cao cố định. WebGL phần cứng dùng mật độ điểm ảnh `min(devicePixelRatio, 1.25)` và hướng tới 60 FPS; SwiftShader dùng độ phân giải native, 24 FPS và bỏ tone mapping nặng. MSAA, shadow map thời gian thực và nguồn sáng điểm động được tắt; vật liệu Lambert, bảng màu và silhouette giữ hình ảnh rõ với shader nhẹ. Bóng tiếp xúc mềm của công trình/xe được gộp trong hai `InstancedMesh`; quầng sáng xanh dưới xe người chơi chỉ hiện ban đêm. Hai texture radial 64×64 được tạo tại runtime, không tải tài nguyên ngoài. Mô phỏng chạy 30 tick/giây. Menu, pause và Game Over chỉ render 4 FPS; tab ẩn không render. Particle, đạn và pháo cối chỉ cập nhật các slot đang sống; AI quét tầm nhìn theo nhịp chia đều. Tia lóe nòng, va chạm, bụi đổ nhà và vòng nổ đã rõ hơn; particle vẫn gộp trong một `InstancedMesh` tối đa 96 phần tử và vòng nổ tái dùng sáu mesh. Mỗi vật phẩm chỉ dùng một mesh gộp; tia điện dùng tám cặp dải răng cưa tái sử dụng và chỉ hiện khi bắn. Các animation trang trí ở địa hình, điểm spawn, vòng ngắm địch, độ giật nòng và HUD vẫn được bỏ.

Hình xe tăng vẫn giữ bánh, xích, đèn, ăng-ten, tháp pháo và màu riêng của từng bộ phận. Nòng pháo được gộp vào mesh tháp pháo; các phần còn lại được ghép trước khi gửi sang GPU. Nhà cao tầng, hàng quán và cây giữ silhouette nhưng giảm chi tiết hình học nhỏ; bản sao trong suốt của nhà che khuất xe dùng silhouette gọn hơn. HUD chỉ còn hai vòng Giáp và Năng lượng; vòng nhiệt đã được loại bỏ. Khung điểm chỉ giữ điểm, combo và thời gian. Đồng hồ ngày–đêm nằm giữa hàng trên; đồng hồ tái cấu trúc đã bỏ. Nút fullscreen nằm trước khung điểm. Thanh tên game, minimap và nút audio/settings không xuất hiện trong gameplay.

Mỗi trận bắt đầu vào ban ngày. Sau 60 giây, ánh sáng chuyển dần sang đêm và mọi địch đang sống hoặc xuất hiện mới trở thành zombie: mắt xanh, gai xanh và vòng sáng xanh; `maxHP` tăng ×2 nhưng giữ nguyên phần trăm máu hiện tại. Sau 60 giây đêm, bình minh đưa chúng về chỉ số thường theo cùng nguyên tắc. Đồng hồ HUD luôn hiển thị thời gian còn lại của pha hiện tại.

## Địa hình được sinh và phá hủy như thế nào?

Grid 25×25 chỉ là dữ liệu nội bộ cho va chạm và navigation. Mỗi seed tạo một lõi cao tầng gọn quanh trung tâm, có vành đường/quảng trường làm khoảng lùi trước khi chuyển sang hàng quán mặt phố và khu nhà thấp tầng. Các cụm cây nhỏ được đặt tách nhau và luôn tiếp giáp đường; nền đi lại dùng cùng bề mặt sáng, không còn ô cỏ kẻ vạch như lối dạo. Các điểm mốc ngẫu nhiên nối thành mạng phố có nhánh, vòng nối và bốn lối tiếp cận ngoài rìa; không còn mạng đại lộ lặp đều kiểu bàn cờ. Mỗi seed được flood-fill trước khi sử dụng nên mọi ô đi được đều nối với khu trung tâm.

Tường gạch, thép, nhà, cây, cao tầng và hàng quán có HP riêng. Đạn và vụ nổ làm giảm HP; khi sập, công trình trở thành rubble có thể đi xuyên qua, collision và đường BFS cập nhật ngay trong cùng tick. Bản đồ không tự dựng lại sau một khoảng thời gian; chỉ các công trình bị phá mới thay đổi địa hình. Mỗi lượt chơi mới lấy seed ngẫu nhiên, hoặc dùng `?seed=` để tái hiện cùng bố cục. BFS phù hợp grid 625 ô, không cần physics engine.

## Kiểm thử và đóng gói

Xem `TESTING.md` để biết kiểm tra nào đã thực chạy. Tùy chọn, nếu có Node:

```sh
node --test tests/core.test.js
```

Bộ kiểm thử browser cần Python, Chrome desktop và `websocket-client`:

```sh
python -m pip install websocket-client
python tests/browser_runner.py --soak
```

Runner phục vụ trang dưới `/repository-name/`, chụp ảnh và ghi JSON vào `artifacts/`. Nó dùng Chrome headless/SwiftShader để kiểm chứng chức năng; kết quả không phải benchmark GPU phổ thông. `--soak` chạy 600 giây **thời gian mô phỏng tăng tốc**, giữ người chơi bất tử riêng trong kiểm thử để đạt cuối bài test. Không phải tuyên bố đã chơi thủ công liên tục 10 phút.

Thêm `?debug` khi chạy local sẽ cung cấp `window.__game` để kiểm tra. Game bình thường không xuất đối tượng debug. Mã nguồn và Three.js đầy đủ nằm trong ZIP bàn giao, không kèm profile trình duyệt kiểm thử.
````


## TESTING.md

````markdown
# Kiểm thử bàn giao

Thực chạy gần nhất ngày **18/09/2026** bằng Python 3.11 và Chrome headless, WebGL qua SwiftShader. Máy chủ HTTP bind loopback; URL thực kiểm tra là `http://127.0.0.1:8765/repository-name/?debug&seed=2026`.

Lệnh thực chạy:

```sh
python tests/browser_runner.py --soak
```

Kết quả chức năng gần nhất: **exit code 0**, 9 bài core + 25 bài smoke + 26 bài integration đều đạt; kiểm tra resize desktop, mô phỏng cảm ứng landscape 844×390 và giao diện đêm đều đạt; không có JavaScript exception hay HTTP response từ 400 trở lên. JSON và ảnh gần nhất nằm trong `artifacts/`.

## Checklist đã chạy

| Hạng mục | Kết quả và phạm vi |
| --- | --- |
| Đường dẫn `/repository-name/` | Đạt. HTML, CSS, module, Three.js, favicon, cursor PNG, biểu tượng iOS và web manifest tải bằng đường dẫn tương đối. Không cần CDN. |
| Sinh map theo seed | Đạt. Cùng seed cho cùng layout, seed khác cho layout khác. 100 seed có điểm bắt đầu trống, mật độ đường trong giới hạn, không có hàng/cột đi xuyên toàn bản đồ và mọi ô đi được liên thông. |
| Khu đô thị | Đạt trên 40 seed. Mỗi seed có một cụm 7–9 cao tầng, khoảng lùi đi được quanh mặt ngoài cụm, tối thiểu mười hàng quán và các cụm cây nhỏ tách biệt. Nhà thấp tầng không nằm sát mặt cao ốc lộ ra đường; các ô cỏ kẻ vạch đã được bỏ khỏi hình ảnh và toàn bộ bề mặt đi được vẫn liên thông. |
| WASD / phím mũi tên | Đạt. Gửi KeyboardEvent qua DOM; vector W và ↑ tương đương. Vector đi chéo dài 1. |
| Dash | Đạt. Tốn 30 stamina, có invulnerability; kiểm tra di chuyển nhiều bước không vượt tường hoặc biên, vị trí cuối hợp lệ. |
| Chuột, raycast, resize | Đạt ở 1440×1000 và 1024×768. Chiếu ngược điểm ngắm về đúng tọa độ chuột; hướng đạn khớp hướng tháp pháo. Cursor tương phản cao do trình duyệt vẽ, không phụ thuộc HUD 5 Hz; raycast không gọi `getBoundingClientRect` mỗi tick. |
| Cảm ứng landscape | Đạt ở viewport 844×390, DPR 2. Hai cần 100×100 CSS px và nút lướt 60×60 CSS px nằm trong màn hình; kéo cần trái tạo vector di chuyển, cần phải vừa ngắm vừa bắn. Cấu hình đồ họa luôn là High. |
| Toàn màn hình | Đạt bằng click thật qua Chrome CDP: nút vào và thoát Fullscreen API thành công, cập nhật nhãn/biểu tượng. Kiểm thử adapter xác nhận các nhánh chuẩn Chrome/Edge, WebKit Safari mới/cũ và Microsoft cũ. Nhánh giả lập iPhone xác nhận nút bị ẩn khi đã chạy standalone, tab Safari hiện hướng dẫn mở từ biểu tượng đã cài; manifest và icon tải thành công. Vùng chạm 44×44 px nằm trọn viewport desktop và mobile 667×375, không chồng bốn cụm HUD. Chưa thử iPhone vật lý. |
| Chu kỳ ngày–đêm | Đạt. Chuyển sang đêm tại 60 giây và trở lại ngày tại 120 giây gameplay. Pause vẫn đóng băng đồng hồ vì chu kỳ dùng `game.time`. |
| Zombie ban đêm | Đạt. Địch đang sống và địch sinh mới đều có `maxHP = baseMaxHP × 2`, giữ phần trăm máu khi chuyển pha, hiện mắt/gai xanh và trở lại HP thường lúc bình minh. |
| Bắn có chủ đích | Đạt. Bắt đầu trận không có đạn tự bắn; tạo đạn khi giữ trạng thái chuột trái. Listener pointerdown chỉ nằm trên canvas, tách khỏi nút UI. Đạn người chơi dùng hình có lõi xanh sáng và viền tối trong một draw call. |
| Nhạc và tiếng pháo | Đạt. Click thật ở menu mở AudioContext và bắt đầu theme. Hai vòng nhạc khác nhau có tín hiệu âm rõ, chuyển theo menu/trận/tạm dừng/kết thúc. Tiếng pháo được trộn sẵn vào một buffer ngắn, có transient mạnh và đuôi tắt dần; địch giảm âm theo khoảng cách và giới hạn số tiếng bắn chồng. Chưa đánh giá bằng nghe thủ công trên nhiều loại loa. |
| Va chạm đạn | Đạt. Segment/AABB và segment/circle; đạn bị chặn khi đầu nòng chạm cover; sau khi phá cover mới trúng địch phía sau. |
| Tường và tìm đường | Đạt. Tường mất collision ngay; version tăng; đường BFS đổi và AI cập nhật cache theo version. |
| Địa hình cố định trong trận | Đạt. Bố cục không tự tái cấu trúc sau nhiều phút sinh tồn; chỉ những công trình bị phá mới chuyển thành rubble và cập nhật đường đi. Đồng hồ và vùng cảnh báo tái cấu trúc đã được gỡ. |
| Hiệu ứng chiến đấu | Đạt. Rocket có khói và vòng nổ cam; shotgun có viên sáng và lóe hình quạt; lửa thành luồng ba màu; điện có lõi trắng, viền lam và tia răng cưa. Hạt hiệu ứng vẫn dùng một `InstancedMesh` với trần 96 phần tử. |
| Vật thể che xe | Đạt. Nhà/cây phía trước được thay bằng bản sao mờ 18% opacity, giữ `scale.y = 1` và vẫn giữ collision; trở lại mô hình đặc khi xe rời vùng che. |
| Spawn | Đạt. Spawn đang cảnh báo bị hủy nếu người chơi tiến vào bán kính an toàn. Tổng địch và spawn chờ bị giới hạn. |
| Chi phí chọn điểm spawn | Đạt. Mỗi lần chọn dùng một flood-fill chung cho mọi ô ứng viên, không gọi BFS đường đi riêng cho từng ô. |
| Pháo cối | Đạt. Vòng cảnh báo có trước; chưa gây sát thương ở 1,5 giây, nổ sau 1,65 giây. |
| Elite | Đạt. Luân phiên chùm 5 đạn / 3 điểm pháo cối. Giữ một slot elite khi địch thường đã bão hòa. Elite xuất hiện trong bài soak. |
| Nổ dây chuyền | Đạt. Ba thùng kề nhau bị phá, không đệ quy lại thùng đã nổ, không cộng điểm vật cản. |
| Phá hủy công trình | Đạt. Thép, nhà, cây, cao tầng và hàng quán có HP hữu hạn; cao tầng/hàng quán hấp thụ đạn rồi chuyển thành rubble đi được. |
| Đợt tấn công | Đạt. Director tạo nhóm quân nhanh từ giây 24, giảm bộ đếm đúng khi schedule thành công và không vượt trần 16 địch + spawn chờ. |
| Vật phẩm | Đạt. Hồi HP, hồi stamina, buff tốc độ, buff bắn nhanh; buff hết sau thời hạn. |
| Vũ khí nhặt được | Đạt. Cả bốn loại đều có thể rơi và nhặt; cùng loại nạp thêm đến trần, hết đạn tự trở về pháo thường. Rocket gây nổ lan; shotgun bắn một chùm sáu viên tầm ngắn mỗi lần trừ một đạn; lửa gây cháy nhưng không xuyên cover; điện giật lan và làm địch khựng lại. Bắn shotgun liên tục đến trần 180 projectile không cấp phát thêm hoặc trừ đạn khi pool đầy. |
| Điểm / combo | Đạt. Mỗi địch chỉ thưởng một lần, combo tối đa ×5, reset khi hết thời gian hoặc nhận sát thương. |
| HP / grace | Đạt. Hai lần trúng liên tiếp trong khoảng bảo vệ chỉ nhận sát thương một lần. |
| Pause / mất focus | Đạt. Timer và spawn đóng băng khi pause; blur tự pause và xóa held input. Handler visibilitychange cùng cơ chế đã được kiểm tra mã nguồn; chưa tự động chuyển tab thật. |
| Game Over / R / restart | Đạt. Hiện thống kê, phím R tạo trận mới. Năm restart liên tiếp không giữ enemy, projectile, pickup từ trận trước. Các listener và RAF chỉ được tạo trong constructor, không tạo ở restart. |
| Pool | Đạt. 180 đạn dùng chung cả đạn thường, rocket và shotgun; 12 pháo cối, 96 particle/debris, 8 cặp dải tia điện và 16 popup. Vật phẩm có tối đa 16 món, mỗi món một mesh gộp; particle chết không còn được cập nhật mỗi tick. |
| Ngân sách render | Đạt với 16 xe địch. 75 draw call ban ngày, 86 ban đêm; thêm 16 vật phẩm chỉ lên 101 draw call ban đêm do mỗi vật phẩm có một mesh. Tối đa 48 enemy mesh và 96 particle instance. Shadow map tắt; bóng tiếp xúc instanced và quầng sáng đêm hoạt động. SwiftShader dùng pixel ratio 1 và 24 FPS, WebGL phần cứng hướng tới 60 FPS. |
| HUD tối giản | Đạt. Không còn minimap, header tên game, nút audio/settings hay các điều khiển tương ứng trong DOM. Cụm status chỉ còn Giáp và Năng lượng, đo được 93×50 px ở viewport mobile 667×375. Nhãn vũ khí/đạn chỉ xuất hiện khi nhặt vũ khí đặc biệt; trên mobile nằm dưới status, không che cần điều khiển hoặc toast. Khung điểm chỉ giữ điểm, combo, thời gian. Đồng hồ ngày–đêm và nút fullscreen nằm cùng hàng, không giao nhau. |

## Bài soak 600 giây mô phỏng

Đây là **600 giây thời gian gameplay chạy tăng tốc**, không phải 10 phút đồng hồ thực hay chơi thủ công. Test dùng cùng `Game.step(1/30)`, world, combat, director và AI thật; đặt invulnerability cho xe người chơi trong test để tránh dừng ở Game Over. Tắt cập nhật DOM mỗi tick và render tại các mốc một phút để stress logic. Không thay tần suất spawn. Bài soak dùng pháo thường; sức chứa đạn đặc biệt được kiểm tra riêng trong integration.

Kết quả của lần cuối:

- Thời gian gameplay: 600,000000000112 giây (sai số cộng số thực).
- **54 ô vật cản bị phá**, không có lần tái cấu trúc định kỳ.
- Đã có elite trong trận; tối đa **16 địch + điểm spawn đang chờ**.
- Tối đa 12 đạn trực tiếp và 96 particle hoạt động trong kịch bản này; các pool luôn hữu hạn.
- **0** lần phát hiện player/enemy nằm trong ô cấm hoặc grid mất liên thông khi lấy mẫu mỗi giây.
- Ở 10 mốc render: **25–27 geometries, 1–2 texture** trong `renderer.info.memory`; draw call dao động **87–120**. Hai texture nhỏ tạo bóng mềm và quầng sáng, không tải từ mạng.
- JS heap tại các mốc dao động khoảng **35,4–64,0 MB**, cuối bài khoảng **55,3 MB** trong lượt Chrome headless này; phép đo không chứng minh không thể rò bộ nhớ ở mọi kịch bản.
- 600 giây gameplay tăng tốc hoàn thành trong khoảng **2,45 giây** đồng hồ ở lượt test này. Đây là thời gian chạy logic trong Chrome headless, không phải FPS trên phần cứng người dùng.

## Giới hạn và kiểm tra thủ công còn lại

- Chưa đo FPS bằng GPU desktop phổ thông, chưa tuyên bố phần cứng đích luôn giữ đúng trần FPS. SwiftShader headless dùng để kiểm chứng chức năng và ngân sách render; không đại diện cho GPU thật.
- Chưa chơi thủ công liên tục 10 phút đồng hồ thực; chưa nghe và đánh giá âm lượng trên loa/tai nghe. Chưa tự động kiểm tra chuyển tab thật, bật/tắt storage của trình duyệt hay mất WebGL context thực tế.
- Chưa triển khai lên GitHub Pages thật. Đã xác minh static site dưới đường dẫn con tương đương bằng HTTP local.
- Chưa kiểm tra Safari/Firefox hoặc điện thoại vật lý. Chrome emulation xác nhận layout, kích thước vùng chạm, Pointer Events và nhánh nhận biết standalone giả lập; vẫn cần chơi thử trên iPhone/Android thật để đánh giá độ trễ, nhiệt và vùng safe-area theo từng máy. Safari tab trên iPhone không hỗ trợ Fullscreen API cho trang HTML; Home Screen standalone vẫn có thể hiện thanh hệ thống tùy bản iOS.
- Arena dùng lưới logic cố định 25×25. Đường phố có hình bất quy tắc, không dùng chunk vuông cố định. Thay kích thước grid vẫn cần cập nhật generator và giới hạn camera cùng nhau.
- Layout đảm bảo kết nối bằng mạng đường ngẫu nhiên được flood-fill, không giữ đại lộ cố định. Phá công trình mở thêm lối đi nhưng không tự dựng lại bản đồ.
- Địa hình dùng collision bảo thủ theo ô 2,4 đơn vị; hình vẽ có khe trang trí nhỏ không phải lối đi. Nhà/cây tiền cảnh giữ nguyên chiều cao và tạm mờ để thấy xe; collision vẫn giữ nguyên.
- Pathfinding BFS có steering tránh chồng xe, chưa có crowd solver phức tạp; nhóm địch có thể ùn tại nút thắt. Đây là một phần tình huống chiến đấu, không đổi vị trí xe để chữa kẹt.
- High score lưu cục bộ; không đồng bộ nhiều máy và không có leaderboard online. Storage có try/catch để fallback an toàn.
- Tổng địch là hữu hạn, HP và tốc độ đạn có trần. Elite mới chờ elite trước bị tiêu diệt; không tạo nhiều elite chồng nhau.

## Kiểm tra UI/UX di động bổ sung

Lần kiểm tra giao diện di động gần nhất dùng Chrome 153 headless với mô phỏng cảm ứng và DPR 2. Kết quả đều đạt ở các trạng thái sau:

- Gameplay ngang 844×390 và 667×375: HUD, thông báo, hai cần điều khiển và nút lướt nằm trọn trong viewport, không chồng lấn; thao tác đi, ngắm và bắn hoạt động.
- Cụm trạng thái 667×375: chỉ còn hai vòng Giáp và Năng lượng, rộng 93×50 px; nhãn rocket 85×27 px nằm ngay bên dưới. Không còn phần tử nhiệt nòng hay trạng thái khóa cò.
- Hộp tạm dừng 667×375: chỉ còn Tiếp tục và Về màn hình chính, không có audio/settings, không cần cuộn; các vùng chạm cao ít nhất 44 CSS px.
- Hộp kết thúc 667×375: tiêu đề, thống kê, Thử lại và Về màn hình chính hiện đầy đủ; vị trí cuộn luôn trở về đầu khi đổi trạng thái.
- Gameplay dọc 390×844: lớp nhắc xoay ngang phủ kín màn hình. Menu dọc vẫn dùng được và không hiện lớp nhắc xoay.
- Chất lượng trên thiết bị cảm ứng luôn là High; cụm status 93×50 px không chồng vùng điều khiển. Không ghi nhận JavaScript exception hoặc HTTP response lỗi.

Kết quả đo nằm trong `tests/results/mobile-*.json`; ảnh đối chiếu nằm trong `artifacts/` và không được đưa vào gói phát hành.

Bài integration xác nhận 20 lần bắn liên tục vẫn tạo đủ 20 viên đạn và đối tượng người chơi không còn thuộc tính nhiệt hoặc khóa cò.

## Kiểm tra nhanh khi triển khai

1. Chạy bằng HTTP, nhấn Chơi ngay; kiểm tra WASD, mũi tên, chuột và Space.
2. Thử giữ bắn vào tường gạch, thép và thùng nhiên liệu; đạn không xuyên cover.
3. Bắn phá nhà và kiểm tra hiệu ứng nổ, bụi, vòng xung kích; xác nhận rubble đi được và đường đi cập nhật.
4. Giữ phím rồi đổi tab; trở lại phải đang pause, không tự tiếp tục di chuyển.
5. Nhấn Esc để tạm dừng và tiếp tục; xác nhận hộp pause không có tùy chọn audio, rung hay chất lượng đồ họa.
6. Thua rồi bấm R nhiều lần; không còn entity trận trước, kỷ lục vẫn được giữ.
7. Chơi 10 phút thực trên phần cứng đích, quan sát FPS/heap/GPU bằng DevTools trước khi công bố số liệu hiệu năng.
8. Nghe nhạc menu, nhạc chiến đấu, tiếng pháo người chơi và địch trên loa điện thoại/tai nghe; kiểm tra mức âm khi bắn liên tục và khi tạm dừng.
9. Nhặt thử cả bốn vũ khí; kiểm tra rocket phá cover, shotgun tỏa chùm, lửa không xuyên tường, điện giật lan và đạn trở về pháo thường khi hết.
````


## src/audio.js

```javascript
import { musicSamples } from './music.js';

export class Audio {
  constructor(settings) {
    this.settings = settings;
    this.context = null;
    this.active = 0;
    this.scene = 'menu';
    this.musicVoice = null;
    this.musicCache = new Map();
    this.lastEnemyShot = -Infinity;
    this.lastFlameSound = -Infinity;
  }

  unlock() {
    try {
      if (!this.context) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) return;
        const c = this.context = new Context();
        this.master = c.createGain();
        this.musicBus = c.createGain();
        this.effectsBus = c.createGain();
        this.musicBus.gain.value = .23;
        this.effectsBus.gain.value = .8;
        this.musicBus.connect(this.master);
        this.effectsBus.connect(this.master);
        this.master.connect(c.destination);
        this.makeNoise();
        this.makeShot();
      }
      this.update();
      if (this.context.state === 'suspended') this.context.resume().then(() => this.syncMusic()).catch(() => {});
      else this.syncMusic();
    } catch {}
  }

  update() {
    if (this.master) this.master.gain.value = this.settings.mute ? 0 : this.settings.volume;
  }

  makeNoise() {
    const c = this.context, length = Math.round(c.sampleRate * .6);
    const buffer = c.createBuffer(1, length, c.sampleRate), data = buffer.getChannelData(0);
    let seed = 0x654a21;
    for (let i = 0; i < length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      data[i] = seed / 2147483648 - 1;
    }
    this.noiseBuffer = buffer;
  }

  makeShot() {
    const c = this.context, rate = c.sampleRate, length = Math.round(rate * .42);
    const buffer = c.createBuffer(1, length, rate), data = buffer.getChannelData(0);
    const noise = this.noiseBuffer.getChannelData(0);
    const crackAlpha = 1 - Math.exp(-2 * Math.PI * 1550 / rate);
    const bodyAlpha = 1 - Math.exp(-2 * Math.PI * 520 / rate);
    const tailAlpha = 1 - Math.exp(-2 * Math.PI * 360 / rate);
    let crackLow = 0, bodyLow = 0, tailLow = 0, phase = 0;
    for (let i = 0; i < length; i++) {
      const time = i / rate, raw = noise[i], delayed = noise[(i + 9001) % noise.length];
      crackLow += (raw - crackLow) * crackAlpha;
      bodyLow += (raw - bodyLow) * bodyAlpha;
      tailLow += (delayed - tailLow) * tailAlpha;
      phase += 2 * Math.PI * (48 + 107 * Math.exp(-time * 24)) / rate;
      const crack = (raw - crackLow) * Math.exp(-time * 55) * .58;
      const body = bodyLow * Math.exp(-time * 17) * .42;
      const thump = Math.sin(phase) * Math.exp(-time * 15) * .53;
      const echo = time > .055 ? tailLow * Math.exp(-(time - .055) * 11) * .16 : 0;
      const click = time > .095 ? (raw - crackLow) * Math.exp(-(time - .095) * 75) * .1 : 0;
      data[i] = (crack + body + thump + echo + click) * Math.min(1, time / .002);
    }
    const dry = data.slice(), delay = Math.round(rate * .074);
    for (let i = delay; i < length; i++) data[i] += dry[i - delay] * .11;
    let peak = 0;
    for (const value of data) peak = Math.max(peak, Math.abs(value));
    const scale = peak > .85 ? .85 / peak : 1;
    for (let i = 0; i < length; i++) data[i] *= scale * Math.min(1, (length - 1 - i) / 110);
    this.shotBuffer = buffer;
  }

  musicBuffer(track) {
    if (!this.musicCache.has(track)) {
      const { samples, sampleRate } = musicSamples(track);
      const buffer = this.context.createBuffer(1, samples.length, sampleRate);
      buffer.getChannelData(0).set(samples);
      this.musicCache.set(track, buffer);
    }
    return this.musicCache.get(track);
  }

  setScene(scene) {
    this.scene = scene;
    this.syncMusic();
  }

  syncMusic() {
    const c = this.context;
    if (!c || c.state !== 'running') return;
    const track = this.scene === 'playing' ? 'battle' : this.scene === 'menu' || this.scene === 'over' ? 'theme' : null;
    const target = this.scene === 'over' ? .5 : 1;
    const now = c.currentTime, old = this.musicVoice;
    if (old?.track === track) {
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setTargetAtTime(target, now, .12);
      return;
    }
    if (old) {
      old.gain.gain.cancelScheduledValues(now);
      old.gain.gain.setValueAtTime(old.gain.gain.value, now);
      old.gain.gain.linearRampToValueAtTime(0, now + .32);
      old.source.stop(now + .34);
      this.musicVoice = null;
    }
    if (!track) return;
    const source = c.createBufferSource(), gain = c.createGain();
    source.buffer = this.musicBuffer(track);
    source.loop = true;
    source.connect(gain);
    gain.connect(this.musicBus);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(target, now + .42);
    source.onended = () => { source.disconnect(); gain.disconnect(); };
    source.start(now);
    this.musicVoice = { source, gain, track };
  }

  noise(at, duration, level, frequency, filterType = 'lowpass') {
    const c = this.context, source = c.createBufferSource(), filter = c.createBiquadFilter(), gain = c.createGain();
    source.buffer = this.noiseBuffer;
    filter.type = filterType;
    filter.frequency.value = frequency;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.effectsBus);
    gain.gain.setValueAtTime(.0001, at);
    gain.gain.linearRampToValueAtTime(level, at + .003);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    const offset = Math.random() * Math.max(0, this.noiseBuffer.duration - duration - .01);
    source.start(at, offset, duration);
    return source;
  }

  tone(at, duration, from, to, level, type = 'sine') {
    const c = this.context, oscillator = c.createOscillator(), gain = c.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, at);
    oscillator.frequency.exponentialRampToValueAtTime(to, at + duration);
    gain.gain.setValueAtTime(level, at);
    gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(gain);
    gain.connect(this.effectsBus);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    oscillator.start(at);
    oscillator.stop(at + duration);
    return oscillator;
  }

  shot(volume, enemy) {
    const c = this.context, source = c.createBufferSource(), gain = c.createGain();
    source.buffer = this.shotBuffer;
    source.playbackRate.value = enemy ? .84 + Math.random() * .12 : .96 + Math.random() * .08;
    gain.gain.value = volume;
    source.connect(gain);
    gain.connect(this.effectsBus);
    source.onended = () => { source.disconnect(); gain.disconnect(); this.active--; };
    source.start();
  }

  play(name, distance = 0) {
    const c = this.context;
    if (!c || c.state !== 'running' || this.settings.mute || this.active >= 24) return;
    const now = c.currentTime;
    if (name === 'enemyShot') {
      if (now - this.lastEnemyShot < .12 || distance > 29) return;
      this.lastEnemyShot = now;
    }
    if (name === 'flame') {
      if (now - this.lastFlameSound < .18) return;
      this.lastFlameSound = now;
    }
    this.active++;
    let end;
    if (name === 'shot' || name === 'enemyShot') {
      const volume = name === 'shot' ? 1 : .4 * Math.max(.18, 1 - distance / 32);
      this.shot(volume, name === 'enemyShot');
      return;
    } else if (name === 'shotgun') {
      this.shot(1.05, false);
      return;
    } else if (name === 'rocket') {
      this.noise(now, .24, .32, 900);
      end = this.tone(now, .31, 280, 72, .35, 'sawtooth');
    } else if (name === 'flame') {
      end = this.noise(now, .18, .14, 1100);
    } else if (name === 'electric') {
      this.noise(now, .13, .2, 1800, 'highpass');
      end = this.tone(now, .19, 980, 170, .27, 'sawtooth');
    } else if (name === 'explosion') {
      this.noise(now, .22, .52, 1300);
      this.tone(now, .42, 105, 29, .58, 'sine');
      end = this.noise(now + .05, .5, .32, 300);
    } else {
      const presets = {
        hit: [160, 48, .16, 'sawtooth', .22],
        dash: [220, 700, .15, 'triangle', .22],
        pickup: [520, 1100, .22, 'sine', .18],
        warning: [600, 360, .3, 'triangle', .15]
      };
      const [from, to, duration, type, level] = presets[name] || presets.hit;
      end = this.tone(now, duration, from, to, level, type);
    }
    end.addEventListener('ended', () => { this.active--; }, { once: true });
  }
}
```


## src/combat.js

```javascript
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { TILE, dist, segmentCircle } from './core.js';
import { part, ring, material, pickupModel } from './models.js';
function playerRoundGeometry(){
  const positions=[],colors=[],color=new THREE.Color();
  for(const [tint,sx,sy,sz,y,z] of [[0x06354b,.3,.3,.86,0,0],[0x31eaff,.19,.075,.65,.15,0],[0xf4ffff,.12,.08,.16,.16,.32]]){
    const shape=new THREE.SphereGeometry(.5,10,6).toNonIndexed();shape.scale(sx,sy,sz);shape.translate(0,y,z);color.setHex(tint);
    const points=shape.getAttribute('position');for(let i=0;i<points.count;i++){positions.push(points.getX(i),points.getY(i),points.getZ(i));colors.push(color.r,color.g,color.b);}shape.dispose();
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();return geometry;
}
function specialRoundGeometry(kind){
  const positions=[],colors=[],color=new THREE.Color();
  const shapes=kind==='rocket'?
    [[new THREE.CylinderGeometry(.15,.17,.53,6),0xf36d38,Math.PI/2,0,0,0],[new THREE.ConeGeometry(.15,.27,6),0xfff1b1,Math.PI/2,0,0,.4],[new THREE.BoxGeometry(.35,.06,.16),0x6e4542,0,0,0,-.3],[new THREE.BoxGeometry(.06,.35,.16),0x6e4542,0,0,0,-.3]]:
    [[new THREE.OctahedronGeometry(.16,0),0xf5ad38,0,0,0,0],[new THREE.OctahedronGeometry(.085,0),0xffffff,0,0,0,.13]];
  for(const [shape,tint,rotation,x,y,z] of shapes){shape.rotateX(rotation);shape.translate(x,y,z);const flat=shape.index?shape.toNonIndexed():shape,points=flat.getAttribute('position');color.setHex(tint);for(let i=0;i<points.count;i++){positions.push(points.getX(i),points.getY(i),points.getZ(i));colors.push(color.r,color.g,color.b);}if(flat!==shape)flat.dispose();shape.dispose();}
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();return geometry;
}
export class Combat {
  constructor(game){this.game=game;this.playerRoundGeometry=playerRoundGeometry();this.rocketGeometry=specialRoundGeometry('rocket');this.pelletGeometry=specialRoundGeometry('pellet');this.playerRoundMaterial=new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false});this.bullets=Array.from({length:CONFIG.combat.maxBullets},()=>{const mesh=part(game.scene,'sphere',0xf05b72,0,0,0,.17,.17,.65);mesh.visible=false;return {mesh,active:false};});this.enemyRoundGeometry=this.bullets[0].mesh.geometry;this.shells=Array.from({length:CONFIG.combat.maxMortars},()=>{const marker=ring(game.scene,0xef6867,2.6),mesh=part(game.scene,'sphere',0xf17963,0,0,0,.4);marker.visible=mesh.visible=false;return {marker,mesh,active:false};});this.activeBullets=new Set();this.activeShells=new Set();this.pickups=[];this.tip=new THREE.Vector3();}
  firePlayer(player){
    const type=player.weapon,weapon=CONFIG.weapons[type];
    if(!weapon)return this.shoot(player,'player',CONFIG.player.damage)?CONFIG.player.fireInterval:0;
    let fired=false;
    if(type==='rocket')fired=this.shoot(player,'player',weapon.damage,0,'rocket');
    else if(type==='shotgun'){for(const offset of [-.3,-.18,-.06,.06,.18,.3])fired=this.shoot(player,'player',weapon.damage,offset,'pellet',!fired,false)||fired;if(fired)this.game.effects.shotgunMuzzle(this.tip.x,this.tip.y,this.tip.z,player.aim);}
    else if(type==='flame')fired=this.flame(player,weapon);
    else if(type==='electric')fired=this.electric(player,weapon);
    if(!fired)return 0;
    player.ammo--;
    if(player.ammo<=0){player.weapon='normal';player.ammo=0;this.game.ui.toast('HẾT ĐẠN ĐẶC BIỆT · PHÁO THƯỜNG');}
    return weapon.interval;
  }
  flame(player,weapon){
    const g=this.game,grid=g.world.grid,range=6.5,angle=player.aim,hitWalls=new Set();let visualRange=range;
    for(const e of g.enemies.list){if(e.dead)continue;const distance=dist(player,e),bearing=Math.atan2(e.x-player.x,e.z-player.z),difference=Math.abs(Math.atan2(Math.sin(bearing-angle),Math.cos(bearing-angle)));if(distance>range||difference>.43||grid.trace(player.x,player.z,e.x,e.z))continue;g.enemies.hurt(e,weapon.damage,true);if(!e.dead){e.burn=Math.max(e.burn,1.5);e.burnTick=Math.min(e.burnTick||.45,.45);}}
    for(const offset of [-.34,0,.34]){const a=angle+offset,x=player.x+Math.sin(a)*range,z=player.z+Math.cos(a)*range,wall=grid.trace(player.x,player.z,x,z,.1);if(wall){visualRange=Math.min(visualRange,range*wall.t);if(!hitWalls.has(wall.i)){hitWalls.add(wall.i);g.world.damage(wall.i,weapon.damage,g);}}}
    g.effects.flameJet(player.x,player.z,angle,visualRange);
    player.model.flashTime=.08;g.audio.play('flame');return true;
  }
  electric(player,weapon){
    const g=this.game,grid=g.world.grid,used=new Set();let source=player,hit=0;
    for(let jump=0;jump<4;jump++){
      let best=null,bestDistance=Infinity;
      for(const e of g.enemies.list){if(e.dead||used.has(e))continue;const distance=dist(source,e);if(distance>(jump===0?11:5.2)||distance>=bestDistance||grid.trace(source.x,source.z,e.x,e.z))continue;if(jump===0){const bearing=Math.atan2(e.x-player.x,e.z-player.z),difference=Math.abs(Math.atan2(Math.sin(bearing-player.aim),Math.cos(bearing-player.aim)));if(difference>.5)continue;}best=e;bestDistance=distance;}
      if(!best)break;used.add(best);g.effects.arc(source.x,source.z,best.x,best.z);g.effects.electricBurst(best.x,best.z);g.enemies.hurt(best,Math.round(weapon.damage*(1-jump*.18)),true);if(!best.dead)best.stun=Math.max(best.stun,.35);source=best;hit++;
    }
    if(!hit){const x=player.x+Math.sin(player.aim)*11,z=player.z+Math.cos(player.aim)*11,wall=grid.trace(player.x,player.z,x,z,.1),end=wall?{x:player.x+(x-player.x)*wall.t,z:player.z+(z-player.z)*wall.t}:{x,z};g.effects.arc(player.x,player.z,end.x,end.z);g.effects.electricBurst(end.x,end.z);if(wall)g.world.damage(wall.i,weapon.damage*.6,g);}
    player.model.flashTime=.1;g.audio.play('electric');return true;
  }
  shoot(owner,team,damage,offset=0,kind='normal',sound=true,muzzleEffect=true){
    const b=this.bullets.find(b=>!b.active);if(!b)return false;
    const g=this.game,m=owner.model;m.root.position.set(owner.x,0,owner.z);m.turret.rotation.y=owner.aim;m.root.updateMatrixWorld(true);m.tip.getWorldPosition(this.tip);
    const angle=owner.aim+offset,speed=kind==='rocket'?17:kind==='pellet'?29:team==='player'?CONFIG.combat.bulletSpeed:CONFIG.combat.enemyBulletSpeed*(1+Math.min(.45,g.time/700));
    // Check the breech-to-muzzle segment too: a muzzle can overlap a wall while the hull cannot.
    const obstruction=g.world.grid.trace(owner.x,owner.z,this.tip.x,this.tip.z,.1);
    const playSound=()=>{if(sound)g.audio.play(team!=='player'?'enemyShot':kind==='rocket'?'rocket':kind==='pellet'?'shotgun':'shot',team==='player'?0:dist(owner,g.player));};
    if(obstruction){if(kind==='rocket')this.explode(this.tip.x,this.tip.z,2.8,damage,'player','rocket');else g.world.damage(obstruction.i,damage,g);m.flashTime=.1;if(muzzleEffect)g.effects.emit(this.tip.x,.8,this.tip.z,team==='player'?0x59efff:0xffd790,6,.22,1.25);playSound();return true;}
    Object.assign(b,{active:true,x:this.tip.x,y:this.tip.y,z:this.tip.z,vx:Math.sin(angle)*speed,vz:Math.cos(angle)*speed,team,damage,kind,angle,trail:0,life:kind==='pellet'?.46:kind==='rocket'?2.5:3.5});this.activeBullets.add(b);b.mesh.position.set(b.x,b.y,b.z);b.mesh.rotation.y=angle;b.mesh.geometry=kind==='rocket'?this.rocketGeometry:kind==='pellet'?this.pelletGeometry:team==='player'?this.playerRoundGeometry:this.enemyRoundGeometry;
    if(kind==='rocket')b.mesh.scale.setScalar(1.2);else if(kind==='pellet')b.mesh.scale.setScalar(1.35);else b.mesh.scale.set(team==='player'?1:.17,team==='player'?1:.17,team==='player'?1:.65);
    b.mesh.material=team==='player'||kind==='rocket'||kind==='pellet'?this.playerRoundMaterial:material(0xf05b72,true);b.mesh.visible=true;
    m.flashTime=.1;if(muzzleEffect)g.effects.emit(b.x,.9,b.z,kind==='rocket'?0xffad68:team==='player'?0x63f1ff:0xffd19b,6,.18,1.3);playSound();return true;
  }
  mortar(owner,x,z){const s=this.shells.find(s=>!s.active);if(!s)return;Object.assign(s,{active:true,x,z,startX:owner.x,startZ:owner.z,life:1.65,max:1.65,damage:owner.damage});this.activeShells.add(s);s.marker.visible=s.mesh.visible=true;s.marker.position.set(x,.12,z);s.marker.scale.setScalar(2.6);this.game.audio.play('warning');}
  explode(x,z,radius,damage,team,visual='normal'){
    const g=this.game;if(visual==='rocket')g.effects.rocketExplosion(x,z,radius/3);else g.effects.explosion(x,z,radius/3);g.audio.play('explosion');
    if(team!=='player'&&dist({x,z},g.player)<radius+g.player.radius&&!g.world.grid.trace(x,z,g.player.x,g.player.z))g.player.hurt(damage,g);
    if(team!=='enemy')for(const e of g.enemies.list)if(!e.dead&&dist({x,z},e)<radius+e.radius&&!g.world.grid.trace(x,z,e.x,e.z))g.enemies.hurt(e,damage);
    // Destroy first, recurse second through World.damage: exploded barrels cannot retrigger themselves.
    const targets=[];for(let i=0;i<g.world.grid.tiles.length;i++)if(Number.isFinite(g.world.grid.hp[i])&&dist({x,z},g.world.grid.center(i))<radius)targets.push(i);
    for(const i of targets)g.world.damage(i,damage,g);
  }
  update(dt){const g=this.game,grid=g.world.grid;
    for(const b of this.activeBullets){const nx=b.x+b.vx*dt,nz=b.z+b.vz*dt,wall=grid.trace(b.x,b.z,nx,nz,.1);let best=wall?wall.t:Infinity,target=null;
      for(const e of b.team==='player'?g.enemies.list:[g.player]){if(e.dead||e.hp<=0)continue;const t=segmentCircle(b.x,b.z,nx,nz,e.x,e.z,e.radius+.11);if(t!==null&&t<best){best=t;target=e;}}
      if(best!==Infinity){const x=b.x+(nx-b.x)*best,z=b.z+(nz-b.z)*best;if(b.kind==='rocket')this.explode(x,z,2.8,b.damage,'player','rocket');else{g.effects.emit(x,.7,z,b.kind==='pellet'?0xffc45e:b.team==='player'?0x72f2ff:0xffcc9e,b.kind==='pellet'?4:7,.3,1.3);if(target){if(b.team==='player')g.enemies.hurt(target,b.damage);else target.hurt(b.damage,g);}else{g.effects.emit(x,.3,z,0xc9bdac,5,.5,1.5);g.world.damage(wall.i,b.damage,g);}}b.active=false;}
      b.x=nx;b.z=nz;b.life-=dt;if(b.life<=0||Math.abs(nx)>grid.half||Math.abs(nz)>grid.half)b.active=false;if(b.active&&b.kind==='rocket'){b.trail-=dt;if(b.trail<=0){b.trail=.09;g.effects.rocketTrail(nx,b.y,nz,b.angle);}}b.mesh.visible=b.active;b.mesh.position.set(nx,b.y,nz);if(!b.active)this.activeBullets.delete(b);
    }
    for(const s of this.activeShells){s.life-=dt;const t=1-s.life/s.max;s.mesh.position.set(s.startX+(s.x-s.startX)*t,1+Math.sin(t*Math.PI)*8,s.startZ+(s.z-s.startZ)*t);if(s.life<=0){s.active=false;this.activeShells.delete(s);s.mesh.visible=s.marker.visible=false;this.explode(s.x,s.z,2.6,s.damage,'enemy');}}
    for(let i=this.pickups.length-1;i>=0;i--){const p=this.pickups[i];p.life-=dt;if(dist(p,g.player)<1.2){const player=g.player,names=['+30 GIÁP','ĐẦY NĂNG LƯỢNG','TĂNG TỐC · 8s','BẮN NHANH · 8s'];if(p.type===0)player.hp=Math.min(CONFIG.player.hp,player.hp+30);if(p.type===1)player.stamina=CONFIG.player.stamina;if(p.type===2)player.speedBuff=8;if(p.type===3)player.fireBuff=8;if(p.type>=4){const type=['rocket','shotgun','flame','electric'][p.type-4];player.equipWeapon(type);names[p.type]=`${CONFIG.weapons[type].name} ×${player.ammo}`;g.ui.toast(`NHẶT ${CONFIG.weapons[type].name} · ${player.ammo} ĐẠN`);}g.audio.play('pickup');g.effects.emit(p.x,1,p.z,p.type>=4?CONFIG.weapons[player.weapon].color:0xb6ffce,7,.55);g.effects.popup(p.x,p.z,names[p.type],p.type>=4?'#fff0bf':'#a9ffe2');p.life=0;}if(p.life<=0){p.mesh.removeFromParent();this.pickups.splice(i,1);}}
  }
  spawnPickup(type,x,z){const g=this.game;if(this.pickups.length>=CONFIG.combat.maxPickups)return null;const mesh=pickupModel(type);mesh.position.set(x,.8,z);g.scene.add(mesh);const pickup={x,z,type,mesh,life:18};this.pickups.push(pickup);return pickup;}
  drop(x,z){const grid=this.game.world.grid;if(this.pickups.length>=CONFIG.combat.maxPickups||grid.random()>.65)return;const roll=grid.random(),type=roll<.4?4+Math.min(3,Math.floor(roll/.4*4)):Math.min(3,Math.floor((roll-.4)/.6*4));this.spawnPickup(type,x,z);}
  clear(){for(const b of this.activeBullets){b.active=false;b.mesh.visible=false;}for(const s of this.activeShells){s.active=false;s.mesh.visible=s.marker.visible=false;}this.activeBullets.clear();this.activeShells.clear();for(const p of this.pickups)p.mesh.removeFromParent();this.pickups=[];}
}
```


## src/config.js

```javascript
export const CONFIG = {
  step: 1 / 30,
  world: { size: 25, cell: 2.4, phaseDuration: 60 },
  player: { hp: 100, stamina: 100, speed: 6, radius: .62, fireInterval: .25, damage: 28,
    dashCost: 30, dashDuration: .18, dashInvulnerability: .12, dashSpeed: 22, dashCooldown: .5, staminaRegen: 23, hurtGrace: .65 },
  director: { maxEnemies: 16, spawnStart: 4.2, spawnMin: 1.35, spawnWarning: 1.5, safeRadius: 11, eliteEvery: 90, assaultFirst: 24, assaultBase: 38, assaultMin: 28, assaultGap: .6 },
  combat: { maxBullets: 180, maxMortars: 12, bulletSpeed: 25, enemyBulletSpeed: 10, comboWindow: 4, maxCombo: 5, survivalScore: 5, maxPickups: 16 },
  weapons: {
    rocket: { name: 'ROCKET', ammo: 8, maxAmmo: 16, interval: .62, damage: 62, color: 0xf18c57 },
    shotgun: { name: 'SHOTGUN', ammo: 20, maxAmmo: 40, interval: .46, damage: 12, color: 0xf3c96c },
    flame: { name: 'LỬA', ammo: 50, maxAmmo: 100, interval: .1, damage: 7, color: 0xf07542 },
    electric: { name: 'ĐIỆN', ammo: 18, maxAmmo: 36, interval: .42, damage: 34, color: 0x6bd9f2 },
  },
  effects: { high: 96, popups: 16 },
  performance: { softwareFPS: 24, highFPS: 60, idleFPS: 4, uiFPS: 5 },
  colors: { mint: 0x74d6b2, sky: 0x8fcdda, yellow: 0xffd36c, coral: 0xed7765, road: 0xe8e4d7, grass: 0xb5d3a1, ink: 0x263f44, steel: 0x8babb4, water: 0x7ec8db },
};
export const ENEMIES = {
  scout: { name: 'Trinh sát', hp: 40, speed: 3.5, radius: .51, scale: .78, color: 0xf28b67, interval: 2.3, damage: 10, points: 100, range: 5 },
  gunner: { name: 'Xạ thủ', hp: 65, speed: 2.4, radius: .62, scale: 1, color: 0xdc6383, interval: 3, damage: 12, points: 180, range: 10 },
  heavy: { name: 'Thiết giáp', hp: 145, speed: 1.45, radius: .83, scale: 1.3, color: 0x966fb5, interval: 3.6, damage: 25, points: 350, range: 11 },
  mortar: { name: 'Pháo cối', hp: 65, speed: 1.8, radius: .62, scale: 1, color: 0xe0a544, interval: 4.6, damage: 24, points: 250, range: 15 },
  elite: { name: 'ĐẠI ÚY KẸO THÉP', hp: 650, speed: 1.9, radius: .91, scale: 1.42, color: 0xcf5474, interval: 2.5, damage: 20, points: 1800, range: 12 },
};
```


## src/core.js

```javascript
import { CONFIG } from './config.js';
export const TILE = { ROAD: 0, BRICK: 1, STEEL: 2, HOUSE: 3, TREE: 4, BARREL: 5, GRASS: 6, HIGHRISE: 7, SHOP: 8, RUBBLE: 9 };
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
export const walkable = t => t === TILE.ROAD || t === TILE.GRASS || t === TILE.RUBBLE;
export const solidShot = t => !walkable(t);
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function screenDirection(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: (x + y) / length / Math.SQRT2, z: (-x + y) / length / Math.SQRT2 };
}
export function turn(current, target, factor) {
  return current + Math.atan2(Math.sin(target - current), Math.cos(target - current)) * factor;
}
// Earliest segment / expanded AABB intersection, including a segment starting inside.
export function segmentBox(ax, az, bx, bz, minX, minZ, maxX, maxZ) {
  let lo = 0, hi = 1;
  for (const [a, d, min, max] of [[ax, bx-ax, minX, maxX], [az, bz-az, minZ, maxZ]]) {
    if (Math.abs(d) < 1e-9) { if (a < min || a > max) return null; }
    else { let t1 = (min-a)/d, t2 = (max-a)/d; if (t1>t2) [t1,t2]=[t2,t1]; lo=Math.max(lo,t1); hi=Math.min(hi,t2); if(lo>hi) return null; }
  }
  return lo;
}
export function segmentCircle(ax, az, bx, bz, x, z, radius) {
  const dx=bx-ax, dz=bz-az, ox=ax-x, oz=az-z, c=ox*ox+oz*oz-radius*radius;
  if (c<=0) return 0;
  const a=dx*dx+dz*dz, b=2*(ox*dx+oz*dz), discriminant=b*b-4*a*c;
  if (!a || discriminant<0) return null;
  const t=(-b-Math.sqrt(discriminant))/(2*a); return t>=0&&t<=1 ? t : null;
}
export class Grid {
  constructor(seed=1) {
    this.size=CONFIG.world.size; this.cell=CONFIG.world.cell; this.half=this.size*this.cell/2;
    this.random=rng(seed); this.seed=seed; this.version=0; this.tiles=new Uint8Array(this.size*this.size);
    this.hp=new Float32Array(this.tiles.length); this.generate();
  }
  index(x,z) { return z*this.size+x; }
  coords(i) { return {x:i%this.size,z:Math.floor(i/this.size)}; }
  center(i) { const p=this.coords(i); return {x:(p.x+.5)*this.cell-this.half,z:(p.z+.5)*this.cell-this.half}; }
  at(x,z) { const c=Math.floor((x+this.half)/this.cell), r=Math.floor((z+this.half)/this.cell); return c<0||r<0||c>=this.size||r>=this.size ? -1:this.index(c,r); }
  neighbors(i) { const {x,z}=this.coords(i), out=[]; if(x>0)out.push(i-1); if(x<this.size-1)out.push(i+1); if(z>0)out.push(i-this.size); if(z<this.size-1)out.push(i+this.size); return out; }
  obstacleTile(tiles,x,z) {
    const choices=[TILE.BRICK,TILE.STEEL,TILE.HOUSE,TILE.TREE,TILE.BARREL];
    const weights=[.24,.09,.42,.17,.08];
    // Neighbour bias grows small districts instead of alternating one prop per cell.
    const neighbours=[];
    if(x>0&&!walkable(tiles[this.index(x-1,z)]))neighbours.push(tiles[this.index(x-1,z)]);
    if(z>0&&!walkable(tiles[this.index(x,z-1)]))neighbours.push(tiles[this.index(x,z-1)]);
    if(neighbours.length&&this.random()<.58){const type=neighbours[Math.floor(this.random()*neighbours.length)];if(type!==TILE.BARREL)return type;}
    let roll=this.random();for(let i=0;i<choices.length;i++){roll-=weights[i];if(roll<=0)return choices[i];}return TILE.BRICK;
  }
  carve(tiles,x,z,radius=0,type=TILE.ROAD) {
    for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){
      const px=x+dx,pz=z+dz;if(px>=0&&pz>=0&&px<this.size&&pz<this.size&&Math.abs(dx)+Math.abs(dz)<=radius)tiles[this.index(px,pz)]=type;
    }
  }
  carvePath(tiles,from,to,width=0) {
    let x=from.x,z=from.z,guard=this.size*this.size;
    this.carve(tiles,x,z,width);
    while((x!==to.x||z!==to.z)&&guard-->0){
      const dx=to.x-x,dz=to.z-z,preferX=Math.abs(dx)/(Math.abs(dx)+Math.abs(dz)||1);
      // A little sideways drift removes long, ruler-straight avenues while the
      // target bias still guarantees that every branch joins the same network.
      if(this.random()<.08){
        if(this.random()<.5&&z>1&&z<this.size-2)z+=this.random()<.5?-1:1;
        else if(x>1&&x<this.size-2)x+=this.random()<.5?-1:1;
      }else if(dx&&(!dz||this.random()<preferX))x+=Math.sign(dx);
      else if(dz)z+=Math.sign(dz);
      x=clamp(x,1,this.size-2);z=clamp(z,1,this.size-2);this.carve(tiles,x,z,width);
      if(this.random()<.045)this.carve(tiles,x,z,1);
    }
  }
  zoneDistricts(tiles) {
    const mid=(this.size-1)/2,eligible=i=>!walkable(tiles[i]),fronts=[];
    for(let i=0;i<tiles.length;i++)if(eligible(i)&&this.neighbors(i).some(n=>walkable(tiles[n])))fronts.push(i);
    // Pick one compact downtown instead of scattering towers through residential
    // blocks. The jitter changes the skyline per seed without breaking zoning.
    const downtown={x:mid+(this.random()-.5)*4,z:mid+(this.random()-.5)*4};
    const ranked=fronts.map(i=>{const p=this.coords(i);return {i,score:Math.hypot(p.x-downtown.x,p.z-downtown.z)+this.random()*1.8};}).sort((a,b)=>a.score-b.score);
    const anchor=this.coords(ranked[0]?.i??this.index(mid,mid)),towers=[];
    const towerPool=ranked.filter(({i})=>{const p=this.coords(i);return Math.hypot(p.x-anchor.x,p.z-anchor.z)<6.5;});
    for(const {i} of towerPool){if(towers.length>=9)break;tiles[i]=TILE.HIGHRISE;towers.push(i);}
    for(const {i} of ranked)if(towers.length<7&&tiles[i]!==TILE.HIGHRISE){tiles[i]=TILE.HIGHRISE;towers.push(i);}
    const nearTower=i=>{const p=this.coords(i);return towers.some(t=>{const q=this.coords(t);return Math.max(Math.abs(p.x-q.x),Math.abs(p.z-q.z))<=1;});};
    // A one-cell public plaza gives the downtown skyline a believable setback;
    // homes and shops begin outside it instead of touching tower footprints.
    const plaza=[];for(let i=0;i<tiles.length;i++)if(tiles[i]!==TILE.HIGHRISE&&nearTower(i)&&!walkable(tiles[i]))plaza.push(i);
    let opened=true;while(opened){opened=false;for(const i of plaza)if(!walkable(tiles[i])&&this.neighbors(i).some(n=>walkable(tiles[n]))){tiles[i]=TILE.ROAD;opened=true;}}
    const shops=fronts.filter(i=>tiles[i]!==TILE.HIGHRISE&&eligible(i)&&!nearTower(i)).map(i=>{const p=this.coords(i);return {i,score:Math.hypot(p.x-downtown.x,p.z-downtown.z)+this.random()*5};}).sort((a,b)=>a.score-b.score);
    let shopCount=tiles.reduce((n,t)=>n+(t===TILE.SHOP),0);for(const {i} of shops){if(shopCount>=14)break;tiles[i]=TILE.SHOP;shopCount++;}
  }
  makeLayout() {
    const tiles=new Uint8Array(this.tiles.length);
    for(let z=0;z<this.size;z++)for(let x=0;x<this.size;x++)tiles[this.index(x,z)]=this.obstacleTile(tiles,x,z);
    const center={x:Math.floor(this.size/2),z:Math.floor(this.size/2)},nodes=[center];
    this.carve(tiles,center.x,center.z,1);
    // Random landmarks form a connected street tree. Connecting some landmarks
    // to a second parent adds loops, alternate routes and irregular intersections.
    for(let n=0;n<10;n++){
      const point={x:2+Math.floor(this.random()*(this.size-4)),z:2+Math.floor(this.random()*(this.size-4))};
      let parent=nodes[0],best=Infinity;for(const node of nodes){const d=Math.abs(node.x-point.x)+Math.abs(node.z-point.z);if(d<best){best=d;parent=node;}}
      this.carvePath(tiles,point,parent,this.random()<.08?1:0);this.carve(tiles,point.x,point.z,this.random()<.18?2:1);nodes.push(point);
      if(n>3&&this.random()<.28)this.carvePath(tiles,point,nodes[Math.floor(this.random()*(nodes.length-1))],0);
    }
    // Four entrances make every generated city approachable from every side.
    const gates=[{x:1,z:2+Math.floor(this.random()*(this.size-4))},{x:this.size-2,z:2+Math.floor(this.random()*(this.size-4))},{x:2+Math.floor(this.random()*(this.size-4)),z:1},{x:2+Math.floor(this.random()*(this.size-4)),z:this.size-2}];
    for(const gate of gates){let parent=nodes[0],best=Infinity;for(const node of nodes){const d=Math.abs(node.x-gate.x)+Math.abs(node.z-gate.z);if(d<best){best=d;parent=node;}}this.carvePath(tiles,gate,parent,0);this.carve(tiles,gate.x,gate.z,0);}
    // Four compact parks replace arbitrary green patches. Each one touches a
    // street and receives trees while connectivity is checked after every tree.
    const roads=[],parkSeeds=[];tiles.forEach((t,i)=>{if(t===TILE.ROAD)roads.push(i);});
    for(let n=0;n<4;n++){
      const sites=[];for(const road of roads)for(const i of this.neighbors(road))if(tiles[i]!==TILE.ROAD){
        const p=this.coords(i);if(Math.hypot(p.x-center.x,p.z-center.z)>3&&parkSeeds.every(q=>Math.hypot(p.x-q.x,p.z-q.z)>5))sites.push({road,seed:p});
      }
      if(!sites.length)continue;const site=sites[Math.floor(this.random()*sites.length)],road=site.road,seed=site.seed,radius=n===0&&this.random()<.55?2:1,park=[];parkSeeds.push(seed);
      for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++){const x=seed.x+dx,z=seed.z+dz;if(x>0&&z>0&&x<this.size-1&&z<this.size-1&&Math.abs(dx)+Math.abs(dz)<=radius+1){const i=this.index(x,z);tiles[i]=TILE.GRASS;park.push(i);}}
      tiles[road]=TILE.ROAD;
      const edge=park.filter(i=>i!==road&&this.neighbors(i).some(j=>!park.includes(j))).sort(()=>this.random()-.5);let planted=0;
      for(const i of edge){if(planted>=2)break;tiles[i]=TILE.TREE;if(this.connected(tiles))planted++;else tiles[i]=TILE.GRASS;}
    }
    this.carve(tiles,center.x,center.z,1);
    // Remove the rare accidental full-width straight line without sacrificing
    // connectivity. This keeps every seed from reading like a regular grid.
    for(let axis=0;axis<2;axis++)for(let line=1;line<this.size-1;line++){
      const cells=Array.from({length:this.size},(_,n)=>axis?this.index(line,n):this.index(n,line));
      if(!cells.every(i=>walkable(tiles[i])))continue;
      for(let tries=0;tries<20;tries++){const i=cells[2+Math.floor(this.random()*(this.size-4))];if(i===this.index(center.x,center.z))continue;const old=tiles[i];tiles[i]=TILE.HOUSE;if(this.connected(tiles))break;tiles[i]=old;}
    }
    this.zoneDistricts(tiles);
    return tiles;
  }
  generate() {
    this.tiles.set(this.makeLayout());
    this.resetHP();this.version++;
  }
  tileHP(type) { return type===TILE.BRICK?55:type===TILE.STEEL?140:type===TILE.HOUSE?90:type===TILE.TREE?35:type===TILE.BARREL?20:type===TILE.HIGHRISE?180:type===TILE.SHOP?75:Infinity; }
  resetHP() { for(let i=0;i<this.tiles.length;i++)this.hp[i]=this.tileHP(this.tiles[i]); }
  flood(start,tiles=this.tiles) {
    const seen=new Uint8Array(tiles.length); if(start<0||!walkable(tiles[start]))return seen;
    const queue=[start];seen[start]=1;
    for(let q=0;q<queue.length;q++)for(const n of this.neighbors(queue[q]))if(!seen[n]&&walkable(tiles[n])){seen[n]=1;queue.push(n);}
    return seen;
  }
  connected(tiles=this.tiles) { const seen=this.flood(this.index(12,12),tiles);return tiles.every((t,i)=>!walkable(t)||seen[i]); }
  path(start,end) {
    if(start<0||end<0||!walkable(this.tiles[start])||!walkable(this.tiles[end]))return [];
    const parent=new Int32Array(this.tiles.length).fill(-1),queue=[start];parent[start]=start;
    for(let q=0;q<queue.length && parent[end]<0;q++)for(const n of this.neighbors(queue[q]))if(parent[n]<0&&walkable(this.tiles[n])){parent[n]=queue[q];queue.push(n);}
    if(parent[end]<0)return [];const result=[];for(let i=end;i!==start;i=parent[i])result.push(i);return result.reverse();
  }
  free(x,z,r=.62,tiles=this.tiles) {
    if(Math.abs(x)+r>this.half||Math.abs(z)+r>this.half)return false;
    const minX=Math.floor((x-r+this.half)/this.cell),maxX=Math.floor((x+r+this.half)/this.cell);
    const minZ=Math.floor((z-r+this.half)/this.cell),maxZ=Math.floor((z+r+this.half)/this.cell);
    for(let cz=minZ;cz<=maxZ;cz++)for(let cx=minX;cx<=maxX;cx++) {
      if(walkable(tiles[this.index(cx,cz)]))continue;
      const left=cx*this.cell-this.half,top=cz*this.cell-this.half;
      if(Math.hypot(x-clamp(x,left,left+this.cell),z-clamp(z,top,top+this.cell))<r)return false;
    }return true;
  }
  move(entity,dx,dz) {
    const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.2));
    for(let n=0;n<steps;n++){if(this.free(entity.x+dx/steps,entity.z,entity.radius))entity.x+=dx/steps;if(this.free(entity.x,entity.z+dz/steps,entity.radius))entity.z+=dz/steps;}
  }
  trace(ax,az,bx,bz,radius=0) {
    let hit=null;
    const minX=clamp(Math.floor((Math.min(ax,bx)-radius+this.half)/this.cell),0,this.size-1),maxX=clamp(Math.floor((Math.max(ax,bx)+radius+this.half)/this.cell),0,this.size-1);
    const minZ=clamp(Math.floor((Math.min(az,bz)-radius+this.half)/this.cell),0,this.size-1),maxZ=clamp(Math.floor((Math.max(az,bz)+radius+this.half)/this.cell),0,this.size-1);
    for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
      const i=this.index(x,z);if(!solidShot(this.tiles[i]))continue;
      const left=x*this.cell-this.half,top=z*this.cell-this.half;
      const t=segmentBox(ax,az,bx,bz,left-radius,top-radius,left+this.cell+radius,top+this.cell+radius);
      if(t!==null&&(!hit||t<hit.t))hit={i,t};
    }return hit;
  }
  damage(i,amount) { if(i<0||!Number.isFinite(this.hp[i]))return false;const destroyed=this.tiles[i];this.hp[i]-=amount;if(this.hp[i]>0)return false;this.tiles[i]=destroyed===TILE.TREE||destroyed===TILE.BARREL?TILE.GRASS:TILE.RUBBLE;this.hp[i]=Infinity;this.version++;return true; }
}
export function readStorage(key,fallback) { try { const value=localStorage.getItem(key); return value===null?fallback:JSON.parse(value); } catch { return fallback; } }
export function writeStorage(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); } catch { /* Private browsing: the current run still works. */ } }
```


## src/effects.js

```javascript
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { ring } from './models.js';
export class Effects {
  constructor(scene,camera,settings){
    this.scene=scene;this.camera=camera;this.settings=settings;this.shake=0;this.particles=[];this.active=new Set();this.cursor=0;
    this.geometry=new THREE.IcosahedronGeometry(1,0);this.material=new THREE.MeshBasicMaterial({vertexColors:false,transparent:true,opacity:.85,depthWrite:false});
    this.mesh=new THREE.InstancedMesh(this.geometry,this.material,CONFIG.effects.high);this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;scene.add(this.mesh);this.dummy=new THREE.Object3D();this.color=new THREE.Color();this.limit=CONFIG.effects.high;
    for(let i=0;i<CONFIG.effects.high;i++){this.particles.push({life:0});this.dummy.scale.setScalar(0);this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);this.mesh.setColorAt(i,this.color);}
    this.rings=Array.from({length:6},()=>{const m=ring(scene,0xffdf9c);m.material=m.material.clone();m.material.transparent=true;m.material.depthWrite=false;m.material.toneMapped=false;m.visible=false;return {mesh:m,life:0,max:.38};});
    this.arcs=Array.from({length:8},()=>{const positions=new Float32Array(21),coreVertices=new Float32Array(108),haloVertices=new Float32Array(108);const makeRibbon=(data,color,opacity)=>{const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(data,3).setUsage(THREE.DynamicDrawUsage));const line=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}));line.frustumCulled=false;line.visible=false;scene.add(line);return line;};return {line:makeRibbon(coreVertices,0xf3ffff,1),halo:makeRibbon(haloVertices,0x20bcef,.55),positions,coreVertices,haloVertices,life:0};});
    this.popups=Array.from({length:CONFIG.effects.popups},()=>{const element=document.createElement('span');element.className='score-popup';element.hidden=true;document.getElementById('popups').append(element);return {element,life:0};});
    this.project=new THREE.Vector3();
  }
  particle(x,y,z,color,life,size,vx,vy,vz){this.cursor=(this.cursor+1)%this.limit;const p=this.particles[this.cursor];p.x=x;p.y=y;p.z=z;p.vx=vx;p.vy=vy;p.vz=vz;p.life=life;p.max=life;p.size=size;p.color=color;this.active.add(this.cursor);this.mesh.setColorAt(this.cursor,this.color.setHex(color));}
  emit(x,y,z,color,count=8,life=.6,size=1){
    for(let i=0;i<count;i++)this.particle(x,y,z,color,life,(.05+Math.random()*.15)*size,(Math.random()-.5)*5,1+Math.random()*4,(Math.random()-.5)*5);this.mesh.instanceColor.needsUpdate=true;
  }
  setQuality(){this.limit=CONFIG.effects.high;this.mesh.count=this.limit;}
  shockwave(x,z,size,color=0xffdf9c){const r=this.rings.find(r=>r.life<=0)||this.rings[0];r.life=r.max;r.mesh.material.color.setHex(color);r.mesh.material.opacity=.8;r.mesh.position.set(x,.1,z);r.mesh.visible=true;r.size=size;this.shake=Math.max(this.shake,.1*size);}
  explosion(x,z,size=1){this.emit(x,.7,z,0xffffff,Math.round(7*size),.16,1.6);this.emit(x,.5,z,0xffaa68,Math.round(10*size),.42,1.25);this.emit(x,.2,z,0x8f9490,Math.round(7*size),.78,1.45);this.shockwave(x,z,size);}
  rocketTrail(x,y,z,angle){const sx=Math.sin(angle),sz=Math.cos(angle);this.particle(x-sx*.35,y,z-sz*.35,0x8d9694,.38,.19,-sx*.7,.45,-sz*.7);this.particle(x-sx*.2,y,z-sz*.2,0xffe4a0,.16,.12,-sx*1.6,.3,-sz*1.6);this.mesh.instanceColor.needsUpdate=true;}
  rocketExplosion(x,z,size=1){this.emit(x,.7,z,0xffffff,7,.14,1.8);this.emit(x,.55,z,0xff9d49,14,.38,1.55);this.emit(x,.25,z,0x697477,9,.65,1.35);this.shockwave(x,z,size,0xff9b50);}
  shotgunMuzzle(x,y,z,angle){const sx=Math.sin(angle),sz=Math.cos(angle),px=sz,pz=-sx;for(let i=0;i<7;i++){const d=.35+(i%3)*.37,spread=(i-3)*.11;this.particle(x+sx*d+px*spread,y,z+sz*d+pz*spread,i%2?0xffb94e:0xffffff,.17,.105+Math.abs(spread)*.15,sx*(3+i*.3)+px*spread*4,.4,sz*(3+i*.3)+pz*spread*4);}this.mesh.instanceColor.needsUpdate=true;}
  flameJet(x,z,angle,range){const sx=Math.sin(angle),sz=Math.cos(angle),px=sz,pz=-sx;for(let i=0;i<12;i++){const d=(range-.12)*(i+1)/13;if(d<=.05)break;const spread=(i%3-1)*Math.min(.48,d*.11),warm=i%3===0?0xfff5ad:i%3===1?0xffa344:0xf15d3c;this.particle(x+sx*d+px*spread,.58+(i%2)*.1,z+sz*d+pz*spread,warm,.21+i*.008,.17+d*.02,sx*(2+i*.15)+px*spread*.5,.65,sz*(2+i*.15)+pz*spread*.5);}this.mesh.instanceColor.needsUpdate=true;}
  electricBurst(x,z){this.particle(x,.9,z,0xffffff,.18,.23,0,1,0);for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.random()*.5;this.particle(x,.8,z,0x60eaff,.24,.11,Math.sin(a)*3,1.4,Math.cos(a)*3);}this.mesh.instanceColor.needsUpdate=true;}
  arc(ax,az,bx,bz){const arc=this.arcs.find(a=>a.life<=0)||this.arcs[0],p=arc.positions,dx=bx-ax,dz=bz-az,length=Math.max(.1,Math.hypot(dx,dz)),perpX=-dz/length,perpZ=dx/length;for(let i=0;i<7;i++){const t=i/6,j=i===0||i===6?0:(Math.random()-.5)*Math.min(1.1,length*.22),k=i*3;p[k]=ax+dx*t+perpX*j;p[k+1]=.93+Math.sin(t*Math.PI)*.3+(i%2)*.08;p[k+2]=az+dz*t+perpZ*j;}this.arcRibbon(p,arc.haloVertices,.17);this.arcRibbon(p,arc.coreVertices,.055);arc.line.geometry.attributes.position.needsUpdate=true;arc.halo.geometry.attributes.position.needsUpdate=true;arc.line.material.opacity=1;arc.halo.material.opacity=.55;arc.line.visible=arc.halo.visible=true;arc.life=.2;}
  arcRibbon(path,out,width){for(let i=0;i<6;i++){const a=i*3,b=a+3,o=i*18,dx=path[b]-path[a],dz=path[b+2]-path[a+2],length=Math.max(.001,Math.hypot(dx,dz)),nx=-dz/length*width,nz=dx/length*width;out.set([path[a]+nx,path[a+1],path[a+2]+nz,path[a]-nx,path[a+1],path[a+2]-nz,path[b]+nx,path[b+1],path[b+2]+nz,path[b]+nx,path[b+1],path[b+2]+nz,path[a]-nx,path[a+1],path[a+2]-nz,path[b]-nx,path[b+1],path[b+2]-nz],o);}}
  popup(x,z,text,color='#fff9d5'){const p=this.popups.find(p=>p.life<=0)||this.popups[0];Object.assign(p,{x,z,life:1.2});p.element.textContent=text;p.element.style.color=color;p.element.hidden=false;}
  update(dt){this.shake=Math.max(0,this.shake-dt);let changed=false;for(const i of this.active){const p=this.particles[i];p.life=Math.max(0,p.life-dt);if(p.life>0){p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;p.vy-=6*dt;this.dummy.position.set(p.x,Math.max(.07,p.y),p.z);this.dummy.rotation.set(0,0,0);this.dummy.scale.setScalar(p.size*Math.min(1,p.life*4));}else{this.dummy.scale.setScalar(0);this.active.delete(i);}this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);changed=true;}if(changed)this.mesh.instanceMatrix.needsUpdate=true;
    for(const r of this.rings)if(r.life>0){r.life=Math.max(0,r.life-dt);r.mesh.visible=r.life>0;r.mesh.scale.setScalar((r.max-r.life)*8*r.size);r.mesh.material.opacity=.8*r.life/r.max;}
    for(const a of this.arcs)if(a.life>0){a.life=Math.max(0,a.life-dt);a.line.visible=a.halo.visible=a.life>0;a.line.material.opacity=a.life/.2;a.halo.material.opacity=.55*a.life/.2;}
    for(const p of this.popups)if(p.life>0){p.life-=dt;p.element.hidden=p.life<=0;}
  }
  render(){for(const p of this.popups)if(p.life>0){this.project.set(p.x,2+(1.2-p.life),p.z).project(this.camera);p.element.style.transform=`translate(${(this.project.x*.5+.5)*innerWidth}px,${(-this.project.y*.5+.5)*innerHeight}px) translate(-50%,-50%)`;p.element.style.opacity=Math.min(1,p.life*3);}}
  clear(){for(const i of this.active){const p=this.particles[i];p.life=0;this.dummy.scale.setScalar(0);this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);}this.active.clear();this.mesh.instanceMatrix.needsUpdate=true;for(const p of this.popups){p.life=0;p.element.hidden=true;}for(const r of this.rings){r.life=0;r.mesh.visible=false;}for(const a of this.arcs){a.life=0;a.line.visible=a.halo.visible=false;}this.shake=0;}
}
```


## src/enemies.js

```javascript
import { CONFIG, ENEMIES } from './config.js';
import { dist, walkable, turn, clamp } from './core.js';
import { tankModel, ring, material } from './models.js';
export class Enemies {
  constructor(game){this.game=game;this.list=[];this.pending=[];this.spawnTimer=1.8;this.eliteTimer=CONFIG.director.eliteEvery;this.assaultTimer=CONFIG.director.assaultFirst;this.assaultRemaining=0;this.serial=0;this.dirty=false;}
  schedule(type){
    const g=this.game,grid=g.world.grid;
    const elitePresent=this.list.some(e=>!e.dead&&e.type==='elite')||this.pending.some(e=>e.type==='elite');
    // Keep one director slot for a scheduled elite even when regular enemies saturate the arena.
    const cap=CONFIG.director.maxEnemies-(type!=='elite'&&!elitePresent?1:0);
    if(this.list.length+this.pending.length>=cap)return false;
    // One flood-fill proves reachability for every spawn cell. Calling path()
    // for every candidate repeated the same BFS hundreds of times per spawn.
    const reachable=grid.flood(grid.at(g.player.x,g.player.z)),possible=[];
    for(let i=0;i<grid.tiles.length;i++)if(walkable(grid.tiles[i])&&reachable[i]){const p=grid.center(i),d=dist(p,g.player);if(d>CONFIG.director.safeRadius&&d<25&&grid.free(p.x,p.z,ENEMIES[type].radius)&&!this.list.some(e=>dist(e,p)<2)&&!this.pending.some(e=>dist(e,p)<2))possible.push(p);}
    if(!possible.length)return false;const p=possible[Math.floor(grid.random()*possible.length)],marker=ring(g.scene,0xe87870,1.3);marker.position.set(p.x,.09,p.z);this.pending.push({...p,type,remaining:CONFIG.director.spawnWarning,marker});return true;
  }
  spawn(p){const g=this.game,data=ENEMIES[p.type],factor=1+Math.min(.7,g.time/700),model=tankModel(data.color,p.type,data.scale),baseMaxHP=data.hp*factor,e={...data,type:p.type,x:p.x,z:p.z,baseMaxHP,hp:baseMaxHP,maxHP:baseMaxHP,zombie:false,angle:0,aim:0,model,dead:false,fire:1.2,path:[],pathVersion:-1,pathTimer:0,senseTimer:0,distance:Infinity,los:false,desired:0,charge:0,burst:0,burstTimer:0,id:this.serial++,smoke:0,flash:0,phase:0,burn:0,burnTick:0,stun:0};this.setZombie(e,g.isNight);g.scene.add(model.root);model.root.position.set(e.x,0,e.z);this.list.push(e);}
  setZombie(e,night){if(e.zombie===night)return;const ratio=e.maxHP?e.hp/e.maxHP:1;e.zombie=night;e.maxHP=e.baseMaxHP*(night?2:1);e.hp=Math.max(1,e.maxHP*ratio);e.model.zombie.visible=night;e.model.halo.material=material(night?0x82d35f:e.color,true);}
  setNight(night){for(const e of this.list)if(!e.dead)this.setZombie(e,night);for(const p of this.pending)p.marker.material=material(night?0x82d35f:0xe87870,true);}
  pickType(time,level){const r=this.game.world.grid.random();if(time<12)return 'scout';if(time<30)return r<.72?'scout':'gunner';if(time<45)return r<.5?'scout':r<.86?'gunner':'heavy';return r<.45-level*.2?'scout':r<.8-level*.12?'gunner':r<.91?'heavy':'mortar';}
  update(dt){
    const g=this.game,grid=g.world.grid,p=g.player,level=clamp(g.time/240,0,1);
    this.spawnTimer-=dt;this.eliteTimer-=dt;this.assaultTimer-=dt;
    if(this.eliteTimer<=0&&!this.list.some(e=>e.type==='elite')&&!this.pending.some(e=>e.type==='elite')){if(this.schedule('elite')){this.eliteTimer=CONFIG.director.eliteEvery;g.ui.toast('ĐẠI ÚY KẸO THÉP đang tiến vào thành phố');g.audio.play('warning');}}
    if(this.assaultTimer<=0&&this.assaultRemaining===0){this.assaultRemaining=3+Math.min(1,Math.floor(g.time/120))+(g.isNight?1:0);this.assaultTimer=Math.max(CONFIG.director.assaultMin,CONFIG.director.assaultBase-g.time*.01);g.ui.toast(g.isNight?'BẦY ZOMBIE ĐANG TRÀN TỚI!':'BÁO ĐỘNG · ĐỢT TẤN CÔNG DỒN DẬP');g.audio.play('warning');}
    if(this.spawnTimer<=0){const assault=this.assaultRemaining>0,scheduled=this.schedule(this.pickType(g.time,level));if(assault&&scheduled)this.assaultRemaining--;const onboarding=g.time<30?(30-g.time)/15:0;this.spawnTimer=assault?CONFIG.director.assaultGap:Math.max(CONFIG.director.spawnMin,CONFIG.director.spawnStart+onboarding-g.time*.008);}
    for(let i=this.pending.length-1;i>=0;i--){const s=this.pending[i];s.remaining-=dt;if(s.remaining<=0){s.marker.removeFromParent();this.pending.splice(i,1);if(dist(s,p)>=CONFIG.director.safeRadius&&grid.free(s.x,s.z,ENEMIES[s.type].radius)&&grid.path(grid.at(s.x,s.z),grid.at(p.x,p.z)).length)this.spawn(s);}}
    for(const e of this.list){
      if(e.dead)continue;if(e.burn>0){e.burn=Math.max(0,e.burn-dt);e.burnTick-=dt;if(e.burnTick<=0){this.hurt(e,4,true);e.burnTick=.45;}if(e.dead)continue;}if(e.stun>0){e.stun=Math.max(0,e.stun-dt);e.charge=0;e.burst=0;e.flash=Math.max(0,e.flash-dt);e.model.flashTime=Math.max(0,e.model.flashTime-dt);e.model.flash.visible=e.model.flashTime>0;e.model.halo.visible=true;e.model.halo.material=material(0x9eeaff,true);continue;}e.fire-=dt;e.pathTimer-=dt;e.senseTimer-=dt;e.flash=Math.max(0,e.flash-dt);e.smoke-=dt;
      if(e.senseTimer<=0){const dx=p.x-e.x,dz=p.z-e.z;e.distance=Math.hypot(dx,dz);e.los=!grid.trace(e.x,e.z,p.x,p.z);e.desired=Math.atan2(dx,dz);e.senseTimer=.16+(e.id%4)*.03;}const distance=e.distance,los=e.los,desired=e.desired;
      if(e.charge<=0)e.aim=turn(e.aim,desired,1-Math.exp(-dt*5));
      if(e.charge>0){e.charge-=dt;if(e.charge<=0)this.attack(e);}
      else {
        let mx=0,mz=0;
        if(!los||distance>e.range){
          if(e.pathVersion!==grid.version||e.pathTimer<=0){e.path=grid.path(grid.at(e.x,e.z),grid.at(p.x,p.z));e.pathVersion=grid.version;e.pathTimer=1.05+(e.id%4)*.12;}
          if(e.path.length){const target=grid.center(e.path[0]);if(dist(e,target)<.22)e.path.shift();else{mx=target.x-e.x;mz=target.z-e.z;}}
        }else if(distance<e.range*.6){mx=e.x-p.x;mz=e.z-p.z;}
        else if(e.type==='scout'||level>.4){const sign=e.id%2?1:-1;mx=-(p.z-e.z)*sign;mz=(p.x-e.x)*sign;}
        const len=Math.hypot(mx,mz);if(len){mx/=len;mz/=len;const beforeX=e.x,beforeZ=e.z;grid.move(e,mx*e.speed*dt,mz*e.speed*dt);const blocked=this.list.some(other=>{if(other===e||other.dead)return false;const dx=e.x-other.x,dz=e.z-other.z,r=(e.radius+other.radius)*.86;return dx*dx+dz*dz<r*r;}),pdx=e.x-p.x,pdz=e.z-p.z,pr=e.radius+p.radius;if(blocked||pdx*pdx+pdz*pdz<pr*pr){e.x=beforeX;e.z=beforeZ;}e.angle=turn(e.angle,Math.atan2(mx,mz),1-Math.exp(-dt*8));}
        if(e.fire<=0&&distance<e.range+4&&los){e.charge=e.type==='heavy'?.95:e.type==='elite'?1.1:e.type==='mortar'?.65:.3;e.fire=e.interval/(1+level*.25);e.aim=desired;}
      }
      if(e.burst>0){e.burstTimer-=dt;if(e.burstTimer<=0){if(!grid.trace(e.x,e.z,p.x,p.z))g.combat.shoot(e,'enemy',e.damage);e.burst--;e.burstTimer=.18;}}
      e.model.root.position.set(e.x,0,e.z);e.model.body.rotation.y=e.angle;e.model.turret.rotation.y=e.aim;
      e.model.flashTime=Math.max(0,e.model.flashTime-dt);e.model.flash.visible=e.model.flashTime>0;e.model.halo.visible=e.charge>0||e.flash>0;if(e.model.halo.visible)e.model.halo.material=material(e.charge>0?0xffed9c:0xffffff,true);
      if(e.hp<e.maxHP*.3&&e.smoke<=0){e.smoke=.45;g.effects.emit(e.x,1,e.z,0x959588,1,.65);}
    }
    if(this.dirty){this.list=this.list.filter(e=>!e.dead);this.dirty=false;}
  }
  attack(e){const g=this.game;if(e.dead)return;
    if(e.type==='mortar'){g.combat.mortar(e,g.player.x,g.player.z);return;}
    if(e.type==='elite'){e.phase++;if(e.phase%2===0){for(let i=-1;i<=1;i++)g.combat.mortar(e,g.player.x+i*2.5,g.player.z+i*1.2);}else for(let i=-2;i<=2;i++)g.combat.shoot(e,'enemy',e.damage,i*.18);return;}
    if(g.world.grid.trace(e.x,e.z,g.player.x,g.player.z))return;
    g.combat.shoot(e,'enemy',e.damage);if(e.type==='gunner'){e.burst=2;e.burstTimer=.18;}
  }
  hurt(e,damage,quiet=false){if(e.dead)return;e.hp-=damage;e.flash=.12;const g=this.game;if(!quiet)g.effects.emit(e.x,.8,e.z,0xffefb8,5,.23,1.2);if(e.hp<=0){e.dead=true;this.dirty=true;e.model.root.removeFromParent();g.effects.explosion(e.x,e.z,e.type==='elite'?2:1);g.audio.play('explosion');g.onKill(e);g.combat.drop(e.x,e.z);}}
  clear(){for(const e of this.list)e.model.root.removeFromParent();for(const p of this.pending)p.marker.removeFromParent();this.list=[];this.pending=[];this.dirty=false;}
}
```


## src/input.js

```javascript
import * as THREE from 'three';
import { screenDirection } from './core.js';
export class Input {
  constructor(canvas,onPause,onRestart) {
    this.keys=new Set();this.mouse=new THREE.Vector2(0,0);this.firing=false;this.dash=false;this.pointerKnown=false;
    this.touchMove={x:0,y:0};this.touchAim={x:0,y:0};this.touchCapable=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;
    document.body.classList.toggle('touch',this.touchCapable);
    this.ray=new THREE.Raycaster();this.plane=new THREE.Plane(new THREE.Vector3(0,1,0),0);this.target=new THREE.Vector3(0,0,5);
    const controls=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'];
    window.addEventListener('keydown',e=>{
      if(e.target.matches?.('input,select')&&e.code!=='Escape')return;
      if(e.target.matches?.('button')&&(e.code==='Space'||e.code==='Enter'))return;
      if(controls.includes(e.code))e.preventDefault();this.keys.add(e.code);
      if(!e.repeat&&e.code==='Space')this.dash=true;
      if(!e.repeat&&e.code==='Escape')onPause();if(!e.repeat&&e.code==='KeyR')onRestart();
    });
    window.addEventListener('keyup',e=>this.keys.delete(e.code));
    canvas.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;this.clientX=e.clientX;this.clientY=e.clientY;this.pointerKnown=true;});
    canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0){this.clientX=e.clientX;this.clientY=e.clientY;this.pointerKnown=true;this.firing=true;}});
    window.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')this.firing=false;});
    canvas.addEventListener('pointerleave',()=>this.firing=false);
    canvas.addEventListener('contextmenu',e=>e.preventDefault());
    window.addEventListener('blur',()=>{this.clear();onPause(true);});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){this.clear();onPause(true);}});
    this.bindStick(document.getElementById('move-stick'),this.touchMove,false);
    this.bindStick(document.getElementById('aim-stick'),this.touchAim,true);
    const dashButton=document.getElementById('dash-button');
    dashButton.addEventListener('pointerdown',e=>{e.preventDefault();if(!dashButton.disabled){this.dash=true;dashButton.classList.add('pressed');navigator.vibrate?.(12);}});
    const releaseDash=()=>dashButton.classList.remove('pressed');dashButton.addEventListener('pointerup',releaseDash);dashButton.addEventListener('pointercancel',releaseDash);
    this.canvas=canvas;
  }
  bindStick(element,value,fires){
    if(!element)return;const knob=element.querySelector('.stick-knob');let active=null;
    const update=e=>{if(e.pointerId!==active)return;const r=element.getBoundingClientRect(),radius=Math.max(24,Math.min(r.width,r.height)*.32),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),length=Math.hypot(dx,dy),scale=Math.min(1,radius/(length||1));value.x=dx*scale/radius;value.y=dy*scale/radius;if(Math.hypot(value.x,value.y)<.12)value.x=value.y=0;knob.style.transform=`translate(${value.x*radius}px,${value.y*radius}px)`;if(fires)this.firing=!!(value.x||value.y);};
    const release=e=>{if(active!==null&&e.pointerId!==active)return;active=null;value.x=value.y=0;knob.style.transform='translate(0,0)';element.classList.remove('active');if(fires)this.firing=false;};
    element.addEventListener('pointerdown',e=>{e.preventDefault();active=e.pointerId;try{element.setPointerCapture(active);}catch{}element.classList.add('active');update(e);});
    element.addEventListener('pointermove',update);element.addEventListener('pointerup',release);element.addEventListener('pointercancel',release);element.addEventListener('lostpointercapture',release);
  }
  clear(){this.keys.clear();this.firing=false;this.dash=false;this.touchMove.x=this.touchMove.y=this.touchAim.x=this.touchAim.y=0;document.querySelectorAll('.stick-knob').forEach(el=>el.style.transform='translate(0,0)');document.querySelectorAll('.touch-stick').forEach(el=>el.classList.remove('active'));}
  movement(){const x=this.touchMove.x||Number(this.keys.has('KeyD')||this.keys.has('ArrowRight'))-Number(this.keys.has('KeyA')||this.keys.has('ArrowLeft')),y=this.touchMove.y||Number(this.keys.has('KeyS')||this.keys.has('ArrowDown'))-Number(this.keys.has('KeyW')||this.keys.has('ArrowUp'));return screenDirection(x,y);}
  aim(camera,origin){if(this.touchAim.x||this.touchAim.y){const d=screenDirection(this.touchAim.x,this.touchAim.y);this.target.set((origin?.x||0)+d.x*20,0,(origin?.z||0)+d.z*20);}else if(this.pointerKnown){this.mouse.set(this.clientX/innerWidth*2-1,-this.clientY/innerHeight*2+1);this.ray.setFromCamera(this.mouse,camera);this.ray.ray.intersectPlane(this.plane,this.target);}return this.target;}
}
```


## src/main.js

```javascript
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { clamp, readStorage, writeStorage } from './core.js';
import { material, tankModel } from './models.js';
import { Input } from './input.js';
import { World } from './world.js';
import { Player } from './player.js';
import { Enemies } from './enemies.js';
import { Combat } from './combat.js';
import { Effects } from './effects.js';
import { Audio } from './audio.js';
import { UI } from './ui.js';

export class Game {
  constructor(){
    this.state='menu';this.touchDevice=matchMedia('(pointer: coarse)').matches||navigator.maxTouchPoints>0;this.settings={mute:false,volume:.6,shake:true,quality:'high'};
    const stored=readStorage('chibi-best',0);this.best=Number.isFinite(stored)?Math.max(0,Math.floor(stored)):0;this.material=material;
    this.renderer=new THREE.WebGLRenderer({canvas:document.getElementById('game'),antialias:false,alpha:false,powerPreference:'high-performance'});const gl=this.renderer.getContext(),debugInfo=gl.getExtension('WEBGL_debug_renderer_info'),gpuName=`${debugInfo?gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL):''} ${gl.getParameter(gl.RENDERER)||''}`;this.softwareRenderer=/swiftshader|software|llvmpipe|microsoft basic/i.test(gpuName);this.renderer.setClearColor(0xe5ecdb);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=this.softwareRenderer?THREE.NoToneMapping:THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.2;
    this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0xe5ecdb);this.scene.fog=new THREE.Fog(0xe5ecdb,75,145);this.daySky=new THREE.Color(0xe5ecdb);this.nightSky=new THREE.Color(0x243844);this.dayHemi=new THREE.Color(0xfff6dd);this.nightHemi=new THREE.Color(0x7792bd);this.daySun=new THREE.Color(0xfff0da);this.nightSun=new THREE.Color(0x9db9dc);
    this.camera=new THREE.OrthographicCamera(-24,24,18,-18,.1,180);this.focus=new THREE.Vector3();this.cameraTarget=new THREE.Vector3();this.labelPosition=new THREE.Vector3();this.cameraOffset=new THREE.Vector3(38,48,38);this.camera.position.copy(this.cameraOffset);this.camera.lookAt(this.focus);
    this.hemi=new THREE.HemisphereLight(0xfff6dd,0x91b3a0,2.6);this.scene.add(this.hemi);this.sun=new THREE.DirectionalLight(0xfff0da,3.2);this.sun.position.set(-20,40,20);this.sun.castShadow=false;this.scene.add(this.sun);
    this.audio=new Audio(this.settings);const unlockAudio=e=>{if(e.target?.closest?.('#play'))this.audio.setScene('playing');this.audio.unlock();window.removeEventListener('pointerdown',unlockAudio);window.removeEventListener('keydown',unlockAudio);};window.addEventListener('pointerdown',unlockAudio);window.addEventListener('keydown',unlockAudio);this.input=new Input(this.renderer.domElement,force=>this.togglePause(force),()=>{if(this.state==='over')this.start();});
    this.effects=new Effects(this.scene,this.camera,this.settings);this.world=null;this.enemies=new Enemies(this);this.combat=new Combat(this);this.reset(1709);this.ui=new UI(this);this.previewTanks=[];this.makePreview();this.setQuality();this.resize();
    window.addEventListener('resize',()=>this.resize());document.addEventListener('visibilitychange',()=>{if(document.hidden){if(this.audio.context)this.audio.context.suspend().catch(()=>{});}else if(this.audio.context)this.audio.unlock();});this.accumulator=0;this.last=performance.now();this.renderLast=0;this.uiAccumulator=0;this.frameCount=0;
    this.renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();this.togglePause(true);document.getElementById('error').hidden=false;document.getElementById('error-message').textContent='WebGL đã mất kết nối. Tải lại trang để khởi động lại.';});
    document.getElementById('loading').hidden=true;this.frame=this.frame.bind(this);this.frameId=requestAnimationFrame(this.frame);
  }
  makePreview(){for(const [x,z,color,type] of [[12,0,0xe8836d,'scout'],[0,-12,0xe2ae59,'mortar'],[-12,12,0xb68abf,'heavy']]){const m=tankModel(color,type);m.root.position.set(x,0,z);m.turret.rotation.y=Math.PI*.7;m.body.rotation.y=Math.PI*.65;this.scene.add(m.root);this.previewTanks.push(m);}this.player.aim=-1.1;this.player.angle=-.6;this.player.sync(0);}
  removePreview(){for(const m of this.previewTanks)m.root.removeFromParent();this.previewTanks=[];}
  reset(seed){this.input.clear();this.enemies.clear();this.combat.clear();this.effects.clear();this.player?.dispose();this.world?.dispose();this.world=new World(this.scene,seed);this.player=new Player(this.scene);this.time=0;this.score=0;this.kills=0;this.combo=0;this.maxCombo=1;this.comboTime=0;this.newBest=false;this.milestones=new Set();this.enemies.spawnTimer=3;this.enemies.eliteTimer=CONFIG.director.eliteEvery;this.enemies.assaultTimer=CONFIG.director.assaultFirst;this.enemies.assaultRemaining=0;this.enemies.serial=0;this.accumulator=0;this.uiAccumulator=0;this.focus.set(0,0,0);this.setNight(false,true,true);this.ui?.clear();}
  start(){this.audio.setScene('playing');this.audio.unlock();this.removePreview();const seed=new URLSearchParams(location.search).get('seed');this.reset(seed!==null?Number(seed)>>>0:crypto.getRandomValues(new Uint32Array(1))[0]);this.state='playing';this.ui.show(this.state);this.last=performance.now();this.resize();this.ui.toast(this.input.touchCapable?'Kéo trái để đi · Kéo phải để ngắm và bắn':'Giữ chuột để bắn · Space để lướt né');document.activeElement?.blur();}
  home(){this.input.clear();this.removePreview();this.reset(1709);this.state='menu';this.audio.setScene('menu');this.makePreview();this.ui.show('menu');this.resize();}
  togglePause(force=false){if(force&&this.state!=='playing')return;if(this.state==='over'||this.state==='menu')return;this.state=this.state==='playing'?'paused':'playing';this.audio.setScene(this.state);this.input.clear();this.accumulator=0;this.last=performance.now();this.ui.show(this.state);if(this.state==='playing'){this.audio.unlock();document.activeElement?.blur();}}
  end(){if(this.state!=='playing')return;this.state='over';this.input.clear();this.effects.explosion(this.player.x,this.player.z,2);this.audio.play('explosion');this.audio.setScene('over');const score=Math.floor(this.score);this.newBest=score>this.best;this.best=Math.max(this.best,score);writeStorage('chibi-best',this.best);this.ui.show('over');}
  onKill(e){this.combo=this.comboTime>0?Math.min(CONFIG.combat.maxCombo,this.combo+1):1;this.comboTime=CONFIG.combat.comboWindow;this.maxCombo=Math.max(this.maxCombo,this.combo);const points=e.points*this.combo;this.score+=points;this.kills++;this.effects.popup(e.x,e.z,`+${points}${this.combo>1?' ×'+this.combo:''}`);}
  step(dt){if(this.state!=='playing')return;const before=this.time;this.time+=dt;this.score+=CONFIG.combat.survivalScore*dt;this.comboTime-=dt;if(this.comboTime<=0)this.combo=0;this.player.update(dt,this);this.enemies.update(dt);this.combat.update(dt);this.effects.update(dt);for(const milestone of [30,60,120])if(before<milestone&&this.time>=milestone&&!this.milestones.has(milestone)){this.milestones.add(milestone);this.score+=milestone*2;this.ui.toast(`SỐNG SÓT ${milestone} GIÂY · +${milestone*2} ĐIỂM`);this.audio.play('pickup');}const night=Math.floor(this.time/CONFIG.world.phaseDuration)%2===1;if(night!==this.isNight)this.setNight(night);this.uiAccumulator+=dt;if(this.uiAccumulator>=1/CONFIG.performance.uiFPS){this.ui.update(this.uiAccumulator);this.uiAccumulator=0;}}
  setNight(night,silent=false,instant=false){const changed=this.isNight!==night;this.isNight=night;document.body.classList.toggle('night',night);this.enemies.setNight(night);if(changed&&!silent&&this.ui){this.ui.toast(night?'ĐÊM XUỐNG · XE TĂNG ZOMBIE ×2 MÁU':'BÌNH MINH · XE TĂNG TRỞ LẠI BÌNH THƯỜNG');this.audio.play('warning');}this.updateDayLighting(99);this.world.updateGroundEffects(this.player,this.enemies.list,night);}
  updateDayLighting(dt){const targetSky=this.isNight?this.nightSky:this.daySky,targetHemi=this.isNight?this.nightHemi:this.dayHemi,targetSun=this.isNight?this.nightSun:this.daySun,f=dt>10?1:1-Math.exp(-dt*1.15);this.scene.background.lerp(targetSky,f);this.scene.fog.color.copy(this.scene.background);this.hemi.color.lerp(targetHemi,f);this.sun.color.lerp(targetSun,f);this.hemi.intensity+=((this.isNight?1.15:2.6)-this.hemi.intensity)*f;this.sun.intensity+=((this.isNight?1.25:3.2)-this.sun.intensity)*f;this.renderer.toneMappingExposure+=((this.isNight?0.82:1.2)-this.renderer.toneMappingExposure)*f;}
  updateCamera(dt){const menu=this.state==='menu';this.cameraTarget.set(menu?-6:clamp(this.player.x,-17,17),0,menu?6:clamp(this.player.z,-17,17));this.focus.lerp(this.cameraTarget,1-Math.exp(-dt*5));this.camera.position.copy(this.focus).add(this.cameraOffset);if(this.settings.shake&&this.state==='playing'&&this.effects.shake>0){const n=this.effects.shake;this.camera.position.x+=(Math.random()-.5)*n;this.camera.position.z+=(Math.random()-.5)*n;}this.camera.lookAt(this.focus);if(menu){this.camera.setViewOffset(innerWidth,innerHeight,-innerWidth*.17,0,innerWidth,innerHeight);}else this.camera.clearViewOffset();this.camera.updateMatrixWorld();if(menu){this.labelPosition.set(this.player.x,2,this.player.z).project(this.camera);const label=document.querySelector('.field-label');label.style.left=`${(this.labelPosition.x*.5+.5)*innerWidth+15}px`;label.style.top=`${(-this.labelPosition.y*.5+.5)*innerHeight-130}px`;}}
  frame(now){this.frameId=requestAnimationFrame(this.frame);if(document.hidden){this.last=this.renderLast=now;return;}const playFPS=this.softwareRenderer?CONFIG.performance.softwareFPS:CONFIG.performance.highFPS,fps=this.state==='playing'?playFPS:CONFIG.performance.idleFPS,interval=1000/fps;if(now-this.renderLast<interval)return;this.renderLast=now-(now-this.renderLast)%interval;const dt=Math.min(.1,Math.max(0,(now-this.last)/1000));this.last=now;if(this.state==='playing'){this.accumulator+=dt;while(this.accumulator>=CONFIG.step){this.step(CONFIG.step);this.accumulator-=CONFIG.step;if(this.state!=='playing'){this.accumulator=0;break;}}}this.updateCamera(dt);this.world.fadeOccluders(this.player);this.world.updateGroundEffects(this.player,this.enemies.list,this.isNight);this.effects.render();this.renderer.render(this.scene,this.camera);this.frameCount++;}
  resize(){const aspect=innerWidth/innerHeight,menu=this.state==='menu',height=menu?40:this.touchDevice&&aspect>1?22:32;this.camera.left=-height*aspect/2;this.camera.right=height*aspect/2;this.camera.top=height/2;this.camera.bottom=-height/2;this.camera.updateProjectionMatrix();this.renderer.setSize(innerWidth,innerHeight);this.updateCamera(1);}
  setQuality(){this.settings.quality='high';this.renderScale=this.softwareRenderer?1:1.25;this.renderer.setPixelRatio(Math.min(devicePixelRatio,this.renderScale));this.renderer.shadowMap.enabled=false;this.sun.castShadow=false;this.effects.setQuality();this.renderLast=0;this.resize();}
}
try{const game=new Game();if(new URLSearchParams(location.search).has('debug'))window.__game=game;}catch(error){console.error(error);document.getElementById('loading').hidden=true;document.getElementById('error').hidden=false;document.getElementById('error-message').textContent=error.message;}
```


## src/models.js

```javascript
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { TILE } from './core.js';
const geometries = {
  box: new THREE.BoxGeometry(1,1,1), sphere: new THREE.SphereGeometry(.5,12,8),
  cylinder: new THREE.CylinderGeometry(.5,.5,1,12), cone: new THREE.ConeGeometry(.7,1,4),
  ring: new THREE.RingGeometry(.83,1,48), ico: new THREE.IcosahedronGeometry(.5,0),
};
const materials=new Map();
const mergedGeometries=new Map();
const mergedMaterial=new THREE.MeshLambertMaterial({vertexColors:true});
export function material(color,unlit=false) { const key=`${color}-${unlit}`;if(!materials.has(key))materials.set(key,unlit?new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}):new THREE.MeshLambertMaterial({color}));return materials.get(key); }
export function part(parent,type,color,x,y,z,sx=1,sy=sx,sz=sx) {
  const mesh=new THREE.Mesh(geometries[type],material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function ring(parent,color,radius=1) { const m=new THREE.Mesh(geometries.ring,material(color,true));m.rotation.x=-Math.PI/2;m.position.y=.08;m.scale.setScalar(radius);parent.add(m);return m; }
function mergedPart(parent,key,specs){
  let geometry=mergedGeometries.get(key);
  if(!geometry){
    const positions=[],normals=[],colors=[],matrix=new THREE.Matrix4(),quaternion=new THREE.Quaternion(),position=new THREE.Vector3(),scale=new THREE.Vector3(),euler=new THREE.Euler(),color=new THREE.Color();
    for(const [type,tint,x,y,z,sx=1,sy=sx,sz=sx,rx=0,ry=0,rz=0] of specs){
      const source=geometries[type].index?geometries[type].toNonIndexed():geometries[type].clone();
      position.set(x,y,z);scale.set(sx,sy,sz);quaternion.setFromEuler(euler.set(rx,ry,rz));matrix.compose(position,quaternion,scale);source.applyMatrix4(matrix);
      const p=source.getAttribute('position'),n=source.getAttribute('normal');color.setHex(tint);
      for(let i=0;i<p.count;i++){positions.push(p.getX(i),p.getY(i),p.getZ(i));normals.push(n.getX(i),n.getY(i),n.getZ(i));colors.push(color.r,color.g,color.b);}
      source.dispose();
    }
    geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geometry.computeBoundingSphere();mergedGeometries.set(key,geometry);
  }
  const mesh=new THREE.Mesh(geometry,mergedMaterial);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;
}
export function pickupModel(type){
  const colors=[0x8fd6ac,0x89c7e6,0xffd36c,0xe69bd4,0xf18c57,0xf3c96c,0xf07542,0x6bd9f2],white=0xfff0c4,specs=[['box',colors[type],0,0,0,.6]];
  if(type<4){specs.push(['box',0xffffff,0,.32,0,.12,.03,.4]);if(type<2)specs.push(['box',0xffffff,0,.32,0,.4,.03,.12]);}
  else if(type===4)specs.push(['cone',white,0,.43,0,.25,.6,.25]);
  else if(type===5)for(const offset of [-.18,0,.18])specs.push(['box',white,offset,.4,0,.09,.48,.12]);
  else if(type===6)specs.push(['cone',0xffec9e,0,.43,0,.34,.65,.34]);
  else specs.push(['box',0xe8ffff,-.12,.4,0,.13,.38,.13,0,0,-.5],['box',0xe8ffff,.12,.4,0,.13,.38,.13,0,0,.5]);
  const root=new THREE.Group();mergedPart(root,`pickup-${type}`,specs);return root;
}
function compactEnemyTank(color,kind,scale){
  const root=new THREE.Group(),body=new THREE.Group(),turret=new THREE.Group(),zombie=new THREE.Group(),dark=CONFIG.colors.ink;root.add(body,turret,zombie);
  const bodyParts=[['box',dark,-.53,.3,0,.35,.5,1.35],['box',dark,.53,.3,0,.35,.5,1.35],['box',0x425c59,-.53,.55,0,.38,.06,1.18],['box',0x425c59,.53,.55,0,.38,.06,1.18],['box',color,0,.55,0,1.05,.48,1.1],['box',0xe8edcc,0,.59,.56,.72,.1,.05],['sphere',0xffe9ac,-.35,.52,.58,.15],['sphere',0xffe9ac,.35,.52,.58,.15]];
  if(kind==='heavy'||kind==='elite')bodyParts.push(['box',color,-.5,.7,0,.28,.55,1.45],['box',color,.5,.7,0,.28,.55,1.45]);
  mergedPart(body,`enemy-body-${kind}-${color}`,bodyParts);
  const turretParts=[['sphere',color,0,.93,0,.95,.76,.85],['cylinder',dark,0,1.26,-.09,.35,.09,.35],['cylinder',color,0,.96,.7,.23,.85,.23,Math.PI/2,0,0],['box',dark,0,.96,1.16,.28,.28,.12]];
  if(kind==='gunner')turretParts.push(['box',dark,.36,1.04,.2,.18,.2,.8]);
  if(kind==='mortar')turretParts.push(['cylinder',dark,0,1.42,0,.55,.85,.55,.35,0,0]);
  if(kind==='elite')for(const x of [-.3,0,.3])turretParts.push(['cone',0xffd36c,x,1.48,0,.25,.4,.25]);
  mergedPart(turret,`enemy-turret-${kind}-${color}`,turretParts);
  const barrel=new THREE.Group();barrel.position.set(0,.96,.22);turret.add(barrel);
  const tip=new THREE.Object3D();tip.position.set(0,0,1.02);barrel.add(tip);const flash=part(barrel,'ico',0xffe9a2,0,0,1.12,.5);flash.material=material(0xffedb4,true);flash.visible=false;
  mergedPart(zombie,`enemy-zombie`,[['box',0x547c4b,0,1.1,.61,.72,.16,.18,-.18,0,0],['sphere',0xa8ff62,-.25,1.08,.72,.13],['sphere',0xa8ff62,.25,1.08,.72,.13],['cone',0x6b934f,-.48,.98,-.42,.19,.42,.19,Math.PI,0,0],['cone',0x6b934f,0,.98,-.42,.19,.42,.19,Math.PI,0,0],['cone',0x6b934f,.48,.98,-.42,.19,.42,.19,Math.PI,0,0]]);zombie.visible=false;
  const halo=ring(root,color,kind==='elite'?1.1:.84);halo.visible=false;root.scale.setScalar(scale);return {root,body,turret,zombie,barrel,tip,flash,halo,flashTime:0};
}
function compactPlayerTank(color,scale){
  const root=new THREE.Group(),body=new THREE.Group(),turret=new THREE.Group(),zombie=new THREE.Group(),dark=CONFIG.colors.ink;root.add(body,turret,zombie);
  const bodyParts=[];for(const x of [-.53,.53]){bodyParts.push(['box',dark,x,.3,0,.35,.5,1.35]);for(const z of [-.43,0,.43])bodyParts.push(['cylinder',0x78918c,x,.28,z,.28,.38,.28,0,0,Math.PI/2]);for(let z=-.55;z<=.56;z+=.22)bodyParts.push(['box',0x425c59,x,.55,z,.38,.035,.08]);}
  bodyParts.push(['box',color,0,.55,0,1.05,.48,1.1],['box',0xe8edcc,0,.59,.56,.72,.1,.05],['sphere',0xffe9ac,-.35,.52,.58,.15],['sphere',0xffe9ac,.35,.52,.58,.15],['cylinder',dark,-.4,1.15,-.4,.035,1,.035,0,0,-.14],['sphere',0xffd36c,-.47,1.65,-.4,.14]);mergedPart(body,`player-body-${color}`,bodyParts);
  mergedPart(turret,`player-turret-${color}`,[['sphere',color,0,.93,0,.95,.76,.85],['cylinder',dark,0,1.26,-.09,.35,.09,.35],['box',0xf5f2d8,0,1.31,.08,.1,.03,.34],['box',0xf5f2d8,0,1.31,.08,.34,.03,.1],['cylinder',color,0,.96,.7,.23,.85,.23,Math.PI/2,0,0],['box',dark,0,.96,1.16,.28,.28,.12]]);
  const barrel=new THREE.Group();barrel.position.set(0,.96,.22);turret.add(barrel);
  const tip=new THREE.Object3D();tip.position.set(0,0,1.02);barrel.add(tip);const flash=part(barrel,'ico',0xffe9a2,0,0,1.12,.5);flash.material=material(0xffedb4,true);flash.visible=false;zombie.visible=false;const halo=ring(root,0xf9ffe3,.84);root.scale.setScalar(scale);return {root,body,turret,zombie,barrel,tip,flash,halo,flashTime:0};
}
export function tankModel(color,kind='player',scale=1) {
  return kind==='player'?compactPlayerTank(color,scale):compactEnemyTank(color,kind,scale);
}
export function tileModel(type,index) {
  const g=new THREE.Group(),c=CONFIG.colors,s=CONFIG.world.cell;
  if(type===TILE.ROAD)return g;
  if(type===TILE.GRASS)return g;
  if(type===TILE.RUBBLE){
    part(g,'box',0xa8aa9d,0,.04,0,2.28,.08,2.28);
    for(let n=0;n<3;n++){const rock=part(g,n%2?'box':'ico',[0x927f70,0xc58f72,0x6f8583][(index+n)%3],((index*7+n*5)%17-8)/10,.17,((index*3+n*7)%17-8)/10,.3,.18,.25);rock.rotation.y=(index+n)*.7;}
    return g;
  }
  part(g,'box',0xd6d8c8,0,.07,0,s-.06,.14,s-.06);
  if(type===TILE.BRICK){
    part(g,'box',0xd88366,0,.62,0,2.18,1.05,1.85);for(const y of [.35,.72,1.08])part(g,'box',0xf2bd8a,0,y,.93,2.2,.05,.04);
  }
  if(type===TILE.STEEL){part(g,'box',c.steel,0,.63,0,2.16,1.1,2.16);part(g,'box',0xbdd5d9,0,1.21,0,2.2,.14,2.2);}
  if(type===TILE.HOUSE){
    const color=[0xf3d2a1,0xa3cfd0,0xefd7b5,0xb8cbb3][index%4];
    part(g,'box',color,0,.84,0,1.95,1.5,1.85);
    const roof=part(g,'cone',index%2?0xd88a70:0x659caa,0,1.91,0,2.05,.8,2.05);roof.rotation.y=Math.PI/4;
    part(g,'box',0x577e88,-.45,1.04,.95,.42,.46,.04);part(g,'box',0x627f7e,.52,.65,.96,.45,.78,.05);
  }
  if(type===TILE.TREE){part(g,'box',c.grass,0,.12,0,2.3,.1,2.3);part(g,'cylinder',0x9c8564,0,.65,0,.3,1,.3);part(g,'ico',0x71ad83,0,1.5,0,1.75,2,1.75);}
  if(type===TILE.HIGHRISE){
    const height=3.8+(index%4)*.65,color=[0x8ca9ab,0xb7ae9b,0x7798a2][index%3];part(g,'box',color,0,height/2+.12,0,1.86,height,1.82);
    part(g,'box',0x526d70,0,height+.2,0,1.35,.18,1.3);part(g,'box',0xb8e1df,0,height*.52+.1,.925,1.35,height*.72,.035);part(g,'box',0x6e9298,.925,height*.52+.1,0,.035,height*.72,1.3);
  }
  if(type===TILE.SHOP){
    const wall=[0xe1b18d,0xa7c9bd,0xe6cf91][index%3],awning=[0xd9675e,0x5b9fac,0xe6a449][index%3];part(g,'box',wall,0,.72,0,2.05,1.25,1.86);part(g,'box',0x746b62,0,1.39,0,2.12,.14,1.95);
    part(g,'box',awning,0,1.13,1.02,2.18,.16,.56);part(g,'box',0x52767a,-.5,.67,.98,.55,.56,.04);part(g,'box',0x63584f,.52,.52,.96,.55,.9,.06);part(g,'box',0xffe7a6,0,1.58,.93,1.05,.3,.08);
  }
  if(type===TILE.BARREL){part(g,'cylinder',c.coral,0,.62,0,.94,1.1,.94);for(const y of [.28,.93])part(g,'cylinder',0x805b53,0,y,0,.98,.08,.98);part(g,'box',c.yellow,0,.62,.475,.34,.38,.025);}
  return g;
}
export function disposeShared() { Object.values(geometries).forEach(g=>g.dispose());materials.forEach(m=>m.dispose());mergedGeometries.forEach(g=>g.dispose());mergedMaterial.dispose(); }
```


## src/music.js

```javascript
// Original, tiny procedural loops. They are rendered once into an AudioBuffer;
// playback uses one looping source instead of scheduling notes during combat.
const SAMPLE_RATE = 22050;
const TAU = Math.PI * 2;
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

export function musicSamples(track) {
  const battle = track === 'battle';
  const beat = 60 / (battle ? 136 : 112);
  const length = Math.round(16 * beat * SAMPLE_RATE);
  const samples = new Float32Array(length);
  let seed = battle ? 0x51b1e : 0x70a7;
  const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1;
  const add = (index, value) => { samples[index % length] += value; };

  function note(at, beats, midi, level, voice) {
    if (midi == null) return;
    const start = Math.round(at * beat * SAMPLE_RATE);
    const held = beats * beat;
    const tail = voice === 'pad' ? .3 : voice === 'pluck' ? .18 : .1;
    const count = Math.round((held + tail) * SAMPLE_RATE);
    const hz = frequency(midi);
    for (let i = 0; i < count; i++) {
      const time = i / SAMPLE_RATE;
      const release = time <= held ? 1 : Math.max(0, 1 - (time - held) / tail);
      let envelope, wave;
      const phase = TAU * hz * time;
      if (voice === 'pad') {
        envelope = Math.min(1, time / .085) * release;
        wave = .58 * Math.sin(phase) + .24 * Math.sin(phase * 1.004) + .18 * Math.sin(phase * 2);
      } else if (voice === 'pluck') {
        envelope = Math.min(1, time / .005) * Math.exp(-time * 3.2) * release;
        wave = .7 * Math.sin(phase) + .23 * Math.sin(phase * 2) + .07 * Math.sin(phase * 3);
      } else if (voice === 'bass') {
        envelope = Math.min(1, time / .008) * Math.exp(-time * .85) * release;
        wave = .8 * Math.sin(phase) + .18 * Math.sin(phase * 2) + .07 * Math.sin(phase * 3);
      } else {
        envelope = Math.min(1, time / .012) * Math.exp(-time * .9) * release;
        wave = .64 * Math.sin(phase) + .25 * Math.sin(phase * 2) + .11 * Math.sin(phase * 3);
      }
      add(start + i, wave * envelope * level);
    }
  }

  function drum(at, kind, level) {
    const start = Math.round(at * beat * SAMPLE_RATE);
    const seconds = kind === 'kick' ? .31 : kind === 'snare' ? .2 : .075;
    const count = Math.round(seconds * SAMPLE_RATE);
    let phase = 0, previous = 0;
    for (let i = 0; i < count; i++) {
      const time = i / SAMPLE_RATE;
      const noise = random();
      let value;
      if (kind === 'kick') {
        phase += TAU * (50 + 100 * Math.exp(-time * 25)) / SAMPLE_RATE;
        value = Math.sin(phase) * Math.exp(-time * 14) + noise * .06 * Math.exp(-time * 90);
      } else if (kind === 'snare') {
        value = (noise - previous * .72) * Math.exp(-time * 23) + Math.sin(TAU * 185 * time) * .22 * Math.exp(-time * 22);
      } else {
        value = (noise - previous * .9) * Math.exp(-time * 65);
      }
      previous = noise;
      add(start + i, value * level);
    }
  }

  const chords = battle
    ? [[52, 55, 59], [48, 52, 55], [50, 54, 57], [47, 51, 54]]
    : [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]];
  const melody = battle
    ? [76, 71, 67, 71, 76, 79, 76, 71, 74, 71, 67, 71, 74, 76, 74, 71,
       72, 67, 64, 67, 72, 76, 72, 67, 71, 75, 78, 75, 71, 66, 68, 71]
    : [74, null, 69, 65, 69, null, 72, 69, 70, null, 74, 72, 69, null, 65, 64,
       67, null, 72, 69, 67, null, 64, 67, 76, null, 73, 69, 73, null, 69, 64];

  for (let bar = 0; bar < 4; bar++) {
    const chord = chords[bar];
    for (const pitch of chord) note(bar * 4, 3.85, pitch, battle ? .055 : .085, 'pad');
    if (battle) {
      for (let eighth = 0; eighth < 8; eighth++) {
        const pitch = eighth % 4 === 3 ? chord[0] + 12 : chord[0] - 12;
        note(bar * 4 + eighth * .5, .43, pitch, .15, 'bass');
      }
    } else {
      note(bar * 4, 1.7, chord[0] - 12, .14, 'bass');
      note(bar * 4 + 2, 1.7, chord[0] - 12, .12, 'bass');
    }
  }
  for (let i = 0; i < melody.length; i++) {
    if (battle) note(i * .5, .43, melody[i], i % 4 === 0 ? .13 : .095, 'lead');
    else note(i * .5, .75, melody[i], .18, 'pluck');
  }
  for (let i = 0; i < 16; i++) {
    if (battle) {
      drum(i, 'kick', .24);
      if (i % 4 === 1 || i % 4 === 3) drum(i, 'snare', .13);
      drum(i, 'hat', .035);
      drum(i + .5, 'hat', .027);
    } else {
      if (i % 4 === 0 || i % 4 === 2) drum(i, 'kick', .075);
      if (i % 4 === 3) drum(i, 'hat', .025);
    }
  }

  // A quiet, wrapped delay gives the synthetic instruments a little room.
  const delay = Math.round(.19 * SAMPLE_RATE);
  const dry = samples.slice();
  for (let i = 0; i < length; i++) samples[(i + delay) % length] += dry[i] * (battle ? .1 : .16);
  let peak = 0;
  for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
  const scale = peak > .78 ? .78 / peak : 1;
  const edge = Math.round(.008 * SAMPLE_RATE);
  for (let i = 0; i < length; i++) {
    const fade = Math.min(1, i / edge, (length - 1 - i) / edge);
    samples[i] *= scale * fade;
  }
  return { samples, sampleRate: SAMPLE_RATE };
}
```


## src/player.js

```javascript
import { CONFIG } from './config.js';
import { turn } from './core.js';
import { tankModel } from './models.js';
export class Player {
  constructor(scene){Object.assign(this,{x:0,z:0,radius:CONFIG.player.radius,hp:CONFIG.player.hp,stamina:CONFIG.player.stamina,angle:Math.PI,aim:Math.PI,fire:0,dash:0,dashCooldown:0,invulnerable:0,regenDelay:0,speedBuff:0,fireBuff:0,trail:0,weapon:'normal',ammo:0});this.model=tankModel(CONFIG.colors.mint);scene.add(this.model.root);}
  equipWeapon(type){const weapon=CONFIG.weapons[type];if(!weapon)return;this.ammo=this.weapon===type?Math.min(weapon.maxAmmo,this.ammo+weapon.ammo):weapon.ammo;this.weapon=type;this.fire=0;}
  update(dt,game){
    const c=CONFIG.player,i=game.input,m=i.movement();
    for(const key of ['fire','dashCooldown','invulnerable','regenDelay','speedBuff','fireBuff'])this[key]=Math.max(0,this[key]-dt);
    if(this.regenDelay===0)this.stamina=Math.min(c.stamina,this.stamina+c.staminaRegen*dt);
    if(i.dash){i.dash=false;if(this.stamina>=c.dashCost&&this.dashCooldown<=0){this.stamina-=c.dashCost;this.dash=c.dashDuration;this.invulnerable=c.dashInvulnerability;this.dashCooldown=c.dashCooldown;this.regenDelay=.5;this.dashX=m.x||m.z?m.x:Math.sin(this.angle);this.dashZ=m.x||m.z?m.z:Math.cos(this.angle);game.audio.play('dash');}}
    if(m.x||m.z)this.angle=turn(this.angle,Math.atan2(m.x,m.z),1-Math.exp(-dt*14));
    const dashing=this.dash>0,speed=c.speed*(this.speedBuff>0?1.4:1);
    game.world.grid.move(this,(dashing?this.dashX*c.dashSpeed:m.x*speed)*dt,(dashing?this.dashZ*c.dashSpeed:m.z*speed)*dt);
    this.dash=Math.max(0,this.dash-dt);
    const target=i.aim(game.camera,this);let aim=Math.atan2(target.x-this.x,target.z-this.z);
    if(i.touchCapable&&i.firing){let best=null,bestScore=Infinity;for(const enemy of game.enemies.list){if(enemy.dead)continue;const distance=Math.hypot(enemy.x-this.x,enemy.z-this.z),enemyAim=Math.atan2(enemy.x-this.x,enemy.z-this.z),difference=Math.abs(Math.atan2(Math.sin(enemyAim-aim),Math.cos(enemyAim-aim)));if(distance<=16&&difference<.26&&!game.world.grid.trace(this.x,this.z,enemy.x,enemy.z)){const score=difference*3+distance/24;if(score<bestScore){best=enemy;bestScore=score;}}}if(best)aim=Math.atan2(best.x-this.x,best.z-this.z);}
    this.aim=aim;
    this.sync(dt);
    if(i.firing&&this.fire<=0){const interval=game.combat.firePlayer(this);if(interval)this.fire=interval*(this.fireBuff>0?.55:1);}
    this.trail-=dt;if(this.trail<=0&&(m.x||m.z||dashing||this.hp<30)){this.trail=.14;game.effects.emit(this.x,.2,this.z,dashing?0xc6fff0:this.hp<30?0x8e8e87:0xded5ba,dashing?2:1,.3);}
    this.model.halo.material=game.material(this.invulnerable>0?0xffffff:this.stamina>=c.dashCost?0xb6ffdf:0xf1af85,true);
  }
  sync(dt){const m=this.model;m.root.position.set(this.x,0,this.z);m.body.rotation.y=this.angle;m.turret.rotation.y=this.aim;m.flashTime=Math.max(0,m.flashTime-dt);m.flash.visible=m.flashTime>0;m.root.visible=true;}
  hurt(amount,game){if(this.invulnerable>0||this.hp<=0)return;this.hp=Math.max(0,this.hp-amount);this.invulnerable=CONFIG.player.hurtGrace;game.combo=0;game.comboTime=0;game.effects.emit(this.x,.8,this.z,0xfff3d0,10,.5);game.effects.shake=.18;game.ui.hit();game.audio.play('hit');if(this.hp<=0)game.end();}
  dispose(){this.model.root.removeFromParent();}
}
```


## src/ui.js

```javascript
import { CONFIG } from './config.js';
const $=id=>document.getElementById(id);
export const formatTime=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
export class UI {
  constructor(game){this.game=game;this.toastLife=0;this.hitLife=0;
    $('play').onclick=()=>game.start();$('resume').onclick=()=>game.togglePause();$('restart').onclick=()=>game.start();$('home').onclick=()=>game.home();$('fullscreen-button').onclick=()=>this.toggleFullscreen();for(const event of ['fullscreenchange','webkitfullscreenchange','MSFullscreenChange'])document.addEventListener(event,()=>this.syncFullscreen());this.syncFullscreen();this.show('menu');
  }
  fullscreenElement(){return document.fullscreenElement||document.webkitFullscreenElement||document.msFullscreenElement;}
  fullscreenRequest(root=document.documentElement){return root.requestFullscreen||root.webkitRequestFullscreen||root.webkitRequestFullScreen||root.msRequestFullscreen;}
  fullscreenExit(){return document.exitFullscreen||document.webkitExitFullscreen||document.msExitFullscreen;}
  standalone(){return navigator.standalone===true||matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches;}
  iphone(){return /iPhone|iPod/.test(navigator.userAgent);}
  syncFullscreen(){const active=!!this.fullscreenElement(),button=$('fullscreen-button');button.hidden=this.iphone()&&this.standalone();button.classList.toggle('is-fullscreen',active);button.setAttribute('aria-label',active?'Thoát toàn màn hình':'Bật toàn màn hình');button.title=active?'Thoát toàn màn hình':'Toàn màn hình';}
  async toggleFullscreen(){
    try{
      if(this.fullscreenElement()){
        const exit=this.fullscreenExit();if(exit)await exit.call(document);screen.orientation?.unlock?.();
      }else{
        const root=document.documentElement,enter=this.fullscreenRequest(root);if(!enter){this.toast(this.iphone()?this.standalone()?'Game đã mở dạng ứng dụng; iOS vẫn giữ thanh trạng thái.':'Mở game từ biểu tượng trên Màn hình chính; tab iPhone không thể vào toàn màn hình.':'Trình duyệt này chưa hỗ trợ toàn màn hình');return;}
        await enter.call(root);if(this.game.touchDevice&&this.game.state==='playing')try{await screen.orientation?.lock?.('landscape');}catch{}
      }
    }catch{this.toast('Không thể bật toàn màn hình trên trình duyệt này');}
    this.syncFullscreen();this.game.resize();
  }
  show(state){const g=this.game;$('menu').hidden=state!=='menu';$('hud').hidden=state==='menu';$('overlay').hidden=state==='playing'||state==='menu';$('touch-controls').hidden=state!=='playing';document.body.classList.toggle('playing',state==='playing'||state==='paused'||state==='over');document.body.dataset.state=state;document.querySelector('.dialog').scrollTop=0;$('results').hidden=state!=='over';$('resume').hidden=state==='over';$('restart').hidden=state!=='over';$('dialog-title').innerHTML=state==='over'?'Hết giáp rồi<span>.</span>':'Tạm dừng<span>.</span>';$('dialog-eyebrow').textContent=state==='over'?(g.newBest?'KỶ LỤC MỚI!':'MỘT TRẬN CHIẾN ĐÁNG NHỚ'):'HÍT THỞ MỘT CHÚT';$('dialog-description').textContent=state==='over'?(g.newBest?'Bạn vừa vượt qua chính mình. Thử giữ thành tích lâu hơn nữa nhé!':'Thành phố vẫn ở đây. Sẵn sàng cho lần tiếp theo?'):'Thành phố có thể đợi bạn.';$('menu-best').textContent=String(g.best).padStart(6,'0');if(state==='paused')$('resume').focus();if(state==='over'){$('final-score').textContent=Math.floor(g.score).toLocaleString('vi-VN');$('final-best').textContent=g.best.toLocaleString('vi-VN');$('final-time').textContent=formatTime(g.time);$('final-kills').textContent=g.kills;$('final-combo').textContent=`×${g.maxCombo}`;$('restart').focus();}}
  toast(text){$('toast').textContent=text;$('toast').classList.add('visible');this.toastLife=3;}
  hit(){this.hitLife=.18;$('hit-flash').classList.add('active');}
  update(dt){const g=this.game,p=g.player;this.toastLife-=dt;this.hitLife-=dt;if(this.toastLife<=0)$('toast').classList.remove('visible');if(this.hitLife<=0)$('hit-flash').classList.remove('active');
    const hp=Math.round(Math.max(0,p.hp/CONFIG.player.hp)*100),stamina=Math.round(p.stamina/CONFIG.player.stamina*100);$('hp-value').textContent=Math.ceil(p.hp);$('hp-ring').style.setProperty('--angle',`${hp*3.6}deg`);$('stamina-value').textContent=Math.floor(p.stamina);$('stamina-ring').style.setProperty('--angle',`${stamina*3.6}deg`);const dashReady=p.stamina>=CONFIG.player.dashCost&&p.dashCooldown<=0;$('dash-button').disabled=!dashReady;$('dash-button').classList.toggle('ready',dashReady);$('score').textContent=String(Math.floor(g.score)).padStart(6,'0');$('combo').textContent=`×${Math.max(1,g.combo)}`;$('time').textContent=formatTime(g.time);
    const elite=g.enemies.list.find(e=>e.type==='elite');$('elite').hidden=!elite;if(elite){const value=Math.round(Math.max(0,elite.hp/elite.maxHP)*100);$('elite-ring').style.setProperty('--angle',`${value*3.6}deg`);$('elite-value').textContent=`${value}%`;}
    const weapon=$('weapon-status'),special=CONFIG.weapons[p.weapon];weapon.hidden=!special;if(special){weapon.dataset.weapon=p.weapon;$('weapon-symbol').textContent={rocket:'R',shotgun:'S',flame:'F',electric:'E'}[p.weapon];$('weapon-name').textContent=special.name;$('weapon-ammo').textContent=p.ammo;weapon.setAttribute('aria-label',`${special.name}, còn ${p.ammo} đạn`);}
    const phaseRemaining=CONFIG.world.phaseDuration-g.time%CONFIG.world.phaseDuration;$('day-icon').textContent=g.isNight?'☾':'☀';$('day-label').textContent=g.isNight?'ĐÊM ZOMBIE':'BAN NGÀY';$('day-timer').textContent=formatTime(Math.ceil(phaseRemaining));$('day-cycle').classList.toggle('is-night',g.isNight);
  }
  clear(){this.toastLife=this.hitLife=0;$('toast').classList.remove('visible');$('hit-flash').classList.remove('active');$('weapon-status').hidden=true;}
}
```


## src/world.js

```javascript
import * as THREE from 'three';
import { CONFIG } from './config.js';
import { Grid, TILE, clamp } from './core.js';
import { part, tileModel } from './models.js';
function radialTexture(inner,outer){const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const context=canvas.getContext('2d'),gradient=context.createRadialGradient(32,32,2,32,32,32);gradient.addColorStop(0,inner);gradient.addColorStop(.5,inner);gradient.addColorStop(1,outer);context.fillStyle=gradient;context.fillRect(0,0,64,64);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;}
export class World {
  constructor(scene,seed) {
    this.grid=new Grid(seed);this.root=new THREE.Group();scene.add(this.root);this.tiles=[];this.batchRoot=new THREE.Group();this.root.add(this.batchRoot);this.batchDirty=true;
    this.ghosts=new Map();this.ghostMaterials=new Map();this.hiddenTiles=new Set();this.hiddenMatrix=new THREE.Matrix4().makeScale(0,0,0);this.fadeX=Infinity;this.fadeZ=Infinity;
    const width=this.grid.half*2;
    part(this.root,'box',0xadc4b1,0,-.62,0,width+1.3,1.2,width+1.3);
    part(this.root,'box',CONFIG.colors.road,0,-.05,0,width,.1,width);
    for(let i=0;i<this.grid.tiles.length;i++)this.rebuild(i);
    this.owned=[];this.groundFxGeometry=new THREE.PlaneGeometry(2,2);this.shadowTexture=radialTexture('rgba(32,48,43,.82)','rgba(32,48,43,0)');this.glowTexture=radialTexture('rgba(255,255,255,.8)','rgba(255,255,255,0)');this.shadowMaterial=new THREE.MeshBasicMaterial({map:this.shadowTexture,color:0x42564f,transparent:true,opacity:.36,depthWrite:false});this.glowMaterial=new THREE.MeshBasicMaterial({map:this.glowTexture,color:0x8dffc1,transparent:true,opacity:.26,depthWrite:false,blending:THREE.AdditiveBlending});this.structureShadows=new THREE.InstancedMesh(this.groundFxGeometry,this.shadowMaterial,this.grid.tiles.length);this.vehicleShadows=new THREE.InstancedMesh(this.groundFxGeometry,this.shadowMaterial,CONFIG.director.maxEnemies+1);this.structureShadows.frustumCulled=this.vehicleShadows.frustumCulled=false;this.structureShadows.renderOrder=this.vehicleShadows.renderOrder=1;this.root.add(this.structureShadows,this.vehicleShadows);this.playerLight=new THREE.Mesh(this.groundFxGeometry,this.glowMaterial);this.playerLight.rotation.x=-Math.PI/2;this.playerLight.position.y=.095;this.playerLight.visible=false;this.playerLight.renderOrder=1;this.root.add(this.playerLight);this.groundFxDummy=new THREE.Object3D();this.owned.push(this.groundFxGeometry,this.shadowMaterial,this.glowMaterial,this.shadowTexture,this.glowTexture);
  }
  rebuild(i){this.removeGhost(i);if(this.tiles[i])this.tiles[i].removeFromParent();const mesh=tileModel(this.grid.tiles[i],i),p=this.grid.center(i);mesh.position.set(p.x,0,p.z);mesh.visible=false;mesh.traverse(part=>{if(part.isMesh)part.userData.tileIndex=i;});this.root.add(mesh);this.tiles[i]=mesh;this.batchDirty=true;}
  rebatch(){
    for(const mesh of this.batchRoot.children)mesh.dispose();this.batchRoot.clear();
    const groups=new Map();this.root.updateMatrixWorld(true);
    for(const tile of this.tiles)tile.traverse(mesh=>{if(!mesh.isMesh)return;const key=mesh.geometry.uuid+mesh.material.uuid;if(!groups.has(key))groups.set(key,{geometry:mesh.geometry,material:mesh.material,items:[]});groups.get(key).items.push(mesh);});
    this.batches=[];for(const group of groups.values()){const mesh=new THREE.InstancedMesh(group.geometry,group.material,group.items.length);mesh.castShadow=mesh.receiveShadow=true;mesh.frustumCulled=false;group.items.forEach((item,i)=>mesh.setMatrixAt(i,this.hiddenTiles.has(item.userData.tileIndex)?this.hiddenMatrix:item.matrixWorld));this.batchRoot.add(mesh);this.batches.push({mesh,items:group.items});}this.updateStructureShadows();this.batchDirty=false;
  }
  updateStructureShadows(){let count=0;const d=this.groundFxDummy;for(let i=0;i<this.grid.tiles.length;i++){const type=this.grid.tiles[i];let sx=0,sz=0,reach=0;if(type===TILE.BRICK||type===TILE.STEEL){sx=1.15;sz=.9;reach=.34;}else if(type===TILE.HOUSE){sx=1.25;sz=1.15;reach=.48;}else if(type===TILE.TREE){sx=1.05;sz=1.1;reach=.38;}else if(type===TILE.HIGHRISE){sx=1.45;sz=2.05;reach=.9;}else if(type===TILE.SHOP){sx=1.3;sz=1.12;reach=.46;}else if(type===TILE.BARREL){sx=.55;sz=.68;reach=.2;}else continue;const p=this.grid.center(i);d.position.set(p.x+reach,.155,p.z-reach);d.rotation.set(-Math.PI/2,0,-.32);d.scale.set(sx,sz,1);d.updateMatrix();this.structureShadows.setMatrixAt(count++,d.matrix);}this.structureShadows.count=count;this.structureShadows.instanceMatrix.needsUpdate=true;}
  updateGroundEffects(player,enemies,night){const d=this.groundFxDummy;let count=0;const place=e=>{d.position.set(e.x+.12,.095,e.z-.12);d.rotation.set(-Math.PI/2,0,-.2);const size=e.radius*1.45;d.scale.set(size,size*.72,1);d.updateMatrix();this.vehicleShadows.setMatrixAt(count++,d.matrix);};place(player);for(const e of enemies)if(!e.dead)place(e);this.vehicleShadows.count=count;this.vehicleShadows.instanceMatrix.needsUpdate=true;this.playerLight.visible=night;this.playerLight.position.x=player.x;this.playerLight.position.z=player.z;this.playerLight.scale.setScalar(4.4);}
  updateInstances(){this.root.updateMatrixWorld(true);for(const {mesh,items} of this.batches) {items.forEach((item,i)=>mesh.setMatrixAt(i,this.hiddenTiles.has(item.userData.tileIndex)?this.hiddenMatrix:item.matrixWorld));mesh.instanceMatrix.needsUpdate=true;}}
  ghostMaterial(base){let ghost=this.ghostMaterials.get(base.uuid);if(!ghost){ghost=base.clone();ghost.transparent=true;ghost.opacity=.18;ghost.depthWrite=false;ghost.side=THREE.DoubleSide;this.ghostMaterials.set(base.uuid,ghost);}return ghost;}
  showGhost(i){
    if(this.ghosts.has(i))return;
    const source=this.tiles[i],type=this.grid.tiles[i];let ghost;
    ghost=new THREE.Group();if(type===TILE.HIGHRISE){const height=3.8+(i%4)*.65;part(ghost,'box',0x8ca9ab,0,height/2+.12,0,1.86,height,1.82);part(ghost,'box',0x526d70,0,height+.2,0,1.35,.18,1.3);}
    else if(type===TILE.HOUSE){part(ghost,'box',0xa9bdae,0,.84,0,1.95,1.5,1.85);const roof=part(ghost,'cone',0x78a3a2,0,1.91,0,2.05,.8,2.05);roof.rotation.y=Math.PI/4;}
    else if(type===TILE.TREE){part(ghost,'cylinder',0x8d826d,0,.65,0,.27,1,.27);part(ghost,'ico',0x79a985,0,1.5,0,1.6,1.9,1.6);}
    else if(type===TILE.SHOP){part(ghost,'box',0xb9b9a8,0,.72,0,2.05,1.25,1.86);part(ghost,'box',0xca836f,0,1.13,1.02,2.18,.16,.56);}
    ghost.visible=true;ghost.traverse(part=>{if(part.isMesh){part.material=this.ghostMaterial(part.material);part.castShadow=false;part.receiveShadow=false;part.renderOrder=2;}});
    ghost.position.copy(source.position);this.root.add(ghost);this.ghosts.set(i,ghost);this.hiddenTiles.add(i);this.transformsDirty=true;
  }
  removeGhost(i){const ghost=this.ghosts.get(i);if(!ghost)return;ghost.removeFromParent();this.ghosts.delete(i);this.hiddenTiles.delete(i);this.transformsDirty=true;}
  damage(i,amount,game){const type=this.grid.tiles[i],p=this.grid.center(i);if(!this.grid.damage(i,amount))return false;this.rebuild(i);const large=type===TILE.HIGHRISE?2:type===TILE.HOUSE||type===TILE.SHOP?1.35:1;game.effects.explosion(p.x,p.z,large);game.effects.emit(p.x,.7,p.z,type===TILE.BARREL?0xffba67:type===TILE.TREE?0x77a46b:0xc58b70,Math.round(12*large),.9,1.45);if(type===TILE.BARREL)game.combat.explode(p.x,p.z,3.8,42,'neutral');return true;}
  fadeOccluders(player){
    // Keep each house and tree full height. Only its rendering changes: replace
    // nearby foreground instances with faint copies so the tank stays visible.
    const moved=Math.hypot(player.x-this.fadeX,player.z-this.fadeZ)>.35;if(moved||this.batchDirty){this.fadeX=player.x;this.fadeZ=player.z;const candidates=[];for(let i=0;i<this.tiles.length;i++){const type=this.grid.tiles[i];if(![TILE.HOUSE,TILE.TREE,TILE.HIGHRISE,TILE.SHOP].includes(type))continue;const p=this.grid.center(i),dx=p.x-player.x,dz=p.z-player.z,range=type===TILE.HIGHRISE?10:7,distance=dx+dz;if(distance>0&&distance<range&&Math.abs(dx-dz)<4)candidates.push({i,distance});}
    candidates.sort((a,b)=>a.distance-b.distance);const visible=new Set(candidates.slice(0,7).map(c=>c.i));for(const i of visible)this.showGhost(i);for(const i of [...this.ghosts.keys()])if(!visible.has(i))this.removeGhost(i);}
    if(this.batchDirty)this.rebatch();else if(this.transformsDirty)this.updateInstances();this.transformsDirty=false;
  }
  dispose(){this.root.removeFromParent();for(const mesh of this.batchRoot.children)mesh.dispose();for(const ghost of this.ghosts.values())ghost.removeFromParent();this.ghosts.clear();this.hiddenTiles.clear();for(const mat of this.ghostMaterials.values())mat.dispose();this.ghostMaterials.clear();this.owned.forEach(r=>r.dispose());}
}
```


## tests/browser_runner.py

```python
"""Run real Chrome with CDP. Requires Python's websocket-client package.
Use --soak for a 600-second simulation stress test (accelerated, not a real-time benchmark).
Artifacts are local, excluded from source distribution. Serves only on loopback.
"""
import base64
import functools
import http.server
import json
import os
from pathlib import Path
import subprocess
import sys
import threading
import time
import urllib.request
import websocket

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / 'artifacts'
ART.mkdir(exist_ok=True)
CDP_PORT = int(os.environ.get('CHIBI_CDP_PORT', '9229'))
PROFILE = ART / os.environ.get('CHIBI_CHROME_PROFILE', 'chrome-profile')

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path.startswith('/repository-name/'):
            path = path[len('/repository-name'):]
        return super().translate_path(path)
    def log_message(self, *_):
        pass

server = http.server.ThreadingHTTPServer(('127.0.0.1', 8765), functools.partial(Handler, directory=str(ROOT)))
threading.Thread(target=server.serve_forever, daemon=True).start()
chrome = Path(os.environ.get('PROGRAMFILES', r'C:\Program Files')) / 'Google/Chrome/Application/chrome.exe'
process = subprocess.Popen([str(chrome), '--headless=new', '--no-sandbox', '--disable-gpu-sandbox', '--disable-extensions', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--no-first-run', '--no-default-browser-check', f'--remote-debugging-port={CDP_PORT}', '--remote-allow-origins=*', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=1440,1000', '--user-data-dir='+str(PROFILE), 'about:blank'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, creationflags=getattr(subprocess, 'CREATE_NO_WINDOW', 0))
ws = None
events = []
counter = 0
session_id = None

def call(method, params=None, timeout=120):
    global counter
    counter += 1
    request_id = counter
    payload = {'id': request_id, 'method': method, 'params': params or {}}
    if session_id and not method.startswith(('Browser.', 'Target.')):
        payload['sessionId'] = session_id
    ws.send(json.dumps(payload))
    ws.settimeout(timeout)
    while True:
        message = json.loads(ws.recv())
        if message.get('id') == request_id:
            if 'error' in message:
                raise RuntimeError(message['error'])
            return message.get('result', {})
        events.append(message)

def evaluate(code, timeout=120):
    result = call('Runtime.evaluate', {'expression': code, 'awaitPromise': True, 'returnByValue': True}, timeout)
    if 'exceptionDetails' in result:
        raise RuntimeError(result['exceptionDetails'])
    return result.get('result', {}).get('value')

def screenshot(name):
    data = call('Page.captureScreenshot', {'format': 'png'})['data']
    (ART / name).write_bytes(base64.b64decode(data))

def navigate_game(touch=False):
    url = 'http://127.0.0.1:8765/repository-name/?debug&seed=2026'
    for _ in range(2):
        call('Page.navigate', {'url':url})
        for _ in range(150):
            if evaluate('Boolean(window.__game' + (' && document.body.classList.contains("touch")' if touch else '') + ')'):
                return True
            time.sleep(.1)
    return False

try:
    for _ in range(100):
        try:
            version = json.load(urllib.request.urlopen(f'http://127.0.0.1:{CDP_PORT}/json/version', timeout=1))
            break
        except Exception:
            time.sleep(.1)
    else:
        raise RuntimeError('Chrome remote debugging did not start')
    ws = websocket.create_connection(version['webSocketDebuggerUrl'], origin=f'http://localhost:{CDP_PORT}')
    target_id = call('Target.createTarget', {'url':'http://127.0.0.1:8765/repository-name/?debug&seed=2026'})['targetId']
    session_id = call('Target.attachToTarget', {'targetId':target_id,'flatten':True})['sessionId']
    call('Runtime.enable')
    call('Page.enable')
    call('Network.enable')
    call('Network.setCacheDisabled', {'cacheDisabled': True})
    call('Emulation.setDeviceMetricsOverride', {'width':1440,'height':1000,'deviceScaleFactor':1,'mobile':False})
    ready = navigate_game()
    if not ready:
        print(json.dumps(events[-30:]), flush=True)
        screenshot('startup-error.png')
        raise RuntimeError(evaluate('JSON.stringify({url:location.href,state:document.readyState,html:document.documentElement.outerHTML})'))
    time.sleep(2)
    screenshot('menu.png')
    fullscreen_rect = evaluate("(()=>{const r=document.getElementById('fullscreen-button').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()")
    call('Input.dispatchMouseEvent', {'type':'mousePressed','x':fullscreen_rect['x'],'y':fullscreen_rect['y'],'button':'left','clickCount':1})
    call('Input.dispatchMouseEvent', {'type':'mouseReleased','x':fullscreen_rect['x'],'y':fullscreen_rect['y'],'button':'left','clickCount':1})
    time.sleep(.25)
    evaluate("window.__menuMusicAudit={scene:__game.audio.scene,track:__game.audio.musicVoice?.track,context:__game.audio.context?.state}")
    entered_fullscreen = evaluate("Boolean(document.fullscreenElement||document.webkitFullscreenElement)")
    if entered_fullscreen:
        evaluate("(document.exitFullscreen||document.webkitExitFullscreen).call(document)")
        time.sleep(.15)
    fullscreen_result = {'name':'Fullscreen button enters and exits browser fullscreen','pass':bool(entered_fullscreen and not evaluate("Boolean(document.fullscreenElement||document.webkitFullscreenElement)"))}
    core = evaluate("import('./tests/core-suite.js').then(m=>m.runCoreTests())")
    print(json.dumps(core, ensure_ascii=False), flush=True)
    (ART / 'core-results.json').write_text(json.dumps(core, indent=2, ensure_ascii=False), encoding='utf-8')
    smoke = evaluate("""(async()=>{
      const g=window.__game,results=[];cancelAnimationFrame(g.frameId);
      const check=(name,condition,data)=>results.push({name,pass:!!condition,...(data?{data}: {})});
      check('First user gesture starts menu theme',window.__menuMusicAudit?.scene==='menu'&&window.__menuMusicAudit?.track==='theme'&&window.__menuMusicAudit?.context==='running',window.__menuMusicAudit);
      document.getElementById('play').click();cancelAnimationFrame(g.frameId);
      check('Start button enters live game',g.state==='playing');
      check('No automatic fire',g.combat.bullets.every(b=>!b.active));
      const controls=await import('./src/core.js');
      const down=code=>document.body.dispatchEvent(new KeyboardEvent('keydown',{code,bubbles:true}));
      const up=code=>document.body.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));
      down('KeyW');const wasd=g.input.movement();up('KeyW');down('ArrowUp');const arrow=g.input.movement();up('ArrowUp');check('W and up arrow equivalent',wasd.x===arrow.x&&wasd.z===arrow.z);
      down('KeyW');down('KeyD');check('Diagonal normalized',Math.abs(Math.hypot(g.input.movement().x,g.input.movement().z)-1)<1e-8);g.input.clear();
      down('Space');g.step(1/60);up('Space');check('Dash consumes stamina, grants invulnerability',g.player.stamina===70&&g.player.invulnerable>0);for(let i=0;i<20;i++)g.step(1/60);check('Dash stays outside solids',g.world.grid.free(g.player.x,g.player.z,g.player.radius));
      const oldTime=g.time,oldSpawn=g.enemies.spawnTimer;down('Escape');up('Escape');g.step(10);check('Pause freezes simulation',g.time===oldTime&&g.enemies.spawnTimer===oldSpawn);down('Escape');up('Escape');
      down('KeyW');g.input.firing=true;window.dispatchEvent(new Event('blur'));check('Blur pauses and clears held input',g.state==='paused'&&!g.input.keys.size&&!g.input.firing);g.togglePause();
      g.player.x=0;g.player.z=0;g.player.sync(0);g.updateCamera(1);g.input.clientX=innerWidth*.61;g.input.clientY=innerHeight*.45;g.input.pointerKnown=true;
      const target=g.input.aim(g.camera).clone().project(g.camera);check('Raycast maps cursor to ground',Math.abs(target.x-(.61*2-1))<1e-6&&Math.abs(target.y-(-.45*2+1))<1e-6);
      const oldRect=g.input.canvas.getBoundingClientRect;let rectReads=0;g.input.canvas.getBoundingClientRect=()=>{rectReads++;return oldRect.call(g.input.canvas);};g.input.aim(g.camera);g.input.canvas.getBoundingClientRect=oldRect;
      check('Native crosshair follows mouse without slow HUD polling or layout reads',!document.getElementById('crosshair')&&getComputedStyle(g.input.canvas).cursor.includes('crosshair.png')&&rectReads===0);
      g.input.firing=true;g.player.fire=0;g.step(1/60);g.input.firing=false;const bullet=g.combat.bullets.find(b=>b.active);check('Player firing uses muzzle direction',bullet&&Math.abs(Math.atan2(bullet.vx,bullet.vz)-g.player.aim)<1e-6);
      check('Player bullets have bright blue core and dark outline in one draw call',bullet?.mesh.geometry===g.combat.playerRoundGeometry&&bullet?.mesh.material===g.combat.playerRoundMaterial&&bullet.mesh.geometry.getAttribute('color').count>0&&bullet.mesh.children.length===0);
      const hp=g.player.hp;g.player.invulnerable=0;g.player.hurt(10,g);g.player.hurt(10,g);check('Damage grace prevents stacked hits',g.player.hp===hp-10);
      g.enemies.spawn({type:'scout',x:12,z:0});let e=g.enemies.list.at(-1);const kills=g.kills,score=g.score;g.enemies.hurt(e,999);g.enemies.hurt(e,999);check('Kill rewarded exactly once',g.kills===kills+1&&g.score===score+100);
      g.player.invulnerable=0;g.player.hurt(999,g);check('Game over captures run stats',g.state==='over'&&!document.getElementById('results').hidden);down('KeyR');up('KeyR');check('R starts clean new run',g.state==='playing'&&g.time===0&&g.kills===0&&g.player.hp===100&&g.combat.bullets.every(b=>!b.active));
      for(let i=0;i<5;i++){g.start();cancelAnimationFrame(g.frameId);}check('Repeated restart clears entities',g.enemies.list.length===0&&g.enemies.pending.length===0&&g.combat.pickups.length===0&&g.effects.popups.length===16);
      check('Fixed pool caps',g.combat.bullets.length===180&&g.combat.shells.length===12&&g.effects.particles.length===96&&g.effects.popups.length===16);
      const statusPanel=document.querySelector('.status-panel').getBoundingClientRect(),scorePanel=document.querySelector('.score-panel').getBoundingClientRect();check('Minimal HUD removes minimap, game header, audio and settings controls',!document.getElementById('minimap')&&!document.querySelector('.topbar')&&!document.getElementById('mute')&&!document.getElementById('pause-button')&&!document.getElementById('volume')&&!document.getElementById('shake')&&!document.getElementById('best')&&statusPanel.width<=160&&scorePanel.width<=190&&scorePanel.height<=60);
      check('Stable city removes reconstruction timer and warning UI',!document.getElementById('world-status')&&!document.getElementById('shift-timer')&&!g.world.pending&&!('nextShift' in g.world)&&!('candidate' in g.world.grid));
      const fullscreen=document.getElementById('fullscreen-button'),fullscreenRect=fullscreen.getBoundingClientRect(),standard=()=>1,webkit=()=>2,webkitOld=()=>3,ms=()=>4,compat=g.ui.fullscreenRequest({requestFullscreen:standard})===standard&&g.ui.fullscreenRequest({webkitRequestFullscreen:webkit})===webkit&&g.ui.fullscreenRequest({webkitRequestFullScreen:webkitOld})===webkitOld&&g.ui.fullscreenRequest({msRequestFullscreen:ms})===ms;check('Fullscreen adapters cover Chrome, Edge and Safari',typeof g.ui.toggleFullscreen==='function'&&compat&&fullscreenRect.width>=44&&fullscreenRect.height>=44&&fullscreen.getAttribute('aria-label')==='Bật toàn màn hình');
      const appManifest=await fetch('./site.webmanifest').then(r=>r.json()),homeIcon=await fetch('./apple-touch-icon.png'),oldIphone=g.ui.iphone,oldStandalone=g.ui.standalone,oldRequest=g.ui.fullscreenRequest;
      g.ui.iphone=()=>true;g.ui.standalone=()=>true;g.ui.syncFullscreen();const installedHidden=fullscreen.hidden;
      g.ui.standalone=()=>false;g.ui.syncFullscreen();const browserVisible=!fullscreen.hidden;g.ui.fullscreenRequest=()=>undefined;await g.ui.toggleFullscreen();const browserHint=document.getElementById('toast').textContent;
      g.ui.iphone=oldIphone;g.ui.standalone=oldStandalone;g.ui.fullscreenRequest=oldRequest;g.ui.syncFullscreen();g.ui.clear();
      check('iPhone standalone avoids repeated install prompt',appManifest.display==='standalone'&&appManifest.start_url==='./'&&homeIcon.ok&&installedHidden&&browserVisible&&browserHint.includes('biểu tượng trên Màn hình chính')&&!browserHint.includes('Thêm vào Màn hình chính'));
      g.ui.update(0);g.updateCamera(1);g.world.fadeOccluders(g.player);g.world.updateGroundEffects(g.player,g.enemies.list,g.isNight);g.renderer.render(g.scene,g.camera);check('Lightweight contact shadows render without shadow maps',g.world.structureShadows.count>0&&g.world.vehicleShadows.count>=1&&!g.renderer.shadowMap.enabled);return results;
    })()""")
    smoke.append(fullscreen_result)
    print(json.dumps(smoke, ensure_ascii=False), flush=True)
    (ART / 'smoke-results.json').write_text(json.dumps(smoke, indent=2, ensure_ascii=False), encoding='utf-8')
    integration = evaluate("import('./tests/integration-suite.js').then(m=>m.runIntegrationTests(window.__game))")
    print('Integration: '+json.dumps(integration, ensure_ascii=False), flush=True)
    (ART / 'integration-results.json').write_text(json.dumps(integration, indent=2, ensure_ascii=False), encoding='utf-8')
    performance_result = evaluate("""(async()=>{
      const g=__game,{CONFIG}=await import('./src/config.js');g.start();cancelAnimationFrame(g.frameId);g.setQuality();
      for(let i=0;i<16;i++)g.enemies.spawn({type:['scout','gunner','heavy','mortar'][i%4],x:-24+(i%6)*4.8,z:-24+Math.floor(i/6)*4.8});
      g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);const dayCalls=g.renderer.info.render.calls;
      g.setNight(true,true,true);g.renderer.render(g.scene,g.camera);const nightCalls=g.renderer.info.render.calls;
      for(let i=0;i<16;i++)g.combat.spawnPickup(i%8,-18+(i%8)*4.8,14+Math.floor(i/8)*2.4);
      g.renderer.render(g.scene,g.camera);const pickupCalls=g.renderer.info.render.calls,pickupMeshes=g.combat.pickups.reduce((count,p)=>count+p.mesh.children.length,0);
      const pixelRatio=g.renderer.getPixelRatio(),expectedRatio=g.softwareRenderer?1:Math.min(devicePixelRatio,1.25);let enemyMeshes=0;
      for(const e of g.enemies.list)e.model.root.traverse(o=>{if(o.isMesh&&o.visible)enemyMeshes++;});
      const uiOptionRemoved=!document.getElementById('quality'),fixedHighScale=!('adjustRenderScale' in g)&&Math.abs(pixelRatio-expectedRatio)<1e-6,circularHUD=['hp-ring','stamina-ring'].every(id=>document.getElementById(id))&&!document.getElementById('heat-ring'),simulationFPS=Math.round(1/CONFIG.step);
      return {pass:dayCalls<110&&nightCalls<125&&pickupCalls-nightCalls<=16&&pickupMeshes===16&&!g.renderer.shadowMap.enabled&&g.effects.mesh.count===96&&enemyMeshes<=64&&g.settings.quality==='high'&&uiOptionRemoved&&fixedHighScale&&circularHUD&&simulationFPS===30,dayCalls,nightCalls,pickupCalls,pickupMeshes,enemyMeshes,particleInstances:g.effects.mesh.count,quality:g.settings.quality,uiOptionRemoved,fixedHighScale,circularHUD,pixelRatio,expectedRatio,hardwareFPS:CONFIG.performance.highFPS,softwareFPS:CONFIG.performance.softwareFPS,simulationFPS,idleFPS:CONFIG.performance.idleFPS,shadows:g.renderer.shadowMap.enabled,softwareRenderer:g.softwareRenderer};
    })()""")
    print('Performance budget: '+json.dumps(performance_result), flush=True)
    (ART / 'performance-results.json').write_text(json.dumps(performance_result, indent=2), encoding='utf-8')
    visual = evaluate("""(()=>{const g=__game,i=g.world.grid.index(13,12);g.world.grid.tiles[i]=3;g.world.grid.hp[i]=Infinity;g.world.rebuild(i);g.player.x=0;g.player.z=0;g.player.sync(0);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);return {ghosts:g.world.ghosts.size,fullHeight:g.world.tiles[i].scale.y===1};})()""")
    print('Visual occlusion: '+json.dumps(visual), flush=True)
    screenshot('house-fade.png')
    evaluate("""(()=>{const g=__game;g.start();cancelAnimationFrame(g.frameId);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);})()""")
    screenshot('gameplay.png')
    for weapon in ('rocket', 'shotgun', 'flame', 'electric'):
        evaluate("""(()=>{const g=__game;g.start();cancelAnimationFrame(g.frameId);const grid=g.world.grid;let spot=null,best=Infinity;for(let i=0;i<grid.tiles.length;i++){const p=grid.center(i),score=p.x*p.x+p.z*p.z;if(score<best&&Math.abs(p.x)<15&&Math.abs(p.z)<15&&grid.free(p.x,p.z,.8)&&!grid.trace(p.x,p.z,p.x+8,p.z,.1)){spot=p;best=score;}}if(!spot)throw Error('No clear weapon preview lane');g.world.rebatch();g.player.x=spot.x;g.player.z=spot.z;g.player.aim=Math.PI/2;g.player.sync(0);g.player.equipWeapon('%s');if('%s'==='electric')g.enemies.spawn({type:'heavy',x:spot.x+7,z:spot.z});g.combat.firePlayer(g.player);if('%s'==='flame'){for(let i=0;i<2;i++){g.effects.update(.065);g.combat.firePlayer(g.player);}}if('%s'==='rocket'||'%s'==='shotgun')g.combat.update(.09);g.effects.update(.025);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);})()""" % (weapon, weapon, weapon, weapon, weapon))
        screenshot('weapon-'+weapon+'.png')
    call('Emulation.setDeviceMetricsOverride', {'width':1024,'height':768,'deviceScaleFactor':1,'mobile':False})
    resize = evaluate("""(()=>{const g=__game;g.resize();g.input.clientX=620;g.input.clientY=350;g.input.pointerKnown=true;const p=g.input.aim(g.camera).clone().project(g.camera);g.renderer.render(g.scene,g.camera);return {pass:Math.abs(p.x-(620/innerWidth*2-1))<1e-6&&Math.abs(p.y-(-350/innerHeight*2+1))<1e-6,width:innerWidth,height:innerHeight};})()""")
    print('Resize: '+json.dumps(resize), flush=True)
    screenshot('gameplay-1024.png')
    if '--soak' in sys.argv:
        # Leave every gameplay subsystem active. An invulnerable test driver keeps the
        # session alive and teleports nowhere; survival mechanics are covered above.
        soak = evaluate("""(async()=>{
          const g=__game;g.start();cancelAnimationFrame(g.frameId);g.setQuality();
          const updateUI=g.ui.update.bind(g.ui);g.ui.update=()=>{};const samples=[],started=performance.now(),initialTerrainVersion=g.world.grid.version;let maxEnemies=0,maxBullets=0,maxParticles=0,invalid=0,eliteSeen=false;
          for(let second=0;second<600;second++){
            for(let f=0;f<30;f++){g.player.invulnerable=2;g.step(1/30);maxEnemies=Math.max(maxEnemies,g.enemies.list.length+g.enemies.pending.length);maxBullets=Math.max(maxBullets,g.combat.activeBullets.size);maxParticles=Math.max(maxParticles,g.effects.active.size);}
            if(!g.world.grid.connected()||!g.world.grid.free(g.player.x,g.player.z,g.player.radius)||g.enemies.list.some(e=>!g.world.grid.free(e.x,e.z,e.radius)))invalid++;if(g.enemies.list.some(e=>e.type==='elite'))eliteSeen=true;
            if(second%60===59){g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);samples.push({second:second+1,geometries:g.renderer.info.memory.geometries,textures:g.renderer.info.memory.textures,drawCalls:g.renderer.info.render.calls,enemies:g.enemies.list.length,terrainChanges:g.world.grid.version-initialTerrainVersion,heap:performance.memory?.usedJSHeapSize});await new Promise(r=>setTimeout(r,0));}
          }
          g.ui.update=updateUI;g.ui.update(0);g.renderer.render(g.scene,g.camera);
          return {pass:invalid===0&&eliteSeen&&maxEnemies<=16&&maxBullets<=180&&maxParticles<=96,time:g.time,elapsedMs:performance.now()-started,terrainChanges:g.world.grid.version-initialTerrainVersion,maxEnemies,maxBullets,maxParticles,eliteSeen,invalid,samples};
        })()""", timeout=300)
        print('Soak: '+json.dumps(soak), flush=True)
        (ART / 'soak-results.json').write_text(json.dumps(soak, indent=2), encoding='utf-8')
        screenshot('soak.png')
    evaluate("localStorage.removeItem('chibi-settings')")
    call('Emulation.setDeviceMetricsOverride', {'width':844,'height':390,'deviceScaleFactor':2,'mobile':True,'screenOrientation':{'type':'landscapePrimary','angle':90}})
    call('Emulation.setTouchEmulationEnabled', {'enabled':True,'maxTouchPoints':5})
    if not navigate_game(touch=True):
        screenshot('mobile-startup-error.png')
        raise RuntimeError('Mobile game did not load after two navigation attempts')
    screenshot('mobile-menu.png')
    mobile = evaluate("""(()=>{
      const g=__game;g.start();cancelAnimationFrame(g.frameId);g.ui.update(0);g.updateCamera(1);
      const controls=document.getElementById('touch-controls'),move=document.getElementById('move-stick'),aim=document.getElementById('aim-stick'),dash=document.getElementById('dash-button');
      const fire=(el,type,x,y,id)=>el.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerType:'touch',pointerId:id,clientX:x,clientY:y,button:0,buttons:type==='pointerup'?0:1}));
      const mr=move.getBoundingClientRect();fire(move,'pointerdown',mr.left+mr.width*.78,mr.top+mr.height*.5,11);const movement=g.input.movement();fire(move,'pointerup',mr.left+mr.width*.78,mr.top+mr.height*.5,11);
      const ar=aim.getBoundingClientRect();fire(aim,'pointerdown',ar.left+ar.width*.75,ar.top+ar.height*.3,12);const aiming=g.input.firing;g.player.fire=0;g.step(1/60);const shot=g.combat.bullets.some(b=>b.active);fire(aim,'pointerup',ar.left+ar.width*.75,ar.top+ar.height*.3,12);
      const dr=dash.getBoundingClientRect(),visible=getComputedStyle(controls).display!=='none';g.renderer.render(g.scene,g.camera);
      return {pass:visible&&Math.hypot(movement.x,movement.z)>.5&&aiming&&shot&&g.settings.quality==='high'&&mr.width>=44&&ar.width>=44&&dr.width>=44&&dr.right<=innerWidth&&mr.left>=0,visible,movement,aiming,shot,quality:g.settings.quality,viewport:[innerWidth,innerHeight],move:[mr.left,mr.top,mr.width,mr.height],aim:[ar.left,ar.top,ar.width,ar.height],dash:[dr.left,dr.top,dr.width,dr.height]};
    })()""")
    print('Mobile: '+json.dumps(mobile), flush=True)
    (ART / 'mobile-results.json').write_text(json.dumps(mobile, indent=2), encoding='utf-8')
    screenshot('mobile-landscape.png')
    night = evaluate("""(()=>{const g=__game;g.enemies.spawn({type:'scout',x:5,z:0});g.enemies.spawn({type:'heavy',x:-5,z:2.4});g.setNight(true,true,true);g.ui.update(0);g.updateCamera(1);g.world.fadeOccluders(g.player);g.renderer.render(g.scene,g.camera);const zombies=g.enemies.list.filter(e=>e.zombie);return {pass:document.body.classList.contains('night')&&zombies.length===2&&zombies.every(e=>e.maxHP===e.baseMaxHP*2&&e.model.zombie.visible)&&document.getElementById('day-label').textContent==='ĐÊM ZOMBIE',zombies:zombies.length,exposure:g.renderer.toneMappingExposure,sky:g.scene.background.getHexString()};})()""")
    print('Night visual: '+json.dumps(night, ensure_ascii=False), flush=True)
    (ART / 'night-results.json').write_text(json.dumps(night, indent=2, ensure_ascii=False), encoding='utf-8')
    screenshot('mobile-night.png')
    call('Emulation.setDeviceMetricsOverride', {'width':667,'height':375,'deviceScaleFactor':2,'mobile':True,'screenOrientation':{'type':'landscapePrimary','angle':90}})
    compact = evaluate("""(()=>{const g=__game;g.setNight(false,true,true);g.player.equipWeapon('rocket');g.resize();g.ui.update(0);g.renderer.render(g.scene,g.camera);
      const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
      const overlap=(a,b)=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
      const status=rect('hp-ring'),panel=document.querySelector('.status-panel').getBoundingClientRect(),weapon=rect('weapon-status'),score=document.querySelector('.score-panel').getBoundingClientRect(),day=rect('day-cycle'),full=rect('fullscreen-button'),toast=rect('toast'),move=rect('move-stick'),aim=rect('aim-stick'),dash=rect('dash-button');
      const inside=r=>r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight;
      const topRects=[panel,weapon,score,day,full,toast],controls=[move,aim,dash];
      const aligned=[panel.top,score.top,day.y].every(y=>Math.abs(y-panel.top)<=2);
      return {pass:status.w>=40&&Math.abs(status.w-status.h)<=3&&panel.width<=145&&aligned&&topRects.every(inside)&&full.w>=44&&full.h>=44&&controls.every(inside)&&controls.every(r=>r.w>=44&&r.h>=44)&&!overlap(panel,day)&&!overlap(score,day)&&!overlap(full,panel)&&!overlap(full,score)&&!overlap(full,day)&&!overlap(weapon,panel)&&!overlap(weapon,toast)&&!overlap(weapon,day)&&!overlap(panel,toast)&&!overlap(score,toast)&&!controls.some(r=>overlap(r,toast)),viewport:[innerWidth,innerHeight],aligned,status,panel,weapon,score,day,full,toast,move,aim,dash};})()""")
    print('Mobile compact: '+json.dumps(compact), flush=True)
    (ART / 'mobile-compact-results.json').write_text(json.dumps(compact, indent=2), encoding='utf-8')
    screenshot('mobile-compact.png')
    status = evaluate("""(()=>{const g=__game;g.ui.update(0);const panel=document.querySelector('.status-panel'),rings=[...panel.querySelectorAll('.status-orb')],aim=document.getElementById('aim-stick'),r=panel.getBoundingClientRect();return {pass:rings.length===2&&!document.getElementById('heat-ring')&&!('heat' in g.player)&&aim.getAttribute('aria-label')==='Kéo để ngắm và bắn'&&r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,panel:[r.x,r.y,r.width,r.height],rings:rings.map(x=>x.id)};})()""")
    print('Mobile status: '+json.dumps(status, ensure_ascii=False), flush=True)
    (ART / 'mobile-status-results.json').write_text(json.dumps(status, indent=2, ensure_ascii=False), encoding='utf-8')
    screenshot('mobile-status.png')
    pause = evaluate("""(()=>{const g=__game;g.togglePause(),el=document.querySelector('.dialog'),dialog=el.getBoundingClientRect(),resume=document.getElementById('resume').getBoundingClientRect(),home=document.getElementById('home').getBoundingClientRect(),labels=[...document.querySelectorAll('#settings label')].map(e=>e.getBoundingClientRect()),inside=r=>r.top>=dialog.top&&r.bottom<=dialog.bottom;return {pass:g.state==='paused'&&document.getElementById('touch-controls').hidden&&dialog.x>=0&&dialog.y>=0&&dialog.right<=innerWidth&&dialog.bottom<=innerHeight&&el.scrollHeight<=el.clientHeight&&el.scrollTop===0&&resume.height>=44&&home.height>=44&&inside(resume)&&inside(home)&&labels.every(r=>r.height>=44&&inside(r)),dialog,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,scrollTop:el.scrollTop,resumeHeight:resume.height,homeHeight:home.height,labelHeights:labels.map(r=>r.height)};})()""")
    print('Mobile pause: '+json.dumps(pause), flush=True)
    (ART / 'mobile-pause-results.json').write_text(json.dumps(pause, indent=2), encoding='utf-8')
    screenshot('mobile-pause.png')
    gameover = evaluate("""(()=>{const g=__game;g.togglePause();g.player.invulnerable=0;g.player.hurt(999,g);const el=document.querySelector('.dialog'),dialog=el.getBoundingClientRect(),title=document.getElementById('dialog-title').getBoundingClientRect(),restart=document.getElementById('restart').getBoundingClientRect(),home=document.getElementById('home').getBoundingClientRect(),inside=r=>r.top>=dialog.top&&r.bottom<=dialog.bottom;return {pass:g.state==='over'&&dialog.x>=0&&dialog.y>=0&&dialog.right<=innerWidth&&dialog.bottom<=innerHeight&&el.scrollHeight<=el.clientHeight&&el.scrollTop===0&&inside(title)&&inside(restart)&&inside(home)&&restart.height>=44&&home.height>=44,dialog,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight,scrollTop:el.scrollTop,restartHeight:restart.height,homeHeight:home.height};})()""")
    print('Mobile game over: '+json.dumps(gameover), flush=True)
    (ART / 'mobile-gameover-results.json').write_text(json.dumps(gameover, indent=2), encoding='utf-8')
    screenshot('mobile-gameover.png')
    call('Emulation.setDeviceMetricsOverride', {'width':390,'height':844,'deviceScaleFactor':2,'mobile':True,'screenOrientation':{'type':'portraitPrimary','angle':0}})
    portrait = evaluate("""(()=>{const g=__game;g.start();g.resize();const notice=document.querySelector('.rotate-notice'),r=notice.getBoundingClientRect();return {pass:getComputedStyle(notice).display==='flex'&&r.x===0&&r.y===0&&r.width===innerWidth&&r.height===innerHeight,viewport:[innerWidth,innerHeight],notice:[r.x,r.y,r.width,r.height]};})()""")
    print('Mobile portrait play: '+json.dumps(portrait), flush=True)
    (ART / 'mobile-portrait-results.json').write_text(json.dumps(portrait, indent=2), encoding='utf-8')
    screenshot('mobile-portrait.png')
    menuPortrait = evaluate("""(()=>{const g=__game;g.home();g.resize();const play=document.getElementById('play').getBoundingClientRect(),intro=document.querySelector('.intro').getBoundingClientRect(),notice=document.querySelector('.rotate-notice');return {pass:getComputedStyle(notice).display==='none'&&play.height>=44&&intro.x>=0&&intro.right<=innerWidth&&intro.y>=0&&intro.bottom<=innerHeight,viewport:[innerWidth,innerHeight],play:[play.x,play.y,play.width,play.height],intro:[intro.x,intro.y,intro.width,intro.height]};})()""")
    print('Mobile portrait menu: '+json.dumps(menuPortrait), flush=True)
    (ART / 'mobile-menu-results.json').write_text(json.dumps(menuPortrait, indent=2), encoding='utf-8')
    screenshot('mobile-menu-portrait.png')
    errors = [e for e in events if e.get('method')=='Runtime.exceptionThrown' or (e.get('method')=='Network.responseReceived' and e['params']['response']['status']>=400)]
    print('Browser errors: '+json.dumps(errors), flush=True)
    (ART / 'browser-errors.json').write_text(json.dumps(errors, indent=2), encoding='utf-8')
    if errors or not all(r['pass'] for r in core+smoke+integration) or not performance_result['pass'] or not visual['fullHeight'] or not resize['pass'] or not mobile['pass'] or not night['pass'] or not all(result['pass'] for result in [compact,status,pause,gameover,portrait,menuPortrait]) or ('--soak' in sys.argv and not soak['pass']):
        sys.exit(1)
finally:
    if ws:
        try:
            call('Browser.close', timeout=3)
        except Exception:
            pass
        ws.close()
    process.terminate()
    server.shutdown()
```


## tests/core-suite.js

```javascript
import { Grid, TILE, rng, screenDirection, segmentBox, segmentCircle, walkable } from '../src/core.js';
import { CONFIG } from '../src/config.js';
export function runCoreTests(){
  const results=[];
  function test(name,fn){try{fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}}
  const assert=(condition,message='Assertion failed')=>{if(!condition)throw new Error(message);};
  test('Seed determinism and variation',()=>{const a=new Grid(100),b=new Grid(100),c=new Grid(101);assert(a.tiles.every((v,i)=>v===b.tiles[i]));assert(a.tiles.some((v,i)=>v!==c.tiles[i]));});
  test('100 irregular seeds: connected roads, clear spawn, no periodic avenues',()=>{for(let seed=0;seed<100;seed++){const g=new Grid(seed),seen=g.flood(g.index(12,12)),orphan=g.tiles.findIndex((t,i)=>walkable(t)&&!seen[i]);assert(orphan<0,`Disconnected seed ${seed} at ${JSON.stringify(g.coords(orphan))}`);assert(g.free(0,0,CONFIG.player.radius));const walkableCount=g.tiles.filter(walkable).length;assert(walkableCount>110&&walkableCount<360,`Bad road density ${seed}: ${walkableCount}`);for(let n=0;n<g.size;n++){let row=true,column=true;for(let j=0;j<g.size;j++){row&&=walkable(g.tiles[g.index(j,n)]);column&&=walkable(g.tiles[g.index(n,j)]);}assert(!row&&!column,`Straight full-map avenue in seed ${seed}`);}}});
  test('40 urban seeds use a downtown, commercial buffer and compact parks',()=>{for(let seed=0;seed<40;seed++){
    const g=new Grid(seed),count=type=>g.tiles.filter(t=>t===type).length,towers=[];
    g.tiles.forEach((t,i)=>{if(t===TILE.HIGHRISE)towers.push(i);});
    assert(towers.length>=7&&towers.length<=9,`Bad tower count ${seed}: ${towers.length}`);
    assert(count(TILE.SHOP)>=10,`Missing shops ${seed}`);
    assert(count(TILE.GRASS)>=8&&count(TILE.GRASS)<50,`Bad park area ${seed}: ${count(TILE.GRASS)}`);
    const points=towers.map(i=>g.coords(i)),cx=points.reduce((n,p)=>n+p.x,0)/points.length,cz=points.reduce((n,p)=>n+p.z,0)/points.length;
    assert(points.every(p=>Math.hypot(p.x-cx,p.z-cz)<8),`Scattered downtown ${seed}`);
    for(const p of points)for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
      const x=p.x+dx,z=p.z+dz;if(x>=0&&z>=0&&x<g.size&&z<g.size){const i=g.index(x,z),tile=g.tiles[i];assert(tile===TILE.HIGHRISE||walkable(tile)||!g.neighbors(i).some(n=>walkable(g.tiles[n])),`Exposed low structure beside tower ${seed}`);}
    }
    assert(g.tiles.every(t=>t>=TILE.ROAD&&t<=TILE.RUBBLE),`Unknown terrain ${seed}`);assert(g.connected(),`Urban layout disconnected ${seed}`);
  }});
  test('Normalized camera-relative movement',()=>{for(const [x,y] of [[1,0],[0,-1],[1,1],[-1,-1]]){const d=screenDirection(x,y);assert(Math.abs(Math.hypot(d.x,d.z)-1)<1e-10);}const d=screenDirection(0,0);assert(d.x===0&&d.z===0);const up=screenDirection(0,-1);assert(up.x<0&&up.z<0);});
  test('Swept collision catches thin walls and earliest entry',()=>{assert(segmentBox(-10,0,10,0,-.1,-1,.1,1)===.495);assert(segmentBox(-10,2,10,2,-.1,-1,.1,1)===null);assert(segmentBox(0,0,10,0,-1,-1,1,1)===0);assert(Math.abs(segmentCircle(-10,0,10,0,0,0,1)-.45)<1e-8);});
  test('Dash substeps cannot tunnel through wall or world boundary',()=>{const g=new Grid(4);g.tiles.fill(TILE.ROAD);g.tiles[g.index(13,12)]=TILE.STEEL;const p={x:0,z:0,radius:.62};g.move(p,20,0);assert(p.x<.59);assert(g.free(p.x,p.z,p.radius));g.move(p,-200,0);assert(p.x>=-g.half+p.radius);});
  test('Destroyed wall becomes traversable rubble and updates navigation immediately',()=>{const g=new Grid(8);g.tiles.fill(TILE.ROAD);const i=g.index(13,12);g.tiles[i]=TILE.BRICK;g.hp[i]=g.tileHP(TILE.BRICK);const old=g.version;assert(g.trace(0,0,6,0)?.i===i);assert(!g.damage(i,28));assert(g.damage(i,28));assert(g.version===old+1&&g.tiles[i]===TILE.RUBBLE);assert(g.trace(0,0,6,0)===null);assert(g.path(g.index(12,12),g.index(14,12)).includes(i));assert(!g.damage(i,100));});
  test('Urban structures have durability and collapse into walkable terrain',()=>{const g=new Grid(9);for(const type of [TILE.STEEL,TILE.HOUSE,TILE.TREE,TILE.HIGHRISE,TILE.SHOP]){const i=g.tiles.findIndex(t=>t===type);assert(i>=0,`Missing type ${type}`);const hp=g.tileHP(type);assert(Number.isFinite(hp)&&hp>0);g.hp[i]=hp;assert(g.damage(i,hp));assert(walkable(g.tiles[i]));}});
  test('Pathfinding changes route after topology changes',()=>{const g=new Grid(1);g.tiles.fill(TILE.ROAD);const start=g.index(10,12),end=g.index(14,12),block=g.index(12,12);assert(g.path(start,end).includes(block));g.tiles[block]=TILE.STEEL;g.version++;const path=g.path(start,end);assert(!path.includes(block));assert(path.length>4);});
  return results;
}
```


## tests/core.test.js

```javascript
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { runCoreTests } from './core-suite.js';
for(const result of runCoreTests())test(result.name,()=>assert.ok(result.pass,result.error));
```


## tests/integration-suite.js

```javascript
import { TILE } from '../src/core.js';
import { CONFIG } from '../src/config.js';
export function runIntegrationTests(g){
  const results=[];
  const assert=(condition,message='Assertion failed')=>{if(!condition)throw new Error(message);};
  const fresh=()=>{g.start();g.world.grid.tiles.fill(TILE.ROAD);g.world.grid.resetHP();g.world.grid.version++;g.player.aim=Math.PI/2;g.player.sync(0);};
  const test=(name,fn)=>{try{fresh();fn();results.push({name,pass:true});}catch(e){results.push({name,pass:false,error:e.message});}};
  test('Muzzle inside cover cannot fire through it; cover destruction opens line of fire',()=>{
    const grid=g.world.grid,i=grid.index(13,12);grid.tiles[i]=TILE.BRICK;grid.hp[i]=50;g.enemies.spawn({type:'scout',x:7.2,z:0});const e=g.enemies.list[0],hp=e.hp;
    g.combat.shoot(g.player,'player',28);for(let n=0;n<30;n++)g.combat.update(1/60);assert(e.hp===hp);assert(grid.hp[i]===22);
    g.combat.shoot(g.player,'player',28);assert(grid.tiles[i]===TILE.RUBBLE);g.combat.shoot(g.player,'player',28);for(let n=0;n<30;n++)g.combat.update(1/60);assert(e.hp<hp);
  });
  test('Barrels chain-react once without awarding obstacle points',()=>{
    const grid=g.world.grid;for(const x of [15,16,17]){const i=grid.index(x,12);grid.tiles[i]=TILE.BARREL;grid.hp[i]=20;}
    const score=g.score;g.world.damage(grid.index(15,12),100,g);assert([15,16,17].every(x=>grid.tiles[grid.index(x,12)]===TILE.GRASS));assert(g.score===score);
  });
  test('Mortar warning precedes delayed area damage',()=>{
    g.enemies.spawn({type:'mortar',x:12,z:0});const e=g.enemies.list[0];g.combat.mortar(e,0,0);const shell=g.combat.shells.find(s=>s.active);assert(shell&&shell.marker.visible);
    for(let i=0;i<90;i++)g.combat.update(1/60);assert(g.player.hp===100&&shell.active);for(let i=0;i<15;i++)g.combat.update(1/60);assert(g.player.hp===76&&!shell.active);
  });
  test('Elite alternates five-shot fan and three mortar targets',()=>{
    g.enemies.spawn({type:'elite',x:12,z:0});const e=g.enemies.list[0];g.enemies.attack(e);assert(g.combat.bullets.filter(b=>b.active).length===5);g.enemies.attack(e);assert(g.combat.shells.filter(s=>s.active).length===3);
  });
  test('Night turns active and newly spawned enemies into double-HP zombies',()=>{
    g.enemies.spawn({type:'scout',x:12,z:0});const active=g.enemies.list[0],base=active.maxHP;active.hp=base*.5;g.setNight(true,true,true);assert(active.zombie&&active.maxHP===base*2&&active.hp===base&&active.model.zombie.visible);
    g.enemies.spawn({type:'gunner',x:-12,z:0});const spawned=g.enemies.list[1];assert(spawned.zombie&&spawned.maxHP===spawned.baseMaxHP*2);
    g.setNight(false,true,true);assert(!active.zombie&&active.maxHP===base&&active.hp===base*.5&&!active.model.zombie.visible);
  });
  test('Day and night alternate every sixty gameplay seconds',()=>{
    g.enemies.spawn({type:'scout',x:12,z:0});g.time=CONFIG.world.phaseDuration-.01;g.step(.02);assert(g.isNight&&g.enemies.list[0].zombie);g.time=CONFIG.world.phaseDuration*2-.01;g.step(.02);assert(!g.isNight&&!g.enemies.list[0].zombie);
  });
  test('Elite can enter a saturated regular enemy population',()=>{
    for(let i=0;i<CONFIG.director.maxEnemies-1;i++)g.enemies.spawn({type:'scout',x:-24+(i%5)*2.4,z:-24+Math.floor(i/5)*2.4});
    assert(!g.enemies.schedule('gunner'));assert(g.enemies.schedule('elite'));assert(g.enemies.list.length+g.enemies.pending.length===CONFIG.director.maxEnemies);
  });
  test('Spawn cancelled if player enters its safety radius during warning',()=>{
    assert(g.enemies.schedule('scout'));const spawn=g.enemies.pending[0];g.player.x=spawn.x;g.player.z=spawn.z;g.enemies.spawnTimer=100;g.enemies.update(2);assert(g.enemies.pending.length===0&&g.enemies.list.length===0);
  });
  test('Spawn selection uses one reachability flood instead of per-cell paths',()=>{
    const grid=g.world.grid,originalFlood=grid.flood.bind(grid),originalPath=grid.path.bind(grid);let floods=0,paths=0;grid.flood=(...args)=>{floods++;return originalFlood(...args);};grid.path=(...args)=>{paths++;return originalPath(...args);};
    const scheduled=g.enemies.schedule('scout');grid.flood=originalFlood;grid.path=originalPath;assert(scheduled,'Spawn scheduling failed');assert(floods===1,`Expected 1 flood, got ${floods}`);assert(paths===0,`Expected 0 paths, got ${paths}`);
  });
  test('Assault director schedules a rapid reinforcement wave without exceeding the cap',()=>{
    g.enemies.assaultTimer=.01;g.enemies.spawnTimer=100;g.enemies.update(.02);const wave=g.enemies.assaultRemaining;assert(wave>=3);g.enemies.spawnTimer=0;g.enemies.update(.01);assert(g.enemies.assaultRemaining===wave-1&&g.enemies.spawnTimer===CONFIG.director.assaultGap);assert(g.enemies.list.length+g.enemies.pending.length<=CONFIG.director.maxEnemies);
  });
  test('High-rises and shops absorb shots, collapse to rubble and open a lane',()=>{
    const grid=g.world.grid;for(const [x,type] of [[13,TILE.HIGHRISE],[14,TILE.SHOP]]){const i=grid.index(x,12);grid.tiles[i]=type;grid.hp[i]=grid.tileHP(type);g.world.rebuild(i);assert(!grid.free(grid.center(i).x,grid.center(i).z,.2));g.world.damage(i,grid.hp[i],g);assert(grid.tiles[i]===TILE.RUBBLE&&grid.free(grid.center(i).x,grid.center(i).z,.2));}
  });
  test('Combo caps at five, expires, and damage resets it',()=>{
    for(let i=0;i<8;i++)g.onKill({points:100,x:0,z:0});assert(g.combo===5&&g.maxCombo===5);g.comboTime=.001;g.step(1/60);assert(g.combo===0);g.onKill({points:100,x:0,z:0});g.player.hurt(1,g);assert(g.combo===0&&g.comboTime===0);
  });
  test('Sustained fire continues without heat or lockout state',()=>{
    g.input.firing=true;for(let i=0;i<20;i++){g.player.fire=0;g.player.update(.01,g);}const shots=g.combat.bullets.filter(b=>b.active).length;
    assert(shots===20);assert(!('heat' in g.player)&&!('overheated' in g.player));assert(!('heatMax' in CONFIG.player)&&!('heatPerShot' in CONFIG.player));
  });
  test('All four pickup effects apply and expire',()=>{
    for(let type=0;type<4;type++){g.combat.spawnPickup(type,0,0);g.player.hp=50;g.player.stamina=20;g.combat.update(1/60);if(type===0)assert(g.player.hp===80);if(type===1)assert(g.player.stamina===100);if(type===2)assert(g.player.speedBuff===8);if(type===3)assert(g.player.fireBuff===8);}g.input.clear();for(let i=0;i<481;i++)g.player.update(1/60,g);assert(g.player.speedBuff===0&&g.player.fireBuff===0&&g.combat.pickups.length===0);
  });
  test('All four weapon drops can appear and pickups equip or refill ammo',()=>{
    const ids=['rocket','shotgun','flame','electric'],random=g.world.grid.random;
    for(let i=0;i<4;i++){let calls=0;g.world.grid.random=()=>calls++===0?0:[.05,.15,.25,.35][i];g.combat.drop(10+i*2,0);assert(g.combat.pickups.at(-1)?.type===i+4&&g.combat.pickups.at(-1).mesh.children.length===1);g.combat.spawnPickup(i+4,0,0);g.combat.update(1/60);assert(g.player.weapon===ids[i]&&g.player.ammo===CONFIG.weapons[ids[i]].ammo);}
    g.world.grid.random=random;g.combat.spawnPickup(7,0,0);g.combat.update(1/60);assert(g.player.ammo===CONFIG.weapons.electric.maxAmmo);g.ui.update(0);assert(!document.getElementById('weapon-status').hidden&&document.getElementById('weapon-ammo').textContent===String(g.player.ammo));
    g.player.ammo=1;g.combat.firePlayer(g.player);g.ui.update(0);assert(g.player.weapon==='normal'&&g.player.ammo===0&&document.getElementById('weapon-status').hidden);
  });
  test('Rocket is a pooled projectile with splash damage',()=>{
    g.enemies.spawn({type:'gunner',x:6,z:0});g.enemies.spawn({type:'gunner',x:7.2,z:1.5});const [first,second]=g.enemies.list;
    g.player.equipWeapon('rocket');assert(g.combat.firePlayer(g.player)===CONFIG.weapons.rocket.interval);const rocket=g.combat.bullets.find(b=>b.active&&b.kind==='rocket');assert(rocket&&g.player.ammo===7);
    for(let i=0;i<20&&rocket.active;i++)g.combat.update(1/30);
    assert(!rocket.active&&first.hp<first.maxHP&&second.hp<second.maxHP&&g.combat.activeBullets.size===0);
  });
  test('Shotgun fires one six-pellet short-range fan per shell',()=>{
    g.player.equipWeapon('shotgun');g.combat.firePlayer(g.player);const pellets=[...g.combat.activeBullets];assert(pellets.length===6&&pellets.every(b=>b.kind==='pellet')&&g.player.ammo===19);assert(new Set(pellets.map(b=>Math.round(Math.atan2(b.vx,b.vz)*100))).size===6);g.combat.update(.5);assert(g.combat.activeBullets.size===0);
  });
  test('Flame burns visible targets and cannot pass through cover',()=>{
    g.enemies.spawn({type:'heavy',x:5,z:0});const e=g.enemies.list[0];g.player.equipWeapon('flame');const hp=e.hp;g.combat.firePlayer(g.player);assert(e.hp<hp&&e.burn>0);g.enemies.spawnTimer=100;g.enemies.update(.46);assert(e.hp<hp-CONFIG.weapons.flame.damage);
    e.burn=0;const blockedHP=e.hp,i=g.world.grid.index(13,12);g.world.grid.tiles[i]=TILE.BRICK;g.world.grid.hp[i]=50;g.world.rebuild(i);g.effects.clear();g.combat.firePlayer(g.player);assert(e.hp===blockedHP&&g.world.grid.hp[i]<50&&[...g.effects.active].every(index=>g.effects.particles[index].x<2));
  });
  test('Electricity chains between enemies and briefly stuns them',()=>{
    g.enemies.spawn({type:'gunner',x:5,z:0});g.enemies.spawn({type:'gunner',x:8,z:0});const [first,second]=g.enemies.list;g.player.equipWeapon('electric');g.combat.firePlayer(g.player);assert(first.hp<first.maxHP&&second.hp<second.maxHP&&first.stun>0&&second.stun>0&&g.effects.arcs.filter(a=>a.line.visible).length>=2);const x=first.x;g.enemies.spawnTimer=100;g.enemies.update(.1);assert(first.x===x);
  });
  test('Sustained special fire respects the existing projectile pool',()=>{
    g.player.equipWeapon('shotgun');g.player.equipWeapon('shotgun');for(let i=0;i<40;i++)g.combat.firePlayer(g.player);assert(g.combat.activeBullets.size===CONFIG.combat.maxBullets&&g.player.ammo===10);g.combat.update(1);assert(g.combat.activeBullets.size===0);g.combat.firePlayer(g.player);assert(g.combat.activeBullets.size===6&&g.player.ammo===9);
  });
  test('Special shots use distinct bounded visual effects',()=>{
    g.player.equipWeapon('rocket');g.combat.firePlayer(g.player);const rocket=g.combat.bullets.find(b=>b.active&&b.kind==='rocket');assert(rocket.mesh.geometry===g.combat.rocketGeometry&&rocket.mesh.material===g.combat.playerRoundMaterial&&rocket.mesh.scale.x>=1.2);g.combat.update(.1);assert([...g.effects.active].some(i=>g.effects.particles[i].color===0x8d9694));g.combat.explode(4,0,2.8,0,'player','rocket');assert(g.effects.rings.some(r=>r.mesh.visible&&r.mesh.material.color.getHex()===0xff9b50));
    g.combat.clear();g.effects.clear();g.player.equipWeapon('shotgun');g.combat.firePlayer(g.player);assert([...g.combat.activeBullets].every(b=>b.mesh.geometry===g.combat.pelletGeometry&&b.mesh.scale.x>=1.35));assert([...g.effects.active].length===7,'Shotgun should emit one shared muzzle fan');
    g.effects.clear();g.player.equipWeapon('flame');g.combat.firePlayer(g.player);assert([...g.effects.active].length===12);assert([...g.effects.active].every(i=>g.effects.particles[i].x<6.5));
    g.effects.clear();g.player.equipWeapon('electric');g.combat.firePlayer(g.player);const arc=g.effects.arcs.find(a=>a.line.visible);assert(arc&&arc.halo.visible&&arc.positions.length===21);assert(g.effects.active.size<=CONFIG.effects.high);g.effects.update(.3);assert(!arc.line.visible&&!arc.halo.visible);
  });
  test('City layout stays fixed through long survival and still reacts to destruction',()=>{
    const grid=g.world.grid,i=grid.index(13,12);grid.tiles[i]=TILE.BRICK;grid.hp[i]=grid.tileHP(TILE.BRICK);g.world.rebuild(i);
    const before=grid.tiles.slice(),version=grid.version;g.time=40;g.step(1/30);g.time=600;g.step(1/30);
    assert(grid.version===version&&grid.tiles.every((tile,i)=>tile===before[i]),'Map changed without damage');
    g.world.damage(i,grid.hp[i],g);assert(grid.tiles[i]===TILE.RUBBLE&&grid.version===version+1&&grid.connected(),'Destroyed roadside cover did not open a connected tile');
  });
  test('Brighter explosions fade while instanced particles stay capped',()=>{
    g.effects.explosion(0,0,2);const ring=g.effects.rings.find(r=>r.mesh.visible);assert(ring&&ring.mesh.material.opacity===.8);
    for(let i=0;i<20;i++)g.effects.explosion(i*.2,0,2);
    assert(g.effects.mesh.count===CONFIG.effects.high&&g.effects.active.size<=CONFIG.effects.high);
    g.effects.update(.19);assert(ring.mesh.material.opacity<.8);
  });
  test('Theme and battle music are distinct loops that follow game state',()=>{
    const audio=g.audio,theme=audio.musicBuffer('theme'),battle=audio.musicBuffer('battle');
    const energy=buffer=>{const samples=buffer.getChannelData(0);let total=0;for(let i=0;i<samples.length;i+=17)total+=samples[i]*samples[i];return Math.sqrt(total/Math.ceil(samples.length/17));};
    assert(theme.length>100000&&battle.length>100000&&theme.length!==battle.length&&energy(theme)>.025&&energy(battle)>.025);
    assert(audio.scene==='playing');g.togglePause();assert(audio.scene==='paused'&&!audio.musicVoice);g.togglePause();assert(audio.scene==='playing');
    g.end();assert(audio.scene==='over');g.home();assert(audio.scene==='menu');
    if(audio.context.state==='running')assert(audio.musicVoice?.track==='theme');
  });
  test('Buffered cannon shot has a strong transient and decaying tail',()=>{
    const buffer=g.audio.shotBuffer,data=buffer.getChannelData(0),rate=buffer.sampleRate;
    const rms=(start,end)=>{let energy=0,count=0;for(let i=Math.floor(start*rate);i<Math.floor(end*rate);i++){energy+=data[i]*data[i];count++;}return Math.sqrt(energy/count);};
    const crack=rms(.005,.065),tail=rms(.27,.38);
    assert(buffer.length>rate*.35&&crack>.035&&tail<crack*.6,`Unexpected cannon envelope: ${crack}, ${tail}`);
  });
  test('Active enemies invalidate cached paths after topology changes',()=>{
    g.enemies.spawn({type:'scout',x:19.2,z:0});const e=g.enemies.list[0];g.enemies.spawnTimer=100;g.enemies.update(1/60);assert(e.pathVersion===g.world.grid.version);const i=g.world.grid.index(19,12);g.world.grid.tiles[i]=TILE.BRICK;g.world.grid.hp[i]=1;g.world.damage(i,2,g);g.enemies.update(1/60);assert(e.pathVersion===g.world.grid.version);
  });
  test('Foreground house fades at full height and keeps collision',()=>{
    const world=g.world,i=world.grid.index(13,12);world.grid.tiles[i]=TILE.HOUSE;world.grid.hp[i]=Infinity;world.rebuild(i);world.fadeOccluders(g.player);
    assert(world.hiddenTiles.has(i));assert(world.ghosts.has(i));assert(world.tiles[i].scale.y===1);assert(world.ghosts.get(i).scale.y===1);
    assert(world.ghosts.get(i).children.every(part=>part.material.opacity===.18));assert(!world.grid.free(2.4,0,CONFIG.player.radius));
    g.player.x=-10;g.player.z=-10;world.fadeOccluders(g.player);assert(!world.hiddenTiles.has(i));assert(!world.ghosts.has(i));assert(world.tiles[i].scale.y===1);
  });
  g.start();g.world.fadeOccluders(g.player);g.ui.update(0);return results;
}
```


## tools/package.py

```python
"""Create the reviewable source listing and a self-contained static-site ZIP."""
from pathlib import Path
import hashlib
import json
import zipfile

root = Path(__file__).resolve().parents[1]
top = ['index.html', 'style.css', 'favicon.svg', 'crosshair.png', 'apple-touch-icon.png', 'site.webmanifest', '.nojekyll', '.gitignore', 'package.json', 'README.md', 'TESTING.md']
files = [root / name for name in top]
for directory in ['src', 'vendor', 'tests', 'tools']:
    files.extend(p for p in sorted((root / directory).rglob('*')) if p.is_file() and '__pycache__' not in p.parts)
language = {'.js':'javascript','.html':'html','.css':'css','.svg':'xml','.json':'json','.webmanifest':'json','.py':'python','.md':'markdown'}
listing = ['# Mã nguồn CHIBI TANK CITY: ENDLESS\n', 'Toàn bộ mã nguồn tự viết, theo đường dẫn. Bản Three.js 0.170.0 nguyên gốc và giấy phép nằm tại `vendor/` trong ZIP; không lặp thư viện minify trong tài liệu này.\n']
for p in files:
    if 'vendor' in p.relative_to(root).parts or 'results' in p.relative_to(root).parts or p.suffix == '.png':
        continue
    fence = '````' if p.suffix == '.md' else '```'
    listing.append('\n## '+p.relative_to(root).as_posix()+'\n\n'+fence+language.get(p.suffix,'text')+'\n'+p.read_text(encoding='utf-8').rstrip()+'\n'+fence+'\n')
(root / 'SOURCE.md').write_text('\n'.join(listing),encoding='utf-8')
files.append(root / 'SOURCE.md')
manifest = {p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
(root / 'MANIFEST.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
files.append(root / 'MANIFEST.json')
destination = root / 'chibi-tank-city-endless.zip'
with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
    for p in files:
        archive.write(p, 'chibi-tank-city/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(destination) as archive:
    assert archive.testzip() is None
    assert 'chibi-tank-city/vendor/three.module.min.js' in archive.namelist()
print(json.dumps({'archive':str(destination),'files':len(files),'bytes':destination.stat().st_size,'sha256':hashlib.sha256(destination.read_bytes()).hexdigest()}))
```
