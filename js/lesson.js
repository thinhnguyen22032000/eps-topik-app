// Màn "Bài học": từ vựng 1, từ vựng 2, ngữ pháp, hội thoại 1 & 2, văn hóa/công xưởng, ôn flashcard riêng của bài
import { esc, speak, loadJSON } from "./util.js";
import { loadLessonIndex, loadLesson } from "./lessons.js";
import { loadState, getCard, isDue } from "./srs.js";

const LS_LESSON = "eps-last-lesson";
const SECTIONS = [
  ["v1", "📗 Từ vựng 1"], ["v2", "📘 Từ vựng 2"], ["gr", "✏️ Ngữ pháp"], ["dl", "💬 Hội thoại"], ["cu", "🏭 Văn hóa & An toàn"], ["fc", "🃏 Ôn Flashcard"],
];
const FIELD = { general: "Chung", manufacturing: "Cơ khí", agriculture: "Nông nghiệp", construction: "Xây dựng", textile: "May mặc", fishery: "Thủy sản", safety: "An toàn LĐ" };

let section = "v1", showVi = true, stopDialog = false, metaP;
const loadMeta = () => (metaP ||= loadJSON("./data/meta.json"));

function speakQueue(lines, onLine, onDone) {
  if (!("speechSynthesis" in window)) { onDone(); return; }
  stopDialog = false;
  speechSynthesis.cancel();
  let i = 0;
  const next = () => {
    if (stopDialog || i >= lines.length) { onLine(-1); onDone(); return; }
    onLine(i);
    const u = new SpeechSynthesisUtterance(lines[i++]);
    u.lang = "ko-KR"; u.rate = 0.8; u.onend = next; u.onerror = next;
    speechSynthesis.speak(u);
  };
  next();
}

