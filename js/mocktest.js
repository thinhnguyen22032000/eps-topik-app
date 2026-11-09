import { esc, speak, loadJSON } from "./util.js";
import { addMock, bestMock } from "./progress.js";

const MAX_PLAYS = 2; // đề thật: nghe tối đa 2 lần
let root, test, qs, answers, flagged, plays, cur, remaining, timerId, keyHandler;

const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export async function initMock(el) {
  root = el;
  test = await loadJSON("./data/mocktest-01.json");
  renderIntro();
}

export function leaveMock() { // gọi khi chuyển sang tab khác: dừng đồng hồ + phím tắt
  clearInterval(timerId); timerId = null;
  if (keyHandler) { document.removeEventListener("keydown", keyHandler); keyHandler = null; }
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  if (root && qs && !qs.submitted && answers) { /* bài đang làm dở bị hủy khi rời tab */ renderIntro(); }
}

const bestScore = bestMock;

function renderIntro() {
  qs = null;
  const total = test.sections.reduce((n, s) => n + s.questions.length, 0);
  const best = bestScore();
  root.innerHTML = `
    <div class="max-w-xl mx-auto px-4 py-10">
      <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p class="text-5xl mb-2">📝</p>
        <h1 class="text-2xl font-bold">${esc(test.title)}</h1>
        <ul class="text-left mt-5 space-y-1 text-slate-600">
          ${test.sections.map((s) => `<li>• ${esc(s.title)}: <b>${s.questions.length}</b> câu</li>`).join("")}
          <li>• Thời gian: <b>${test.durationMin} phút</b> (tổng ${total} câu, thang ${test.maxScore} điểm)</li>
          <li>• Phần nghe: tối đa <b>${MAX_PLAYS}</b> lần/câu (giọng đọc mô phỏng của trình duyệt)</li>
          <li>• Điểm đạt tham khảo: <b>${test.passScore}/${test.maxScore}</b></li>
        </ul>
        ${best !== undefined ? `<p class="mt-4 text-sm text-slate-500">Điểm cao nhất của bạn: <b>${best}</b></p>` : ""}
        <button id="start" class="mt-6 w-full rounded-xl bg-blue-700 text-white font-bold py-3 hover:bg-blue-800">Bắt đầu làm bài</button>
      </div>
    </div>`;
  root.querySelector("#start").addEventListener("click", start);
}

function start() {
  // Xáo thứ tự đáp án để không học vẹt vị trí; giữ thứ tự câu hỏi theo phần
  qs = [];
  test.sections.forEach((s) => s.questions.forEach((q) => {
    const order = shuffle(q.choices.map((text, i) => ({ text, ok: i === q.answer })));
    qs.push({ ...q, skill: s.skill, choices: order.map((o) => o.text), answer: order.findIndex((o) => o.ok) });
  }));
  qs.submitted = false;
  answers = qs.map(() => null);
  flagged = new Set();
  plays = qs.map(() => 0);
  cur = 0;
  remaining = test.durationMin * 60;
  clearInterval(timerId);
  timerId = setInterval(tick, 1000);
  keyHandler = onKey;
  document.addEventListener("keydown", keyHandler);
  renderExam();
}

function tick() {
  remaining--;
  const t = root.querySelector("#timer");
  if (t) { t.textContent = fmt(Math.max(0, remaining)); t.classList.toggle("timer-low", remaining <= 60); }
  if (remaining <= 0) submit(true);
}

function onKey(e) {
  if (!qs || qs.submitted) return;
  if (["1", "2", "3", "4"].includes(e.key)) choose(Number(e.key) - 1);
  else if (e.key === "ArrowRight") go(cur + 1);
  else if (e.key === "ArrowLeft") go(cur - 1);
}

function choose(i) { answers[cur] = i; renderExam(); }
function go(i) { if (i >= 0 && i < qs.length) { cur = i; renderExam(); } }

