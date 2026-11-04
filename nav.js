/* Draggable vertical navigation: a glowing dot on a fixed left-hand line.
   - dot position always mirrors the page scroll position (wheel, keyboard, touch, links)
   - dragging the dot (mouse or touch) scrolls the page; the track also accepts clicks
   - keyboard: Arrow keys move 5%, PageUp/PageDown 20%, Home/End jump to top/bottom */
(function () {
  const nav = document.getElementById("vnav"), track = document.getElementById("vnavTrack"),
        dot = document.getElementById("vnavDot"), pct = document.getElementById("vnavPct"),
        tickBox = document.getElementById("vnavTicks");
  if (!nav || !track || !dot) return;

  const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = v => Math.min(1, Math.max(0, v));

  /* Cached scroll range: reading scrollHeight forces layout, so it is refreshed
     at most a few times a second instead of on every scroll frame. */
  let cachedMax = 0, cacheAt = -1e9;
  function measure() {
    cachedMax = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    cacheAt = performance.now();
  }
  function maxScroll() {
    if (performance.now() - cacheAt > 250) measure();
    return cachedMax;
  }

  let p = 0, dragging = false, raf = 0, stops = [];

  function paint() {
    nav.style.setProperty("--p", p);
    const n = Math.round(p * 100);
    pct.textContent = n + "%";
    dot.setAttribute("aria-valuenow", n);
    dot.setAttribute("aria-valuetext", n + "% of the page");
    [...tickBox.children].forEach((t, i) => t.classList.toggle("on", p + 0.002 >= stops[i]));
  }
  const setP = v => { p = clamp(v); paint(); };
  const fromScroll = () => { const m = maxScroll(); setP(m ? window.scrollY / m : 0); };
  const scrollToFrac = (f, smooth) => window.scrollTo({ top: clamp(f) * maxScroll(), behavior: smooth && !reduce ? "smooth" : "instant" });
  const fracFromY = y => { const r = track.getBoundingClientRect(); return r.height ? clamp((y - r.top) / r.height) : 0; };

  /* section ticks */
  function buildTicks() {
    if (!nav.offsetParent && getComputedStyle(nav).display === "none") return;
    const ids = ["top", "about", "projects", "experience", "documents", "code", "skills", "education", "resume", "contact"];
    measure();
    const m = cachedMax; stops = []; tickBox.innerHTML = "";
    ids.forEach(id => {
      const el = document.getElementById(id); if (!el || !m) return;
      const pos = clamp((el.getBoundingClientRect().top + window.scrollY - 70) / m);
      stops.push(pos);
      const t = document.createElement("i");
      t.style.top = (pos * 100) + "%"; t.title = id === "top" ? "Top" : id[0].toUpperCase() + id.slice(1);
      tickBox.appendChild(t);
    });
    paint();
  }

  /* scroll -> dot */
  window.addEventListener("scroll", () => {
    if (dragging || raf) return;
    raf = requestAnimationFrame(() => { raf = 0; fromScroll(); });
  }, { passive: true });

  /* drag (mouse + touch + pen) */
  function move(e) {
    if (!dragging) return;
    const f = fracFromY(e.clientY);
    setP(f); scrollToFrac(f, false);
  }
  function start(e) {
    if (e.button !== undefined && e.button !== 0) return;
    dragging = true; nav.classList.add("dragging");
    try { track.setPointerCapture(e.pointerId); } catch (_) {}
    move(e);
    if (e.cancelable) e.preventDefault();
  }
  function end(e) {
    if (!dragging) return;
    dragging = false; nav.classList.remove("dragging");
    try { track.releasePointerCapture(e.pointerId); } catch (_) {}
    fromScroll();
  }
  track.addEventListener("pointerdown", start);
  track.addEventListener("pointermove", move);
  track.addEventListener("pointerup", end);
  track.addEventListener("pointercancel", end);
  track.addEventListener("lostpointercapture", end);

  /* keyboard */
  dot.addEventListener("keydown", e => {
    const k = e.key; let f = null;
    if (k === "ArrowUp" || k === "ArrowLeft") f = p - 0.05;
    else if (k === "ArrowDown" || k === "ArrowRight") f = p + 0.05;
    else if (k === "PageUp") f = p - 0.2;
    else if (k === "PageDown") f = p + 0.2;
    else if (k === "Home") f = 0;
    else if (k === "End") f = 1;
    if (f === null) return;
    e.preventDefault(); scrollToFrac(f, true);
  });

  /* keep tick positions right when the layout changes (never during a drag or scroll frame) */
  let t = 0;
  const later = () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (dragging || raf) return;
      measure();
      buildTicks();
      fromScroll();
    }, 120);
  };
  window.addEventListener("resize", later);
  window.addEventListener("load", later);
  window.addEventListener("hashchange", later);
  if ("ResizeObserver" in window) {
    let roT = 0;
    new ResizeObserver(() => { clearTimeout(roT); roT = setTimeout(() => { if (!dragging && !raf) later(); }, 200); })
      .observe(document.body);
  }

  measure();
  buildTicks(); fromScroll();
})();