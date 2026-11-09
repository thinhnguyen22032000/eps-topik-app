import { esc, speak, loadJSON } from "./util.js";

export async function initSafety(root) {
  const { groups, imageGuide } = await loadJSON("./data/safety-signs.json");
  let active = "all";
  let selfTest = false;

  function render() {
    const shown = active === "all" ? groups : groups.filter((g) => g.id === active);
    root.innerHTML = `
      <div class="flex flex-wrap items-center gap-2 mb-4">
        <button data-g="all" class="tab-btn ${active === "all" ? "active" : ""}">Tất cả</button>
        ${groups.map((g) => `<button data-g="${g.id}" class="tab-btn ${active === g.id ? "active" : ""}">${esc(g.title)}</button>`).join("")}
        <label class="ml-auto text-sm flex items-center gap-2 cursor-pointer">
          <input id="selftest" type="checkbox" ${selfTest ? "checked" : ""}> Tự kiểm tra (ẩn ý nghĩa, bấm để xem)
        </label>
      </div>
      ${shown.map((g) => `
        <section class="mb-8 ${g.css}">
          <h2 class="text-lg font-bold" style="color:var(--c)">${esc(g.title)} · ${esc(g.ko)}</h2>
          <p class="text-sm text-slate-500 mb-1">${esc(g.hint)}</p>
          <details class="text-xs text-slate-400 mb-3"><summary class="cursor-pointer">Nguồn hình chuẩn để thay thế</summary>
            <p class="mt-1">${esc(g.sourceHint)}</p><p>${esc(imageGuide.koreaSource)}</p><p>${esc(imageGuide.howToReplace)}</p></details>
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            ${g.signs.map((s) => `
              <div class="sign-card ${selfTest ? "" : "open"} ${g.css}" data-ko="${esc(s.ko)}">
                <div class="flex items-center gap-3">
                  <img class="sign-img" src="${esc(s.image)}" alt="${esc(s.vi)}" width="72" height="72">
                  <div>
                    <p class="text-xl font-bold">${esc(s.ko)}</p>
                    <p class="reveal font-semibold" style="color:var(--c)">${esc(s.vi)}</p>
                  </div>
                </div>
                <p class="reveal text-sm mt-3 text-slate-700">🏭 ${esc(s.scene)}</p>
              </div>`).join("")}
          </div>
        </section>`).join("")}`;
    root.querySelectorAll("[data-g]").forEach((b) => b.addEventListener("click", () => { active = b.dataset.g; render(); }));
    root.querySelector("#selftest").addEventListener("change", (e) => { selfTest = e.target.checked; render(); });
    root.querySelectorAll(".sign-card").forEach((c) => c.addEventListener("click", () => {
      if (selfTest) c.classList.toggle("open");
      speak(c.dataset.ko);
    }));
  }
  render();
}
