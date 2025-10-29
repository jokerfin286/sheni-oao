// Image carousel functionality for life sections
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".life-image-carousel")

  carousels.forEach((carousel) => {
    const images = carousel.querySelectorAll(".carousel-image")
    const dots = carousel.querySelectorAll(".dot")
    let currentIndex = 0
    let autoplayInterval

    // Function to show specific slide
    function showSlide(index) {
      // Remove active class from all images and dots
      images.forEach((img) => img.classList.remove("active"))
      dots.forEach((dot) => dot.classList.remove("active"))

      // Add active class to current image and dot
      images[index].classList.add("active")
      dots[index].classList.add("active")

      currentIndex = index
    }

    // Function to show next slide
    function nextSlide() {
      const nextIndex = (currentIndex + 1) % images.length
      showSlide(nextIndex)
    }

    // Add click handlers to dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index)
        // Reset autoplay when user manually changes slide
        clearInterval(autoplayInterval)
        startAutoplay()
      })
    })

    // Start autoplay
    function startAutoplay() {
      autoplayInterval = setInterval(nextSlide, 4000) // Change image every 4 seconds
    }

    // Pause autoplay on hover
    carousel.addEventListener("mouseenter", () => {
      clearInterval(autoplayInterval)
    })

    // Resume autoplay when mouse leaves
    carousel.addEventListener("mouseleave", () => {
      startAutoplay()
    })

    // Initialize autoplay
    startAutoplay()
  })
})
