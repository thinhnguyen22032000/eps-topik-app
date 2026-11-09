// Sinh img/signs/*.svg (khung + màu chuẩn ISO 7010) và cập nhật data/safety-signs.json
// Chạy: node tools/build-signs.mjs
// Các hình bên trong là pictogram đơn giản tự vẽ để làm chỗ giữ. Muốn dùng hình chuẩn HRD Korea / KOSHA:
// chép file cùng tên (slug.svg hoặc .png) đè vào img/signs/ — không cần sửa code.
import fs from "node:fs";

const COLORS = { prohibition: "#D3202B", warning: "#F9C400", mandatory: "#0A57A6", safe: "#00913F" };

const person = `<circle cx="50" cy="26" r="9"/><path d="M38 40h24l5 26h-9v18h-7V68h-2v16h-7V66h-9z"/>`;
const hand = `<path d="M36 82V50l-7-9 4-3 7 6V24h5v24h3V20h5v28h3V24h5v30l5-9 5 3-9 31z"/>`;
const P = { // pictogram, vẽ trong hệ 100x100
  person,
  cigarette: `<rect x="22" y="56" width="42" height="9"/><rect x="66" y="56" width="10" height="9" fill="#999"/><path d="M70 50c-4-6 4-8 0-14M78 50c-4-6 4-8 0-14" fill="none" stroke="currentColor" stroke-width="3"/>`,
  flame: `<path d="M50 18c4 12 20 22 20 40a20 20 0 0 1-40 0c0-10 6-15 9-24 4 4 6 8 6 12 4-8 5-17 5-28z"/>`,
  hand,
  bolt: `<path d="M58 16 32 54h16l-6 30 26-40H52z"/>`,
  falling: `<rect x="36" y="16" width="28" height="18"/><path d="M50 84 30 58h13V42h14v16h13z"/>`,
  slip: `<g transform="rotate(28 50 46)">${person}</g><path d="M18 84h64" stroke="currentColor" stroke-width="4"/>`,
  heat: `<path d="M30 76c-8-10 8-14 0-26s8-14 0-24M50 76c-8-10 8-14 0-26s8-14 0-24M70 76c-8-10 8-14 0-26s8-14 0-24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
  forklift: `<rect x="20" y="48" width="36" height="22"/><rect x="58" y="22" width="6" height="52"/><rect x="64" y="64" width="20" height="5"/><circle cx="30" cy="76" r="7"/><circle cx="50" cy="76" r="7"/>`,
  skull: `<path d="M50 16a24 24 0 0 0-13 44v12h26V60a24 24 0 0 0-13-44z"/><circle cx="41" cy="44" r="6" fill="#fff"/><circle cx="59" cy="44" r="6" fill="#fff"/><path d="M22 80l56-14M22 66l56 14" stroke="currentColor" stroke-width="5"/>`,
  helmet: `<path d="M22 62a28 28 0 0 1 56 0z"/><rect x="16" y="62" width="68" height="9" rx="4"/><rect x="45" y="26" width="10" height="14"/>`,
  goggles: `<circle cx="34" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="66" cy="50" r="14" fill="none" stroke="currentColor" stroke-width="6"/><rect x="46" y="47" width="8" height="6"/><rect x="12" y="47" width="8" height="6"/><rect x="80" y="47" width="8" height="6"/>`,
  boot: `<path d="M36 18h22v34l24 10v20H30z"/>`,
  glove: hand,
  mask: `<path d="M22 38q28-14 56 0v24q-28 20-56 0z"/><path d="M14 44l8 2M86 44l-8 2M14 58l8-2M86 58l-8-2" stroke="currentColor" stroke-width="3"/>`,
  earmuff: `<path d="M24 56a26 26 0 0 1 52 0" fill="none" stroke="currentColor" stroke-width="6"/><rect x="18" y="54" width="14" height="26" rx="5"/><rect x="68" y="54" width="14" height="26" rx="5"/>`,
  exit: `<rect x="58" y="20" width="24" height="60"/><g transform="translate(-14 0) scale(.9)">${person}</g><path d="M30 62h20m-7-7 7 7-7 7" fill="none" stroke="currentColor" stroke-width="4"/>`,
  cross: `<path d="M40 20h20v20h20v20H60v20H40V60H20V40h20z"/>`,
  extinguisher: `<rect x="36" y="38" width="28" height="44" rx="7"/><rect x="43" y="24" width="14" height="14"/><path d="M57 28h14l9 12" fill="none" stroke="currentColor" stroke-width="4"/>`,
  drop: `<path d="M50 16C36 36 28 46 28 58a22 22 0 0 0 44 0c0-12-8-22-22-42z"/>`,
  house: `<path d="M50 20 16 50h12v32h44V50h12z"/>`,
};

const SPEC = { // ko -> [slug, pictogram]
  "출입금지": ["no-entry", "person"], "금연": ["no-smoking", "cigarette"], "화기엄금": ["no-fire", "flame"],
  "손대지 마시오": ["no-touch", "hand"], "통행금지": ["no-passage", "person"],
  "고압전기": ["high-voltage", "bolt"], "낙하물 주의": ["falling-objects", "falling"], "미끄럼 주의": ["slippery", "slip"],
  "고온 주의": ["high-temperature", "heat"], "지게차 주의": ["forklift", "forklift"], "유해물질 경고": ["toxic", "skull"],
  "안전모 착용": ["helmet", "helmet"], "보안경 착용": ["goggles", "goggles"], "안전화 착용": ["safety-boots", "boot"],
  "보호장갑 착용": ["gloves", "glove"], "방진마스크 착용": ["dust-mask", "mask"], "귀마개 착용": ["ear-protection", "earmuff"],
  "비상구": ["emergency-exit", "exit"], "응급처치": ["first-aid", "cross"], "소화기": ["extinguisher", "extinguisher"],
  "세안 설비": ["eye-wash", "drop"], "대피소": ["shelter", "house"],
};

function svg(group, pic) {
  const c = COLORS[group], body = P[pic];
  const frame = {
    prohibition: `<circle cx="50" cy="50" r="44" fill="#fff" stroke="${c}" stroke-width="9"/><g fill="#111" color="#111" transform="translate(0 0) scale(.78) translate(14 14)">${body}</g><path d="M19 81 81 19" stroke="${c}" stroke-width="9"/>`,
    warning: `<path d="M50 6 95 88H5z" fill="${c}" stroke="#111" stroke-width="5" stroke-linejoin="round"/><g fill="#111" color="#111" transform="translate(25 32) scale(.5)">${body}</g>`,
    mandatory: `<circle cx="50" cy="50" r="46" fill="${c}"/><g fill="#fff" color="#fff" transform="translate(11 11) scale(.78)">${body}</g>`,
    safe: `<rect x="4" y="4" width="92" height="92" rx="10" fill="${c}"/><g fill="#fff" color="#fff" transform="translate(11 11) scale(.78)">${body}</g>`,
  }[group];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img">${frame}</svg>\n`;
}

