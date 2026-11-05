
/* File viewers (Verilog and C++) and interactive ALU demo. */
(function () {
  function viewer(ids, files) {
    const tabs = document.getElementById(ids.tabs);
    const pre = document.getElementById(ids.view);
    const note = document.getElementById(ids.note);
    const copy = document.getElementById(ids.copy);

    if (!tabs || !pre || !files || !files.length) return;

    let token = 0;

    async function show(i) {
      const f = files[i];
      const my = ++token;

      [...tabs.children].forEach((b, j) => {
        b.setAttribute("aria-selected", j === i);
        b.tabIndex = j === i ? 0 : -1;
      });

      if (note) note.textContent = f.note || "";
      pre.textContent = "Loading...";

      try {
        const fileURL = new URL(f.path, document.baseURI);
        const response = await fetch(fileURL);

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        const code = await response.text();

        if (my === token) {
          pre.textContent = code;
        }
      } catch (error) {
        if (my === token) {
          pre.textContent =
            "Unable to load: " + f.path +
            "\n\nError: " + error.message +
            "\n\nCheck that this file exists in your GitHub repository at the exact path shown above.";
        }

        console.error("[portfolio] File loading failed:", f.path, error);
      }
    }

    files.forEach((f, i) => {
      const button = document.createElement("button");

      button.type = "button";
      button.setAttribute("role", "tab");
      button.textContent = f.name;

      button.onclick = () => show(i);

      button.onkeydown = e => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;

        e.preventDefault();

        const next = (
          i + (e.key === "ArrowRight" ? 1 : files.length - 1)
        ) % files.length;

        show(next);
        tabs.children[next].focus();
      };

      tabs.appendChild(button);
    });

    if (copy) {
      copy.onclick = async () => {
        const code = pre.textContent;

        try {
          await navigator.clipboard.writeText(code);
          copy.textContent = "Copied!";
        } catch (error) {
          copy.textContent = "Copy failed";
          console.error("[portfolio] Clipboard error:", error);
        }

        setTimeout(() => {
          copy.textContent = "Copy code";
        }, 1500);
      };
    }

    show(0);
  }

  /* Verilog and C++ viewers */
  if (typeof VFILES !== "undefined") {
    viewer(
      { tabs: "vTabs", view: "vView", note: "vNote", copy: "vCopy" },
      VFILES
    );
  }

  if (typeof CPPFILES !== "undefined") {
    viewer(
      { tabs: "codeTabs", view: "codeView", note: "codeNote", copy: "copyBtn" },
      CPPFILES
    );
  }

  /* Interactive 4-bit ALU */
  const A = document.getElementById("aluA");
  const B = document.getElementById("aluB");
  const O = document.getElementById("aluOp");
  const out = document.getElementById("aluOut");

  if (!A || !B || !O || !out) return;

  const bin = v => v.toString(2).padStart(4, "0");

  function run() {
    const a = (parseInt(A.value, 10) || 0) & 15;
    const b = (parseInt(B.value, 10) || 0) & 15;

    let r;
    let carry = 0;

    switch (O.value) {
      case "ADD":
        r = a + b;
        carry = r > 15 ? 1 : 0;
        break;

      case "SUB":
        r = a + ((~b) & 15) + 1;
        carry = r > 15 ? 1 : 0;
        break;

      case "AND":
        r = a & b;
        break;

      case "OR":
        r = a | b;
        break;

      case "XOR":
        r = a ^ b;
        break;

      default:
        r = (~a) & 15;
    }

    r &= 15;

    out.innerHTML =
      `<span>A</span> ${bin(a)} &nbsp; ` +
      `<span>B</span> ${bin(b)}<br>` +
      `<span>Result</span> <b>${bin(r)}</b> (${r}) &nbsp;` +
      `<span>Carry</span> ${carry} &nbsp;` +
      `<span>Zero</span> ${r === 0 ? 1 : 0}`;
  }

  ["input", "change"].forEach(event => {
    [A, B, O].forEach(element => {
      element.addEventListener(event, run);
    });
  });

  run();
})();

