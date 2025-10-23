// Analytics tracking system for monitoring website visitors
;(() => {
  const ANALYTICS_KEY = "site_analytics_data"
  const SESSION_KEY = "analytics_session_id"

  // Generate unique session ID
  function getSessionId() {
    let sessionId = sessionStorage.getItem(SESSION_KEY)
    if (!sessionId) {
      sessionId = "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem(SESSION_KEY, sessionId)
    }
    return sessionId
  }

  // Get browser info
  function getBrowserInfo() {
    const ua = navigator.userAgent
    let browser = "Unknown"

    if (ua.indexOf("Firefox") > -1) browser = "Firefox"
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome"
    else if (ua.indexOf("Safari") > -1) browser = "Safari"
    else if (ua.indexOf("Edge") > -1) browser = "Edge"
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera"

    return browser
  }

  // Get device type
  function getDeviceType() {
    const ua = navigator.userAgent
    if (/mobile|android|iphone|ipad|phone/i.test(ua.toLowerCase())) {
      return /ipad/i.test(ua.toLowerCase()) ? "Tablet" : "Mobile"
    }
    return "Desktop"
  }

  // Get OS
  function getOS() {
    const ua = navigator.userAgent
    if (ua.indexOf("Win") > -1) return "Windows"
    if (ua.indexOf("Mac") > -1) return "macOS"
    if (ua.indexOf("Linux") > -1) return "Linux"
    if (ua.indexOf("Android") > -1) return "Android"
    if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) return "iOS"
    return "Unknown"
  }

  // Track page view
  function trackPageView() {
    const data = {
      sessionId: getSessionId(),
      page: window.location.pathname,
      title: document.title,
      timestamp: new Date().toISOString(),
      browser: getBrowserInfo(),
      device: getDeviceType(),
      os: getOS(),
      referrer: document.referrer || "Direct",
      screenResolution: window.innerWidth + "x" + window.innerHeight,
    }

    // Send to server
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch((err) => console.log("[v0] Analytics error:", err))
  }

  // Track time on page
  const pageStartTime = Date.now()
  window.addEventListener("beforeunload", () => {
    const timeOnPage = Math.round((Date.now() - pageStartTime) / 1000)
    fetch("/api/analytics/time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: getSessionId(),
        page: window.location.pathname,
        timeSpent: timeOnPage,
      }),
    }).catch((err) => console.log("[v0] Time tracking error:", err))
  })

  // Initialize tracking
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trackPageView)
  } else {
    trackPageView()
  }

  // Expose for testing
  window.analyticsDebug = {
    getSessionId,
    getBrowserInfo,
    getDeviceType,
    getOS,
  }
})()
