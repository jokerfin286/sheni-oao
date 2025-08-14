let safetyTopics = []

// Load safety topics
async function loadSafetyTopics() {
  try {
    const response = await fetch("data/safety.json")
    safetyTopics = await response.json()
    renderSafetyTopics()
  } catch (error) {
    console.error("Error loading safety topics:", error)
    document.getElementById("safety-topics").innerHTML = "<p>Ошибка загрузки данных о безопасности.</p>"
  }
}

// Render safety topics
function renderSafetyTopics() {
  const container = document.getElementById("safety-topics")

  if (safetyTopics.length === 0) {
    container.innerHTML = "<p>Нет доступных тем по безопасности.</p>"
    return
  }

  const topicsHtml = safetyTopics
    .map(
      (topic) => `
        <div class="safety-topic ${topic.priority}" onclick="openSafetyArticle('${topic.id}')">
            <div class="topic-icon">${topic.icon}</div>
            <div class="topic-content">
                <h3 class="topic-title">${topic.title}</h3>
                <p class="topic-description">${topic.description}</p>
                <div class="topic-priority priority-${topic.priority}">
                    ${
                      topic.priority === "high"
                        ? "Высокий приоритет"
                        : topic.priority === "medium"
                          ? "Средний приоритет"
                          : "Низкий приоритет"
                    }
                </div>
            </div>
            <div class="topic-arrow">→</div>
        </div>
    `,
    )
    .join("")

  container.innerHTML = topicsHtml
}

// Open safety article modal or external file
function openSafetyArticle(topicId) {
  const topic = safetyTopics.find((t) => t.id === topicId)
  if (!topic) return

  if (topic.type === "pdf" && topic.pdfUrl) {
    window.open(topic.pdfUrl, "_blank")
    return
  }

  if (topic.type === "html" && topic.htmlUrl) {
    window.open(topic.htmlUrl, "_blank")
    return
  }

  // For regular articles, show modal
  document.getElementById("safety-article-title").textContent = topic.title
  document.getElementById("safety-article-content").innerHTML = topic.content

  const modal = document.getElementById("safety-modal")
  modal.style.display = "block"
  document.body.style.overflow = "hidden"

  setTimeout(() => {
    modal.classList.add("show")
  }, 10)
}

// Close modal
function closeSafetyModal() {
  const modal = document.getElementById("safety-modal")

  modal.classList.remove("show")

  setTimeout(() => {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }, 300)
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadSafetyTopics()

  // Modal close events
  const modal = document.getElementById("safety-modal")

  if (modal) {
    const closeBtn = modal.querySelector(".modal-close")

    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        closeSafetyModal()
      })
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeSafetyModal()
      }
    })
  }

  // Escape key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("safety-modal")
      if (modal && modal.style.display === "block") {
        closeSafetyModal()
      }
    }
  })
})
