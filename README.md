# CHIBI TANK CITY: ENDLESS

Game xe tăng 3D sinh tồn, giao diện tiếng Việt, thành phố tự thay đổi trong cùng một trận. Bản đồ tập trung vào khu đô thị với nhà ở, cao tầng và dãy hàng quán; công trình bị bắn sập sẽ thành đống đổ nát mở lối mới. Ngày và đêm luân phiên mỗi 60 giây; ban đêm biến địch thành xe tăng zombie có lượng máu ×2. HTML/CSS/JavaScript ES Modules, Three.js **0.170.0** đóng gói tại `vendor/`. Không build, backend, tài khoản, CDN, model, texture hay audio tải ngoài. Âm thanh tổng hợp bằng Web Audio sau thao tác người chơi.

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

Thân xe xoay theo di chuyển; tháp pháo xoay riêng theo điểm chuột chiếu xuống mặt đất. Bắn liên tục tám phát sẽ làm nòng pháo quá nhiệt và khóa cò; phải nhả cò hoặc nhả cần ngắm để tản nhiệt, nòng mở lại khi xuống 40%. Các loạt bắn ngắn tự hạ nhiệt sau 0,25 giây. Vật phẩm Bắn nhanh tạo ít nhiệt hơn mỗi phát để vẫn giữ giá trị nâng cấp. Dash có 0,12 giây bất tử trong 0,18 giây di chuyển. Nhận sát thương có 0,65 giây bảo vệ. Dùng vật cản để cắt đường đạn. Nút toàn màn hình dùng Fullscreen API trên desktop và điện thoại; khi đang chơi bằng cảm ứng, game cũng thử khóa ngang màn hình. Trình duyệt không cung cấp API sẽ hiện thông báo ngắn. Mất focus hoặc đổi tab sẽ xóa phím đang giữ và tạm dừng; trở lại bằng Esc hoặc nút Tiếp tục.

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
│   ├── combat.js           Pool đạn, pháo cối, vật phẩm, nổ dây chuyền
│   ├── world.js            Địa hình, cảnh báo, commit, instancing
│   ├── models.js           Mô hình xe và thành phố từ geometry
│   ├── effects.js          Pool particle/debris, shockwave, popup
│   ├── audio.js            Web Audio tổng hợp
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
| `world.shiftMin / shiftMax` | 35 / 50 s | Khoảng giữa các đợt tái cấu trúc |
| `world.warning` | 2 s | Cảnh báo trước commit |
| `world.protectRadius` | 5,5 | Vùng đệm bảo vệ người chơi quanh khu vực sắp đổi |
| `world.phaseDuration` | 60 s | Thời lượng mỗi pha ngày hoặc đêm |
| `player.hp / stamina` | 100 / 100 | Giáp và năng lượng tối đa |
| `player.speed / radius` | 6 / 0,62 | Tốc độ, bán kính va chạm |
| `player.fireInterval / damage` | 0,25 s / 28 | Tốc độ bắn, sát thương |
| `player.heatMax / heatPerShot` | 100 / 14 | Ngưỡng quá nhiệt và nhiệt mỗi phát; tám phát liên tục sẽ khóa nòng |
| `player.heatCoolRate / heatCoolDelay / heatUnlock` | 45/s / 0,25 s / 40 | Tốc độ, độ trễ tản nhiệt và ngưỡng mở khóa nòng |
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
| `combat.bulletSpeed / enemyBulletSpeed` | 25 / 10 | Tốc độ đạn ban đầu |
| `combat.comboWindow / maxCombo` | 4 s / ×5 | Combo hết khi quá hạn hoặc nhận sát thương |
| `combat.survivalScore` | 5/giây | Điểm thời gian |
| `combat.maxPickups` | 16 | Vật phẩm cùng lúc, tự hết sau 18 giây |
| `effects.high / popups` | 96 / 16 | Pool particle/debris và popup gọn nhẹ |
| `performance.softwareFPS / highFPS` | 24 / 60 | Trần khung hình cho SwiftShader và WebGL phần cứng; menu/pause chạy 4 FPS |
| `colors` | Mint, trời, vàng, san hô | Bảng màu chính |
| `ENEMIES` | Scout / Gunner / Heavy / Mortar / Elite | HP, tốc độ, silhouette, điểm và chu kỳ bắn từng loại |

Director tăng HP tối đa 70%, tốc độ đạn tối đa 45%, tăng tỷ trọng đối thủ mạnh và hành vi đánh vòng theo thời gian. 12 giây đầu chỉ có Scout; Gunner, Heavy và Mortar được mở dần trong 45 giây đầu để người mới học điều khiển. Từ giây 24, các đợt tấn công đưa 3–5 xe vào trận cách nhau 0,6 giây; ban đêm có thêm một zombie. Tổng địch và spawn chờ bị giới hạn ở 16. Điểm tiêu diệt: Scout 100, Gunner 180, Heavy 350, Mortar 250, Elite 1800, nhân combo. Các mốc sống sót 30/60/120 giây có điểm thưởng. Không có điểm từ công trình.

Trên thiết bị cảm ứng, game vẫn dùng cấu hình đồ họa cao, phóng camera gần hơn và dùng trợ ngắm nhẹ trong một góc hẹp theo hướng kéo; vật cản vẫn chặn khóa mục tiêu. Giao diện yêu cầu xoay ngang để giữ đủ không gian cho hai cần điều khiển.

