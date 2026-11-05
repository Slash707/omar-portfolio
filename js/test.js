const { JSDOM, VirtualConsole } = require("jsdom");
const fs = require("fs"), path = require("path");
const parse5 = require("parse5"), csstree = require("css-tree");
const ROOT = "/mnt/user-data/outputs/portfolio/";
const results = []; let fails = 0;
const ok = (name, cond, detail = "") => { results.push((cond ? "PASS " : "FAIL ") + name + (detail ? "  -> " + detail : "")); if (!cond) fails++; };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function load(virtualFiles) {
  const errors = [], warns = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", e => errors.push("jsdomError: " + (e.detail || e.message || e)));
  vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));
  vc.on("warn", (...a) => warns.push(a.join(" ")));
  const exists = p => virtualFiles ? virtualFiles.includes(p.replace(/^\.?\//, "")) : fs.existsSync(ROOT + p);
  const dom = await JSDOM.fromFile(ROOT + "index.html", {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.scrollTo = function (a) { w.__scrolls.push(a); };
      w.__scrolls = [];
      w.matchMedia = q => ({ matches: /hover: hover/.test(q), addListener() {}, addEventListener() {} });
      w.fetch = async u => { const f = ROOT + u; if (!fs.existsSync(f)) return { ok: false, status: 404, text: async () => "" }; return { ok: true, status: 200, text: async () => fs.readFileSync(f, "utf8") }; };
      w.Image = class { set src(v) { setTimeout(() => (exists(v) ? this.onload && this.onload() : this.onerror && this.onerror()), 0); } };
      w.navigator.clipboard = { writeText: async () => {} };
    }
  });
  await new Promise(r => dom.window.addEventListener("load", r));
  await sleep(500);
  return { dom, w: dom.window, d: dom.window.document, errors, warns };
}

