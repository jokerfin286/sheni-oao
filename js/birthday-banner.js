// Данные о днях рождения сотрудников (месяц-день)
const birthdayData = [
	{ name: 'Якимовец Александр Петрович', date: '10-14' },
]

function checkBirthday() {
	const today = new Date()
	const currentMonth = String(today.getMonth() + 1).padStart(2, '0')
	const currentDay = String(today.getDate()).padStart(2, '0')
	const todayDate = `${currentMonth}-${currentDay}`

	const birthday = birthdayData.find(person => person.date === todayDate)

	if (birthday) {
		showBirthdayBanner(birthday.name)
	}
}

function showBirthdayBanner(name) {
	// Проверяем, не был ли баннер уже показан сегодня
	const lastShown = localStorage.getItem('birthdayBannerShown')
	const today = new Date().toDateString()

	if (lastShown === today) {
		return
	}

	// Создаем оверлей с блюром
	const overlay = document.createElement('div')
	overlay.className = 'birthday-banner-overlay'
	document.body.appendChild(overlay)

	// Создаем баннер
	const banner = document.createElement('div')
	banner.className = 'birthday-banner'
	banner.innerHTML = `
  <div class="birthday-banner-content">
    <div class="birthday-banner-icon">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Простой торт со свечами -->
        <rect x="6" y="12" width="12" height="6" fill="#FFB7C5" stroke="white" stroke-width="1"/>
        <rect x="8" y="9" width="8" height="3" fill="#FFD7E0" stroke="white" stroke-width="1"/>
        
        <!-- Свечи -->
        <rect x="10" y="6" width="1" height="3" fill="#FF6B6B"/>
        <rect x="13" y="6" width="1" height="3" fill="#4ECDC4"/>
        
        <!-- Огоньки -->
        <circle cx="10.5" cy="5" r="1" fill="#FFD93D" filter="blur(0.5px)"/>
        <circle cx="13.5" cy="5" r="1" fill="#FFD93D" filter="blur(0.5px)"/>
        
        <!-- Текст "Поздравляем" на торте -->
        <path d="M9 15 L15 15" stroke="white" stroke-width="0.5"/>
      </svg>
    </div>
    <div class="birthday-banner-text">
      <h3>С днем рождения!</h3>
      <p>Поздравляем <strong>${name}</strong> с днем рождения! Желаем здоровья, счастья и успехов!</p>
    </div>
    <button class="birthday-banner-close" aria-label="Закрыть">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
  <div class="birthday-banner-confetti"></div>
`

	document.body.appendChild(banner)

	const confettiInterval = createContinuousConfetti()

	// Закрытие баннера
	const closeBtn = banner.querySelector('.birthday-banner-close')
	closeBtn.addEventListener('click', () => {
		clearInterval(confettiInterval)
		banner.classList.add('closing')
		overlay.classList.add('closing')
		setTimeout(() => {
			banner.remove()
			overlay.remove()
		}, 400)
	})

	// Сохраняем, что баннер был показан сегодня
	localStorage.setItem('birthdayBannerShown', today)
}

function createContinuousConfetti() {
	const banner = document.querySelector('.birthday-banner')
	if (!banner) return

	const confettiContainer = banner.querySelector('.birthday-banner-confetti')
	const colors = [
		'#16a34a',
		'#22c55e',
		'#84cc16',
		'#fbbf24',
		'#f87171',
		'#60a5fa',
		'#a78bfa',
		'#f472b6',
		'#fb923c',
		'#c084fc',
	]

	const shapes = ['circle', 'rectangle', 'triangle']

	const interval = setInterval(() => {
		if (!document.body.contains(banner)) {
			clearInterval(interval)
			return
		}

		for (let i = 0; i < 6; i++) {
			const confetti = document.createElement('div')
			confetti.className = 'confetti-piece'

			const shape = shapes[Math.floor(Math.random() * shapes.length)]
			const color = colors[Math.floor(Math.random() * colors.length)]

			// Случайные стили для разнообразия
			confetti.style.left = Math.random() * 100 + '%'
			confetti.style.backgroundColor = color
			confetti.style.animationDelay = Math.random() * 0.5 + 's'
			confetti.style.setProperty('--x-end', Math.random() * 200 - 100)
			confetti.style.setProperty('--rotation', Math.random() * 720 + 360)

			// Разные размеры и формы
			const size = Math.random() * 12 + 6
			confetti.style.width = size + 'px'
			confetti.style.height = size + 'px'

			if (shape === 'rectangle') {
				confetti.style.borderRadius = '2px'
				confetti.style.transform = `rotate(${Math.random() * 360}deg)`
			} else if (shape === 'triangle') {
				confetti.style.borderRadius = '50% 50% 0 50%'
				confetti.style.transform = `rotate(${Math.random() * 360}deg)`
			}

			confettiContainer.appendChild(confetti)

			// Удаляем конфети после завершения анимации
			setTimeout(() => confetti.remove(), 4000)
		}
	}, 120)

	return interval
}

// Функция для тестирования баннера (вызывается из консоли)
window.testBirthdayBanner = (name = 'Администратор') => {
	// Очищаем localStorage, чтобы баннер показался снова
	localStorage.removeItem('birthdayBannerShown')
	showBirthdayBanner(name)
}

// Функция для очистки localStorage
window.clearBirthdayBannerCache = () => {
	localStorage.removeItem('birthdayBannerShown')
	console.log(
		'Кэш баннера очищен. Баннер будет показан при следующей загрузке страницы.'
	)
}

// Функция для проверки статуса
window.checkBirthdayBannerStatus = () => {
	const lastShown = localStorage.getItem('birthdayBannerShown')
	console.log('Последний показ баннера:', lastShown || 'Никогда не показывался')
}

// Проверяем день рождения при загрузке страницы
document.addEventListener('DOMContentLoaded', checkBirthday)