Game dùng một cấu hình hình ảnh cao cố định. WebGL phần cứng dùng mật độ điểm ảnh `min(devicePixelRatio, 1.25)` và hướng tới 60 FPS; SwiftShader dùng độ phân giải native, 24 FPS và bỏ tone mapping nặng. MSAA, shadow map thời gian thực và nguồn sáng điểm động được tắt; vật liệu Lambert, bảng màu và silhouette giữ hình ảnh rõ với shader nhẹ. Bóng tiếp xúc mềm của công trình/xe được gộp trong hai `InstancedMesh`; quầng sáng xanh dưới xe người chơi chỉ hiện ban đêm. Hai texture radial 64×64 được tạo tại runtime, không tải tài nguyên ngoài. Mô phỏng chạy 30 tick/giây. Menu, pause và Game Over chỉ render 4 FPS; tab ẩn không render. Particle, đạn và pháo cối chỉ cập nhật các slot đang sống; AI quét tầm nhìn theo nhịp chia đều; minimap và vòng cập nhật canvas phụ đã được loại bỏ; cảnh báo địa hình dùng một `InstancedMesh`. Các animation trang trí ở địa hình, điểm spawn, vòng ngắm địch, độ giật nòng và HUD đã được bỏ.

Hình xe tăng vẫn giữ bánh, xích, đèn, ăng-ten, tháp pháo và màu riêng của từng bộ phận. Nòng pháo được gộp vào mesh tháp pháo; các phần còn lại được ghép trước khi gửi sang GPU. Nhà cao tầng, hàng quán và cây giữ silhouette nhưng giảm chi tiết hình học nhỏ; bản sao trong suốt của nhà che khuất xe dùng silhouette gọn hơn. HUD giáp, năng lượng và nhiệt nòng chỉ còn một cụm ba vòng 150 px trên desktop và 136 px trên mobile. Khung điểm chỉ giữ điểm, combo và thời gian. Đồng hồ ngày–đêm cùng bộ đếm tái cấu trúc được rút gọn thành hai pill ở giữa; cả bốn cụm HUD nằm trên một hàng cùng chiều cao. Thanh tên game, minimap và nút audio/settings không xuất hiện trong gameplay.

Mỗi trận bắt đầu vào ban ngày. Sau 60 giây, ánh sáng chuyển dần sang đêm và mọi địch đang sống hoặc xuất hiện mới trở thành zombie: mắt xanh, gai xanh và vòng sáng xanh; `maxHP` tăng ×2 nhưng giữ nguyên phần trăm máu hiện tại. Sau 60 giây đêm, bình minh đưa chúng về chỉ số thường theo cùng nguyên tắc. Đồng hồ HUD luôn hiển thị thời gian còn lại của pha hiện tại.

## Địa hình thay đổi như thế nào?

Grid 25×25 chỉ là dữ liệu nội bộ cho va chạm và navigation. Mỗi seed tạo một lõi cao tầng gọn quanh trung tâm, có vành đường/quảng trường làm khoảng lùi trước khi chuyển sang hàng quán mặt phố và khu nhà thấp tầng. Các cụm cây nhỏ được đặt tách nhau và luôn tiếp giáp đường; nền đi lại dùng cùng bề mặt sáng, không còn ô cỏ kẻ vạch như lối dạo. Các điểm mốc ngẫu nhiên nối thành mạng phố có nhánh, vòng nối và bốn lối tiếp cận ngoài rìa; không còn mạng đại lộ lặp đều kiểu bàn cờ. Mỗi seed được flood-fill trước khi sử dụng nên mọi ô đi được đều nối với khu trung tâm.

Tường gạch, thép, nhà, cây, cao tầng và hàng quán có HP riêng. Đạn và vụ nổ làm giảm HP; khi sập, công trình trở thành rubble có thể đi xuyên qua, collision và đường BFS cập nhật ngay trong cùng tick.

1. Từ 2–3 điểm ngẫu nhiên, lan một vùng có biên bất quy tắc chiếm 10–18% bản đồ và tránh vùng bảo vệ quanh mọi entity.
2. Sinh một mạng phố mới, lấy cấu trúc trong vùng đã chọn và chỉ chấp nhận ứng viên có ít nhất tám thay đổi đóng/mở lối đi. Flood-fill xác nhận toàn bộ đường vẫn liên thông.
3. Vẽ đúng đường biên bất quy tắc bằng màu vàng trong hai giây và phát âm cảnh báo. Mô phỏng và trận chiến vẫn tiếp diễn.
4. Ngay trước commit, ghép phần ngoài vùng cảnh báo từ địa hình hiện hành để giữ nguyên tường vừa bị phá và mọi diễn biến ở nơi khác.
5. Nếu xe vừa tiến vào vùng cảnh báo, hệ thống giữ ô quanh xe và mở các lối an toàn trong vùng đó. Chu kỳ vẫn tạo thay đổi, không dịch chuyển xe và không gây sát thương bất ngờ.
6. Cập nhật grid, collision, mesh và `version` trong cùng tick, rồi nâng các vật thể thay đổi từ nền trong 0,5 giây. AI thấy `version` mới sẽ bỏ đường cũ và tìm lại bằng BFS. Đạn luôn va chạm theo địa hình hiện hành.

BFS phù hợp grid 625 ô, không cần physics engine. Mỗi chu kỳ thực sự mở hoặc đóng đường nhánh, đổi cover và đường đi. Nếu ứng viên đóng đường không còn an toàn, phương án dự phòng sẽ mở đường mới để lần tái cấu trúc đó vẫn xảy ra.

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
