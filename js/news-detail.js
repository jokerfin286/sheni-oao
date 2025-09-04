// Рендер полной статьи по slug ?slug=...

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search)
  const slug = params.get("slug")

  const titleEl = document.getElementById("articleTitle")
  const dateEl = document.getElementById("articleDate")
  const catEl = document.getElementById("articleCategory")
  const tagsEl = document.getElementById("articleTags")
  const contentEl = document.getElementById("articleContent")
  const mediaWrap = document.getElementById("articleMedia")

  if (!slug) {
    titleEl.textContent = "Статья не найдена"
    contentEl.textContent = "Отсутствует параметр slug."
    return
  }

  try {
    const res = await fetch("data/news.json", { cache: "no-store" })
    const data = await res.json()
    const post = (data.posts || []).find((p) => p.slug === slug)

    if (!post) {
      titleEl.textContent = "Статья не найдена"
      contentEl.textContent = "Проверьте ссылку или вернитесь к списку новостей."
      return
    }

    titleEl.textContent = post.title
    dateEl.textContent = new Date(post.date).toLocaleDateString("ru-RU")
    catEl.textContent = categoryRu(post.category)
    catEl.className = `news-category ${post.category}`
    tagsEl.innerHTML = (post.tags || []).map((t) => `<span class="article-tag">${escapeHtml(t)}</span>`).join("")

    function isVideo(src = "", type = "") {
      return type === "video" || /\.mp4$|\.webm$|\.ogg$/i.test(src)
    }
    function buildMediaHtml(items = []) {
      if (!Array.isArray(items) || !items.length) return ""
      return items
        .map((m) => {
          if (isVideo(m.src, m.type)) {
            return `<figure class="article-media"><video src="${m.src}" controls preload="metadata"></video>${m.caption ? `<figcaption>${escapeHtml(m.caption)}</figcaption>` : ""}</figure>`
          }
          return `<figure class="article-media"><img src="${m.src}" alt="${escapeHtml(m.alt || "")}"/>${m.caption ? `<figcaption>${escapeHtml(m.caption)}</figcaption>` : ""}</figure>`
        })
        .join("")
    }

    if (mediaWrap) {
      const html = buildMediaHtml(post.media)
      if (html) {
        mediaWrap.style.display = "block"
        mediaWrap.innerHTML = html
      } else {
        mediaWrap.style.display = "none"
      }
    }

    contentEl.innerHTML = post.content
    document.title = `${post.title} — Шени-агропродукт`
  } catch (e) {
    titleEl.textContent = "Ошибка загрузки"
    contentEl.textContent = "Не удалось загрузить данные статьи."
  }

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
  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;")
  }
})
