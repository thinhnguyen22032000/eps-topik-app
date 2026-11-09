// Nhập môn Hangeul: nguyên âm, phụ âm, ghép vần (có bộ ghép tương tác), patchim, quy tắc đọc
import { esc, speak, loadJSON } from "./util.js";

const LEADS = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const VOWELS = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
const TAILS = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const TAIL_COMMON = ["", "ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅇ"]; // 7 patchim đại diện + không có

// Công thức Unicode: 0xAC00 + (phụ âm đầu × 21 + nguyên âm) × 28 + phụ âm cuối
export const compose = (lead, vowel, tail = "") =>
  String.fromCharCode(0xac00 + (LEADS.indexOf(lead) * 21 + VOWELS.indexOf(vowel)) * 28 + TAILS.indexOf(tail));

const TABS = [["vowel", "Nguyên âm"], ["cons", "Phụ âm"], ["build", "Ghép vần"], ["patchim", "Patchim"], ["rules", "Quy tắc đọc"]];

export async function initHangeul(root) {
  const data = await loadJSON("./data/hangeul.json");
  let tab = "vowel";
  const b = { lead: "ㄱ", vowel: "ㅏ", tail: "" }; // trạng thái bộ ghép vần

  const sayVowel = (v) => compose("ㅇ", v);
  const sayCons = (c) => compose(c, "ㅏ");

  const letterCard = (x, say, big) => `
    <button data-say="${esc(say)}" class="bg-white rounded-2xl shadow p-3 text-center hover:ring-2 hover:ring-blue-400 transition w-full">
      <p class="text-5xl font-bold">${esc(x.c)}</p>
      ${x.name ? `<p class="text-xs text-slate-400">${esc(x.name)}</p>` : ""}
      <p class="text-blue-700 font-semibold mt-1">${esc(x.vi)}</p>
      <p class="text-sm mt-1">${esc(x.ex)} <span class="text-slate-500">· ${esc(x.exVi)}</span></p>
      ${x.note ? `<p class="text-xs text-amber-700 mt-1">${esc(x.note)}</p>` : ""}
      <p class="text-xs text-slate-300 mt-1">🔊 bấm để nghe</p>
    </button>`;

  const groups = (list, say) => {
    const order = [...new Set(list.map((x) => x.group))];
    return order.map((g) => `
      <h3 class="font-bold mt-5 mb-2">${esc(data.groupLabels[g])}</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">${list.filter((x) => x.group === g).map((x) => letterCard(x, say(x.c))).join("")}</div>`).join("");
  };

  const grid = () => { // bảng 가나다: phụ âm × 10 nguyên âm cơ bản
    const rows = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
    const cols = ["ㅏ","ㅑ","ㅓ","ㅕ","ㅗ","ㅛ","ㅜ","ㅠ","ㅡ","ㅣ"];
    return `<div class="overflow-x-auto bg-white rounded-2xl shadow p-3"><table class="mx-auto text-center">
      <tr><th></th>${cols.map((v) => `<th class="p-1 text-slate-400">${v}</th>`).join("")}</tr>
      ${rows.map((c) => `<tr><th class="p-1 text-slate-400">${c}</th>${cols.map((v) => { const s = compose(c, v); return `<td><button data-say="${s}" class="w-10 h-10 sm:w-12 sm:h-12 text-xl rounded-lg hover:bg-blue-100">${s}</button></td>`; }).join("")}</tr>`).join("")}
    </table></div>`;
  };

  const builder = () => {
    const syl = compose(b.lead, b.vowel, b.tail);
    const pick = (arr, key, cls) => arr.map((x) => `<button data-b="${key}" data-v="${x}" class="w-10 h-10 rounded-lg border text-lg ${b[key] === x ? "bg-blue-600 text-white border-blue-600" : "bg-white hover:bg-blue-50"}">${x || "∅"}</button>`).join("");
    return `
      <div class="bg-white rounded-2xl shadow p-5 mb-5">
        <div class="flex flex-col sm:flex-row items-center gap-6">
          <div class="text-center">
            <p id="syl" class="text-8xl font-bold">${syl}</p>
            <p class="text-slate-500 mt-1">${b.lead} + ${b.vowel}${b.tail ? " + " + b.tail : ""}</p>
            <button data-say="${syl}" class="mt-3 px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold">🔊 Nghe</button>
          </div>
          <div class="flex-1 text-sm space-y-3 w-full">
            <div><p class="font-semibold mb-1">1. Phụ âm đầu</p><div class="flex flex-wrap gap-1">${pick(LEADS, "lead")}</div></div>
            <div><p class="font-semibold mb-1">2. Nguyên âm</p><div class="flex flex-wrap gap-1">${pick(VOWELS, "vowel")}</div></div>
            <div><p class="font-semibold mb-1">3. Patchim (phụ âm cuối, ∅ = không có)</p><div class="flex flex-wrap gap-1">${pick(TAIL_COMMON, "tail")}</div></div>
          </div>
        </div>
        <p class="text-sm text-slate-500 mt-4">Nguyên âm đứng dọc (ㅏ ㅣ ㅓ…) viết bên phải phụ âm, nguyên âm ngang (ㅗ ㅜ ㅡ) viết bên dưới. Patchim luôn nằm ở dưới cùng.</p>
      </div>
      <h3 class="font-bold mb-2">Bảng ghép 가나다</h3>${grid()}`;
  };

  const patchim = () => `
    <p class="mb-3 text-slate-600">Patchim là phụ âm cuối của âm tiết. Dù có tới 27 cách viết, chỉ có <b>7 âm</b> khi đọc. Âm cuối tiếng Hàn gần giống âm cuối tiếng Việt (c, n, t, l, m, p, ng).</p>
    <div class="grid gap-3 md:grid-cols-2">${data.patchim.map((p) => `
      <article class="bg-white rounded-2xl shadow p-4">
        <div class="flex items-baseline justify-between"><h3 class="text-xl font-bold text-blue-700">${esc(p.sound)}</h3>
          <span class="text-lg">${esc(p.letters)}</span></div>
        <p class="text-sm text-slate-600 my-2">${esc(p.vi)}</p>
        <div class="flex flex-wrap gap-2">${p.examples.map(([ko, ph, vi]) => `
          <button data-say="${esc(ko)}" class="border rounded-xl px-3 py-1.5 text-left hover:bg-blue-50">
            <span class="text-xl font-bold">${esc(ko)}</span> <span class="text-xs text-slate-500 block">${esc(ph)} · ${esc(vi)}</span></button>`).join("")}</div>
      </article>`).join("")}</div>`;

  const rules = () => `<div class="grid gap-3 md:grid-cols-2">${data.rules.map((r) => `
    <article class="bg-white rounded-2xl shadow p-4">
      <h3 class="font-bold text-blue-700">${esc(r.title)}</h3>
      <p class="text-sm my-2">${esc(r.body)}</p>
      <div class="flex flex-wrap gap-2">${r.examples.map(([a, c]) => `
        <button data-say="${esc(a.replace(/[^가-힣]/g, "") || c.replace(/[^가-힣]/g, ""))}" class="border rounded-xl px-3 py-1.5 hover:bg-blue-50 text-sm"><b>${esc(a)}</b> → ${esc(c)}</button>`).join("")}</div>
    </article>`).join("")}</div>`;

  function render() {
    const body = { vowel: () => groups(data.vowels, sayVowel), cons: () => groups(data.consonants, sayCons), build: builder, patchim, rules }[tab]();
    root.innerHTML = `
      <div class="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4 text-sm">👋 <b>Mới bắt đầu?</b> ${esc(data.intro)}</div>
      <div class="flex gap-2 overflow-x-auto mb-4">${TABS.map(([k, t]) => `<button data-t="${k}" class="tab-btn ${k === tab ? "active" : ""}">${t}</button>`).join("")}</div>
      ${body}`;
    root.querySelectorAll("[data-t]").forEach((x) => x.addEventListener("click", () => { tab = x.dataset.t; render(); }));
    root.querySelectorAll("[data-say]").forEach((x) => x.addEventListener("click", () => speak(x.dataset.say, 0.7)));
    root.querySelectorAll("[data-b]").forEach((x) => x.addEventListener("click", () => { b[x.dataset.b] = x.dataset.v; render(); speak(compose(b.lead, b.vowel, b.tail), 0.7); }));
  }
  render();
}
