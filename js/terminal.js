// Animated Terminal Showcase Engine for s0
(function () {
  const terminalBody = document.getElementById("terminalBody");
  if (!terminalBody) return;

  const scenarios = [
    {
      command: "curl -fsSL https://s0-install.pages.dev/sh | bash",
      outputs: [
        { text: "[1/6] Checking prerequisites... ✓ done", delay: 180, cls: "term-dim" },
        { text: "[2/6] Deploying S0 to /home/analyst/.s0... ✓ done", delay: 200, cls: "term-dim" },
        { text: "[3/6] Configuring Python virtual environment... ✓ done", delay: 220, cls: "term-dim" },
        { text: "[4/6] Upgrading pip and package managers... ✓ done", delay: 200, cls: "term-dim" },
        { text: "[5/6] Installing S0 packages and cryptographic modules... ✓ done", delay: 240, cls: "term-dim" },
        { text: "[6/6] Installing s0 command into user bin... ✓ done", delay: 180, cls: "term-dim" },
        { text: "      symlink: /home/analyst/.local/bin/s0 → /home/analyst/.s0/.venv/bin/s0", delay: 150, cls: "term-dim" },
        { text: "✓ S0 installed successfully! Ready to use.", delay: 200, cls: "term-green" }
      ],
      pauseAfter: 1400
    },
    {
      command: "s0 list",
      outputs: [
        { text: "PATH           TYPE    STORAGE   CAPACITY  MODEL               MOUNTED?  OS_DRIVE?", delay: 180, cls: "term-dim" },
        { text: "/dev/nvme0n1   block   NVMe       1.0 TB   Samsung SSD 980     YES       YES [OS]", delay: 180 },
        { text: "/dev/sda       block   SATA       2.0 TB   WDC WD20EZAZ        NO        -", delay: 180 },
        { text: "/dev/sdb       block   USB       32.0 GB   SanDisk Ultra       NO        - [READY]", delay: 180, cls: "term-cyan" }
      ],
      pauseAfter: 1400
    },
    {
      command: "sudo s0 wipe --target /dev/sdb --yes --operator \"analyst-01\"",
      outputs: [
        { text: "==> S0: Secure Media Sanitization", delay: 180, cls: "term-orange" },
        { text: "Target         : /dev/sdb (32.0 GB, SanDisk Ultra)", delay: 150 },
        { text: "NIST SP 800-88 : Purge (NVMe/ATA Block Erase + CSPRNG Verify)", delay: 180 },
        { text: "[s0 wipe] | [████████████████████] | 100.0% | 32.0 GiB | 148 MB/s | ETA: 0s", delay: 500, cls: "term-cyan" },
        { text: "Sampled readback: 64 random LBA clusters verified (0 residual bits).", delay: 220, cls: "term-green" },
        { text: "Audit Ledger   : recorded block #1257 (51b4b4e7...)", delay: 150, cls: "term-dim" },
        { text: "Certificate    : drive_wipe_certificate_a7f39b10.json", delay: 150, cls: "term-green" },
        { text: "PDF Certificate: drive_wipe_certificate_a7f39b10.pdf", delay: 150, cls: "term-green" }
      ],
      pauseAfter: 1600
    },
    {
      command: "s0 verify drive_wipe_certificate_a7f39b10.json",
      outputs: [
        { text: "✅ CERTIFICATE AUTHENTIC & VERIFIED", delay: 220, cls: "term-green" },
        { text: "UUID         : a7f39b10-82a1-4ef2-9381-12c84092b115", delay: 140 },
        { text: "Status       : success", delay: 120 },
        { text: "NIST Tier    : Purge", delay: 120 },
        { text: "Device       : /dev/sdb (32.0 GB)", delay: 120 },
        { text: "Issuer       : Digital Forensics & Data Sanitization Lab", delay: 120, cls: "term-dim" },
        { text: "Fingerprint  : sha256:8396af8c07a7d40f98ba492cf2b61e23fa...", delay: 150, cls: "term-dim" }
      ],
      pauseAfter: 6000
    }
  ];

  let isRunning = false;
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

  // Scroll to bottom smoothly only if user hasn't scrolled far up
  function autoScroll() {
    const threshold = 80;
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
      await sleep(28 + Math.random() * 20, signal);
    }

    await sleep(150, signal);
    cursor.remove();
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
          await sleep(120, signal);

          for (const out of scenario.outputs) {
            const outLine = document.createElement("div");
            outLine.className = `terminal-line ${out.cls || ""}`;
            outLine.textContent = out.text;
            terminalBody.appendChild(outLine);
            autoScroll();
            await sleep(out.delay || 140, signal);
          }

          const spacer = document.createElement("div");
          spacer.style.height = "12px";
          terminalBody.appendChild(spacer);
          autoScroll();

          await sleep(scenario.pauseAfter || 1400, signal);
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
    }, 100);
  }

  window.restartTerminalShowcase = restartShowcase;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(runShowcase, 400);
    });
  } else {
    setTimeout(runShowcase, 400);
  }
})();
