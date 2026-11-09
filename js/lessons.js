import { loadJSON } from "./util.js";

let indexP; const cache = {};
export const loadLessonIndex = () => (indexP ||= loadJSON("./data/lessons/index.json"));
export async function loadLesson(id) {
  const index = await loadLessonIndex();
  const meta = index.find((l) => l.id === id) || index[0];
  return (cache[meta.id] ||= loadJSON("./data/lessons/" + meta.file));
}
export async function loadAllLessons() {
  const index = await loadLessonIndex();
  return Promise.all(index.map((l) => loadLesson(l.id)));
}
