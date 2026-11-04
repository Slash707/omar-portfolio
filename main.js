/* Rendering, routing and small interactions. Each block is wrapped so one problem can never stop the rest. */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const safe = (name, fn) => { try { fn(); } catch (e) { console.error("[portfolio] " + name + " failed:", e); } };
const isSvg = p => /\.svg$/i.test(p);

/* ---------- theme ---------- */
safe("theme", () => {
  let saved = "dark";
  try { saved = localStorage.getItem("theme") || "dark"; } catch (e) {}
  const apply = t => {
    document.documentElement.setAttribute("data-theme", t);
    $("#themeToggle").innerHTML = t === "dark" ? "&#9728;" : "&#9790;";
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === "dark" ? "#030814" : "#eef3fb";
  };
  apply(saved);
  $("#themeToggle").onclick = () => {
    const t = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    apply(t); try { localStorage.setItem("theme", t); } catch (e) {}
  };
});

safe("year", () => { $("#yr").textContent = new Date().getFullYear(); });

/* ---------- profile picture: tries the configured path, then common alternatives ---------- */
safe("profile", () => {
  const base = CONFIG.profilePhoto || "assets/profile.jpg";
  const stem = base.replace(/\.[^./]+$/, "");
  const names = [base];
  ["jpg", "jpeg", "png", "webp", "JPG", "JPEG", "PNG", "jnp", "jpg.jpg", "jpeg.jpg"].forEach(x => names.push(stem + "." + x));
  ["profile.jpg", "profile.jpeg", "profile.png", "profile.webp", "assets/images/profile.jpg", "assets/img/profile.jpg", "images/profile.jpg"].forEach(x => names.push(x));
  const list = [...new Set(names)];
  const img = $("#profileImg"), frame = $("#photoFrame");
  let i = 0;
  const next = () => {
    if (i >= list.length) { console.warn("[portfolio] No profile picture found. Put it in assets/ as profile.jpg. Tried:", list.join(", ")); return; }
    const test = new Image(); const src = list[i++];
    test.onload = () => { img.src = src; img.hidden = false; frame.classList.remove("no-photo"); };
    test.onerror = next;
    test.src = src;
  };
  next();
});

/* ---------- hero social links and location ---------- */
safe("social", () => {
  const li = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>';
  const gh = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>';
  const mail = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 5h20a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm1.6 2L12 13l8.4-6H3.6z"/></svg>';
  const a = (href, label, icon, ext) => `<a href="${esc(href)}" aria-label="${label}" title="${label}"${ext ? ' target="_blank" rel="noopener noreferrer"' : ""}>${icon}</a>`;
  $("#socialLinks").innerHTML =
    (CONFIG.linkedin ? a(CONFIG.linkedin, "LinkedIn", li, true) : "") +
    (CONFIG.github ? a(CONFIG.github, "GitHub", gh, true) : "") +
    (CONFIG.email ? a("mailto:" + CONFIG.email, "Email", mail, false) : "");
  if (CONFIG.location) $("#heroLocationText").textContent = CONFIG.location; else $("#heroLocation").hidden = true;
});

/* ---------- project cards ---------- */
safe("cards", () => {
  $("#cards").innerHTML = PROJECTS.map(p => `<a class="card reveal-scroll" href="#${p.id}">${p.thumb ? `<div class="thumb${isSvg(p.thumb.src) ? " contain" : ""}"><img src="${esc(p.thumb.src)}" alt="${esc(p.thumb.alt)}" loading="lazy"></div>` : ""}<span class="tag">${esc(p.tag)}</span><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p><span class="go">View project &rarr;</span></a>`).join("");
});

