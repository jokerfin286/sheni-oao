// Динамическая лента новостей из data/news.json + поиск, фильтр, теги, шаринг + пагинация

document.addEventListener("DOMContentLoaded", async () => {
  const newsList = document.getElementById("newsList")
  const searchInput = document.getElementById("newsSearch")
  const categoryFilter = document.getElementById("categoryFilter")
  const categoryLinks = document.querySelectorAll(".category-link")
  const tagsCloud = document.getElementById("tagsCloud")

  let allPosts = []
  let filteredPosts = []

  let currentPage = 1
  const postsPerPage = 6 // количество новостей на странице

  // Загружаем данные
  try {
    const res = await fetch("data/news.json", { cache: "no-store" })
    const data = await res.json()
    allPosts = (data.posts || []).sort((a, b) => (a.date < b.date ? 1 : -1))
    filteredPosts = [...allPosts]
    renderAll()
  } catch (e) {
    console.error("Не удалось загрузить новости", e)
    newsList.innerHTML = `<div class="no-results-message"><div class="no-results-content">
      <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
      </svg><h3>Не удалось загрузить новости</h3><p>Попробуйте обновить страницу</p></div></div>`
  }

  function renderAll() {
    renderList(filteredPosts)
    renderCategoriesCounts(allPosts)
    renderTags(allPosts)
    renderPagination()
  }

  function renderList(posts) {
    newsList.innerHTML = ""
    if (!posts.length) {
      newsList.innerHTML = `<div class="no-results-message"><div class="no-results-content">
        <svg class="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path>
        </svg><h3>Новости не найдены</h3><p>Попробуйте изменить критерии поиска</p></div></div>`
      return
    }

    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const postsToShow = posts.slice(startIndex, endIndex)

    function isVideo(src = "", type = "") {
      return type === "video" || /\.mp4$|\.webm$|\.ogg$/i.test(src)
    }

    function renderCoverMedia(post) {
      const media = Array.isArray(post.media) ? post.media : []
      if (!media.length) return ""
      const cover = media.find((m) => m.cover) || media[0]
      if (!cover) return ""
      if (isVideo(cover.src, cover.type)) {
        return `<div class="news-media"><video src="${cover.src}" controls preload="metadata"></video></div>`
      }
      return `<div class="news-media"><img src="${cover.src}" alt="${escapeHtml(cover.alt || post.title)}"/></div>`
    }

    postsToShow.forEach((post, idx) => {
      const isFeatured = idx === 0 && currentPage === 1 && !searchInput.value && !categoryFilter.value
      const el = document.createElement("article")
      el.className = `news-item${isFeatured ? " featured" : ""}`
      el.setAttribute("data-category", post.category)
      el.setAttribute("data-searchable", "")

      el.innerHTML = `
        <div class="news-item-header">
          <div class="news-meta">
            <span class="news-category ${post.category}">${categoryRu(post.category)}</span>
            <time class="news-date">${formatDate(post.date)}</time>
          </div>
          <div class="news-actions">
            <button class="news-share-btn" title="Поделиться" aria-label="Поделиться">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="news-content-wrapper">
          ${renderCoverMedia(post)}
          <h2 class="news-title">${escapeHtml(post.title)}</h2>
          <div class="news-excerpt"><p>${escapeHtml(post.excerpt)}</p></div>
          <div class="news-footer">
            <div class="news-tags">
              ${post.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
            </div>
            <a href="news-detail.html?slug=${encodeURIComponent(post.slug)}" class="read-more-btn">
              Подробнее
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12,5 19,12 12,19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      `
      newsList.appendChild(el)
    })

    // Навешиваем обработчики после рендера
    const shareButtons = newsList.querySelectorAll(".news-share-btn")
    shareButtons.forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        const p = postsToShow[i] // используем postsToShow вместо posts
        if (navigator.share) {
          navigator
            .share({
              title: p.title,
              text: `Новость от ОАО «Шени-агропродукт»: ${p.title}`,
              url: `${location.origin}${location.pathname.replace("news.html", "")}news-detail.html?slug=${encodeURIComponent(p.slug)}`,
            })
            .catch(() => {})
        } else {
          navigator.clipboard
            ?.writeText(
              `${location.origin}${location.pathname.replace("news.html", "")}news-detail.html?slug=${encodeURIComponent(p.slug)}`,
            )
            .then(() => window.showNotification?.("Ссылка скопирована в буфер обмена", "success"))
            .catch(() => window.showNotification?.("Не удалось скопировать ссылку", "error"))
        }
      })
    })
  }

  function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    const paginationContainer = document.querySelector(".pagination")

    if (!paginationContainer || totalPages <= 1) {
      if (paginationContainer) paginationContainer.style.display = "none"
      return
    }

    paginationContainer.style.display = "flex"

    const prevBtn = paginationContainer.querySelector(".pagination-prev")
    const nextBtn = paginationContainer.querySelector(".pagination-next")
    const numbersContainer = paginationContainer.querySelector(".pagination-numbers")

    // Обновляем кнопки prev/next
    prevBtn.disabled = currentPage === 1
    nextBtn.disabled = currentPage === totalPages

    // Генерируем номера страниц
    numbersContainer.innerHTML = ""

    // Логика отображения номеров страниц
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, currentPage + 2)

    // Показываем первую страницу если нужно
    if (startPage > 1) {
      const btn = createPageButton(1)
      numbersContainer.appendChild(btn)
      if (startPage > 2) {
        const dots = document.createElement("span")
        dots.className = "pagination-dots"
        dots.textContent = "..."
        numbersContainer.appendChild(dots)
      }
    }

    // Показываем основные страницы
    for (let i = startPage; i <= endPage; i++) {
      const btn = createPageButton(i)
      numbersContainer.appendChild(btn)
    }

    // Показываем последнюю страницу если нужно
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        const dots = document.createElement("span")
        dots.className = "pagination-dots"
        dots.textContent = "..."
        numbersContainer.appendChild(dots)
      }
      const btn = createPageButton(totalPages)
      numbersContainer.appendChild(btn)
    }
  }

  function createPageButton(pageNum) {
    const btn = document.createElement("button")
    btn.className = `pagination-number ${pageNum === currentPage ? "active" : ""}`
    btn.textContent = pageNum
    btn.addEventListener("click", () => goToPage(pageNum))
    return btn
  }

  function goToPage(pageNum) {
    currentPage = pageNum
    renderList(filteredPosts)
    renderPagination()
    document.querySelector(".news-content").scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function renderCategoriesCounts(posts) {
    const counts = { "": 0, announcement: 0, news: 0, events: 0, reports: 0 }
    posts.forEach((p) => {
      counts[""]++
      if (counts[p.category] !== undefined) counts[p.category]++
    })
    document.querySelectorAll(".category-link").forEach((link) => {
      const cat = link.getAttribute("data-category") || ""
      const countEl = link.querySelector(".category-count")
      if (countEl && counts[cat] !== undefined) countEl.textContent = String(counts[cat])
    })
  }

  function renderTags(posts) {
    if (!tagsCloud) return
    const map = new Map()
    posts.forEach((p) => (p.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1)))
    const tags = Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
    tagsCloud.innerHTML = tags.map(([t]) => `<a href="#" class="cloud-tag">${escapeHtml(t)}</a>`).join("")
    tagsCloud.querySelectorAll(".cloud-tag").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault()
        if (searchInput) searchInput.value = a.textContent || ""
        applyFilters()
        document.querySelector(".news-content").scrollIntoView({ behavior: "smooth", block: "start" })
      })
    })
  }

  function applyFilters() {
    const term = (searchInput?.value || "").toLowerCase().trim()
    const cat = categoryFilter?.value || ""
    filteredPosts = allPosts.filter((p) => {
      const search =
        p.title.toLowerCase() + " " + (p.excerpt || "").toLowerCase() + " " + (p.content || "").toLowerCase()
      const okSearch = term ? search.includes(term) : true
      const okCat = cat ? p.category === cat : true
      return okSearch && okCat
    })
    currentPage = 1
    renderList(filteredPosts)
    renderPagination()
  }

  // Events
  if (searchInput) searchInput.addEventListener("input", applyFilters)
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters)
  categoryLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      categoryLinks.forEach((l) => l.classList.remove("active"))
      link.classList.add("active")
      const cat = link.getAttribute("data-category") || ""
      if (categoryFilter) categoryFilter.value = cat
      applyFilters()
    })
  })

  const prevBtn = document.querySelector(".pagination-prev")
  const nextBtn = document.querySelector(".pagination-next")

  prevBtn?.addEventListener("click", () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1)
    }
  })

  nextBtn?.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    if (currentPage < totalPages) {
      goToPage(currentPage + 1)
    }
  })

  // Вспомогательные
  function categoryRu(key) {
    switch (key) {
      case "announcement":
        return "Объявление"
      case "news":
        return "Новости"
      case "events":
        return "События"
      case "reports":
        return "Отчеты"
      default:
        return "Новости"
    }
  }
  function formatDate(iso) {
    try {
      const d = new Date(iso)
      return d.toLocaleDateString("ru-RU")
    } catch {
      return iso
    }
  }
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;")
  }
})
