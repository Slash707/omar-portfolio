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
/* ---------- technical skills ---------- */
safe("skills", () => {
  const grid = $("#skillgrid");
  if (!grid) return;

  grid.innerHTML = Object.entries(SKILLS).map(([category, items]) => `
    <article class="card reveal-scroll">
      <span class="tag">${esc(category)}</span>
      <ul class="chips">
        ${items.map(item => `<li>${esc(item)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
});

/* ---------- social media icons ---------- */
safe("social links", () => {
  const container = $("#socialLinks");
  if (!container) return;

  const icons = {
    linkedin: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19ZM8 10H5V19H8V10ZM6.5 5.5A1.5 1.5 0 1 0 6.5 8.5A1.5 1.5 0 0 0 6.5 5.5ZM19 13.5C19 10.8 17.6 9.5 15.5 9.5C14.3 9.5 13.5 10.1 13 10.8V10H10V19H13V14C13 12.7 13.3 11.5 14.7 11.5C16.1 11.5 16 13 16 14V19H19V13.5Z"/>
    </svg>`,

    github: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M12 .8A11.2 11.2 0 0 0 8.46 22.62C9.02 22.72 9.22 22.37 9.22 22.06V19.9C5.48 20.72 4.81 18.31 4.81 18.31C4.3 17.02 3.57 16.68 3.57 16.68C2.55 15.98 3.65 15.99 3.65 15.99C4.78 16.07 5.38 17.15 5.38 17.15C6.38 18.86 8.01 18.37 9.24 18.06C9.34 17.34 9.63 16.85 9.95 16.57C6.96 16.23 3.82 15.07 3.82 9.98C3.82 8.53 4.34 7.35 5.4 6.43C5.27 6.1 4.81 4.77 5.51 2.94C5.51 2.94 6.6 2.59 9.18 4.34A9.7 9.7 0 0 1 12 3.96C12.96 3.96 13.93 4.09 14.82 4.34C17.4 2.59 18.49 2.94 18.49 2.94C19.19 4.77 18.73 6.1 18.6 6.43C19.66 7.35 20.18 8.53 20.18 9.98C20.18 15.08 17.03 16.22 14.03 16.56C14.44 16.92 14.8 17.62 14.8 18.69V22.06C14.8 22.37 15 22.73 15.57 22.62A11.2 11.2 0 0 0 12 .8Z"/>
    </svg>`,

    email: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#EA4335" d="M3 6.5 12 13l9-6.5V19H3z"/>
      <path fill="#4285F4" d="M3 6.5V19h3V9z"/>
      <path fill="#34A853" d="M18 9v10h3V6.5z"/>
      <path fill="#FBBC04" d="M3 6.5 12 13l2-1.5-11-8z"/>
      <path fill="#C5221F" d="M21 6.5 12 13l-2-1.5 11-8z"/>
    </svg>`
  };

  const links = [
    { name: "LinkedIn", href: CONFIG.linkedin, icon: icons.linkedin },
    { name: "GitHub", href: CONFIG.github, icon: icons.github },
    { name: "Gmail", href: "mailto:" + CONFIG.email, icon: icons.email }
  ];

  container.innerHTML = links
    .filter(link => link.href)
    .map(link => `
      <a class="social-link"
         href="${esc(link.href)}"
         aria-label="${link.name}"
         title="${link.name}"
         ${link.name !== "Gmail" ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        ${link.icon}
      </a>
    `).join("");
});

/* ---------- remove profile picture completely ---------- */

safe("profile", () => {
  const frame = $("#photoFrame");
  if (frame) frame.remove();
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
/* ---------- Engineering project cards ---------- */
safe("projects", () => {
const cards = $("#cards");
if (!cards) return;

cards.innerHTML = PROJECTS.map(p => `    <a class="card reveal-scroll" href="#${esc(p.id)}">
      ${p.thumb ?` <div class="thumb"> <img src="${esc(p.thumb.src)}"
            alt="${esc(p.thumb.alt)}"
            loading="lazy"> </div>
`: ""}       <span class="tag">${esc(p.tag)}</span>       <h3>${esc(p.title)}</h3>       <p>${esc(p.summary || p.overview)}</p>       <span class="go">EXPLORE PROJECT &rarr;</span>     </a>
 `).join("");
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
/* ---------- Reading-position electrical waveform ---------- */
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (document.getElementById("electric-wave")) return;

  const style = document.createElement("style");

  style.textContent = `
    main {
      position: relative;
      isolation: isolate;
    }

    main > *:not(#electric-wave) {
      position: relative;
      z-index: 1;
    }

    #electric-wave {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      pointer-events: none;
      overflow: visible;
    }

    #electric-wave path {
      fill: none;
      stroke: #39ff88;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter:
        drop-shadow(0 0 4px #39ff88)
        drop-shadow(0 0 10px #00ff66);
    }
  `;

  document.head.appendChild(style);

  const svgNS = "http://www.w3.org/2000/svg";

  const wave = document.createElementNS(svgNS, "svg");
  wave.id = "electric-wave";
  wave.setAttribute("aria-hidden", "true");
  wave.setAttribute("preserveAspectRatio", "none");

  const path = document.createElementNS(svgNS, "path");
  wave.appendChild(path);

  const main = document.querySelector("main");
  if (!main) return;

  main.prepend(wave);

  let trackedScroll = window.scrollY;
  let trackedReadingPosition =
    trackedScroll + window.innerHeight * 0.55;

  // Update the reader's position every 500 milliseconds.
  setInterval(() => {
    trackedScroll = window.scrollY;

    trackedReadingPosition =
      trackedScroll + window.innerHeight * 0.55;
  }, 500);

  function updateWave() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Follow the reader's current position on screen.
    const y = trackedReadingPosition - window.scrollY;

    wave.setAttribute("viewBox", `0 0 ${width} ${height}`);

    path.setAttribute("d", `
      M -30 ${y}
      L ${width * 0.10} ${y}
      L ${width * 0.13} ${y - 12}
      L ${width * 0.16} ${y + 15}
      L ${width * 0.19} ${y - 55}
      L ${width * 0.22} ${y + 65}
      L ${width * 0.25} ${y}
      L ${width * 0.38} ${y}
      L ${width * 0.41} ${y - 12}
      L ${width * 0.44} ${y + 15}
      L ${width * 0.47} ${y - 55}
      L ${width * 0.50} ${y + 65}
      L ${width * 0.53} ${y}
      L ${width * 0.66} ${y}
      L ${width * 0.69} ${y - 12}
      L ${width * 0.72} ${y + 15}
      L ${width * 0.75} ${y - 55}
      L ${width * 0.78} ${y + 65}
      L ${width * 0.81} ${y}
      L ${width + 30} ${y}
    `);
  }

  function showWave() {
    updateWave();

    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    path.getAnimations().forEach(animation => animation.cancel());
    wave.getAnimations().forEach(animation => animation.cancel());

    path.animate(
      [
        { strokeDashoffset: length },
        { strokeDashoffset: 0 }
      ],
      {
        duration: 2500,
        easing: "linear",
        fill: "forwards"
      }
    );

    wave.animate(
      [
        { opacity: 0 },
        { opacity: 0.45, offset: 0.15 },
        { opacity: 0.45, offset: 0.75 },
        { opacity: 0 }
      ],
      {
        duration: 3000,
        easing: "ease-in-out",
        fill: "forwards"
      }
    );
  }

  window.addEventListener("resize", updateWave);

  // First appearance after 5 seconds.
  setTimeout(showWave, 5000);

  // Repeat every 30 seconds.
  setInterval(showWave, 9000);
})();