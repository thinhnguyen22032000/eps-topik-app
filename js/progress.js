// Lưu tiến trình học: ngày đã học (streak) + lịch sử điểm thi CBT. SRS có state riêng trong srs.js.
const KEY = "eps-progress-v1";
const MAX_MOCKS = 50;

function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY)); if (d && Array.isArray(d.days) && Array.isArray(d.mocks)) return d; } catch {}
  return { days: [], mocks: [] };
}
function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }

const dayStr = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function markStudied() {
  const d = load(), t = dayStr();
  if (!d.days.includes(t)) { d.days.push(t); d.days = d.days.slice(-400); save(d); }
}

// Chuỗi ngày học liên tiếp tính đến hôm nay (nếu hôm nay chưa học thì tính đến hôm qua)
export function streak() {
  const set = new Set(load().days);
  const d = new Date();
  if (!set.has(dayStr(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(dayStr(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export const studiedToday = () => load().days.includes(dayStr());
export const totalDays = () => load().days.length;

export function addMock(r) {
  const d = load();
  d.mocks.push({ ...r, at: Date.now() });
  d.mocks = d.mocks.slice(-MAX_MOCKS);
  save(d);
  markStudied();
}
export const mocks = () => load().mocks;
export const bestMock = () => load().mocks.reduce((m, x) => Math.max(m, x.score), 0) || undefined;

export function resetAll() {
  try { localStorage.removeItem(KEY); localStorage.removeItem("eps-srs-v1"); } catch {}
}
