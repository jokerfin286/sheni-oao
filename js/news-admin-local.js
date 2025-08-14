const API_BASE = "http://localhost:3001/api"
const Quill = window.Quill // Declare the Quill variable

let currentPosts = []
let currentEditId = null
let currentMedia = []
let quillEditor = null

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  initializeEditor()
  loadNews()
  setupEventListeners()

  // Устанавливаем сегодняшнюю дату по умолчанию
  document.getElementById("date").value = new Date().toISOString().split("T")[0]
})

function initializeEditor() {
  quillEditor = new Quill("#editor", {
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ align: [] }],
        ["blockquote", "code-block"],
        ["link", "image"],
        ["clean"],
      ],
    },
    placeholder: "Введите основной текст новости...",
  })
}

function setupEventListeners() {
  document.getElementById("loadNews").addEventListener("click", loadNews)
  document.getElementById("saveNews").addEventListener("click", saveAllNews)
  document.getElementById("savePost").addEventListener("click", savePost)
  document.getElementById("resetForm").addEventListener("click", resetForm)

  const uploadArea = document.getElementById("uploadArea")
  const mediaInput = document.getElementById("media")

  uploadArea.addEventListener("click", () => mediaInput.click())
  uploadArea.addEventListener("dragover", handleDragOver)
  uploadArea.addEventListener("dragleave", handleDragLeave)
  uploadArea.addEventListener("drop", handleDrop)
  mediaInput.addEventListener("change", handleMediaUpload)
}

function handleDragOver(e) {
  e.preventDefault()
  e.currentTarget.classList.add("dragover")
}

function handleDragLeave(e) {
  e.preventDefault()
  e.currentTarget.classList.remove("dragover")
}

function handleDrop(e) {
  e.preventDefault()
  e.currentTarget.classList.remove("dragover")
  const files = Array.from(e.dataTransfer.files)
  handleMediaFiles(files)
}

async function loadNews() {
  try {
    showStatus("Загружаем новости...", "warn")
    const response = await fetch(`${API_BASE}/news`)
    const data = await response.json()

    if (response.ok) {
      currentPosts = data.posts || []
      renderPostsTable()
      showStatus(`✅ Загружено ${currentPosts.length} новостей`, "ok")
    } else {
      throw new Error(data.error || "Ошибка загрузки")
    }
  } catch (error) {
    showStatus(`❌ Ошибка: ${error.message}`, "err")
  }
}

async function saveAllNews() {
  try {
    showStatus("Сохраняем изменения...", "warn")
    const response = await fetch(`${API_BASE}/news`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ posts: currentPosts }),
    })

    const result = await response.json()
    if (response.ok) {
      showStatus("✅ Все изменения успешно сохранены!", "ok")
    } else {
      throw new Error(result.error || "Ошибка сохранения")
    }
  } catch (error) {
    showStatus(`❌ Ошибка: ${error.message}`, "err")
  }
}

