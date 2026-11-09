// SRS dựa trên SM-2 rút gọn. Trạng thái lưu localStorage.
const KEY = "eps-srs-v1";
const DAY = 86400000;

export const RATINGS = { again: 0, hard: 1, good: 2, easy: 3 };

export function loadState() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
export function saveState(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function getCard(state, id) {
  return state[id] || { ease: 2.5, interval: 0, reps: 0, due: 0 };
}

export function isDue(card, now = Date.now()) { return card.due <= now; }

// ── Chế độ đơn giản cho Flashcard: Đã thuộc / Chưa thuộc ──
const REVIEW_AFTER_DAYS = 7; // từ đã thuộc sẽ tự quay lại để ôn sau 7 ngày
export const isKnown = (card, now = Date.now()) => card.reps >= 3 && card.due > now;
export const markKnown = (card, now = Date.now()) => ({ ...card, reps: Math.max(3, card.reps), due: now + REVIEW_AFTER_DAYS * DAY });
export const markUnknown = (card, now = Date.now()) => ({ ...card, reps: 0, interval: 0, due: now });

// Trả về thẻ mới sau khi chấm điểm
export function review(card, rating, now = Date.now()) {
  let { ease, interval, reps } = card;
  if (rating === RATINGS.again) {
    reps = 0; interval = 0; ease = Math.max(1.3, ease - 0.2);
    return { ease, interval, reps, due: now + 10 * 60 * 1000 }; // học lại sau 10 phút
  }
  reps += 1;
  if (reps === 1) interval = 1;
  else if (reps === 2) interval = rating === RATINGS.hard ? 2 : 4;
  else {
    const mult = rating === RATINGS.hard ? 1.2 : rating === RATINGS.easy ? ease * 1.3 : ease;
    interval = Math.max(1, Math.round(interval * mult));
  }
  if (rating === RATINGS.hard) ease = Math.max(1.3, ease - 0.15);
  if (rating === RATINGS.easy) ease += 0.15;
  return { ease, interval, reps, due: now + interval * DAY };
}

// Mốc hẹn ôn hiển thị trên nút
export function previewLabel(card, rating) {
  if (rating === RATINGS.again) return "10 phút";
  const d = review(card, rating).interval;
  return d + " ngày";
}
