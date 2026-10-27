export const THEME_STORAGE_KEY = "portfolio-theme";

export type Theme = "dark" | "light";

export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

/** Inline script: runs before paint to avoid flash of wrong theme. */
export const themeInitScript = `(function(){try{var k='portfolio-theme';var t=localStorage.getItem(k);var theme=t==='light'?'light':'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(theme);document.documentElement.dataset.theme=theme;}catch(e){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}})();`;
