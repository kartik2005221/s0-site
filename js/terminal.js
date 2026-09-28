// Animated Terminal Showcase Engine for s0
(function () {
  const terminalBody = document.getElementById("terminalBody");
  if (!terminalBody) return;

  const scenarios = [
    {
      command: "curl -fsSL https://s0-install.pages.dev/sh | bash",
      postCommandDelay: 400,
      outputs: [
        { text: "[1/6] Checking prerequisites... ✓ done", delay: 350, cls: "term-dim" },
        { text: "[2/6] Deploying S0 to /home/analyst/.s0... ✓ done", delay: 420, cls: "term-dim" },
        { text: "[3/6] Configuring Python virtual environment... ✓ done", delay: 480, cls: "term-dim" },
        { text: "[4/6] Upgrading pip and package managers... ✓ done", delay: 380, cls: "term-dim" },
        { text: "[5/6] Installing S0 packages and cryptographic modules... ✓ done", delay: 520, cls: "term-dim" },
        { text: "[6/6] Installing s0 command into user bin... ✓ done", delay: 350, cls: "term-dim" },
        { text: "      symlink: /home/analyst/.local/bin/s0 → /home/analyst/.s0/.venv/bin/s0", delay: 280, cls: "term-dim" },
        { text: "✓ S0 installed successfully! Ready to use.", delay: 400, cls: "term-green" }
      ],
      pauseAfter: 2000
    },
    {
      command: "s0 list",
      postCommandDelay: 350,
      outputs: [
        { text: "PATH           TYPE    STORAGE   CAPACITY  MODEL               MOUNTED?  OS_DRIVE?", delay: 300, cls: "term-dim" },
        { text: "/dev/nvme0n1   block   NVMe       1.0 TB   Samsung SSD 980     YES       YES [OS]", delay: 280 },
        { text: "/dev/sda       block   SATA       2.0 TB   WDC WD20EZAZ        NO        -", delay: 280 },
        { text: "/dev/sdb       block   USB       32.0 GB   SanDisk Ultra       NO        - [READY]", delay: 300, cls: "term-cyan" }
      ],
      pauseAfter: 2200
    },
    {
      command: "sudo s0 wipe --target /dev/sdb --yes --operator \"analyst-01\"",
      postCommandDelay: 450,
      outputs: [
        { text: "==> S0: Secure Media Sanitization", delay: 320, cls: "term-orange" },
        { text: "Target         : /dev/sdb (32.0 GB, SanDisk Ultra)", delay: 260 },
        { text: "NIST SP 800-88 : Purge (NVMe/ATA Block Erase + CSPRNG Verify)", delay: 300 },
        { type: "progress" },
        { text: "Sampled readback: 64 random LBA clusters verified (0 residual bits).", delay: 380, cls: "term-green" },
        { text: "Audit Ledger   : recorded block #1257 (51b4b4e7...)", delay: 260, cls: "term-dim" },
        { text: "Certificate    : drive_wipe_certificate_a7f39b10.json", delay: 260, cls: "term-green" },
        { text: "PDF Certificate: drive_wipe_certificate_a7f39b10.pdf", delay: 280, cls: "term-green" }
      ],
      pauseAfter: 2500
    },
    {
      command: "s0 verify drive_wipe_certificate_a7f39b10.json",
      postCommandDelay: 400,
      outputs: [
        { text: "✅ CERTIFICATE AUTHENTIC & VERIFIED", delay: 380, cls: "term-green" },
        { text: "UUID         : a7f39b10-82a1-4ef2-9381-12c84092b115", delay: 200 },
        { text: "Status       : success", delay: 180 },
        { text: "NIST Tier    : Purge", delay: 180 },
        { text: "Device       : /dev/sdb (32.0 GB)", delay: 180 },
        { text: "Issuer       : Digital Forensics & Data Sanitization Lab", delay: 200, cls: "term-dim" },
        { text: "Fingerprint  : sha256:8396af8c07a7d40f98ba492cf2b61e23fa...", delay: 240, cls: "term-dim" }
      ],
      pauseAfter: 7000
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

  // Scroll to bottom smoothly only if user hasn't scrolled up to inspect
  function autoScroll() {
    const threshold = 100;
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
      // Natural human typing rhythm (45ms to 75ms per character)
      await sleep(45 + Math.random() * 30, signal);
    }

    await sleep(220, signal);
    cursor.remove();
  }

  // Live animated progress bar stepping from 0% to 100%
  async function animateProgressBar(lineElement, signal) {
    lineElement.className = "terminal-line term-cyan";
    const stages = [
      { pct: 0,   gib: " 0.0", speed: "  0", eta: "--", delay: 220 },
      { pct: 14,  gib: " 4.5", speed: "142", eta: "4s", delay: 350 },
      { pct: 32,  gib: "10.2", speed: "146", eta: "3s", delay: 380 },
      { pct: 55,  gib: "17.6", speed: "148", eta: "2s", delay: 420 },
      { pct: 76,  gib: "24.3", speed: "151", eta: "1s", delay: 380 },
      { pct: 91,  gib: "29.1", speed: "149", eta: "1s", delay: 320 },
      { pct: 100, gib: "32.0", speed: "148", eta: "0s", delay: 400 }
    ];

    for (const stage of stages) {
      const filled = Math.round((stage.pct / 100) * 20);
      const empty = 20 - filled;
      const bar = "█".repeat(filled) + "░".repeat(empty);
      lineElement.textContent = `[s0 wipe] | [${bar}] | ${String(stage.pct).padStart(3, " ")}.0% | ${stage.gib} GiB | ${stage.speed} MB/s | ETA: ${stage.eta}`;
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
      while (true) {
        terminalBody.innerHTML = "";

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
              await animateProgressBar(outLine, signal);
            } else {
              outLine.className = `terminal-line ${out.cls || ""}`;
              outLine.textContent = out.text;
              autoScroll();
              await sleep(out.delay || 250, signal);
            }
          }

          const spacer = document.createElement("div");
          spacer.style.height = "12px";
          terminalBody.appendChild(spacer);
          autoScroll();

          await sleep(scenario.pauseAfter || 1800, signal);
        }
      }
    } catch (err) {
      // Aborted or stopped cleanly
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
