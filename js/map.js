document.addEventListener("DOMContentLoaded", () => {
  // Простая инициализация для встроенной карты
  const locationCard = document.querySelector(".company-location")

  if (locationCard) {
    // Добавляем плавную анимацию при загрузке
    setTimeout(() => {
      locationCard.style.opacity = "1"
      locationCard.style.transform = "translateY(0)"
    }, 300)

    // Инициальные стили для анимации
    locationCard.style.opacity = "0"
    locationCard.style.transform = "translateY(20px)"
    locationCard.style.transition = "all 0.6s ease"
  }

  // Обработка клика по карточке местоположения
  if (locationCard) {
    locationCard.addEventListener("click", (e) => {
      // Если клик не по iframe, открываем карты в новой вкладке
      if (!e.target.closest("iframe")) {
        const mapsUrl =
          "https://www.google.com/maps/search/225170+ул.+Центральная+52+аг.+Шени+Пружанский+район+Брестская+область"
        window.open(mapsUrl, "_blank")
      }
    })
  }
})
