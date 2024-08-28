// Personal Bootstrap Toast Sender
function showToast(title, body) {
  // Generate a unique ID for each toast
  const toastId = 'toast' + Date.now();

  // Create the toast HTML
  const toastHTML = `
      <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
              <strong class="me-auto">${title}</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
              ${body}
          </div>
      </div>
  `;

  // Append the toast to the container
  document.getElementById('toast-container').insertAdjacentHTML('beforeend', toastHTML);

  // Initialize and show the toast
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 5000 });
  toast.show();

  // Remove the toast from the DOM after it's hidden
  toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
  });
}

// Bootstrap Dark and Light mode Handler
// https://webvees.com/post/how-use-toggle-dark-and-light-mode-in-bootstrap-53/
document.getElementById("darkModeIcon").addEventListener("click", function () {
    this.classList.toggle("fa-moon");
    this.classList.toggle("fa-sun");
    let theme = document.documentElement.getAttribute("data-bs-theme");
    if (theme === "dark") {
      document.documentElement.removeAttribute("data-bs-theme");
    } else {
      document.documentElement.setAttribute("data-bs-theme", "dark");
    }
  });

/*!
 * Color mode toggler for Bootstrap's docs (https://getbootstrap.com/)
 * Copyright 2011-2024 The Bootstrap Authors
 * Licensed under the Creative Commons Attribution 3.0 Unported License.
 */

// (() => {
//   'use strict'

const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const setTheme = (theme) => {
  if (theme === "auto") {
    document.documentElement.setAttribute(
      "data-bs-theme",
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  } else {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }
};

setTheme(getPreferredTheme());

const showActiveTheme = (theme, focus = false) => {
  const themeSwitcher = document.querySelector("#bd-theme");

  if (!themeSwitcher) {
    return;
  }

  const themeSwitcherText = document.querySelector("#bd-theme-text");
  const activeThemeIcon = document.querySelector(".theme-icon-active use");
  const btnToActive = document.querySelector(
    `[data-bs-theme-value="${theme}"]`
  );
  const svgOfActiveBtn = btnToActive
    .querySelector("svg use")
    .getAttribute("href");

  document.querySelectorAll("[data-bs-theme-value]").forEach((element) => {
    element.classList.remove("active");
    element.setAttribute("aria-pressed", "false");
  });

  btnToActive.classList.add("active");
  btnToActive.setAttribute("aria-pressed", "true");
  activeThemeIcon.setAttribute("href", svgOfActiveBtn);
  const themeSwitcherLabel = `${themeSwitcherText.textContent} (${btnToActive.dataset.bsThemeValue})`;
  themeSwitcher.setAttribute("aria-label", themeSwitcherLabel);

  if (focus) {
    themeSwitcher.focus();
  }
};

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    const storedTheme = getStoredTheme();
    if (storedTheme !== "light" && storedTheme !== "dark") {
      setTheme(getPreferredTheme());
    }
  });

window.addEventListener("DOMContentLoaded", () => {
  showActiveTheme(getPreferredTheme());

  document.querySelectorAll("[data-bs-theme-value]").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const theme = toggle.getAttribute("data-bs-theme-value");
      setStoredTheme(theme);
      setTheme(theme);
      showActiveTheme(theme, true);
    });
  });
});
// })()