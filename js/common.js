document.addEventListener("DOMContentLoaded", () => {
  setCurrentYear();
  enableScrollTop();
  showGreeting();
  initializeAuth();
  enforceAuthGuard();
  setupLogoutHandler();
});

// ✅ Sets current year in footer
function setCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ✅ Enables smooth scroll to top
function enableScrollTop() {
  const topBtn = document.getElementById("backToTop");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

// ✅ Real-time greeting message
function showGreeting() {
  const greetingEl = document.getElementById("greeting");
  if (!greetingEl) return;

  const hour = new Date().getHours();
  const greetingText =
    hour < 12
      ? "Good morning, Supervisor 🌅"
      : hour < 18
      ? "Good afternoon, Supervisor ☀️"
      : "Good evening, Supervisor 🌙";

  greetingEl.textContent = greetingText;
}

// ✅ Initializes admin credentials (first-time only)
function initializeAuth() {
  if (!localStorage.getItem("adminUser")) {
    localStorage.setItem("adminUser", "admin");
    localStorage.setItem("adminPass", "admin123");
  }
}

// ✅ Enforces login guard
function enforceAuthGuard() {
  const path = window.location.pathname;
  const isLoginPage =
    path.includes("login.html") || path.includes("reset-password.html");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn && !isLoginPage) {
    window.location.href = "login.html";
  }
}

// ✅ Logout handler
function setupLogoutHandler() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }
}
