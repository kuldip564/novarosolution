type ScrollListener = (scrollY: number) => void;

let scrollY = 0;
let mouseX = 0;
let mouseY = 0;
const listeners = new Set<ScrollListener>();

export const scrollStore = {
  get mx() {
    return mouseX;
  },
  set mx(value: number) {
    mouseX = value;
  },
  get my() {
    return mouseY;
  },
  set my(value: number) {
    mouseY = value;
  },
  get y() {
    return scrollY;
  },
};

export function setScrollY(next: number): void {
  if (next === scrollY) return;
  scrollY = next;
  listeners.forEach((listener) => listener(next));
}

export function subscribeScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  listener(scrollY);
  return () => listeners.delete(listener);
}
