// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const mobileMenu = document.getElementById("mobileMenu")

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("active")

      // Animate hamburger menu
      const spans = mobileMenuBtn.querySelectorAll("span")
      if (mobileMenu.classList.contains("active")) {
        spans[0].style.transform = "rotate(45deg) translate(5px, 5px)"
        spans[1].style.opacity = "0"
        spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)"
      } else {
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      }
    })

    // Close mobile menu when clicking on a link
    const mobileNavLinks = mobileMenu.querySelectorAll(".nav-link")
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active")
        const spans = mobileMenuBtn.querySelectorAll("span")
        spans[0].style.transform = "none"
        spans[1].style.opacity = "1"
        spans[2].style.transform = "none"
      })
    })
  }

  // Contact Form Handling
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const formObject = {}
      formData.forEach((value, key) => {
        formObject[key] = value
      })

      // Show success message
      showNotification("Сообщение отправлено успешно!", "success")

      // Reset form
      contactForm.reset()
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
      const phoneRegex = /^[+]?[0-9\s\-$$$$]{10,}$/
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
