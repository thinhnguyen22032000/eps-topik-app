// Đóng gói app thành 1 trang HTML tự chứa (CSS + JS inline) + data/ + img/ để publish lên Claude Artifact (xem trên điện thoại).
// Chạy: node tools/build-artifact.mjs <thư-mục-đầu-ra>
// Cần esbuild: npx --yes esbuild (tự tải khi chạy lần đầu).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const out = path.resolve(process.argv[2] || "dist-artifact");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

// 1. Gộp toàn bộ module JS thành một script thường (IIFE)
const bundle = execFileSync("npx", ["--yes", "esbuild@0.21.5", "js/main.js", "--bundle", "--format=iife", "--minify"], { encoding: "utf8", shell: true, maxBuffer: 64 * 1024 * 1024 });

// 2. Lấy phần thân của index.html (giữa <body> và thẻ script cuối)
const src = fs.readFileSync("index.html", "utf8");
const inner = src.slice(src.indexOf("<body"), src.lastIndexOf("<script type=\"module\"")).replace(/^<body[^>]*>/, "");
const css = fs.readFileSync("css/style.css", "utf8");

// Nền cố định cho body vì trang chủ động dùng giao diện sáng
const html = `<title>EPS-TOPIK Ôn Thi</title>
<style>
body { background: #f1f5f9; color: #1e293b; margin: 0; }
${css}
</style>
<script src="https://cdn.tailwindcss.com/3.4.17"></script>
<div class="bg-slate-100 min-h-screen text-slate-800">
${inner}
</div>
<script>
${bundle.replace(/<\/script/gi, "<\\/script")}
</script>
`;
fs.writeFileSync(path.join(out, "index.html"), html);

// 3. Dữ liệu và ảnh
for (const dir of ["data", "img"]) fs.cpSync(dir, path.join(out, dir), { recursive: true });
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); f.isDirectory() ? walk(p) : files.push(path.relative(out, p).replaceAll("\\", "/")); } })(out);
console.log("OUT", out, "files:", files.length, "html KB:", Math.round(html.length / 1024));