function renderPostsTable() {
  const tbody = document.getElementById("postsTbody")
  tbody.innerHTML = ""

  currentPosts.forEach((post) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${formatDate(post.date)}</td>
      <td><span class="category-badge category-${post.category}">${getCategoryName(post.category)}</span></td>
      <td><strong>${post.title}</strong></td>
      <td>${post.tags ? post.tags.join(", ") : "—"}</td>
      <td class="actions">
        <button class="btn btn-sm" onclick="editPost('${post.id}')" title="Редактировать">✏️</button>
        <button class="btn btn-sm btn-danger" onclick="deletePost('${post.id}')" title="Удалить">🗑️</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function getCategoryName(category) {
  const names = {
    news: "Новости",
    announcement: "Объявления",
    events: "События",
    reports: "Отчеты",
  }
  return names[category] || category
}

function editPost(id) {
  const post = currentPosts.find((p) => p.id === id)
  if (!post) return

  currentEditId = id
  document.getElementById("formTitle").textContent = "✏️ Редактировать новость"

  // Заполняем форму
  document.getElementById("title").value = post.title
  document.getElementById("date").value = post.date
  document.getElementById("category").value = post.category
  document.getElementById("excerpt").value = post.excerpt
  document.getElementById("tags").value = post.tags ? post.tags.join(", ") : ""

  quillEditor.root.innerHTML = post.content

  // Загружаем медиа
  currentMedia = post.media ? [...post.media] : []
  renderMediaList()

  // Прокручиваем к форме
  document.getElementById("formTitle").scrollIntoView({ behavior: "smooth" })
}

function deletePost(id) {
  if (!confirm("Вы уверены, что хотите удалить эту новость?")) return

  currentPosts = currentPosts.filter((p) => p.id !== id)
  renderPostsTable()
  showFormStatus('🗑️ Новость удалена из списка. Нажмите "Сохранить все" для применения.', "warn")
}

async function handleMediaUpload(event) {
  const files = Array.from(event.target.files)
  handleMediaFiles(files)
  event.target.value = ""
}

async function handleMediaFiles(files) {
  if (files.length === 0) return

  showFormStatus("📤 Загружаем файлы...", "warn")

  try {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    })

    const result = await response.json()
    if (response.ok) {
      // Добавляем загруженные файлы к текущим медиа
      result.files.forEach((file, index) => {
        const mediaItem = {
          type: file.mimetype.startsWith("image/") ? "image" : "video",
          src: file.path,
          alt: file.originalName,
          caption: "",
          cover: currentMedia.length === 0 && index === 0, // Первый файл = обложка, если медиа пустое
        }
        currentMedia.push(mediaItem)
      })

      renderMediaList()
      showFormStatus(`✅ Загружено ${result.files.length} файлов`, "ok")
    } else {
      throw new Error(result.error || "Ошибка загрузки")
    }
  } catch (error) {
    showFormStatus(`❌ Ошибка: ${error.message}`, "err")
  }
}

function renderMediaList() {
  const container = document.getElementById("mediaList")
  container.innerHTML = ""

  currentMedia.forEach((media, index) => {
    const card = document.createElement("div")
    card.className = "media-card"

    const preview =
      media.type === "image"
        ? `<img src="${media.src}" alt="${media.alt}" />`
        : `<video src="${media.src}" muted></video>`

    card.innerHTML = `
      ${media.cover ? '<div class="cover-badge">Обложка</div>' : ""}
      <button class="remove" title="Удалить">×</button>
      <div class="preview">${preview}</div>
      <div class="fields">
        <input type="text" placeholder="Подпись к медиа" value="${media.caption || ""}" class="caption-input" />
        <label style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem;">
          <input type="checkbox" ${media.cover ? "checked" : ""} class="cover-checkbox" />
          Использовать как обложку
        </label>
      </div>
    `

    const removeBtn = card.querySelector(".remove")
    const captionInput = card.querySelector(".caption-input")
    const coverCheckbox = card.querySelector(".cover-checkbox")

    removeBtn.addEventListener("click", () => {
      console.log("Кликнули удалить для индекса:", index, "медиа:", media)
      removeMediaByReference(media)
    })

    captionInput.addEventListener("change", (e) => {
      console.log("Изменили подпись для индекса:", index)
      updateMediaCaptionByReference(media, e.target.value)
    })

    coverCheckbox.addEventListener("change", (e) => {
      console.log("Изменили обложку для индекса:", index, "значение:", e.target.checked)
      setCoverByReference(media, e.target.checked)
    })

    container.appendChild(card)
  })
}

function removeMediaByReference(mediaToRemove) {
  if (!confirm("Удалить этот медиафайл?")) return

  console.log("Удаляем медиафайл:", mediaToRemove)
  console.log("Массив до удаления:", currentMedia.length, "элементов")

  const indexToRemove = currentMedia.findIndex((media) => media === mediaToRemove)

  if (indexToRemove === -1) {
    console.error("Медиафайл не найден в массиве!")
    return
  }

  console.log("Найден индекс для удаления:", indexToRemove)

  currentMedia.splice(indexToRemove, 1)

  console.log("Массив после удаления:", currentMedia.length, "элементов")

  // Если удаленный элемент был обложкой, назначаем первый элемент обложкой
  if (mediaToRemove.cover && currentMedia.length > 0) {
    currentMedia[0].cover = true
    console.log("Назначили новую обложку:", currentMedia[0])
  }

  // Принудительно очищаем контейнер и перерисовываем
  const container = document.getElementById("mediaList")
  container.innerHTML = ""

  // Небольшая задержка для корректной перерисовки
  setTimeout(() => {
    renderMediaList()
  }, 10)
}

