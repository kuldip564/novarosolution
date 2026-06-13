type ScrollListener = (scrollY: number) => void;

let scrollY = 0;
const listeners = new Set<ScrollListener>();

export const scrollStore = {
  mx: 0,
  my: 0,
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
