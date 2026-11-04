/* File viewers (Verilog and C++) and the interactive ALU demo.
   File lists live in js/data.js (VFILES and CPPFILES). */
(function () {
  function viewer(ids, files) {
    const tabs = document.getElementById(ids.tabs), pre = document.getElementById(ids.view),
          note = document.getElementById(ids.note), copy = document.getElementById(ids.copy);
    if (!tabs || !pre || !files || !files.length) return;
    let token = 0;
    async function show(i) {
      const f = files[i], my = ++token;
      [...tabs.children].forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
      note.textContent = f.note;
      pre.textContent = "Loading...";
      try {
        const r = await fetch(f.path);
        if (!r.ok) throw new Error(r.status);
        const text = await r.text();
        if (my === token) pre.textContent = text;
      } catch (e) {
        if (my === token) pre.textContent = "Could not load " + f.path + ".\nOpen the site with VS Code Live Server or GitHub Pages (browsers block file loading from a double-clicked page).";
      }
    }
    files.forEach((f, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.setAttribute("role", "tab"); b.textContent = f.name; b.onclick = () => show(i);
      b.onkeydown = e => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const n = (i + (e.key === "ArrowRight" ? 1 : files.length - 1)) % files.length;
        show(n); tabs.children[n].focus();
      };
      tabs.appendChild(b);
    });
    copy.onclick = async () => {
      try { await navigator.clipboard.writeText(pre.textContent); copy.textContent = "Copied!"; }
      catch (e) { copy.textContent = "Copy failed"; }
      setTimeout(() => (copy.textContent = "Copy code"), 1500);
    };
    show(0);
  }

  if (typeof VFILES !== "undefined") viewer({ tabs: "vTabs", view: "vView", note: "vNote", copy: "vCopy" }, VFILES);
  if (typeof CPPFILES !== "undefined") viewer({ tabs: "codeTabs", view: "codeView", note: "codeNote", copy: "copyBtn" }, CPPFILES);

  /* Interactive 4-bit ALU (JavaScript version of cpp/alu_model.cpp) */
  const A = document.getElementById("aluA"), B = document.getElementById("aluB"),
        O = document.getElementById("aluOp"), out = document.getElementById("aluOut");
  if (!A || !B || !O || !out) return;
  const bin = v => v.toString(2).padStart(4, "0");
  function run() {
    const a = (parseInt(A.value, 10) || 0) & 15, b = (parseInt(B.value, 10) || 0) & 15;
    let r, carry = 0;
    switch (O.value) {
      case "ADD": r = a + b; carry = r > 15 ? 1 : 0; break;
      case "SUB": r = a + ((~b) & 15) + 1; carry = r > 15 ? 1 : 0; break;
      case "AND": r = a & b; break;
      case "OR":  r = a | b; break;
      case "XOR": r = a ^ b; break;
      default:    r = (~a) & 15;
    }
    r &= 15;
    out.innerHTML = `<span>A</span> ${bin(a)} &nbsp; <span>B</span> ${bin(b)}<br><span>Result</span> <b>${bin(r)}</b> (${r}) &nbsp; <span>Carry</span> ${carry} &nbsp; <span>Zero</span> ${r === 0 ? 1 : 0}`;
  }
  ["input", "change"].forEach(ev => [A, B, O].forEach(el => el.addEventListener(ev, run)));
  run();
})();