function updateMediaCaptionByReference(mediaToUpdate, caption) {
  const index = currentMedia.findIndex((media) => media === mediaToUpdate)
  if (index !== -1) {
    currentMedia[index].caption = caption
    console.log("Обновлена подпись для медиа", index, ":", caption)
  }
}

function setCoverByReference(mediaToUpdate, isCover) {
  const index = currentMedia.findIndex((media) => media === mediaToUpdate)
  if (index === -1) {
    console.error("Медиафайл не найден для установки обложки!")
    return
  }

  console.log("Устанавливаем обложку для медиа", index, ":", isCover)

  if (isCover) {
    // Убираем обложку со всех элементов
    currentMedia.forEach((media) => {
      media.cover = false
    })
    // Устанавливаем обложку только для выбранного
    mediaToUpdate.cover = true
  } else {
    // Просто убираем обложку с этого элемента
    mediaToUpdate.cover = false
  }

  console.log(
    "Текущее состояние обложек:",
    currentMedia.map((m, i) => `${i}: ${m.cover}`),
  )

  // Перерисовываем список
  setTimeout(() => renderMediaList(), 0)
}

function removeMedia(index) {
  if (index < 0 || index >= currentMedia.length) {
    console.warn("Неверный индекс для удаления:", index)
    return
  }
  removeMediaByReference(currentMedia[index])
}

function updateMediaCaption(index, caption) {
  if (index >= 0 && index < currentMedia.length) {
    updateMediaCaptionByReference(currentMedia[index], caption)
  }
}

function setCover(index, isCover) {
  if (index < 0 || index >= currentMedia.length) {
    console.warn("Неверный индекс для установки обложки:", index)
    return
  }
  setCoverByReference(currentMedia[index], isCover)
}

function savePost() {
  const title = document.getElementById("title").value.trim()
  const date = document.getElementById("date").value
  const category = document.getElementById("category").value
  const excerpt = document.getElementById("excerpt").value.trim()
  const tags = document.getElementById("tags").value.trim()
  const content = quillEditor.root.innerHTML.trim()

  if (!title || !date || !excerpt || !content || content === "<p><br></p>") {
    showFormStatus("❌ Заполните все обязательные поля", "err")
    return
  }

  const slug = generateSlug(title)
  const id = currentEditId || `${date}-${Date.now()}`

  const post = {
    id,
    slug,
    title,
    date,
    category,
    excerpt,
    content,
    tags: tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t)
      : [],
    media: [...currentMedia],
  }

  if (currentEditId) {
    const index = currentPosts.findIndex((p) => p.id === currentEditId)
    if (index !== -1) {
      currentPosts[index] = post
    }
  } else {
    currentPosts.unshift(post)
  }

  renderPostsTable()
  resetForm()
  showFormStatus('✅ Новость сохранена в список. Нажмите "Сохранить все" для применения.', "ok")
}

function resetForm() {
  currentEditId = null
  currentMedia = []
  document.getElementById("formTitle").textContent = "✏️ Добавить новость"
  document.getElementById("title").value = ""
  document.getElementById("date").value = new Date().toISOString().split("T")[0]
  document.getElementById("category").value = "news"
  document.getElementById("excerpt").value = ""
  document.getElementById("tags").value = ""
  quillEditor.setContents([])
  renderMediaList()
  hideFormStatus()
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[а-я]/g, (char) => {
      const map = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      }
      return map[char] || char
    })
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function showStatus(message, type) {
  const status = document.getElementById("status")
  status.textContent = message
  status.className = `result ${type}`
  status.style.display = "block"

  if (type === "ok") {
    setTimeout(() => {
      status.style.display = "none"
    }, 3000)
  }
}

function showFormStatus(message, type) {
  const status = document.getElementById("formResult")
  status.textContent = message
  status.className = `result ${type}`
  status.style.display = "block"

  if (type === "ok") {
    setTimeout(() => {
      status.style.display = "none"
    }, 3000)
  }
}

function hideFormStatus() {
  document.getElementById("formResult").style.display = "none"
}
