// Flashcard đơn giản: lật thẻ → "Chưa thuộc" (ôn lại cuối lượt) hoặc "Đã thuộc" (sang từ tiếp theo).
import { loadState, saveState, getCard, markKnown, markUnknown, isKnown } from "./srs.js";
import { markStudied } from "./progress.js";
import { loadLessonIndex, loadLesson } from "./lessons.js";
import { speak } from "./util.js";

const $ = (id) => document.getElementById(id);
const FIELD_LABEL = {
  general: "Chung", manufacturing: "Cơ khí", agriculture: "Nông nghiệp",
  construction: "Xây dựng", textile: "May mặc", fishery: "Thủy sản", safety: "An toàn LĐ",
};
const LS_LESSON = "eps-last-lesson";

let state = loadState();
let lesson = null, index = [];
let queue = [], current = null, flipped = false, total = 0, known = 0, bound = false;

export async function init() {
  index = await loadLessonIndex();
  const sel = $("lesson-select");
  if (!sel.options.length) {
    sel.innerHTML = index.map((l) => `<option value="${l.id}">Bài ${l.number}: ${l.title}</option>`).join("");
    let last; try { last = localStorage.getItem(LS_LESSON); } catch {}
    if (last && index.some((l) => l.id === last)) sel.value = last;
    sel.addEventListener("change", () => { try { localStorage.setItem(LS_LESSON, sel.value); } catch {} load(sel.value); });
  }
  if (!bound) { bind(); bound = true; }
  await load(sel.value);
}

export function setLesson(id) { const s = $("lesson-select"); s.value = id; s.dispatchEvent(new Event("change")); }

// all = true: học lại toàn bộ từ của bài; mặc định chỉ các từ chưa thuộc
async function load(id, all = false) {
  state = loadState();
  lesson = await loadLesson(id);
  $("lesson-sub").textContent = `${lesson.title.ko} · ${lesson.vocabulary.length} từ`;
  queue = lesson.vocabulary.filter((v) => all || !isKnown(getCard(state, v.id)));
  total = lesson.vocabulary.length;
  known = total - queue.length;
  $("finished").classList.add("hidden");
  $("study").classList.remove("hidden");
  next();
}

function bind() {
  $("card").addEventListener("click", flip);
  $("flip-btn").addEventListener("click", flip);
  $("speak").addEventListener("click", (e) => { e.stopPropagation(); speak(current.ko); });
  $("speak-ex").addEventListener("click", (e) => { e.stopPropagation(); speak(current.example.ko); });
  $("btn-known").addEventListener("click", () => rate(true));
  $("btn-unknown").addEventListener("click", () => rate(false));
  $("fin-again").addEventListener("click", () => load(lesson.id, true));
  $("fin-next").addEventListener("click", () => {
    const i = index.findIndex((l) => l.id === lesson.id);
    setLesson(index[Math.min(i + 1, index.length - 1)].id);
  });
  document.addEventListener("keydown", (e) => {
    if ($("tab-flash").classList.contains("hidden")) return;
    if (["SELECT", "INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.code === "Space" || e.key === "Enter") { e.preventDefault(); flip(); }
    else if (flipped && e.key === "ArrowRight") rate(true);
    else if (flipped && e.key === "ArrowLeft") rate(false);
  });
}

function flip() {
  if (!current) return;
  flipped = !flipped;
  $("card-inner").classList.toggle("flipped", flipped);
  $("rate-bar").classList.toggle("hidden", !flipped);
  $("flip-btn").classList.toggle("hidden", flipped);
}

function rate(isKnownNow) {
  if (!current || !flipped) return;
  const card = getCard(state, current.id);
  state[current.id] = isKnownNow ? markKnown(card) : markUnknown(card);
  saveState(state);
  markStudied();
  if (isKnownNow) known++; else queue.push(current); // chưa thuộc: quay lại cuối danh sách
  next();
}

function next() {
  flipped = false;
  $("card-inner").classList.remove("flipped");
  $("rate-bar").classList.add("hidden");
  $("flip-btn").classList.remove("hidden");
  current = queue.shift() || null;
  $("progress").style.width = (total ? Math.round((known / total) * 100) : 100) + "%";
  $("counter").textContent = `Đã thuộc ${known}/${total}`;
  if (!current) {
    $("study").classList.add("hidden");
    $("finished").classList.remove("hidden");
    $("fin-sub").textContent = `Bạn đã thuộc ${known}/${total} từ của Bài ${lesson.number}.`;
    $("fin-next").classList.toggle("hidden", index.findIndex((l) => l.id === lesson.id) === index.length - 1);
    return;
  }
  render(current);
}

function render(v) {
  $("ko").textContent = v.ko;
  $("vi-phonetic").textContent = v.viPhonetic;
  $("meaning").textContent = v.meaning;
  $("field").textContent = FIELD_LABEL[v.field] || v.field;
  $("ex-ko").textContent = v.example.ko;
  $("ex-ph").textContent = v.example.viPhonetic || "";
  $("ex-vi").textContent = v.example.vi;
  if (!$("tab-flash").classList.contains("hidden")) setTimeout(() => speak(v.ko), 150);
}
