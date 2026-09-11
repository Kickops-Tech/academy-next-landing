/**
 * Shared scroll/resize → single rAF tick for all subscribers.
 * Avoids N window listeners × N React setStates on every scroll.
 */
type ScrollRafListener = () => void;

const listeners = new Set<ScrollRafListener>();
let rafId = 0;
let attached = false;

function flush() {
  rafId = 0;
  for (const listener of listeners) {
    listener();
  }
}

function schedule() {
  if (rafId !== 0) {
    return;
  }
  rafId = window.requestAnimationFrame(flush);
}

function attach() {
  if (attached) {
    return;
  }
  attached = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function detach() {
  if (!attached || listeners.size > 0) {
    return;
  }
  attached = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (rafId !== 0) {
    window.cancelAnimationFrame(rafId);
    rafId = 0;
  }
}

export function subscribeScrollRaf(listener: ScrollRafListener) {
  listeners.add(listener);
  attach();
  listener();

  return () => {
    listeners.delete(listener);
    detach();
  };
}