const SOURCES = {
  prohibition: "Mẫu chuẩn: biển P*** theo ISO 7010 (nền trắng, viền + gạch chéo đỏ). Tìm: 'ISO 7010 prohibition signs' trên Wikimedia Commons (kiểm tra giấy phép từng file).",
  warning: "Mẫu chuẩn: biển W*** theo ISO 7010 (tam giác vàng viền đen). Tìm: 'ISO 7010 warning signs' trên Wikimedia Commons.",
  mandatory: "Mẫu chuẩn: biển M*** theo ISO 7010 (tròn xanh dương, hình trắng). Tìm: 'ISO 7010 mandatory signs' trên Wikimedia Commons.",
  safe: "Mẫu chuẩn: biển E*** / F*** theo ISO 7010 (vuông xanh lá, hình trắng). Tìm: 'ISO 7010 safe condition signs' trên Wikimedia Commons.",
};
const KOREA_HINT = "Biển báo hàn quốc: tra '안전보건표지' trên trang Cơ quan An toàn Sức khỏe Hàn Quốc (KOSHA, kosha.or.kr) và giáo trình EPS-TOPIK của HRD Korea. Cần kiểm tra bản quyền trước khi dùng thương mại.";

const file = "data/safety-signs.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));
fs.mkdirSync("img/signs", { recursive: true });
data.imageGuide = {
  howToReplace: "Chép file ảnh (svg/png) vào img/signs/ rồi sửa trường 'image' của biển tương ứng nếu đổi đuôi file. Không cần sửa code.",
  koreaSource: KOREA_HINT,
};
for (const g of data.groups) {
  g.color = COLORS[g.id]; g.sourceHint = SOURCES[g.id];
  for (const s of g.signs) {
    const spec = SPEC[s.ko]; if (!spec) throw new Error("Thiếu SPEC: " + s.ko);
    fs.writeFileSync(`img/signs/${spec[0]}.svg`, svg(g.id, spec[1]));
    s.slug = spec[0]; s.image = `img/signs/${spec[0]}.svg`;
  }
}
fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log("OK", Object.keys(SPEC).length, "biển");
