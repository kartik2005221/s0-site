// Animated Terminal Showcase Engine for s0
(function () {
  const terminalBody = document.getElementById("terminalBody");
  if (!terminalBody) return;

  const scenarios = [
    // 1. One-Line Installation
    {
      command: "curl -fsSL https://s0-install.pages.dev/sh | bash",
      postCommandDelay: 400,
      outputs: [
        { text: "[1/6] Checking prerequisites... ✓ done", delay: 320, cls: "term-dim" },
        { text: "[2/6] Deploying S0 to /home/analyst/.s0... ✓ done", delay: 350, cls: "term-dim" },
        { text: "[3/6] Configuring Python virtual environment... ✓ done", delay: 380, cls: "term-dim" },
        { text: "[4/6] Upgrading pip and package managers... ✓ done", delay: 320, cls: "term-dim" },
        { text: "[5/6] Installing S0 packages and cryptographic modules... ✓ done", delay: 420, cls: "term-dim" },
        { text: "[6/6] Installing s0 command into user bin... ✓ done", delay: 300, cls: "term-dim" },
        { text: "      symlink: /home/analyst/.local/bin/s0 → /home/analyst/.s0/.venv/bin/s0", delay: 240, cls: "term-dim" },
        { text: "✓ S0 installed successfully! Ready to use.", delay: 350, cls: "term-green" }
      ],
      pauseAfter: 1600
    },

    // 2. Hardware Storage Enumeration
    {
      command: "s0 list",
      postCommandDelay: 350,
      outputs: [
        { text: "PATH           TYPE    STORAGE   CAPACITY  MODEL               MOUNTED?  OS_DRIVE?", delay: 280, cls: "term-dim" },
        { text: "/dev/nvme0n1   block   NVMe       1.0 TB   Samsung SSD 980     YES       YES [OS]", delay: 240 },
        { text: "/dev/sda       block   SATA       2.0 TB   WDC WD20EZAZ        NO        -", delay: 240 },
        { text: "/dev/sdb       block   USB       32.0 GB   SanDisk Ultra       NO        - [READY]", delay: 260, cls: "term-cyan" }
      ],
      pauseAfter: 1800
    },

    // 3. Offensive Evidence Carving / Deleted File Recovery
    {
      command: "s0 carve --target /dev/sdb --out-dir /cases/evidence_01 --operator \"analyst-01\"",
      postCommandDelay: 420,
      outputs: [
        { text: "==> S0 Module 2: Advanced Forensic Evidence Carving", delay: 300, cls: "term-orange" },
        { text: "Target Media: /dev/sdb (32.0 GB, ext4 / unallocated sectors)", delay: 240 },
        { text: "Output Dir  : /cases/evidence_01", delay: 200 },
        {
          type: "progress",
          operation: "s0 carve",
          unit: "GiB",
          total: 32.0,
          speedUnit: "MB/s",
          extraField: "Found",
          stages: [
            { pct: 0,   val: " 0.0", speed: "  0", extra: " 0", eta: "--", delay: 200 },
            { pct: 18,  val: " 5.7", speed: "144", extra: " 3", eta: "4s", delay: 340 },
            { pct: 42,  val: "13.4", speed: "148", extra: " 7", eta: "3s", delay: 360 },
            { pct: 68,  val: "21.7", speed: "150", extra: "11", eta: "2s", delay: 380 },
            { pct: 89,  val: "28.5", speed: "149", extra: "14", eta: "1s", delay: 320 },
            { pct: 100, val: "32.0", speed: "148", extra: "14", eta: "0s", delay: 350 }
          ]
        },
        { text: "Bytes Scanned   : 32.0 GiB | Files Recovered: 14", delay: 300, cls: "term-green" },
        { text: "ID             EXT        SIZE    CONF  SHA256 (PREFIX)      FILENAME", delay: 240, cls: "term-dim" },
        { text: "carve_01a9     pdf      428 KB     98%  a7f39b10c812d45e...  contract_signed.pdf", delay: 220, cls: "term-cyan" },
        { text: "carve_02b4     png      1.8 MB     95%  51b4b4e7f4934b6b...  screen_capture.png", delay: 220, cls: "term-cyan" },
        { text: "carve_03c8     docx      84 KB     91%  05dd581ce8e2041a...  financial_ledger.docx", delay: 220, cls: "term-cyan" },
        { text: "[+] Recovery Manifest: carve_manifest_e21b8a90.json (Ed25519 Signed)", delay: 280, cls: "term-green" },
        { text: "[+] Audit Ledger     : recorded block #1258 (SHA-256 Chained)", delay: 240, cls: "term-dim" }
      ],
      pauseAfter: 2000
    },

    // 4. Cryptographic Hash-Chained Audit Ledger Verification
    {
      command: "s0 audit verify",
      postCommandDelay: 380,
      outputs: [
        { text: "==> Auditing Hash-Chained Cryptographic Ledger (SQLite)...", delay: 300, cls: "term-dim" },
        { text: "Chain Status : ✅ VALID & CONTINUOUS", delay: 320, cls: "term-green" },
        { text: "Blocks Tested: 1,258 blocks verified", delay: 220 },
        { text: "Details      : Hash-chain unbroken. All Ed25519 signatures authentic.", delay: 260, cls: "term-cyan" }
      ],
      pauseAfter: 1800
    },

    // 5. Zero-Trust Air-Gapped Certificate Verification
    {
      command: "s0 verify carve_manifest_e21b8a90.json",
      postCommandDelay: 380,
      outputs: [
        { text: "✅ CERTIFICATE AUTHENTIC & VERIFIED", delay: 320, cls: "term-green" },
        { text: "UUID         : e21b8a90-34fa-4ce2-b198-5a4a911e1872", delay: 180 },
        { text: "Status       : success (14 carved artifacts verified)", delay: 160 },
        { text: "Target       : /dev/sdb (32.0 GB)", delay: 160 },
        { text: "Issuer       : Accredited Digital Forensics Lab Root", delay: 180, cls: "term-dim" },
        { text: "Fingerprint  : sha256:8396af8c07a7d40f98ba492cf2b61e23fa...", delay: 200, cls: "term-dim" },
        { text: "Verdict      : RFC 8785 Canonical JSON validated in 3.8ms.", delay: 240, cls: "term-cyan" }
      ],
      pauseAfter: 1000
    }
  ];

  let isRunning = false;
  let hasStarted = false;
  let abortController = null;

  function sleep(ms, signal) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, ms);
      if (signal) {
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject(new Error("aborted"));
        });
      }
    });
  }

  // Smooth scroll to bottom only if user hasn't manually scrolled up to inspect earlier logs
  function autoScroll() {
    const threshold = 120;
    const isNearBottom = terminalBody.scrollHeight - terminalBody.scrollTop - terminalBody.clientHeight <= threshold;
    if (isNearBottom) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  }

  async function typeCommand(lineElement, text, signal) {
    const promptSpan = document.createElement("span");
    promptSpan.className = "term-prompt";
    promptSpan.textContent = "analyst@s0:~$ ";
    lineElement.appendChild(promptSpan);

    const cmdSpan = document.createElement("span");
    cmdSpan.className = "term-cmd";
    lineElement.appendChild(cmdSpan);

    const cursor = document.createElement("span");
    cursor.className = "term-cursor";
    lineElement.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      cmdSpan.textContent += text[i];
      autoScroll();
      // Human typing rhythm (40ms to 70ms per character)
      await sleep(40 + Math.random() * 30, signal);
    }

    await sleep(200, signal);
    cursor.remove();
  }

  // Animated progress bar
  async function animateProgressBar(lineElement, cfg, signal) {
    lineElement.className = "terminal-line term-cyan";
    const op = cfg.operation || "s0 task";

    for (const stage of cfg.stages) {
      const filled = Math.round((stage.pct / 100) * 20);
      const empty = 20 - filled;
      const bar = "█".repeat(filled) + "░".repeat(empty);
      const extraPart = cfg.extraField ? ` | ${cfg.extraField}: ${stage.extra}` : "";
      lineElement.textContent = `[${op}] | [${bar}] | ${String(stage.pct).padStart(3, " ")}.0% | ${stage.val} ${cfg.unit} | ${stage.speed} ${cfg.speedUnit}${extraPart} | ETA: ${stage.eta}`;
      autoScroll();
      await sleep(stage.delay, signal);
    }
  }

  async function runShowcase() {
    if (isRunning) return;
    isRunning = true;
    abortController = new AbortController();
    const signal = abortController.signal;

    try {
      terminalBody.innerHTML = "";

      // Run each scenario ONCE in sequence
      for (const scenario of scenarios) {
        const cmdLine = document.createElement("div");
        cmdLine.className = "terminal-line";
        terminalBody.appendChild(cmdLine);

        await typeCommand(cmdLine, scenario.command, signal);
        await sleep(scenario.postCommandDelay || 350, signal);

        for (const out of scenario.outputs) {
          const outLine = document.createElement("div");
          terminalBody.appendChild(outLine);

          if (out.type === "progress") {
            await animateProgressBar(outLine, out, signal);
          } else {
            outLine.className = `terminal-line ${out.cls || ""}`;
            outLine.textContent = out.text;
            autoScroll();
            await sleep(out.delay || 240, signal);
          }
        }

        const spacer = document.createElement("div");
        spacer.style.height = "12px";
        terminalBody.appendChild(spacer);
        autoScroll();

        await sleep(scenario.pauseAfter || 1600, signal);
      }

      // FINAL STATE: Stop here! Do not clear, do not repeat.
      // Append standing active prompt with blinking cursor so user can see and inspect the full history.
      const finalPromptLine = document.createElement("div");
      finalPromptLine.className = "terminal-line";
      const promptSpan = document.createElement("span");
      promptSpan.className = "term-prompt";
      promptSpan.textContent = "analyst@s0:~$ ";
      const finalCursor = document.createElement("span");
      finalCursor.className = "term-cursor";
      finalPromptLine.appendChild(promptSpan);
      finalPromptLine.appendChild(finalCursor);
      terminalBody.appendChild(finalPromptLine);
      autoScroll();

    } catch (err) {
      // Aborted cleanly on replay
    } finally {
      isRunning = false;
    }
  }

  function restartShowcase() {
    if (abortController) {
      abortController.abort();
    }
    setTimeout(() => {
      terminalBody.innerHTML = "";
      runShowcase();
    }, 120);
  }

  window.restartTerminalShowcase = restartShowcase;

  // Start live terminal demo ONLY when the user scrolls to it
  function initTerminalObserver() {
    const demoSection = document.getElementById("demo");
    if (!demoSection) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            hasStarted = true;
            setTimeout(runShowcase, 300);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.25,
        rootMargin: "0px 0px -40px 0px"
      });

      observer.observe(demoSection);
    } else {
      setTimeout(runShowcase, 1000);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTerminalObserver);
  } else {
    initTerminalObserver();
  }
})();
