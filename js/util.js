export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function speak(text, rate = 0.8) {
  if (!("speechSynthesis" in window)) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR"; u.rate = rate;
  speechSynthesis.speak(u);
  return true;
}

export const loadJSON = (url) => fetch(url).then((r) => r.json());

// Hộp thoại xác nhận tự vẽ (confirm()/alert() của trình duyệt bị chặn trong nhiều khung nhúng).
// Trả về Promise<boolean>; okOnly = true thì chỉ có nút Đóng (dùng như thông báo).
export function confirmDialog(message, { okLabel = "Đồng ý", cancelLabel = "Hủy", okOnly = false } = {}) {
  return new Promise((resolve) => {
    const wrap = document.createElement("div");
    wrap.className = "fixed inset-0 z-[60] bg-slate-900/50 grid place-items-center p-4";
    wrap.innerHTML = `<div class="bg-white text-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-6" role="alertdialog" aria-modal="true">
      <p class="mb-5 whitespace-pre-line"></p>
      <div class="flex gap-2 justify-end">
        ${okOnly ? "" : `<button data-no class="px-4 py-2 rounded-xl border">${esc(cancelLabel)}</button>`}
        <button data-yes class="px-4 py-2 rounded-xl bg-blue-700 text-white font-semibold">${esc(okOnly ? "Đóng" : okLabel)}</button>
      </div></div>`;
    wrap.querySelector("p").textContent = message;
    const done = (v) => { wrap.remove(); document.removeEventListener("keydown", onKey); resolve(v); };
    const onKey = (e) => { if (e.key === "Escape") done(false); };
    wrap.querySelector("[data-yes]").addEventListener("click", () => done(true));
    const no = wrap.querySelector("[data-no]"); if (no) no.addEventListener("click", () => done(false));
    document.addEventListener("keydown", onKey);
    document.body.appendChild(wrap);
    wrap.querySelector("[data-yes]").focus();
  });
}
