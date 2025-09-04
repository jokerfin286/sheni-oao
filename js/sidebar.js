// Боковая панель навигации
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar")
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebarClose = document.getElementById("sidebarClose")
  const sidebarOverlay = document.getElementById("sidebarOverlay")

  // Функция открытия боковой панели
  function openSidebar() {
    sidebar.classList.add("active")
    sidebarOverlay.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Функция закрытия боковой панели
  function closeSidebar() {
    sidebar.classList.remove("active")
    sidebarOverlay.classList.remove("active")
    document.body.style.overflow = ""
  }

  // Обработчики событий
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", openSidebar)
  }

  if (sidebarClose) {
    sidebarClose.addEventListener("click", closeSidebar)
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSidebar)
  }

  // Закрытие по клавише Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      closeSidebar()
    }
  })

  // Закрытие при изменении размера окна
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024 && sidebar.classList.contains("active")) {
      closeSidebar()
    }
  })

  // Активная ссылка
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const sidebarLinks = document.querySelectorAll(".sidebar-link")

  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href")
    if (href === currentPage) {
      link.classList.add("active")
    }
  })
})
