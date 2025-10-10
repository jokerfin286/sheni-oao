const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs").promises
const cors = require("cors")

const app = express()
const PORT = 3001

// Middleware
app.use(cors())

// Увеличиваем лимит для JSON и form-data, чтобы избежать ошибки 413
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Статические файлы
app.use(express.static("."))

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const dir = "images/news"
    try {
      await fs.mkdir(dir, { recursive: true })
    } catch (err) {
      console.error("Error creating directory:", err)
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = file.originalname.replace(ext, "").replace(/[^a-zA-Z0-9а-яё\-_]/gi, "-")
    const timestamp = Date.now()
    cb(null, `${name}-${timestamp}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Разрешены только изображения и видео"))
    }
  },
})

// ======================= ROUTES =======================

// Получить все новости
app.get("/api/news", async (req, res) => {
  try {
    const data = await fs.readFile("data/news.json", "utf8")
    const news = JSON.parse(data)
    res.json(news)
  } catch (error) {
    console.error("Error reading news:", error)
    res.status(500).json({ error: "Ошибка чтения новостей" })
  }
})

// Сохранить новости
app.post("/api/news", async (req, res) => {
  try {
    await fs.mkdir("data", { recursive: true })

    const posts = req.body.posts || []
    const uniquePosts = posts.filter(
      (post, index, arr) => arr.findIndex((p) => p.id === post.id) === index
    )

    const newsData = { posts: uniquePosts }
    await fs.writeFile("data/news.json", JSON.stringify(newsData, null, 2), "utf8")
    res.json({ success: true, message: "Новости сохранены" })
  } catch (error) {
    console.error("Error saving news:", error)
    res.status(500).json({ error: "Ошибка сохранения новостей" })
  }
})

// Загрузить медиафайлы
app.post("/api/upload", upload.array("files"), (req, res) => {
  try {
    const files = req.files.map((file) => ({
      originalName: file.originalname,
      filename: file.filename,
      path: `images/news/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }))

    res.json({ success: true, files })
  } catch (error) {
    console.error("Error uploading files:", error)
    res.status(500).json({ error: "Ошибка загрузки файлов" })
  }
})

// Удалить медиафайл
app.delete("/api/media/:filename", async (req, res) => {
  try {
    const filename = req.params.filename
    const filepath = path.join("images/news", filename)
    await fs.unlink(filepath)
    res.json({ success: true, message: "Файл удален" })
  } catch (error) {
    console.error("Error deleting file:", error)
    res.status(500).json({ error: "Ошибка удаления файла" })
  }
})

// ======================= SERVER =======================
app.listen(PORT, () => {
  console.log(`🚀 Локальный сервер запущен на http://localhost:${PORT}`)
  console.log(`📝 Админка доступна по адресу: http://localhost:${PORT}/news-admin-local.html`)
})
