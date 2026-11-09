import { esc } from "./util.js";
import { loadAllLessons } from "./lessons.js";
import { loadState, isDue, getCard } from "./srs.js";
import { streak, studiedToday, totalDays, mocks, bestMock, resetAll } from "./progress.js";

const MASTER_REPS = 3; // coi là "đã thuộc" khi nhớ đúng liên tiếp >= 3 lần

export async function initDashboard(root, { go }) {
  const lessons = await loadAllLessons();
  const state = loadState();
  const all = lessons.flatMap((l) => l.vocabulary.map((v) => ({ ...v, lesson: l })));
  const learned = all.filter((v) => state[v.id]).length; // đã từng chấm điểm ít nhất 1 lần
  const mastered = all.filter((v) => (state[v.id]?.reps || 0) >= MASTER_REPS).length;
  const due = all.filter((v) => state[v.id] && isDue(getCard(state, v.id))).length;
  const hist = mocks(), best = bestMock(), s = streak();

  const stat = (icon, label, value, sub = "") => `
    <div class="bg-white rounded-2xl shadow p-4">
      <p class="text-2xl">${icon}</p>
      <p class="text-3xl font-extrabold mt-1">${value}</p>
      <p class="text-sm text-slate-500">${label}</p>${sub ? `<p class="text-xs text-slate-400">${sub}</p>` : ""}
    </div>`;

  const bars = hist.slice(-10).map((m, i, a) => {
    const h = Math.max(4, Math.round((m.score / 200) * 100));
    return `<div class="flex-1 flex flex-col items-center justify-end h-full" title="${m.score}/200">
      <span class="text-[10px] text-slate-500">${m.score}</span>
      <div class="w-full rounded-t ${m.score >= 80 ? "bg-green-500" : "bg-red-400"}" style="height:${h}%"></div></div>`;
  }).join("");

  const lessonRows = lessons.map((l) => {
    const m = l.vocabulary.filter((v) => (state[v.id]?.reps || 0) >= MASTER_REPS).length;
    const pct = Math.round((m / l.vocabulary.length) * 100);
    return `<button data-lesson="${l.id}" class="w-full text-left flex items-center gap-3 py-2 hover:bg-slate-50 rounded-lg px-2">
      <span class="w-16 text-sm text-slate-500">Bài ${l.number}</span>
      <span class="flex-1 text-sm font-medium">${esc(l.title.vi)}</span>
      <span class="w-24 h-2 bg-slate-200 rounded-full overflow-hidden"><span class="block h-full bg-blue-600" style="width:${pct}%"></span></span>
      <span class="w-12 text-right text-xs text-slate-500">${m}/${l.vocabulary.length}</span></button>`;
  }).join("");

  root.innerHTML = `
    <div class="mb-5">
      <h1 class="text-2xl font-extrabold">Xin chào! 👋</h1>
      <p class="text-slate-500">${studiedToday() ? "Hôm nay bạn đã học rồi, tuyệt vời!" : s ? `Hôm nay chưa học. Học ngay để giữ chuỗi ${s} ngày!` : "Bắt đầu học hôm nay để tạo chuỗi ngày học đầu tiên."}</p>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      ${stat("🔥", "Chuỗi ngày học", s, `Tổng ${totalDays()} ngày đã học`)}
      ${stat("📚", "Từ đã học", `${learned}/${all.length}`)}
      ${stat("✅", "Từ đã thuộc", mastered, `Nhớ đúng ≥${MASTER_REPS} lần liên tiếp`)}
      ${stat("⏰", "Thẻ đến hạn ôn", due, "Cần ôn lại hôm nay")}
    </div>
    <div class="grid md:grid-cols-2 gap-4">
      <section class="bg-white rounded-2xl shadow p-5">
        <div class="flex items-baseline justify-between mb-3"><h2 class="font-bold">Lịch sử điểm thi thử</h2>
          <span class="text-sm text-slate-500">${best !== undefined ? "Cao nhất: <b>" + best + "</b>/200" : "Chưa có bài nào"}</span></div>
        ${hist.length ? `<div class="flex items-end gap-1 h-32 mb-3">${bars}</div>
          <ul class="text-sm divide-y max-h-40 overflow-auto">${hist.slice().reverse().slice(0, 8).map((m) => `
            <li class="py-1.5 flex justify-between"><span>${new Date(m.at).toLocaleDateString("vi-VN")}</span>
              <span>Đọc ${m.reading} · Nghe ${m.listening}</span>
              <b class="${m.score >= 80 ? "text-green-600" : "text-red-500"}">${m.score}</b></li>`).join("")}</ul>`
          : `<p class="text-sm text-slate-400 py-6 text-center">Làm đề thi thử để theo dõi tiến bộ.</p>`}
        <button data-go="mock" class="mt-3 w-full rounded-xl bg-blue-700 text-white font-semibold py-2">📝 Làm đề thi thử</button>
      </section>
      <section class="bg-white rounded-2xl shadow p-5">
        <h2 class="font-bold mb-2">Tiến độ theo bài</h2>
        <div class="max-h-72 overflow-auto">${lessonRows}</div>
      </section>
    </div>
    <p class="text-center mt-6"><button id="reset" class="text-xs text-slate-400 underline">Xóa toàn bộ tiến trình</button></p>`;

  root.querySelectorAll("[data-lesson]").forEach((b) => b.addEventListener("click", () => go("lesson", b.dataset.lesson)));
  root.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.dataset.go)));
  root.querySelector("#reset").addEventListener("click", () => {
    if (confirm("Xóa toàn bộ tiến trình học và điểm thi? Không thể hoàn tác.")) { resetAll(); location.reload(); }
  });
}