export async function initLesson(root, { id, go }) {
  const [index, meta] = await Promise.all([loadLessonIndex(), loadMeta()]);
  let last; try { last = localStorage.getItem(LS_LESSON); } catch {}
  const lid = id || (index.some((l) => l.id === last) ? last : index[0].id);
  try { localStorage.setItem(LS_LESSON, lid); } catch {}
  const lesson = await loadLesson(lid);
  const state = loadState();
  const pos = index.findIndex((l) => l.id === lid);
  const vocabOf = (g) => lesson.vocabulary.filter((v) => v.group === g);
  const dueCount = lesson.vocabulary.filter((v) => isDue(getCard(state, v.id))).length;
  const known = lesson.vocabulary.filter((v) => (state[v.id]?.reps || 0) >= 3).length;
  // Nhãn nguồn: chỉ hiện bản "chuẩn giáo trình" khi bài đã được đối chiếu (source.verified = true)
  const verified = !!lesson.source?.verified;
  const badge = verified ? meta.badgeVerified : meta.badgeDraft;
  const footer = verified ? meta.footerVerified : meta.footerDraft;

  const vocabHtml = (g) => vocabOf(g).map((v) => `
    <article class="bg-white rounded-2xl shadow p-4">
      <div class="flex items-start gap-3">
        <button data-say="${esc(v.ko)}" class="shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white" aria-label="Nghe">🔊</button>
        <div class="flex-1">
          <p class="flex flex-wrap items-baseline gap-x-3"><span class="text-2xl font-bold">${esc(v.ko)}</span>
            <span class="text-slate-500 italic">${esc(v.viPhonetic)}</span>
            ${v.pos ? `<span class="text-xs bg-slate-100 text-slate-600 rounded-full px-2 py-0.5">${esc(v.pos)}</span>` : ""}
            <span class="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">${esc(FIELD[v.field] || v.field)}</span></p>
          <p class="font-semibold text-blue-700">${esc(v.meaning)}</p>
          <div class="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm">
            <button data-say="${esc(v.example.ko)}" class="text-left font-medium hover:underline">🔊 ${esc(v.example.ko)}</button>
            <p class="text-slate-600">${esc(v.example.vi)}</p></div>
        </div>
      </div>
    </article>`).join("");

  const grammarHtml = (lesson.grammar || []).map((g, i) => `
    <article class="bg-white rounded-2xl shadow p-5">
      <p class="text-xs text-slate-400">Ngữ pháp ${i + 1}</p>
      <h3 class="text-xl font-bold text-blue-700">${esc(g.pattern)}</h3>
      <p class="text-sm text-slate-500 mb-2">${esc(g.meaning)}</p>
      <p class="mb-3">${esc(g.explanation)}</p>
      <p class="text-sm bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3"><b>Cấu tạo:</b> ${esc(g.formation)}</p>
      <ul class="space-y-2">${g.examples.map((e) => `<li class="flex items-start gap-2">
        <button data-say="${esc(e.ko)}" class="shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white text-sm" aria-label="Nghe">🔊</button>
        <div><p class="font-medium">${esc(e.ko)}</p><p class="text-sm text-slate-500">${esc(e.vi)}</p></div></li>`).join("")}</ul>
    </article>`).join("");

  const dialogs = lesson.dialogues || [];
  const dialogHtml = dialogs.length ? `
    <label class="text-sm flex items-center gap-2 cursor-pointer mb-3"><input id="toggle-vi" type="checkbox" ${showVi ? "checked" : ""}> Hiện nghĩa tiếng Việt</label>
    <div class="space-y-4">${dialogs.map((d, di) => `
    <article class="bg-white rounded-2xl shadow p-5" data-dlg="${di}">
      <p class="text-xs text-slate-400">Hội thoại ${di + 1}</p>
      <h3 class="text-lg font-bold">${esc(d.title)}</h3>
      <p class="text-sm text-slate-500 mb-3">📍 ${esc(d.situation)}</p>
      <button data-play="${di}" class="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold mb-4 disabled:opacity-50">▶ Nghe cả đoạn</button>
      <div class="space-y-3">${d.lines.map((l, i) => {
        const right = i % 2 === 1;
        return `<div class="dlg-line flex ${right ? "justify-end" : ""}" data-i="${i}">
          <div class="max-w-[85%] rounded-2xl px-4 py-2 ${right ? "bg-blue-600 text-white" : "bg-slate-100"}">
            <p class="text-xs opacity-70">${esc(l.speaker)}</p>
            <button data-say="${esc(l.ko)}" class="text-left font-medium">${esc(l.ko)}</button>
            <p class="vi text-sm opacity-80 ${showVi ? "" : "hidden"}">${esc(l.vi)}</p></div></div>`;
      }).join("")}</div>
    </article>`).join("")}</div>` : `<p class="text-slate-500">Bài này chưa có hội thoại.</p>`;

  const cu = lesson.culture;
  const cultureHtml = cu ? `
    <article class="bg-white rounded-2xl shadow p-5">
      <p class="text-xs text-slate-400">정보 / 문화 · Thông tin thực tế</p>
      <h3 class="text-lg font-bold mb-3">${esc(cu.title)}</h3>
      <ul class="space-y-3">${cu.items.map((it) => `<li class="flex gap-3">
        <span class="mt-1 w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
        <div><p class="font-semibold">${esc(it.h)}</p><p class="text-sm text-slate-600">${esc(it.body)}</p></div></li>`).join("")}</ul>
      <p class="text-xs text-slate-400 mt-4">Thông tin mang tính hướng dẫn chung; quy định cụ thể phụ thuộc hợp đồng lao động và luật hiện hành.</p>
    </article>` : `<p class="bg-white rounded-2xl shadow p-6 text-slate-500">Phần Văn hóa & An toàn của bài này đang được bổ sung.</p>`;

  const fcHtml = `
    <article class="bg-white rounded-2xl shadow p-8 text-center">
      <p class="text-5xl mb-2">🃏</p>
      <h3 class="text-xl font-bold">Ôn Flashcard bài ${lesson.number}</h3>
      <p class="text-slate-500 mt-1">${lesson.vocabulary.length} từ trong bài · <b>${dueCount}</b> thẻ đang chờ ôn · <b>${known}</b> từ đã thuộc</p>
      <button data-go-flash class="mt-5 px-6 py-3 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800">Bắt đầu ôn bài này</button>
      <p class="text-xs text-slate-400 mt-3">Chỉ ôn từ vựng của bài đang chọn, không trộn với các bài khác.</p>
    </article>`;

  const body = { v1: vocabHtml(1), v2: vocabHtml(2), gr: grammarHtml, dl: dialogHtml, cu: cultureHtml, fc: fcHtml }[section];

  root.innerHTML = `
    <div class="flex items-center gap-2 mb-1">
      <button id="prev" class="px-3 py-1 rounded-lg border bg-white disabled:opacity-40" ${pos === 0 ? "disabled" : ""} aria-label="Bài trước">←</button>
      <select id="pick" class="flex-1 text-lg font-bold bg-white border rounded-lg px-2 py-1 min-w-0" aria-label="Chọn bài">
        ${index.map((l) => `<option value="${l.id}" ${l.id === lid ? "selected" : ""}>Bài ${l.number}: ${esc(l.title)}</option>`).join("")}</select>
      <button id="next" class="px-3 py-1 rounded-lg border bg-white disabled:opacity-40" ${pos === index.length - 1 ? "disabled" : ""} aria-label="Bài sau">→</button>
    </div>
    <p class="mb-2"><span class="inline-block text-xs rounded-full px-3 py-1 ${verified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}">${esc(badge)}</span></p>
    <p class="text-sm text-slate-500 mb-4">${esc(lesson.title.ko)} · ${lesson.vocabulary.length} từ · ${(lesson.grammar || []).length} ngữ pháp · ${dialogs.length} hội thoại${cu ? " · có phần văn hóa" : ""}</p>
    <div class="flex gap-2 overflow-x-auto mb-4">${SECTIONS.map(([k, t]) => `<button data-sec="${k}" class="tab-btn ${k === section ? "active" : ""}">${t}</button>`).join("")}</div>
    <div class="grid gap-3 ${section === "v1" || section === "v2" || section === "gr" ? "md:grid-cols-2" : ""}">${body}</div>
    <div class="mt-6 flex justify-between">
      <button data-sec-step="-1" class="px-4 py-2 rounded-lg border bg-white disabled:opacity-40" ${section === "v1" ? "disabled" : ""}>← Phần trước</button>
      <button data-sec-step="1" class="px-4 py-2 rounded-lg border bg-white disabled:opacity-40" ${section === "fc" ? "disabled" : ""}>Phần sau →</button>
    </div>
    <p class="mt-6 text-xs text-slate-400 text-center border-t pt-3">${esc(footer)}</p>`;

  const rerender = (nid) => { stopDialog = true; if ("speechSynthesis" in window) speechSynthesis.cancel(); initLesson(root, { id: nid || lid, go }); };
  root.querySelector("#pick").addEventListener("change", (e) => rerender(e.target.value));
  root.querySelector("#prev").addEventListener("click", () => rerender(index[pos - 1].id));
  root.querySelector("#next").addEventListener("click", () => rerender(index[pos + 1].id));
  root.querySelectorAll("[data-sec]").forEach((b) => b.addEventListener("click", () => { section = b.dataset.sec; rerender(); }));
  root.querySelectorAll("[data-sec-step]").forEach((b) => b.addEventListener("click", () => {
    const k = SECTIONS.findIndex(([s]) => s === section) + Number(b.dataset.secStep);
    section = SECTIONS[Math.max(0, Math.min(SECTIONS.length - 1, k))][0]; rerender();
  }));
  root.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => { stopDialog = true; speak(b.dataset.say); }));
  const fc = root.querySelector("[data-go-flash]"); if (fc) fc.addEventListener("click", () => go("flash", lid));
  const tv = root.querySelector("#toggle-vi");
  if (tv) tv.addEventListener("change", () => { showVi = tv.checked; root.querySelectorAll(".dlg-line .vi").forEach((p) => p.classList.toggle("hidden", !showVi)); });
  root.querySelectorAll("[data-play]").forEach((btn) => btn.addEventListener("click", () => {
    const di = Number(btn.dataset.play), card = root.querySelector(`[data-dlg="${di}"]`);
    root.querySelectorAll("[data-play]").forEach((b) => (b.disabled = true));
    speakQueue(dialogs[di].lines.map((l) => l.ko),
      (i) => card.querySelectorAll(".dlg-line").forEach((el) => el.classList.toggle("ring-2", Number(el.dataset.i) === i)),
      () => root.querySelectorAll("[data-play]").forEach((b) => (b.disabled = false)));
  }));
}

export function leaveLesson() { stopDialog = true; if ("speechSynthesis" in window) speechSynthesis.cancel(); }