function renderExam() {
  const q = qs[cur];
  const isL = q.skill === "listening";
  const answered = answers.filter((a) => a !== null).length;
  root.innerHTML = `
    <div class="exam-bar">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div><p class="font-bold">${esc(test.title)}</p><p class="text-xs opacity-70">Đã làm ${answered}/${qs.length}</p></div>
        <div class="text-right"><p class="text-xs opacity-70">Thời gian còn lại</p>
          <p id="timer" class="text-2xl font-mono font-bold ${remaining <= 60 ? "timer-low" : ""}">${fmt(remaining)}</p></div>
      </div>
    </div>
    <div class="max-w-5xl mx-auto px-4 py-5 grid gap-5 md:grid-cols-[1fr_16rem]">
      <section class="bg-white rounded-2xl shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm px-3 py-1 rounded-full ${isL ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}">${isL ? "🎧 Nghe (듣기)" : "📖 Đọc (읽기)"} · Câu ${cur + 1}/${qs.length}</span>
          <button id="flag" class="text-sm ${flagged.has(cur) ? "text-amber-600 font-bold" : "text-slate-400"}">🚩 ${flagged.has(cur) ? "Đã đánh dấu" : "Đánh dấu xem lại"}</button>
        </div>
        ${isL ? `
          <div class="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 flex items-center gap-3">
            <button id="play" class="w-12 h-12 rounded-full bg-purple-600 text-white text-xl disabled:opacity-40" ${plays[cur] >= MAX_PLAYS ? "disabled" : ""}>▶</button>
            <p class="text-sm">Nhấn để nghe. Còn <b>${MAX_PLAYS - plays[cur]}</b> lượt nghe.</p>
          </div>` : ""}
        ${q.passage ? `<div class="passage mb-4">${esc(q.passage)}</div>` : ""}
        ${q.image ? `<img src="${esc(q.image)}" alt="Hình câu hỏi" class="w-32 h-32 mx-auto my-3">` : ""}
        ${q.icon ? `<div class="text-7xl text-center my-3">${q.icon}</div>` : ""}
        <p class="text-lg font-medium whitespace-pre-line mb-5">${esc(q.stem)}</p>
        <div class="space-y-3">
          ${q.choices.map((c, i) => `<button class="choice ${answers[cur] === i ? "sel" : ""}" data-c="${i}"><b>${"①②③④"[i]}</b><span>${esc(c)}</span></button>`).join("")}
        </div>
        <div class="flex justify-between mt-6">
          <button id="prev" class="px-5 py-2 rounded-lg border bg-white disabled:opacity-40" ${cur === 0 ? "disabled" : ""}>← Trước</button>
          <button id="next" class="px-5 py-2 rounded-lg border bg-white disabled:opacity-40" ${cur === qs.length - 1 ? "disabled" : ""}>Sau →</button>
        </div>
        <p class="text-xs text-slate-400 mt-3">Phím tắt: 1–4 chọn đáp án · ← → chuyển câu</p>
      </section>
      <aside class="bg-white rounded-2xl shadow p-4 h-fit">
        <p class="font-semibold mb-2">Bảng câu hỏi</p>
        ${["reading", "listening"].map((sk) => `
          <p class="text-xs text-slate-400 mt-2 mb-1">${sk === "reading" ? "Đọc" : "Nghe"}</p>
          <div class="flex flex-wrap gap-1.5">${qs.map((x, i) => x.skill !== sk ? "" :
            `<button class="q-num ${answers[i] !== null ? "answered" : ""} ${flagged.has(i) ? "flagged" : ""} ${i === cur ? "current" : ""}" data-n="${i}">${i + 1}</button>`).join("")}</div>`).join("")}
        <button id="submit" class="mt-5 w-full rounded-xl bg-red-600 text-white font-bold py-2.5 hover:bg-red-700">Nộp bài</button>
      </aside>
    </div>`;
  root.querySelectorAll("[data-c]").forEach((b) => b.addEventListener("click", () => choose(Number(b.dataset.c))));
  root.querySelectorAll("[data-n]").forEach((b) => b.addEventListener("click", () => go(Number(b.dataset.n))));
  root.querySelector("#prev").addEventListener("click", () => go(cur - 1));
  root.querySelector("#next").addEventListener("click", () => go(cur + 1));
  root.querySelector("#flag").addEventListener("click", () => { flagged.has(cur) ? flagged.delete(cur) : flagged.add(cur); renderExam(); });
  root.querySelector("#submit").addEventListener("click", () => {
    const left = answers.filter((a) => a === null).length;
    if (confirm(left ? `Còn ${left} câu chưa làm. Vẫn nộp bài?` : "Nộp bài ngay?")) submit(false);
  });
  const play = root.querySelector("#play");
  if (play) play.addEventListener("click", () => {
    if (plays[cur] >= MAX_PLAYS) return;
    if (speak(q.audio, 0.75)) { plays[cur]++; renderExam(); }
    else alert("Trình duyệt không hỗ trợ giọng đọc.");
  });
}

