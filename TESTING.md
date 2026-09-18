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
