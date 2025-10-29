document.addEventListener("DOMContentLoaded", () => {
  const typewriterElement = document.getElementById("typewriterText")

  if (!typewriterElement) return

  const texts = [
    "Сила нашей земли — в людях, которые на ней работают.\nМы создаём качественные продукты и комфортные условия для жизни.",
    "Мы объединяем традиции земли и современные технологии.\nНатурально. Надёжно. С любовью к делу.",
    "Вместе растим урожай и будущее.\nЗабота о людях и земле — наша основа.",
    "Каждый день мы растим не только урожай, но и возможности.\nЛюди, труд и технологии — наш путь к успеху.",
    "Мы растим качество.\nМы развиваем землю и заботимся о людях.",
    "Всё начинается с земли.\nМы превращаем труд в урожай и уверенность в завтрашнем дне.",
    "Мы рядом с природой и людьми.\nСоздаём, растим и поддерживаем жизнь вокруг нас.",
  ]

  let currentTextIndex = 0
  let currentCharIndex = 0
  let isDeleting = false
  let isPaused = false

  const typingSpeed = 50 // Speed of typing in ms
  const deletingSpeed = 30 // Speed of deleting in ms
  const pauseAfterComplete = 3000 // Pause after completing text
  const pauseBeforeDelete = 2000 // Pause before starting to delete

  function type() {
    const currentText = texts[currentTextIndex]

    if (isPaused) {
      return
    }

    if (!isDeleting) {
      // Typing
      typewriterElement.textContent = currentText.substring(0, currentCharIndex)
      currentCharIndex++

      if (currentCharIndex > currentText.length) {
        // Finished typing, pause before deleting
        isPaused = true
        setTimeout(() => {
          isPaused = false
          isDeleting = true
          type()
        }, pauseBeforeDelete)
        return
      }
    } else {
      // Deleting
      typewriterElement.textContent = currentText.substring(0, currentCharIndex)
      currentCharIndex--

      if (currentCharIndex < 0) {
        // Finished deleting, move to next text
        isDeleting = false
        currentTextIndex = (currentTextIndex + 1) % texts.length
        currentCharIndex = 0

        // Small pause before starting next text
        isPaused = true
        setTimeout(() => {
          isPaused = false
          type()
        }, 500)
        return
      }
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed
    setTimeout(type, speed)
  }

  // Start the typewriter effect
  type()
})