function submit() {
  if (!qs || qs.submitted) return;
  qs.submitted = true;
  clearInterval(timerId); timerId = null;
  document.removeEventListener("keydown", keyHandler); keyHandler = null;
  if ("speechSynthesis" in window) speechSynthesis.cancel();
  renderResult();
}

function renderResult() {
  const per = (sk) => { const idx = qs.map((q, i) => i).filter((i) => qs[i].skill === sk); return { n: idx.length, ok: idx.filter((i) => answers[i] === qs[i].answer).length }; };
  const R = per("reading"), L = per("listening");
  const correct = R.ok + L.ok;
  const score = Math.round((correct / qs.length) * test.maxScore);
  const pass = score >= test.passScore;
  const used = test.durationMin * 60 - Math.max(0, remaining);
  addMock({ testId: test.id, score, reading: R.ok, listening: L.ok, total: qs.length, usedSec: used });
  let filter = "all";

  const draw = () => {
    root.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-8">
        <div class="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p class="text-5xl">${pass ? "🎉" : "💪"}</p>
          <h1 class="text-3xl font-extrabold mt-2 ${pass ? "text-green-600" : "text-red-600"}">${score}/${test.maxScore} điểm</h1>
          <p class="text-slate-500">${pass ? "ĐẠT (tham khảo)" : `Chưa đạt, mốc tham khảo ${test.passScore} điểm`} · Thời gian dùng ${fmt(used)}</p>
          <div class="grid grid-cols-2 gap-3 mt-5">
            <div class="bg-blue-50 rounded-xl p-3"><p class="text-sm text-slate-500">Đọc</p><p class="text-xl font-bold">${R.ok}/${R.n}</p></div>
            <div class="bg-purple-50 rounded-xl p-3"><p class="text-sm text-slate-500">Nghe</p><p class="text-xl font-bold">${L.ok}/${L.n}</p></div>
          </div>
          <div class="flex gap-2 justify-center mt-6">
            <button id="again" class="px-5 py-2 rounded-xl bg-blue-700 text-white font-semibold">Làm lại</button>
          </div>
        </div>
        <div class="flex gap-2 my-5">
          ${[["all", "Tất cả"], ["wrong", "Câu sai"], ["right", "Câu đúng"]].map(([k, t]) => `<button data-f="${k}" class="tab-btn ${filter === k ? "active" : ""}">${t}</button>`).join("")}
        </div>
        <div class="space-y-4">
          ${qs.map((q, i) => {
            const a = answers[i], ok = a === q.answer;
            if ((filter === "wrong" && ok) || (filter === "right" && !ok)) return "";
            return `<article class="bg-white rounded-2xl shadow p-5">
              <p class="text-sm mb-1 ${ok ? "text-green-600" : "text-red-600"} font-bold">${ok ? "✔ Đúng" : a === null ? "✘ Chưa làm" : "✘ Sai"} · Câu ${i + 1} (${q.skill === "reading" ? "Đọc" : "Nghe"})</p>
              ${q.passage ? `<div class="passage mb-3 text-sm">${esc(q.passage)}</div>` : ""}
              ${q.image ? `<img src="${esc(q.image)}" alt="" class="w-16 h-16">` : ""}
              ${q.icon ? `<p class="text-4xl">${q.icon}</p>` : ""}
              <p class="font-medium whitespace-pre-line mb-3">${esc(q.stem)}</p>
              ${q.audio ? `<button data-say="${esc(q.audio)}" class="text-sm text-purple-700 mb-3 hover:underline">🎧 Nghe lại: ${esc(q.audio)}</button>` : ""}
              <div class="space-y-2">${q.choices.map((c, j) => `<div class="choice ${j === q.answer ? "ok" : j === a ? "bad" : ""}"><b>${"①②③④"[j]}</b><span>${esc(c)}</span>${j === q.answer ? " ✔" : j === a ? " (bạn chọn)" : ""}</div>`).join("")}</div>
              <p class="text-sm bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">💡 ${esc(q.explanation)}</p>
            </article>`;
          }).join("")}
        </div>
      </div>`;
    root.querySelector("#again").addEventListener("click", renderIntro);
    root.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { filter = b.dataset.f; draw(); }));
    root.querySelectorAll("[data-say]").forEach((b) => b.addEventListener("click", () => speak(b.dataset.say, 0.75)));
  };
  draw();
}
