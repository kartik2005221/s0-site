// Theme Management
function getPreferredTheme() {
  const stored = localStorage.getItem("s0_theme");
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function updateFavicon(theme) {
  const iconPath = theme === "light"
    ? "assets/favicons/s0-light/favicon-32x32.png"
    : "assets/favicons/s0-dark/favicon-32x32.png";
  
  let dynamicFavicon = document.getElementById("dynamic-favicon");
  if (dynamicFavicon) {
    dynamicFavicon.href = iconPath;
  }
  let headerLogo = document.getElementById("headerLogo");
  if (headerLogo) {
    headerLogo.src = iconPath;
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("s0_theme", theme);
  const label = document.getElementById("themeToggleLabel");
  if (label) {
    label.textContent = theme === "light" ? "Dark" : "Light";
  }
  const mobileLabel = document.getElementById("mobileThemeToggleLabel");
  if (mobileLabel) {
    mobileLabel.textContent = theme === "light" ? "Switch to Dark" : "Switch to Light";
  }
  updateFavicon(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const target = current === "dark" ? "light" : "dark";
  applyTheme(target);
}

// Mobile Navigation Drawer Toggle
function toggleMobileMenu() {
  const drawer = document.getElementById("mobileNavDrawer");
  const toggleBtn = document.getElementById("mobileMenuToggle");
  if (!drawer) return;
  const isOpen = drawer.classList.contains("open");
  if (isOpen) {
    drawer.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
  } else {
    drawer.classList.add("open");
    toggleBtn.setAttribute("aria-expanded", "true");
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById("mobileNavDrawer");
  const toggleBtn = document.getElementById("mobileMenuToggle");
  if (drawer && drawer.classList.contains("open")) {
    drawer.classList.remove("open");
    if (toggleBtn) toggleBtn.setAttribute("aria-expanded", "false");
  }
}

// Clipboard Copy Utility
function copyText(elementId, btn) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;

  navigator.clipboard.writeText(text.trim()).then(() => {
    const originalText = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove("copied");
    }, 2000);
  }).catch(() => {
    // Fallback if clipboard API is restricted
    const textArea = document.createElement("textarea");
    textArea.value = text.trim();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = "Copy";
      btn.classList.remove("copied");
    }, 2000);
  });
}

// Fetch Latest Release Version dynamically from GitHub API
function fetchLatestReleaseVersion() {
  const versionTags = document.querySelectorAll(".s0-release-version");
  if (!versionTags.length) return;

  fetch("https://api.github.com/repos/kartik2005221/s0/releases/latest")
    .then((res) => {
      if (!res.ok) throw new Error("Network response error");
      return res.json();
    })
    .then((data) => {
      if (data && data.tag_name) {
        versionTags.forEach((el) => {
          el.textContent = data.tag_name;
        });
      }
    })
    .catch(() => {
      // Fallback stays v2.4.3
      versionTags.forEach((el) => {
        el.textContent = "v2.4.3";
      });
    });
}

// Platform Filter for Quick Install Cards
function filterInstallPlatform(platform, clickedBtn) {
  const cards = document.querySelectorAll(".install-card");
  const tabBtns = document.querySelectorAll(".install-tab-btn");

  tabBtns.forEach(btn => btn.classList.remove("active"));
  if (clickedBtn) clickedBtn.classList.add("active");

  cards.forEach(card => {
    const cardPlatform = card.getAttribute("data-platform");
    if (platform === "all" || cardPlatform === platform) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);
  fetchLatestReleaseVersion();

  // Close mobile drawer on clicking any drawer link
  const drawerLinks = document.querySelectorAll("#mobileNavDrawer a");
  drawerLinks.forEach(link => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  // Close mobile drawer on clicking outside
  document.addEventListener("click", (e) => {
    const drawer = document.getElementById("mobileNavDrawer");
    const toggleBtn = document.getElementById("mobileMenuToggle");
    if (drawer && drawer.classList.contains("open")) {
      if (!drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeMobileMenu();
      }
    }
  });
});
