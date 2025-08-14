let allAwards = []

// Загрузка наград при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  loadAwards()
  setupFilters()
  setupModal()
  setupFullscreenModal() // добавил настройку полноэкранного режима
})

// Загрузка данных о наградах
async function loadAwards() {
  try {
    const response = await fetch("data/awards.json")
    allAwards = await response.json()

    populateFilters()
    renderAwards(allAwards)
  } catch (error) {
    console.error("Ошибка загрузки наград:", error)
    showNoAwards()
  }
}

// Заполнение фильтров
function populateFilters() {
  const yearFilter = document.getElementById("yearFilter")

  // Получаем уникальные годы
  const years = [...new Set(allAwards.map((award) => award.year))].sort((a, b) => b - a)
  years.forEach((year) => {
    const option = document.createElement("option")
    option.value = year
    option.textContent = year
    yearFilter.appendChild(option)
  })
}

// Настройка фильтров
function setupFilters() {
  const yearFilter = document.getElementById("yearFilter")
  yearFilter.addEventListener("change", filterAwards)
}

// Фильтрация наград
function filterAwards() {
  const yearFilter = document.getElementById("yearFilter").value

  let filteredAwards = allAwards

  if (yearFilter) {
    filteredAwards = filteredAwards.filter((award) => award.year.toString() === yearFilter)
  }

  renderAwards(filteredAwards)
}

// Отображение наград
function renderAwards(awards) {
  const grid = document.getElementById("awardsGrid")
  const noAwards = document.getElementById("noAwards")

  if (awards.length === 0) {
    showNoAwards()
    return
  }

  noAwards.style.display = "none"

  grid.innerHTML = awards
    .map(
      (award) => `
        <div class="award-card" onclick="openModal(${award.id})">
            <div class="award-image">
                <img src="${award.image}" alt="${award.title}" loading="lazy">
                <div class="award-overlay">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </div>
            </div>
            <div class="award-info">
                <h3 class="award-title">${award.title}</h3>
                <div class="award-meta">
                    <span class="award-year">${award.year}</span>
                    <span class="award-place">${award.place}</span>
                </div>
                <!-- убрал отображение категории -->
            </div>
        </div>
    `,
    )
    .join("")
}

// Показать сообщение об отсутствии наград
function showNoAwards() {
  document.getElementById("awardsGrid").innerHTML = ""
  document.getElementById("noAwards").style.display = "block"
}

// Настройка модального окна
function setupModal() {
  const modal = document.getElementById("awardModal")
  const closeBtn = document.getElementById("modalClose")

  closeBtn.addEventListener("click", closeModal)

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal()
    }
  })
}

function setupFullscreenModal() {
  const fullscreenModal = document.getElementById("fullscreenModal")
  const fullscreenClose = document.getElementById("fullscreenClose")

  fullscreenClose.addEventListener("click", closeFullscreen)

  fullscreenModal.addEventListener("click", (e) => {
    if (e.target === fullscreenModal) {
      closeFullscreen()
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFullscreen()
    }
  })
}

// Открытие модального окна
function openModal(awardId) {
  const award = allAwards.find((a) => a.id === awardId)
  if (!award) return

  const modalImage = document.getElementById("modalImage")
  modalImage.src = award.image
  modalImage.alt = award.title

  modalImage.onclick = () => openFullscreen(award.image, award.title)
  modalImage.style.cursor = "pointer"

  document.getElementById("modalTitle").textContent = award.title
  document.getElementById("modalYear").textContent = award.year
  document.getElementById("modalPlace").textContent = award.place
  document.getElementById("modalDescription").textContent = award.description

  document.getElementById("awardModal").style.display = "block"
  document.body.style.overflow = "hidden"
}

// Закрытие модального окна
function closeModal() {
  document.getElementById("awardModal").style.display = "none"
  document.body.style.overflow = "auto"
}

function openFullscreen(imageSrc, imageAlt) {
  const fullscreenImage = document.getElementById("fullscreenImage")
  fullscreenImage.src = imageSrc
  fullscreenImage.alt = imageAlt

  // Добавляем обработчик клика для закрытия
  fullscreenImage.onclick = closeFullscreen

  const fullscreenModal = document.getElementById("fullscreenModal")
  fullscreenModal.style.display = "flex"

  // Плавное появление
  setTimeout(() => {
    fullscreenModal.classList.add("active")
  }, 10)
}

function closeFullscreen() {
  const fullscreenModal = document.getElementById("fullscreenModal")
  fullscreenModal.classList.remove("active")

  // Скрываем после анимации
  setTimeout(() => {
    fullscreenModal.style.display = "none"
  }, 300)
}
