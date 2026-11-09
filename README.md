# EPS-TOPIK Study App

Ứng dụng web (HTML/JS + Tailwind CDN, không cần build) giúp lao động ôn thi EPS-TOPIK: học Hangeul, bài học (từ vựng, ngữ pháp, hội thoại, văn hóa), flashcard, biển báo an toàn và thi thử CBT.

## Chạy thử

Trang dùng `fetch` và ES modules nên cần một HTTP server cục bộ:

```bash
npx serve .
# hoặc
python -m http.server 8765
```

Mở http://localhost:8765/ (hoặc cổng mà `serve` in ra).

## Cấu trúc

```
index.html            # khung app: sidebar + các tab
css/style.css
js/                   # mỗi tab một module: hangeul, lesson, flashcard, grammar, safety, mocktest, dashboard
data/
  lessons/            # lesson-01..20.json + index.json (SINH TỰ ĐỘNG, đừng sửa tay)
  hangeul.json  grammar.json  safety-signs.json  mocktest-01.json  meta.json
img/signs/            # 22 biển báo SVG (SINH TỰ ĐỘNG bằng tools/build-signs.mjs)
tools/                # script sinh dữ liệu (Node): build-lessons, build-signs, dialogues, expansions
```

Sinh lại dữ liệu sau khi sửa nguồn:

```bash
node tools/build-lessons.mjs   # từ tools/build-lessons.mjs + dialogues.mjs + expansions.mjs
node tools/build-signs.mjs
```

Tiến trình học (SRS, streak, điểm thi) lưu trong `localStorage` của trình duyệt.

## Tình trạng nội dung (quan trọng)

Toàn bộ từ vựng, ngữ pháp, hội thoại, đề thi thử và phần văn hóa do nhóm phát triển **tự biên soạn** theo chủ đề và trình độ EPS-TOPIK. **Chưa** phải bản sao hay đã được đối chiếu với giáo trình chính thức của HRD Korea, và 17/20 bài chưa mở rộng đầy đủ (mới bài 1–3). Mỗi bài có cờ `source.verified` (mặc định `false`); chỉ bật `true` sau khi đã đối chiếu thật với giáo trình. Biển báo SVG là hình tự vẽ để giữ chỗ, có thể thay bằng ảnh chuẩn (xem `data/safety-signs.json`, mục `imageGuide`).
