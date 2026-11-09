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
