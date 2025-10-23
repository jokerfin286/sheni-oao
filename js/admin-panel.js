// Admin Panel Logic

class AdminPanel {
  constructor() {
    this.analyticsData = []
    this.init()
  }

  init() {
    this.setupNavigation()
    this.loadAnalyticsData()
    this.updateDashboard()
    this.setupAutoRefresh()
  }

  setupNavigation() {
    document.querySelectorAll(".admin-nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (link.classList.contains("logout")) return
        e.preventDefault()

        const section = link.dataset.section
        this.showSection(section)

        document.querySelectorAll(".admin-nav-link").forEach((l) => l.classList.remove("active"))
        link.classList.add("active")
      })
    })
  }

  showSection(sectionId) {
    document.querySelectorAll(".admin-section").forEach((section) => {
      section.classList.remove("active")
    })
    document.getElementById(sectionId).classList.add("active")
  }

  loadAnalyticsData() {
    // Simulate loading analytics data
    fetch("/api/analytics/data")
      .then((res) => res.json())
      .then((data) => {
        this.analyticsData = data
        this.updateDashboard()
      })
      .catch((err) => {
        console.log("[v0] Error loading analytics:", err)
        this.generateMockData()
      })
  }

  generateMockData() {
    // Generate mock data for testing
    this.analyticsData = [
      { page: "/", browser: "Chrome", device: "Desktop", timestamp: new Date().toISOString() },
      { page: "/news", browser: "Firefox", device: "Mobile", timestamp: new Date().toISOString() },
      { page: "/contacts", browser: "Safari", device: "Tablet", timestamp: new Date().toISOString() },
    ]
  }

  updateDashboard() {
    const now = new Date()
    const oneHourAgo = new Date(now - 60 * 60 * 1000)

    // Active visitors (last hour)
    const activeVisitors = this.analyticsData.filter((d) => new Date(d.timestamp) > oneHourAgo).length

    document.getElementById("activeVisitors").textContent = activeVisitors
    document.getElementById("totalSessions").textContent = this.analyticsData.length

    // Calculate stats
    this.updateStats()
    this.updateCharts()
  }

  updateStats() {
    const browsers = {}
    const devices = {}
    const totalTime = 0

    this.analyticsData.forEach((d) => {
      browsers[d.browser] = (browsers[d.browser] || 0) + 1
      devices[d.device] = (devices[d.device] || 0) + 1
    })

    const mobileCount = (((devices["Mobile"] || 0) / this.analyticsData.length) * 100).toFixed(0)
    document.getElementById("mobileCount").textContent = mobileCount + "%"

    const avgTime = Math.round(totalTime / this.analyticsData.length || 0)
    document.getElementById("avgTime").textContent = avgTime + "м"
  }

  updateCharts() {
    this.drawBrowserChart()
    this.drawDeviceChart()
    this.drawPagesChart()
  }

  drawBrowserChart() {
    const browsers = {}
    this.analyticsData.forEach((d) => {
      browsers[d.browser] = (browsers[d.browser] || 0) + 1
    })

    const canvas = document.getElementById("browserCanvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const labels = Object.keys(browsers)
    const data = Object.values(browsers)

    // Simple bar chart
    const barWidth = canvas.width / labels.length
    const maxValue = Math.max(...data)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    labels.forEach((label, i) => {
      const height = (data[i] / maxValue) * (canvas.height - 40)
      const x = i * barWidth + 10
      const y = canvas.height - height - 20

      ctx.fillStyle = "#16a34a"
      ctx.fillRect(x, y, barWidth - 20, height)

      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText(label, x + barWidth / 2 - 10, canvas.height - 5)
      ctx.fillText(data[i], x + barWidth / 2 - 10, y - 5)
    })
  }

  drawDeviceChart() {
    const devices = {}
    this.analyticsData.forEach((d) => {
      devices[d.device] = (devices[d.device] || 0) + 1
    })

    const canvas = document.getElementById("deviceCanvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const labels = Object.keys(devices)
    const data = Object.values(devices)

    // Simple pie chart
    const total = data.reduce((a, b) => a + b, 0)
    let currentAngle = 0
    const colors = ["#16a34a", "#3b82f6", "#f59e0b"]

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    data.forEach((value, i) => {
      const sliceAngle = (value / total) * 2 * Math.PI

      ctx.fillStyle = colors[i % colors.length]
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 80, currentAngle, currentAngle + sliceAngle)
      ctx.lineTo(canvas.width / 2, canvas.height / 2)
      ctx.fill()

      currentAngle += sliceAngle
    })
  }

  drawPagesChart() {
    const pages = {}
    this.analyticsData.forEach((d) => {
      pages[d.page] = (pages[d.page] || 0) + 1
    })

    const pagesList = document.getElementById("pagesList")
    pagesList.innerHTML = Object.entries(pages)
      .sort((a, b) => b[1] - a[1])
      .map(
        ([page, count]) => `
        <div class="page-item">
          <span>${page || "/"}</span>
          <span>${count} посещений</span>
        </div>
      `,
      )
      .join("")
  }

  setupAutoRefresh() {
    setInterval(() => this.loadAnalyticsData(), 30000) // Refresh every 30 seconds
  }
}

// Initialize admin panel
document.addEventListener("DOMContentLoaded", () => {
  new AdminPanel()
})

// Logout function
function logout() {
  if (confirm("Вы уверены, что хотите выйти?")) {
    localStorage.removeItem("adminToken")
    window.location.href = "/"
  }
}

// Save settings
function saveSettings() {
  const settings = {
    siteName: document.getElementById("siteName").value,
    notificationEmail: document.getElementById("notificationEmail").value,
    analyticsEnabled: document.getElementById("analyticsEnabled").checked,
    sessionTimeout: document.getElementById("sessionTimeout").value,
  }

  localStorage.setItem("siteSettings", JSON.stringify(settings))
  alert("Настройки сохранены!")
}

// Update analytics
function updateAnalytics() {
  const dateFilter = document.getElementById("dateFilter").value
  const pageFilter = document.getElementById("pageFilter").value

  console.log("[v0] Filtering by date:", dateFilter, "page:", pageFilter)
  // Implement filtering logic
}
