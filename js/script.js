// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenu = document.getElementById("mobileMenu")
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay")
  const mobileMenuClose = document.getElementById("mobileMenuClose")
  const accessibilityPanel = document.getElementById("accessibilityPanel")

  if (mobileMenuBtn && mobileMenu && mobileMenuOverlay) {
    // Открытие меню
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.add("active")
      mobileMenuOverlay.classList.add("active")
      mobileMenuBtn.classList.add("active")
      document.body.style.overflow = "hidden"

      if (accessibilityPanel) {
        accessibilityPanel.style.display = "none"
      }
    })

    // Закрытие меню через кнопку закрытия
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMenu)
    }

    // Закрытие меню через оверлей
    mobileMenuOverlay.addEventListener("click", closeMenu)

    // Закрытие меню при клике на ссылку
    const mobileNavLinks = mobileMenu.querySelectorAll(".mobile-nav-link")
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setTimeout(closeMenu, 150) // Небольшая задержка для плавности
      })
    })

    // Закрытие меню по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
        closeMenu()
      }
    })

    function closeMenu() {
      mobileMenu.classList.remove("active")
      mobileMenuOverlay.classList.remove("active")
      mobileMenuBtn.classList.remove("active")
      document.body.style.overflow = ""

      if (accessibilityPanel) {
        accessibilityPanel.style.display = "block"
      }
    }

    // Обработка изменения размера окна
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024 && mobileMenu.classList.contains("active")) {
        closeMenu()
      }
    })
  }

  // Contact Form Handling
  const contactForm = document.getElementById("contactForm")
  const emailjs = window.emailjs // Declare the emailjs variable
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      if (!validateForm(contactForm)) {
        showNotification("Проверьте правильность заполнения формы", "error")
        return
      }

      emailjs
        .sendForm(
          "service_vspzggq",
          "template_hyi40qd",
          "#contactForm",
          "m9V1HowEGTB20Q6GL", // public key
        )
        .then(() => {
          showNotification("Сообщение отправлено успешно!", "success")
          contactForm.reset()
        })
        .catch((error) => {
          console.error("Ошибка отправки:", error)
          showNotification("Ошибка при отправке сообщения", "error")
        })
    })
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animatedElements = document.querySelectorAll(
    ".service-card, .news-card, .stat-card, .contact-card, .vacancy-card",
  )
  animatedElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(el)
  })

  // Header scroll effect
  let lastScrollTop = 0
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)"
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })

  // Add scroll transition to header
  header.style.transition = "transform 0.3s ease"
})

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `

  const content = notification.querySelector(".notification-content")
  content.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `

  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `

  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto hide after 5 seconds
  const autoHide = setTimeout(() => {
    hideNotification(notification)
  }, 5000)

  // Close button functionality
  closeBtn.addEventListener("click", () => {
    clearTimeout(autoHide)
    hideNotification(notification)
  })
}

function hideNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

// Form validation
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444"
      isValid = false
    } else {
      input.style.borderColor = "#e5e7eb"
    }

    // Email validation
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.value)) {
        input.style.borderColor = "#ef4444"
        isValid = false
      }
    }

    // Phone validation
    if (input.type === "tel" && input.value) {
      const phoneRegex = /^[+]?[0-9\s\-()]{10,}$/
      if (!phoneRegex.test(input.value)) {
        input.style.borderColor = "#ef4444"
        isValid = false
      }
    }
  })

  return isValid
}

// Search functionality (if needed)
function initSearch() {
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = this.value.toLowerCase()
      const searchableElements = document.querySelectorAll("[data-searchable]")

      searchableElements.forEach((element) => {
        const text = element.textContent.toLowerCase()
        if (text.includes(query)) {
          element.style.display = ""
        } else {
          element.style.display = "none"
        }
      })
    })
  }
}

// Initialize search if needed
document.addEventListener("DOMContentLoaded", initSearch)

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]")

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading
document.addEventListener("DOMContentLoaded", initLazyLoading)

// Back to top button
function initBackToTop() {
  const backToTopBtn = document.createElement("button")
  backToTopBtn.innerHTML = "↑"
  backToTopBtn.className = "back-to-top"
  backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `

  document.body.appendChild(backToTopBtn)

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.style.opacity = "1"
      backToTopBtn.style.visibility = "visible"
    } else {
      backToTopBtn.style.opacity = "0"
      backToTopBtn.style.visibility = "hidden"
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
}

// Initialize back to top button
document.addEventListener("DOMContentLoaded", initBackToTop)

document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("accessibilityPanel")
  const toggleBtn = document.getElementById("panelToggle")
  const content = panel.querySelector(".panel-content")

  // Открытие/закрытие панели
  toggleBtn.addEventListener("click", () => {
    content.style.display = content.style.display === "block" ? "none" : "block"
  })

  document.addEventListener("click", (e) => {
    if (!panel.contains(e.target) && content.style.display === "block") {
      content.style.display = "none"
    }
  })

  // Подстраиваем цвета панели под тему сайта
  function updatePanelColors() {
    const theme = document.documentElement.getAttribute("data-theme") || "light"
    let bg = "#fff",
      color = "#000"
    if (theme === "dark") {
      bg = "#333"
      color = "#eee"
    }

    panel.style.setProperty("--panel-bg", bg)
    panel.style.setProperty("--panel-color", color)

    panel.querySelectorAll(".control-btn").forEach((btn) => {
      btn.style.color = color
      btn.style.borderColor = color
    })
  }

  updatePanelColors()
  const observer = new MutationObserver(updatePanelColors)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })

  // Цвет сайта
  const colorButtons = panel.querySelectorAll("[data-color]")
  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.getAttribute("data-color")
      let bg, text
      switch (color) {
        case "blue":
          bg = "#e0f2ff"
          text = "#1e3a8a"
          break
        case "yellow":
          bg = "#fef9c3"
          text = "#92400e"
          break
        case "green":
          bg = "#dcfce7"
          text = "#166534"
          break
        default:
          bg = ""
          text = ""
          break
      }
      document
        .querySelectorAll("body, header, footer, section, div, nav, p, h1,h2,h3,h4,h5,h6,a,span")
        .forEach((el) => {
          el.style.backgroundColor = bg
          el.style.color = text
        })
    })
  })

  // Размер шрифта на весь сайт
  const fontButtons = panel.querySelectorAll("[data-font]")
  fontButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const scale = btn.getAttribute("data-font")
      document.documentElement.style.fontSize = scale + "em"
      document.body.style.fontSize = scale + "em"
    })
  })

  // Подсветка ссылок
  const highlightLinksBtn = document.getElementById("highlightLinks")
  highlightLinksBtn?.addEventListener("click", () => {
    document.querySelectorAll("a").forEach((a) => {
      if (!a.style.outline) {
        a.style.outline = "2px solid #ff0"
        a.style.backgroundColor = "#333"
        a.style.color = "#ff0"
      } else {
        a.style.outline = ""
        a.style.backgroundColor = ""
        a.style.color = ""
      }
    })
  })

  // Скрыть/показ изображений
  const toggleImagesBtn = document.getElementById("toggleImages")
  toggleImagesBtn?.addEventListener("click", () => {
    document.querySelectorAll("img").forEach((img) => {
      img.style.display = img.style.display === "none" ? "" : "none"
    })
  })
})
