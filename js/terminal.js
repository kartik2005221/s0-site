// Animated Terminal Showcase Engine for s0
(function () {
  const terminalBody = document.getElementById("terminalBody");
  if (!terminalBody) return;

  const scenarios = [
    {
      command: "s0 list",
      outputs: [
        { text: "[*] Enumerating storage controllers & block media...", delay: 200, cls: "term-dim" },
        { text: "NAME          TYPE   MODEL                   SIZE     RO  STATE     MOUNTPOINT", delay: 250, cls: "term-dim" },
        { text: "/dev/nvme0n1  NVMe   Samsung SSD 980 PRO     1.0 TB   0   active    / [System Host - Locked]", delay: 200 },
        { text: "/dev/sda      SATA   WDC WD20EZAZ-00L9GB0    2.0 TB   0   standby   [Unmounted]", delay: 200 },
        { text: "/dev/sdb      USB    SanDisk Ultra Flair     32 GB    0   ready     [Target Unlocked]", delay: 200, cls: "term-green" }
      ],
      pauseAfter: 1200
    },
    {
      command: "sudo s0 wipe --target /dev/sdb --yes --operator \"analyst-01\"",
      outputs: [
        { text: "[!] Hardware Target: /dev/sdb [SanDisk Ultra Flair, 32.0 GB]", delay: 200, cls: "term-orange" },
        { text: "[*] Standard: NIST SP 800-88 Rev. 1 Clear (1-Pass Zero Overwrite)", delay: 200 },
        { text: "[*] Pre-flight: Thermal sensor 34°C | Bad sectors zero-fill active", delay: 200, cls: "term-dim" },
        { text: "Progress: [████████████████████████████████] 100% | 32.0 GB | 148 MB/s | ETA: 0s", delay: 600, cls: "term-cyan" },
        { text: "[*] Readback Verification: 64 random LBA clusters sampled... 0 residual hits.", delay: 350, cls: "term-green" },
        { text: "[+] Certificate Emitted: cert_e7a93f21.json (+ A4 PDF with optical QR)", delay: 250, cls: "term-green" },
        { text: "[+] Ed25519 RFC 8032 Signature: 3a9f...c81d [VERIFIED]", delay: 200, cls: "term-green" },
        { text: "[+] Anchored to SHA-256 Hash-Chained Audit Ledger: block #42", delay: 200, cls: "term-dim" }
      ],
      pauseAfter: 1600
    },
    {
      command: "s0 verify cert_e7a93f21.json",
      outputs: [
        { text: "[*] Parsing Canonical JSON (RFC 8785) & Ed25519 signature payload...", delay: 200, cls: "term-dim" },
        { text: "[*] Authority Public Key: ed25519_pk1q...984d [Accredited]", delay: 200, cls: "term-dim" },
        { text: "[+] VERDICT: [OK] AUTHENTIC & CRYPTOGRAPHICALLY VALID", delay: 300, cls: "term-green" },
        { text: "    Media Sanitized: /dev/sdb (32.0 GB) | Passes: 1 | Markers Residual: 0", delay: 200, cls: "term-dim" },
        { text: "    Zero-trust offline verification succeeded in 4.2ms.", delay: 200, cls: "term-cyan" }
      ],
      pauseAfter: 5000
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

  async function typeCommand(lineElement, text, signal) {
    const promptSpan = document.createElement("span");
    promptSpan.className = "term-prompt";
    promptSpan.textContent = "analyst@s0-station:~$ ";
    lineElement.appendChild(promptSpan);

    const cmdSpan = document.createElement("span");
    cmdSpan.className = "term-cmd";
    lineElement.appendChild(cmdSpan);

    const cursor = document.createElement("span");
    cursor.className = "term-cursor";
    lineElement.appendChild(cursor);

    for (let i = 0; i < text.length; i++) {
      cmdSpan.textContent += text[i];
      await sleep(35 + Math.random() * 25, signal);
    }

    await sleep(200, signal);
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
          await sleep(150, signal);

          for (const out of scenario.outputs) {
            const outLine = document.createElement("div");
            outLine.className = `terminal-line ${out.cls || ""}`;
            outLine.textContent = out.text;
            terminalBody.appendChild(outLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
            await sleep(out.delay || 150, signal);
          }

          const spacer = document.createElement("div");
          spacer.style.height = "10px";
          terminalBody.appendChild(spacer);

          await sleep(scenario.pauseAfter || 1500, signal);
        }
      }
    } catch (err) {
      // Aborted or stopped
    } finally {
      isRunning = false;
    }
  }

  function restartShowcase() {
    if (abortController) {
      abortController.abort();
    }
    setTimeout(() => {
      runShowcase();
    }, 100);
  }

  window.restartTerminalShowcase = restartShowcase;

  // Start after DOM load or slight delay
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(runShowcase, 600);
    });
  } else {
    setTimeout(runShowcase, 600);
  }
})();
