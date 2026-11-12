import { init as initFlash, setLesson } from "./flashcard.js";
import { initGrammar } from "./grammar.js";
import { initSafety } from "./safety.js";
import { initMock, leaveMock } from "./mocktest.js";
import { initDashboard } from "./dashboard.js";
import { initLesson, leaveLesson } from "./lesson.js";
import { initHangeul } from "./hangeul.js";
import { initTopics } from "./topics.js";
import { streak, totalDays, bestMock, resetAll } from "./progress.js";
import { loadState } from "./srs.js";
import { confirmDialog } from "./util.js";

const inits = { topics: initTopics, hangeul: initHangeul, home: (el) => initDashboard(el, { go: show }), lesson: (el, id) => initLesson(el, { id, go: show }), flash: () => {}, grammar: initGrammar, safety: initSafety, mock: initMock };
const loaded = {};
function show(tab, arg, arg2) {
  if (tab !== "mock") leaveMock();
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("hidden", t.id !== "tab-" + tab));
  document.querySelectorAll(".side-btn[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  if (tab !== "lesson") leaveLesson();
  // Tổng quan và Bài học luôn vẽ lại (số liệu mới / bài được chọn); các tab khác chỉ khởi tạo một lần
  if (tab === "home" || tab === "lesson" || !loaded[tab]) { loaded[tab] = true; inits[tab](document.getElementById("tab-" + tab), arg); }
  if (tab === "flash" && arg) setLesson(arg, arg2 || 0);
  try { history.replaceState(null, "", "#" + tab); } catch {}
  const act = document.querySelector(".side-btn.active");
  document.getElementById("nav-current").textContent = act ? act.textContent : "";
  setMenu(false);
  updateStats();
  window.scrollTo(0, 0);
}

// Drawer trên mobile (< 1024px)
const sidebar = document.getElementById("sidebar"), overlay = document.getElementById("overlay"), opener = document.getElementById("side-open");
function setMenu(open) {
  sidebar.classList.toggle("open", open);
  overlay.classList.toggle("hidden", !open);
  opener.setAttribute("aria-expanded", String(open));
}
opener.addEventListener("click", () => setMenu(true));
document.getElementById("side-close").addEventListener("click", () => setMenu(false));
overlay.addEventListener("click", () => setMenu(false));
document.querySelectorAll(".side-btn[data-tab]").forEach((b) => b.addEventListener("click", () => show(b.dataset.tab)));

// Thông tin tiến trình ngắn ở đáy sidebar + hộp thoại cài đặt
const settings = document.getElementById("settings");
function updateStats() {
  const learned = Object.keys(loadState()).length;
  document.getElementById("side-stats").innerHTML =
    `<span class="stat-pill" title="Chuỗi ngày học">🔥 ${streak()} ngày</span><span class="stat-pill" title="Từ đã học">📚 ${learned} từ</span>`;
}
const openSettings = (open) => {
  settings.classList.toggle("hidden", !open);
  if (open) document.getElementById("settings-info").innerHTML =
    `<p>🔥 Chuỗi ngày học: <b>${streak()}</b> (tổng ${totalDays()} ngày)</p><p>📚 Từ đã học: <b>${Object.keys(loadState()).length}</b></p><p>📝 Điểm thi cao nhất: <b>${bestMock() ?? "—"}</b>/200</p>`;
};
document.getElementById("open-settings").addEventListener("click", () => openSettings(true));
document.getElementById("close-settings").addEventListener("click", () => openSettings(false));
settings.addEventListener("click", (e) => { if (e.target === settings) openSettings(false); });
document.getElementById("reset-all").addEventListener("click", async () => {
  if (await confirmDialog("Xóa toàn bộ tiến trình học và điểm thi? Không thể hoàn tác.", { okLabel: "Xóa" })) { resetAll(); location.reload(); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { setMenu(false); openSettings(false); } });
initFlash().then(() => {
  const start = location.hash.slice(1);
  show(inits[start] ? start : "home");
});
