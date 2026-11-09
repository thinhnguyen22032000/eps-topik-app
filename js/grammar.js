import { esc, speak, loadJSON } from "./util.js";
import { loadAllLessons } from "./lessons.js";

export async function initGrammar(root) {
  const data = await loadJSON("./data/grammar.json");
  // gộp ngữ pháp theo từng bài (bài 1–10) vào danh sách điểm ngữ pháp
  const lessons = await loadAllLessons();
  const seen = new Set(data.points.map((p) => p.pattern));
  lessons.forEach((l) => (l.grammar || []).forEach((g) => {
    if (!seen.has(g.pattern)) { seen.add(g.pattern); data.points.push({ ...g, lesson: l.number }); }
  }));
  let view = "points";

  const pointCard = (g) => `
    <article class="bg-white rounded-2xl shadow p-5">
      <h3 class="text-xl font-bold text-blue-700">${esc(g.pattern)}${g.lesson ? ` <span class="text-xs font-normal bg-slate-100 text-slate-500 rounded-full px-2 py-0.5 align-middle">Bài ${g.lesson}</span>` : ""}</h3>
      <p class="text-sm text-slate-500 mb-3">${esc(g.meaning)}</p>
      <p class="mb-3">${esc(g.explanation)}</p>
      <p class="text-sm bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3"><b>Cấu tạo:</b> ${esc(g.formation)}</p>
      <ul class="space-y-2">${g.examples.map((e) => `
        <li class="flex items-start gap-2">
          <button data-say="${esc(e.ko)}" class="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm" aria-label="Nghe">🔊</button>
          <div><p class="font-medium">${esc(e.ko)}</p><p class="text-sm text-slate-500">${esc(e.vi)}</p></div>
        </li>`).join("")}</ul>
    </article>`;

  const pairCard = (p) => `
    <article class="bg-white rounded-2xl shadow overflow-hidden">
      <div class="grid grid-cols-2 text-center font-bold text-white">
        <div class="bg-blue-600 py-2">${esc(p.a.label)}</div>
        <div class="bg-orange-500 py-2">${esc(p.b.label)}</div>
      </div>
      <div class="grid grid-cols-2 divide-x text-sm">
        <div class="p-3"><p class="text-xs uppercase text-slate-400">Cách dùng</p><p>${esc(p.a.use)}</p>
          <p class="text-xs uppercase text-slate-400 mt-2">Ví dụ</p>
          <button data-say="${esc(p.a.example)}" class="text-left text-blue-700 hover:underline">🔊 ${esc(p.a.example)}</button></div>
        <div class="p-3"><p class="text-xs uppercase text-slate-400">Cách dùng</p><p>${esc(p.b.use)}</p>
          <p class="text-xs uppercase text-slate-400 mt-2">Ví dụ</p>
          <button data-say="${esc(p.b.example)}" class="text-left text-orange-700 hover:underline">🔊 ${esc(p.b.example)}</button></div>
      </div>
      <p class="bg-amber-50 border-t border-amber-200 px-4 py-2 text-sm">💡 <b>Mẹo thi:</b> ${esc(p.tip)}</p>
    </article>`;

  function render() {
    root.innerHTML = `
      <div class="flex flex-wrap gap-2 mb-5">
        <button data-view="points" class="tab-btn ${view === "points" ? "active" : ""}">Ngữ pháp trọng tâm</button>
        <button data-view="pairs" class="tab-btn ${view === "pairs" ? "active" : ""}">⚖️ Cặp dễ nhầm lẫn</button>
      </div>
      <div class="grid gap-4 md:grid-cols-2">
        ${(view === "points" ? data.points.map(pointCard) : data.pairs.map(pairCard)).join("")}
      </div>`;
    root.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => { view = b.dataset.view; render(); }));
    root.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => speak(b.dataset.say)));
  }
  render();
}