safe("skills", () => {
  $("#skillgrid").innerHTML = Object.entries(SKILLS).map(([k, v]) => `<div><h3>${esc(k)}</h3><ul class="chips">${v.map(i => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
});

/* ---------- contact ---------- */
safe("contact", () => {
  const row = (label, text, href) => `<li><span>${label}</span><a href="${esc(href)}"${/^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(text)}</a></li>`;
  let h = "";
  if (CONFIG.email) h += row("Email", CONFIG.email, "mailto:" + CONFIG.email);
  if (CONFIG.linkedin) h += row("LinkedIn", CONFIG.linkedin.replace(/^https?:\/\/(www\.)?/, ""), CONFIG.linkedin);
  if (CONFIG.github) h += row("GitHub", CONFIG.github.replace(/^https?:\/\/(www\.)?/, ""), CONFIG.github);
  else if (CONFIG.showPlaceholders) h += '<li><span>GitHub</span><span class="todo">[ADD in CONFIG]</span></li>';
  if (CONFIG.location) h += `<li><span>Location</span><span>${esc(CONFIG.location)}</span></li>`;
  $("#contactList").innerHTML = h;
});

/* ---------- Verilog design cards (internal id: labGrid) ---------- */
safe("designs", () => {
  $("#labGrid").innerHTML = LABS.map(l => `<article class="lab reveal-scroll"><div><span class="tag">${esc(l.sub)}</span><h3>${esc(l.title)}</h3><ul>${l.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul><a class="go" href="${esc(l.zip.href)}" download>${esc(l.zip.label)} &darr;</a></div>${l.wave ? `<figure><img src="${esc(l.wave.src)}" alt="${esc(l.wave.alt)}" loading="lazy"><figcaption>Plotted from the VCD file my simulation produced.</figcaption></figure>` : ""}</article>`).join("");
});

/* ---------- documents ---------- */
safe("documents", () => {
  $("#docGrid").innerHTML = DOCS.map(x => {
    const pdf = /\.pdf$/i.test(x.href);
    return `<div class="card reveal-scroll">${x.preview ? `<div class="thumb${isSvg(x.preview) ? " contain" : ""}"><img src="${esc(x.preview)}" alt="Preview of ${esc(x.title)}" loading="lazy"></div>` : ""}<h3>${esc(x.title)}</h3><p>${esc(x.sum)}</p><a class="go" href="${esc(x.href)}" ${pdf ? 'target="_blank" rel="noopener"' : "download"}>${pdf ? "Open PDF &nearr;" : "Download files &darr;"}</a></div>`;
  }).join("");
});

/* hide any preview that fails to load instead of showing a broken icon */
safe("imgfallback", () => {
  $$(".thumb img").forEach(img => img.addEventListener("error", () => { console.warn("[portfolio] missing image:", img.getAttribute("src")); img.closest(".thumb").remove(); }));
});

/* ---------- project detail pages ---------- */
const list = a => `<ul>${a.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;
const ALU = `<svg class="alu" viewBox="0 0 640 300" role="img" aria-label="Illustrative block diagram of an ALU"><g fill="none" stroke="var(--blue)" stroke-width="2"><path d="M250 40h140l30 60v100l-30 60H250l-30-60V100z"/><path d="M60 100h160M60 200h160M320 20v25M520 150H420"/></g><g fill="var(--tx)" font-family="sans-serif" font-size="15"><text x="300" y="150">ALU</text><text x="60" y="90">Operand A</text><text x="60" y="190">Operand B</text><text x="330" y="16">Operation select</text><text x="440" y="140">Result</text><text x="440" y="175">Status flags</text></g><text x="320" y="290" text-anchor="middle" fill="var(--mut)" font-family="sans-serif" font-size="12">Illustrative block diagram</text></svg>`;

function detail(p) {
  const gallery = p.media.length ? `<h2>Images and diagrams</h2><div class="gallery">${p.media.map(m => `<a href="${esc(m.src)}" target="_blank" rel="noopener"><img src="${esc(m.src)}" alt="${esc(m.alt)}" loading="lazy"></a>`).join("")}</div>` : "";
  const files = (p.docs && p.docs.length) || (p.links && p.links.length) ? `<h2>Files and links</h2><ul>${[...(p.docs || []), ...(p.links || [])].map(l => `<li><a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a></li>`).join("")}</ul>` : "";
  $("#detailBody").innerHTML = `<a class="back" href="#projects">&larr; All projects</a><span class="tag" style="display:block;margin-top:24px">${esc(p.tag)}</span><h1>${esc(p.title)}</h1>
<h2>Overview</h2><p>${esc(p.overview)}</p><h2>Objective</h2><p>${esc(p.objective)}</p>
<h2>Technologies and tools</h2><ul class="chips">${p.tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
<h2>My contribution</h2>${list(p.contrib)}<h2>Engineering concepts</h2>${list(p.concepts)}<h2>Challenges and learning outcomes</h2>${list(p.learn)}
${p.alu ? `<h2>What an ALU does</h2><p>An Arithmetic Logic Unit is the part of a processor that carries out arithmetic (such as add and subtract) and logical operations (such as AND, OR, and compare). It takes two operands and an operation-select input, routes them through adders and logic gates, and uses multiplexers to pick which result leaves as the output. Registers hold the operands and results between clock cycles.</p>${ALU}` : ""}
${files}${gallery}`;
}

function route() {
  const p = PROJECTS.find(x => "#" + x.id === location.hash);
  document.body.classList.toggle("d", !!p);
  if (p) {
    detail(p);
    document.title = p.title + " | Omar Ahmed";
    window.scrollTo({ top: 0, behavior: "auto" });
  } else {
    document.title = "Omar Ahmed | Electrical Engineering Student";
    const t = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (t) requestAnimationFrame(() => t.scrollIntoView());
  }
  $("#links").classList.remove("open");
  $("#burger").setAttribute("aria-expanded", "false");
}
safe("route", () => { addEventListener("hashchange", route); route(); });

safe("burger", () => {
  $("#burger").onclick = () => { const o = $("#links").classList.toggle("open"); $("#burger").setAttribute("aria-expanded", o); };
});

/* ---------- scroll reveal (always reveals everything if observers are unavailable) ---------- */
safe("reveal", () => {
  const els = $$(".reveal-scroll");
  if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("is-visible")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });
  els.forEach(e => io.observe(e));
  setTimeout(() => els.forEach(e => e.classList.add("is-visible")), 4000); /* safety net */
});

/* ---------- highlight the current section in the nav ---------- */
safe("navspy", () => {
  if (!("IntersectionObserver" in window)) return;
  const links = new Map($$(".links a").map(a => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.removeAttribute("aria-current"));
    const a = links.get(e.target.id); if (a) a.setAttribute("aria-current", "true");
  }), { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((a, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
});

/* ---------- glass: mouse-following light (cheap: sets two CSS variables) ---------- */
safe("glass", () => {
  if (!window.matchMedia("(hover: hover)").matches) return;
  let raf = 0, last = null, scrolling = -1e9;
  addEventListener("scroll", () => { scrolling = performance.now(); }, { passive: true });
  document.addEventListener("pointermove", e => {
    if (performance.now() - scrolling < 120) return; /* pointer churn during scroll does not need the light */
    const t = e.target.closest && e.target.closest(".card, .i-card, .exp, .lab, .demo, .codebox");
    if (!t) return;
    last = { t, x: e.clientX, y: e.clientY };
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0; const r = last.t.getBoundingClientRect();
      last.t.style.setProperty("--mx", (last.x - r.left) + "px");
      last.t.style.setProperty("--my", (last.y - r.top) + "px");
    });
  }, { passive: true });
});