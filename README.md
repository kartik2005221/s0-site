<div align="center">

# S0 — Official Featuring Website

**Live Site:** [s0-home.pages.dev](https://s0-home.pages.dev/)

[![Cloudflare Pages](https://img.shields.io/badge/Deployment-Cloudflare_Pages-F38020.svg?logo=cloudflare&logoColor=white)](https://s0-home.pages.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/kartik2005221/s0/blob/main/LICENSE)
[![Color Palette](https://img.shields.io/badge/Theme-ColorHunt_%23FF6500-FF6500.svg)](https://colorhunt.co/palette/ff65001e3e620b192c000000)

</div>

---

## Overview

This repository hosts the official featuring and landing website for **[s0 (Sector Zero)](https://github.com/kartik2005221/s0)** — the unified digital forensic data sanitization, offensive evidence carving, bit-stream acquisition, and cryptographic audit suite.

Built with pure static HTML5, CSS3, and JavaScript with zero external frameworks, designed to deploy directly on **Cloudflare Pages**.

## Key Sections & Features

- **Hero & Mission Statement:** Unified tagline, compliance badges (NIST SP 800-88, IEEE 2883-2022, RFC 8785, RFC 8032), and quick one-line installer.
- **Five Core Capabilities Grid:** Defensive Sanitization, Offensive Carving, Bit-Stream Imaging, Cryptographic Audit Ledger, and Zero-Trust Verification.
- **Live Terminal Emulation (`js/terminal.js`):** Interactive simulated terminal showing real-time command typing and progress telemetry.
- **Quick Installation Cards:** Interactive copyable commands for Linux, macOS, Windows PowerShell, Command Prompt, and bare-metal Live ISO.
- **Comprehensive Comparison Matrix:** Deep feature breakdown of `s0` versus DBAN, Autopsy, Foremost, and dd/shred.
- **Ecosystem Portals Quick Links:** Direct links to the Documentation Portal, Verification Portal, and Installation Portal.
- **Dark & Light Mode:** Seamless theme toggle with local storage persistence and dynamic favicon switching.
- **Dynamic Release Badge:** Live release version fetched asynchronously from GitHub Releases API with automated fallback.
- **Mobile Responsive Drawer:** Clean slide-down hamburger navigation for mobile and tablet devices.

## Color Scheme

Adheres strictly to the designated palette:
- **`#FF6500`** — Brand Forensic Orange (Primary Accent)
- **`#1E3E62`** — Deep Navy Blue (Borders & Elevated Elements)
- **`#0B192C`** — Midnight Canvas (Cards & Surfaces)
- **`#000000`** — Pure Pitch Black (Base Canvas)

## Directory Structure

```
.
├── _headers                # Cloudflare Pages security & caching headers
├── index.html              # Main single-page application
├── css/
│   └── home.css            # Custom responsive stylesheet & themes
├── js/
│   ├── home.js             # Theme controller, copy utility & version fetcher
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
