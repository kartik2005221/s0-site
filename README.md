<div align="center">

# S0 — Official Featuring Website

**Live Site:** [s0-home.pages.dev](https://s0-home.pages.dev/)  
**Original s0 Repository:** [github.com/kartik2005221/s0](https://github.com/kartik2005221/s0)

[![GitHub Repository](https://img.shields.io/badge/GitHub-kartik2005221%2Fs0-181717.svg?logo=github&logoColor=white)](https://github.com/kartik2005221/s0)
[![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare_Pages-F38020.svg?logo=cloudflare&logoColor=white)](https://s0-home.pages.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/kartik2005221/s0/blob/main/LICENSE)

</div>

---

## Overview

This repository hosts the official featuring and landing website for **[s0 (Sector Zero)](https://github.com/kartik2005221/s0)** — the unified digital forensic data sanitization, offensive evidence carving, bit-stream acquisition, and cryptographic audit suite.

Built with pure static HTML5, CSS3, and JavaScript with zero external frameworks, designed to deploy directly on **Cloudflare Pages**.

- **Core s0 Toolchain:** [https://github.com/kartik2005221/s0](https://github.com/kartik2005221/s0)
- **Documentation Portal:** [https://s0-docs.gitbook.io/](https://s0-docs.gitbook.io/)
- **Installation Portal:** [https://s0-install.pages.dev/](https://s0-install.pages.dev/)
- **Zero-Trust Verification Portal:** [https://s0-verify.pages.dev/](https://s0-verify.pages.dev/)

## Key Sections & Features

- **Hero & Mission Statement:** Clean, open layout with platform-aware one-line installer.
- **Forensic Capabilities:** Defensive Sanitization, Offensive Evidence Carving, and Bit-Stream Acquisition.
- **Side Capabilities:** Cryptographic Audit Ledger and Zero-Trust Client-Side Verification.
- **Live Terminal Emulation (`js/terminal.js`):** Centered fixed-height terminal showcasing real installation, storage enumeration, sanitization, and verification outputs.
- **Quick Installation Cards:** Expansive, un-truncated commands for Linux, macOS, Windows, and Bare-Metal Live ISO.
- **Forensic Comparison Matrix:** Feature breakdown of `s0` versus DBAN, Autopsy, Foremost, and dd/shred.
- **Dark & Light Mode:** Seamless theme toggle with local storage persistence and dynamic favicon switching.
- **Dynamic Release Badge:** Live release version fetched asynchronously from GitHub Releases API with automated fallback.

## Directory Structure

```
.
├── _headers                # Cloudflare Pages security & caching headers
├── index.html              # Main single-page application
├── css/
│   └── home.css            # Custom responsive stylesheet & themes
├── js/
│   ├── home.js             # Theme controller, copy utility & platform detector
│   └── terminal.js         # Animated CLI showcase engine
├── fonts/                  # Self-hosted Rubik & JetBrains Mono WOFF2 fonts
└── assets/
    └── favicons/           # Dark and light mode favicons & manifests
```

## Cloudflare Pages Deployment

1. Connect GitHub repository `kartik2005221/s0-site` in the Cloudflare Pages Dashboard.
2. Build Settings:
   - **Framework preset:** `None`
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/` (or root)
3. Deploy!

## License

Distributed under the **MIT License**. Part of the **Sector Zero (s0)** open-source forensics initiative by [@kartik2005221](https://github.com/kartik2005221).
