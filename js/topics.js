// Từ vựng theo chủ đề: màn hình riêng, tách khỏi Bài học.
// Ba màn: danh sách chủ đề → lưới hình + từ → flashcard riêng (tiến độ lưu riêng, không trộn với flashcard của bài).
import { esc, speak, loadJSON } from "./util.js";

const KEY = "eps-topics-v1";
const loadKnown = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const saveKnown = (k) => { try { localStorage.setItem(KEY, JSON.stringify(k)); } catch {} };

// Ảnh thật: đặt file img/topics/<id>.jpg (ví dụ jobs-01.jpg) hoặc khai báo 'image' trong topics.json.
// Chưa có file ảnh thì tự hiện emoji thay thế.
const pic = (w) => `<div class="pic"><span aria-hidden="true">${w.emoji || "📘"}</span><img src="${esc(w.image || `img/topics/${w.id}.jpg`)}" alt="${esc(w.vi)}" loading="lazy"></div>`;
function fixPics(scope) {
  scope.querySelectorAll(".pic img").forEach((img) => {
    const drop = () => img.remove();
    img.addEventListener("error", drop, { once: true });
    if (img.complete && !img.naturalWidth) drop();
  });
}

export async function initTopics(root) {
  const data = await loadJSON("./data/topics.json");
  let known = loadKnown();
  let view = { name: "list" };
  let hideMeaning = false;
  let st = null; // trạng thái lượt học flashcard

  const knownCount = (t) => t.words.filter((w) => known[w.id]).length;
  const go = (v) => { view = v; render(); window.scrollTo(0, 0); };

  function renderList() {
    root.innerHTML = `
      <h1 class="text-2xl font-extrabold">Từ vựng theo chủ đề</h1>
      <p class="text-slate-500 mb-5">Học từ qua hình minh họa, rồi ôn bằng flashcard riêng của từng chủ đề.</p>
      <div class="grid gap-4 sm:grid-cols-2">
        ${data.topics.map((t) => {
          const k = knownCount(t), pct = Math.round((k / t.words.length) * 100);
          return `<button data-open="${t.id}" class="text-left bg-white rounded-2xl shadow p-5 hover:ring-2 hover:ring-blue-400 transition">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-blue-50 grid place-items-center text-4xl">${t.emoji}</div>
              <div class="min-w-0"><p class="text-xl font-bold">${esc(t.title)}</p>
                <p class="text-sm text-slate-500">${esc(t.ko)} · ${t.words.length} từ · ${esc(t.lesson)}</p></div>
            </div>
            <div class="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden"><div class="h-full bg-green-500" style="width:${pct}%"></div></div>
            <p class="text-xs text-slate-500 mt-1">Đã thuộc ${k}/${t.words.length}</p>
          </button>`;
        }).join("")}
      </div>
      <p class="text-xs text-slate-400 mt-6">Hình minh họa hiện dùng emoji. Có thể thay bằng ảnh riêng (xem ghi chú trong data/topics.json).</p>`;
    root.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => go({ name: "topic", id: b.dataset.open })));
  }

  function renderTopic(t) {
    root.innerHTML = `
      <button data-back class="text-sm text-blue-700 mb-3">← Tất cả chủ đề</button>
      <div class="flex flex-wrap items-center gap-3 mb-4">
        <div class="w-14 h-14 rounded-2xl bg-blue-50 grid place-items-center text-3xl">${t.emoji}</div>
        <div class="min-w-0 flex-1"><h1 class="text-2xl font-extrabold">${esc(t.title)} <span class="text-slate-400 font-semibold">${esc(t.ko)}</span></h1>
          <p class="text-sm text-slate-500">${t.words.length} từ · đã thuộc ${knownCount(t)}</p></div>
        <button data-study class="px-5 py-3 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800">🃏 Học flashcard</button>
      </div>
      <label class="text-sm flex items-center gap-2 cursor-pointer mb-4"><input id="hide-meaning" type="checkbox" ${hideMeaning ? "checked" : ""}> Tự kiểm tra: ẩn nghĩa, bấm vào hình để xem</label>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        ${t.words.map((w) => `
          <button data-word="${esc(w.id)}" class="word-card text-left bg-white rounded-2xl shadow p-3 ${hideMeaning ? "" : "open"}">
            ${pic(w)}
            <p class="text-xl font-bold mt-2">${esc(w.ko)} ${known[w.id] ? '<span class="text-green-600 text-sm" title="Đã thuộc">✓</span>' : ""}</p>
            <div class="reveal"><p class="text-xs text-slate-500 italic">${esc(w.phonetic)}</p>
              <p class="text-sm font-semibold text-blue-700">${esc(w.vi)}</p></div>
          </button>`).join("")}
      </div>`;
    root.querySelector("[data-back]").addEventListener("click", () => go({ name: "list" }));
    root.querySelector("[data-study]").addEventListener("click", () => startStudy(t, false));
    root.querySelector("#hide-meaning").addEventListener("change", (e) => { hideMeaning = e.target.checked; render(); });
    root.querySelectorAll("[data-word]").forEach((b) => b.addEventListener("click", () => {
      const w = t.words.find((x) => x.id === b.dataset.word);
      if (hideMeaning) b.classList.toggle("open");
      speak(w.ko);
    }));
  }

  function startStudy(t, all) {
    known = loadKnown();
    const queue = t.words.filter((w) => all || !known[w.id]);
    st = { t, queue: [...queue], cur: null, flipped: false, total: t.words.length, done: t.words.length - queue.length };
    nextCard();
  }
  function nextCard() { st.flipped = false; st.cur = st.queue.shift() || null; go({ name: "study" }); }

  function rate(isKnown) {
    if (!st.cur || !st.flipped) return;
    if (isKnown) { known[st.cur.id] = true; st.done++; saveKnown(known); } else { delete known[st.cur.id]; saveKnown(known); st.queue.push(st.cur); }
    nextCard();
  }
  function flip() {
    if (!st.cur) return;
    st.flipped = !st.flipped;
    root.querySelector("#t-inner").classList.toggle("flipped", st.flipped);
    root.querySelector("#t-rate").classList.toggle("hidden", !st.flipped);
    root.querySelector("#t-flip").classList.toggle("hidden", st.flipped);
  }

  function renderStudy() {
    const { t, cur } = st, pct = Math.round((st.done / st.total) * 100);
    if (!cur) {
      root.innerHTML = `
        <div class="max-w-md mx-auto text-center bg-white rounded-2xl shadow p-10">
          <p class="text-5xl mb-2">🎉</p><h2 class="text-xl font-bold">Xong chủ đề "${esc(t.title)}"!</h2>
          <p class="text-slate-500 mt-1">Bạn đã thuộc ${st.done}/${st.total} từ.</p>
          <div class="flex flex-col sm:flex-row gap-2 justify-center mt-6">
            <button data-again class="px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-700 font-semibold">🔁 Ôn lại cả chủ đề</button>
            <button data-back class="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-semibold">Về chủ đề</button>
          </div></div>`;
      root.querySelector("[data-again]").addEventListener("click", () => startStudy(t, true));
      root.querySelector("[data-back]").addEventListener("click", () => go({ name: "topic", id: t.id }));
      return;
    }
    root.innerHTML = `
      <div class="max-w-xl mx-auto">
        <div class="flex items-center justify-between mb-3">
          <button data-back class="text-sm text-blue-700">← ${esc(t.title)}</button>
          <span class="text-sm text-slate-500">Đã thuộc ${st.done}/${st.total}</span></div>
        <div class="h-2 bg-slate-200 rounded-full mb-5 overflow-hidden"><div class="h-full bg-blue-600 transition-all" style="width:${pct}%"></div></div>
        <div class="tscene"><div id="t-card" class="cursor-pointer select-none"><div id="t-inner" class="tflip">
          <div class="tface bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-6">
            <p class="text-5xl font-bold text-center mb-6">${esc(cur.ko)}</p>
            <button id="t-say" class="w-14 h-14 rounded-full bg-blue-600 text-white text-2xl" aria-label="Phát âm">🔊</button>
            <p class="absolute bottom-4 text-xs text-slate-300">Bấm vào thẻ để lật</p>
          </div>
          <div class="tface tback bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-5 text-center">
            <div class="w-40">${pic(cur)}</div>
            <p class="text-2xl font-bold text-blue-700 mt-3">${esc(cur.vi)}</p>
            <p class="text-slate-500 italic">${esc(cur.phonetic)}</p>
            <div class="mt-3 w-full bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
              <button id="t-say-ex" class="font-medium hover:underline">🔊 ${esc(cur.example.ko)}</button>
              <p class="text-slate-600">${esc(cur.example.vi)}</p></div>
          </div>
        </div></div></div>
        <button id="t-flip" class="mt-4 w-full rounded-xl bg-blue-700 text-white font-bold py-3">Lật thẻ <span class="text-xs font-normal opacity-70">(Space)</span></button>
        <div id="t-rate" class="hidden grid grid-cols-2 gap-3 mt-4">
          <button id="t-no" class="rounded-xl py-3 bg-white border-2 border-orange-400 text-orange-600 font-bold">✗ Chưa thuộc<br><span class="text-[11px] font-normal opacity-70">ôn lại sau · ←</span></button>
          <button id="t-yes" class="rounded-xl py-3 bg-green-600 text-white font-bold">✓ Đã thuộc<br><span class="text-[11px] font-normal opacity-80">từ tiếp theo · →</span></button>
        </div>
      </div>`;
    root.querySelector("[data-back]").addEventListener("click", () => go({ name: "topic", id: t.id }));
    root.querySelector("#t-card").addEventListener("click", flip);
    root.querySelector("#t-flip").addEventListener("click", flip);
    root.querySelector("#t-say").addEventListener("click", (e) => { e.stopPropagation(); speak(cur.ko); });
    root.querySelector("#t-say-ex").addEventListener("click", (e) => { e.stopPropagation(); speak(cur.example.ko); });
    root.querySelector("#t-yes").addEventListener("click", () => rate(true));
    root.querySelector("#t-no").addEventListener("click", () => rate(false));
    if (!root.classList.contains("hidden")) setTimeout(() => speak(cur.ko), 150);
  }

  function render() {
    if (view.name === "list") renderList();
    else if (view.name === "topic") renderTopic(data.topics.find((t) => t.id === view.id));
    else renderStudy();
    fixPics(root);
  }

  document.addEventListener("keydown", (e) => {
    if (root.classList.contains("hidden") || view.name !== "study" || !st?.cur) return;
    if (["SELECT", "INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.code === "Space" || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (st.flipped && e.key === "ArrowRight") rate(true);
    else if (st.flipped && e.key === "ArrowLeft") rate(false);
  });

  render();
}
