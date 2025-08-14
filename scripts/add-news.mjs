// Скрипт добавления новости в data/news.json
// Использование локально (из корня проекта):
//   node scripts/add-news.mjs \
//     --title="Заголовок" \
//     --date="2025-08-10" \
//     --category="news|announcement|events|reports" \
//     --excerpt="Короткое описание" \
//     --tags="тег1,тег2" \
//     --content-file="path/to/content.html"
//
// Скрипт читает data/news.json, добавляет запись, сортирует по дате (новые сверху) и перезаписывает файл.
// В продакшене запускайте в CI или вручную, посетители сайта не имеют доступа к этому скрипту и не могут менять контент.

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseArgs() {
  const args = process.argv.slice(2)
  const map = {}
  args.forEach(a => {
    const [k, ...rest] = a.split("=")
    const key = k.replace(/^--/, "")
    map[key] = rest.join("=")
  })
  return map
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 80)
}

function ensureCategory(cat) {
  const allowed = ["news", "announcement", "events", "reports"]
  if (!allowed.includes(cat)) throw new Error(`Некорректная категория: ${cat}`)
  return cat
}

async function main() {
  const args = parseArgs()
  const title = args.title
  const date = args.date || new Date().toISOString().slice(0,10)
  const category = ensureCategory(args.category || "news")
  const excerpt = args.excerpt || ""
  const tags = (args.tags || "").split(",").map(s => s.trim()).filter(Boolean)
  const contentFile = args["content-file"]

  if (!title) throw new Error("Укажите --title")
  if (!contentFile) throw new Error("Укажите --content-file (HTML фрагмент контента)")

  const content = fs.readFileSync(path.resolve(contentFile), "utf-8")
  const dataPath = path.resolve(__dirname, "..", "data", "news.json")
  const json = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

  const id = `${date}-${Math.random().toString(36).slice(2,6)}`
  const slugBase = slugify(title)
  let slug = slugBase
  // уникализация slug
  const existingSlugs = new Set((json.posts || []).map(p => p.slug))
  let i = 2
  while (existingSlugs.has(slug)) { slug = `${slugBase}-${i++}` }

  const post = { id, slug, title, date, category, excerpt, content, tags }
  json.posts = Array.isArray(json.posts) ? json.posts : []
  json.posts.push(post)
  json.posts.sort((a,b) => (a.date < b.date ? 1 : -1))

  fs.writeFileSync(dataPath, JSON.stringify(json, null, 2), "utf-8")
  console.log(`Добавлена новость: ${title}`)
  console.log(`Slug: ${slug}`)
}

main().catch(err => {
  console.error("Ошибка:", err.message)
  process.exit(1)
})
