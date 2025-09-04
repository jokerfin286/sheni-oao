// Переключение темы с «аурора»-волной и сохранением выбора
// Учитывает prefers-reduced-motion: при активном ограничении анимация отключается [^1]

;(() => {
  const STORAGE_KEY = "theme"
  const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

  function getSystemPrefersDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
  }

  function applyTheme(theme) {
    const root = document.documentElement
    if (theme === "dark") root.setAttribute("data-theme", "dark")
    else if (theme === "light") root.setAttribute("data-theme", "light")
    else root.setAttribute("data-theme", getSystemPrefersDark() ? "dark" : "light")
  }

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY)
    } catch {
      return null
    }
  }
  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {}
  }

  // Инициализация
  const stored = readStoredTheme()
  if (stored === "light" || stored === "dark") applyTheme(stored)
  else applyTheme("auto")

  // Обновление при смене системы, если нет явного выбора
  const mql = window.matchMedia("(prefers-color-scheme: dark)")
  mql.addEventListener?.("change", () => {
    const current = readStoredTheme()
    if (!current) applyTheme("auto")
  })

  function themeAtMidAnimation(nextTheme) {
    applyTheme(nextTheme)
    storeTheme(nextTheme)
  }

  function animateThemeTransition(nextTheme, origin) {
    if (prefersReducedMotion) {
      themeAtMidAnimation(nextTheme)
      return
    }

    const overlay = document.createElement("div")
    overlay.className = "theme-transition " + (nextTheme === "dark" ? "to-dark" : "to-light")

    const x = typeof origin?.x === "number" ? origin.x : window.innerWidth / 2
    const y = typeof origin?.y === "number" ? origin.y : window.innerHeight / 2
    overlay.style.setProperty("--x", `${x}px`)
    overlay.style.setProperty("--y", `${y}px`)

    document.body.appendChild(overlay)
    // reflow
    overlay.offsetHeight
    overlay.classList.add("expand")

    const mid = 320
    const total = 700

    const midTimer = setTimeout(() => {
      themeAtMidAnimation(nextTheme)
      overlay.classList.add("fade-out")
    }, mid)

    const endTimer = setTimeout(() => {
      overlay.remove()
      clearTimeout(midTimer)
    }, total)

    overlay.addEventListener("transitionend", (e) => {
      if (e.propertyName === "opacity" && overlay.classList.contains("fade-out")) {
        try {
          overlay.remove()
        } catch {}
        clearTimeout(midTimer)
        clearTimeout(endTimer)
      }
    })
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".theme-toggle")
    if (!btn) return

    btn.addEventListener("click", (e) => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"
      const origin =
        e instanceof MouseEvent || e instanceof PointerEvent
          ? { x: e.clientX, y: e.clientY }
          : { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      animateThemeTransition(next, origin)
    })
  })
})()