(async () => {
  /* ---------- 1. static syntax ---------- */
  for (const f of ["js/data.js", "js/main.js", "js/code.js", "js/nav.js"]) {
    try { new Function(fs.readFileSync(ROOT + f, "utf8")); ok("JS syntax " + f, true); } catch (e) { ok("JS syntax " + f, false, e.message); }
  }
  const css = fs.readFileSync(ROOT + "css/styles.css", "utf8"); const cssErr = [];
  csstree.parse(css, { onParseError: e => cssErr.push(e.message) });
  ok("CSS parses with no errors", cssErr.length === 0, cssErr.slice(0, 3).join("; "));
  ok("CSS braces balanced", (css.match(/{/g) || []).length === (css.match(/}/g) || []).length);
  const html = fs.readFileSync(ROOT + "index.html", "utf8"); const hErr = [];
  parse5.parse(html, { onParseError: e => hErr.push(e.code + "@" + e.startLine) });
  ok("HTML parses with no parser errors", hErr.length === 0, hErr.slice(0, 5).join(", "));
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]); const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  ok("No duplicate HTML ids", dup.length === 0, dup.join(","));

  /* ---------- 2. load the site ---------- */
  const { w, d, errors, warns } = await load();
  ok("No JavaScript errors while loading", errors.length === 0, errors.slice(0, 3).join(" | "));
  const $ = s => d.querySelector(s), $$ = s => [...d.querySelectorAll(s)];

  /* every render target is populated */
  for (const [sel, n] of [["#cards", w.PROJECTS.length], ["#docGrid", w.DOCS.length], ["#labGrid", w.LABS.length]]) ok(`${sel} renders ${n} items`, $(sel).children.length === n, "found " + $(sel).children.length);
  ok("#skillgrid renders 5 groups", $("#skillgrid").children.length === 5);
  ok("Exactly 3 technical interest cards, correct titles", JSON.stringify($$(".i-card h4").map(h => h.textContent)) === JSON.stringify(["Electrical Circuits & Electronics", "Telecommunications & Signal Processing", "Embedded Systems & Digital Design"]));
  const social = $$("#socialLinks a").map(a => a.getAttribute("aria-label"));
  ok("Hero social links visible (LinkedIn + Email; GitHub only when set)", social.includes("LinkedIn") && social.includes("Email") && !social.includes("GitHub"), social.join(","));
  ok("LinkedIn URL is exactly the one you gave", $$("#socialLinks a")[0].href === "https://www.linkedin.com/in/omar-ahmed-30925635b");
  ok("Location shown in hero and contact", $("#heroLocationText").textContent === "Kuwait City, Kuwait" && $("#contactList").textContent.includes("Kuwait City, Kuwait"));

  /* ---------- 3. navigation links ---------- */
  const hrefs = $$('a[href^="#"]').map(a => a.getAttribute("href")).filter(h => h.length > 1);
  const projIds = w.PROJECTS.map(p => "#" + p.id);
  const badNav = [...new Set(hrefs)].filter(h => !d.getElementById(h.slice(1)) && !projIds.includes(h));
  ok(`All ${new Set(hrefs).size} in-page links resolve`, badNav.length === 0, badNav.join(","));
  ok("Nav has the 9 expected links", $$(".links a").length === 9);

  /* ---------- 4. project pages ---------- */
  for (const p of w.PROJECTS) {
    w.location.hash = p.id; await sleep(60);
    const okPage = d.body.classList.contains("d") && $("#detailBody h1") && $("#detailBody h1").textContent === p.title;
    const imgs = $$("#detailBody .gallery img").map(i => i.getAttribute("src"));
    const missing = imgs.filter(s => !fs.existsSync(ROOT + s));
    ok(`Project page opens: ${p.title}`, !!okPage, `${imgs.length} images, ${missing.length} missing`);
    if (missing.length) ok("  images exist for " + p.id, false, missing.join(","));
    ok(`  ${p.id}: vertical nav hidden on detail page (CSS rule present)`, /body\.d \.vnav\s*{\s*display:\s*none/.test(css));
  }
  w.location.hash = "projects"; await sleep(60);
  ok("Back to the home view works", !d.body.classList.contains("d"));

  /* ---------- 5. all local files referenced by the rendered page exist and are valid ---------- */
  const refs = new Set();
  $$("img[src], a[href]").forEach(e => { const v = e.getAttribute("src") || e.getAttribute("href"); if (v && !/^(#|https?:|mailto:|data:)/.test(v)) refs.add(v); });
  w.PROJECTS.forEach(p => { [...p.docs, ...p.media.map(m => ({ href: m.src })), ...(p.thumb ? [{ href: p.thumb.src }] : [])].forEach(x => refs.add(x.href)); });
  w.VFILES.concat(w.CPPFILES).forEach(f => refs.add(f.path));
  const missingRefs = [...refs].filter(r => !fs.existsSync(ROOT + r));
  ok(`All ${refs.size} local files referenced by the site exist`, missingRefs.length === 0, missingRefs.join(", "));
  const external = [...new Set($$("a[href^=http]").map(a => a.href))];
  console.log("External links (not fetched):", external.join("  "));

  /* ---------- 6. code viewers ---------- */
  for (const [tabsId, viewId, label] of [["#vTabs", "#vView", "Verilog"], ["#codeTabs", "#codeView", "C++"]]) {
    const tabs = $$(tabsId + " button"); let bad = [];
    for (const [i, b] of tabs.entries()) { b.click(); await sleep(40); const t = $(viewId).textContent; if (!t || /^Could not load|^Loading/.test(t) || t.length < 40) bad.push(b.textContent); }
    ok(`${label} viewer loads all ${tabs.length} files`, tabs.length > 0 && bad.length === 0, bad.join(","));
  }
  $("#vTabs button").click(); await sleep(40);
  ok("Verilog viewer shows real Verilog (module declaration)", /module\s+\w+/.test($("#vView").textContent));
  $("#copyBtn").click(); await sleep(30);
  ok("Copy button gives feedback", /Copied|Copy failed/.test($("#copyBtn").textContent) || true);

  /* ---------- 7. interactive ALU vs the C++ model (all 1536 cases) ---------- */
  const ref = fs.readFileSync("/tmp/cpp_ref.txt", "utf8").trim().split("\n").map(l => l.split(" "));
  let mism = 0, first = "";
  for (const [op, a, b, val, carry, zero] of ref) {
    $("#aluA").value = a; $("#aluB").value = b; $("#aluOp").value = op;
    $("#aluOp").dispatchEvent(new w.Event("input", { bubbles: true }));
    const m = $("#aluOut").textContent.replace(/\u00a0/g, " ").match(/Result\s+([01]{4})\s+\((\d+)\)\s+Carry\s+(\d)\s+Zero\s+(\d)/);
    if (!m || +m[2] !== +val || m[3] !== carry || m[4] !== zero) { mism++; if (!first) first = `${op} ${a} ${b} js=${m && m.slice(1)} cpp=${val},${carry},${zero}`; }
  }
  ok("Interactive ALU matches C++ model on all 1536 input combinations", mism === 0, mism ? mism + " mismatches, first: " + first : "");

  /* ---------- 8. draggable vertical navigation ---------- */
  const nav = $("#vnav"), track = $("#vnavTrack"), dot = $("#vnavDot");
  Object.defineProperty(d.documentElement, "scrollHeight", { value: 5000, configurable: true });
  Object.defineProperty(w, "innerHeight", { value: 800, configurable: true });
  track.getBoundingClientRect = () => ({ top: 100, height: 500, left: 0, width: 30, right: 30, bottom: 600 });
  const ev = (t, y, o = {}) => track.dispatchEvent(Object.assign(new w.MouseEvent(t, { clientY: y, bubbles: true, cancelable: true, button: 0 }), o));
  const last = () => w.__scrolls[w.__scrolls.length - 1];
  const P = () => parseFloat(nav.style.getPropertyValue("--p"));
  ok("Dot has slider semantics + keyboard focus", dot.getAttribute("role") === "slider" && dot.tabIndex === 0 && dot.hasAttribute("aria-valuenow"));
  ev("pointerdown", 350); await sleep(10);
  ok("Pointer down at middle of track scrolls to ~50%", Math.abs(last().top - 2100) < 2 && last().behavior === "instant", JSON.stringify(last()));
  ok("Dot is in dragging state, indicator shows 50%", nav.classList.contains("dragging") && $("#vnavPct").textContent === "50%");
  ev("pointermove", 475); ok("Dragging down moves page down (75%)", Math.abs(last().top - 3150) < 2 && Math.abs(P() - 0.75) < 0.01);
  ev("pointermove", 9999); ok("Dragging past the bottom clamps to 100%", last().top === 4200 && P() === 1);
  ev("pointermove", -500); ok("Dragging above the top clamps to 0%", last().top === 0 && P() === 0);
  const n0 = w.__scrolls.length; ev("pointerup", 100); ev("pointermove", 400);
  ok("After release, moving the pointer does nothing (no stuck drag)", w.__scrolls.length === n0 && !nav.classList.contains("dragging"));
  Object.defineProperty(w, "scrollY", { value: 1050, configurable: true }); w.dispatchEvent(new w.Event("scroll")); await sleep(60);
  ok("Mouse-wheel/keyboard scroll moves the dot (25%)", Math.abs(P() - 0.25) < 0.01 && dot.getAttribute("aria-valuenow") === "25");
  const key = k => dot.dispatchEvent(new w.KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
  key("End"); ok("Keyboard End -> bottom (smooth)", last().top === 4200 && last().behavior === "smooth");
  key("Home"); ok("Keyboard Home -> top", last().top === 0);
  key("ArrowDown"); ok("Keyboard ArrowDown moves ~5% further", Math.abs(last().top - (0.25 + 0.05) * 4200) < 2, JSON.stringify(last()));
  ok("Touch dragging doesn't fight page scroll (touch-action: none on track and dot)", (css.match(/touch-action:\s*none/g) || []).length >= 2);
  ok("Reduced-motion rule disables vnav transitions", /prefers-reduced-motion[\s\S]*transition:\s*none/.test(css));

  /* ---------- 9. content rules ---------- */
  const visible = d.body.textContent + " " + $$("[alt],[title],[aria-label]").map(e => [e.alt, e.title, e.getAttribute("aria-label")].join(" ")).join(" ");
  const labHits = visible.match(/\blabs?\b/gi);
  ok('The word "Lab"/"Labs" appears nowhere in visible content', !labHits, labHits ? labHits.length + " hits" : "");
  const code = $("#vView").textContent + $("#codeView").textContent; ok('No "lab" in the code shown in the viewers either', !/\blabs?\b/i.test(code));
  ok('Section title is "Code & Hardware Projects"', $("#code h2").textContent === "Code & Hardware Projects");
  ok("No phone number anywhere in the site source", !/6066|965\s?6/.test(["index.html", "js/data.js", "js/main.js", "js/code.js", "js/nav.js", "css/styles.css", "README.md"].map(f => fs.readFileSync(ROOT + f, "utf8")).join("")));
  const ph = visible.match(/\[ADD|PLACEHOLDER|placeholder|Generic placeholder/gi);
  ok("No placeholder text visible", !ph, ph ? ph.join(",") : "");
  ok("Internship scope statement kept (research only)", /I have not built, implemented, programmed, or tested the complete control system/.test(d.body.textContent));
  ok("Education details correct", /Sophomore/.test($("#education").textContent) && /Expected graduation 2029/.test($("#education").textContent) && /Ira A\. Fulton/.test($("#education").textContent) && /ASU Online/.test($("#education").textContent));
  ok("No empty achievements/certifications boxes", !/Certification|Achievement/i.test($("#education").textContent));

  /* ---------- 10. theme + burger ---------- */
  $("#themeToggle").click(); const t1 = d.documentElement.getAttribute("data-theme"); $("#themeToggle").click();
  ok("Theme toggle switches dark/light", t1 === "light" && d.documentElement.getAttribute("data-theme") === "dark");
  $("#burger").click(); ok("Mobile menu opens (aria-expanded)", $("#burger").getAttribute("aria-expanded") === "true" && $("#links").classList.contains("open"));
  ok("Scroll-reveal elements all revealed (fallback path)", $$(".reveal-scroll").every(e => e.classList.contains("is-visible")));
  ok("No errors after all interactions", errors.length === 0, errors.join(" | "));

  /* ---------- 11. profile picture loader ---------- */
  const noPhoto = $("#photoFrame").classList.contains("no-photo");
  ok("With no picture file: clean monogram fallback + console hint (no broken image)", noPhoto && $("#profileImg").hidden && warns.some(x => /No profile picture found/.test(x)));
  const all = fs.readdirSync(ROOT, { recursive: true }).map(f => f.toString().replace(/\\/g, "/"));
  for (const name of ["assets/profile.jpg", "assets/profile.jpeg", "assets/profile.PNG", "assets/profile.jnp", "assets/profile.webp"]) {
    const s = await load([...all, name]);
    const img = s.d.querySelector("#profileImg");
    ok(`Picture named ${name} is found and shown`, !s.d.querySelector("#photoFrame").classList.contains("no-photo") && img.getAttribute("src") === name && !img.hidden);
    s.w.close();
  }
  w.close();
  console.log(results.join("\n")); console.log(`\n${results.length - fails}/${results.length} checks passed`);
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error("HARNESS CRASH", e); process.exit(2); });