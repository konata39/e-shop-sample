import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// 一律允許 CORS（若正式上線可收斂為你的網域）
app.use(cors())
app.use(express.json())

// ---- MySQL 連線池 ----
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: Number(process.env.MYSQL_PORT ?? 3306),
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'admin',
  database: process.env.MYSQL_DATABASE ?? 'eshop',
  waitForConnections: true,
  connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT ?? 10),
  queueLimit: 0
})

// ---- user auth utils ----
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derivedKey = crypto.scryptSync(password, salt, 64)
  return `${salt}:${derivedKey.toString('hex')}`
}

function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false
  const [salt, key] = storedHash.split(':')
  if (!salt || !key) return false

  const derived = crypto.scryptSync(password, salt, 64)
  const storedBuffer = Buffer.from(key, 'hex')
  if (storedBuffer.length !== derived.length) return false

  return crypto.timingSafeEqual(storedBuffer, derived)
}

async function ensureUsersTable() {
  const createSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `
  await pool.query(createSQL)
}

async function upsertDefaultUsers() {
  const defaults = [
    {
      email: process.env.ADMIN_EMAIL ?? 'admin@example.com',
      name: process.env.ADMIN_NAME ?? '管理員',
      password: process.env.ADMIN_PASSWORD ?? 'admin1234',
      role: 'admin'
    },
    {
      email: process.env.USER_EMAIL ?? 'user@example.com',
      name: process.env.USER_NAME ?? '一般會員',
      password: process.env.USER_PASSWORD ?? 'user1234',
      role: 'user'
    }
  ]

  for (const user of defaults) {
    const password_hash = hashPassword(user.password)
    await pool.query(
      `
        INSERT INTO users (email, name, password_hash, role)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          name = VALUES(name),
          password_hash = VALUES(password_hash),
          role = VALUES(role)
      `,
      [user.email, user.name, password_hash, user.role]
    )
  }
}

await ensureUsersTable()
await upsertDefaultUsers()

// ===================== Auth =====================

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email 與密碼為必填' })
    }

    const [rows] = await pool.query(
      'SELECT id, email, name, password_hash, role FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    if (!rows.length) return res.status(401).json({ error: '帳號或密碼錯誤' })

    const user = rows[0]
    const isValid = verifyPassword(password, user.password_hash)
    if (!isValid) return res.status(401).json({ error: '帳號或密碼錯誤' })

    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// ---- util: 以 slug 取得/建立 category ----
async function ensureCategoryId({ category_id, category_slug, category_name }) {
  if (category_id) return category_id
  if (!category_slug) throw new Error('category_slug 或 category_id 需至少提供一個')

  const conn = await pool.getConnection()
  try {
    const [rows] = await conn.query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [category_slug])
    if (rows.length) return rows[0].id

    const name = category_name ?? category_slug
    const [result] = await conn.query(
      'INSERT INTO categories (slug, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
      [category_slug, name]
    )
    if (result.insertId) return result.insertId

    const [rows2] = await conn.query('SELECT id FROM categories WHERE slug = ? LIMIT 1', [category_slug])
    return rows2[0]?.id
  } finally {
    conn.release()
  }
}

// ===================== Categories =====================

// 取得所有分類
app.get('/api/categories', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, slug, name, created_at FROM categories ORDER BY id ASC')
    res.json({ data: rows })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// ===================== News =====================

app.get('/api/news', async (req, res) => {
  try {
    const requestedLimit = Number(req.query.limit ?? 20)
    const limit = Number.isFinite(requestedLimit) && requestedLimit > 0 ? Math.min(requestedLimit, 50) : 20

    const [rows] = await pool.query(
      'SELECT id, title, summary, created_at FROM news ORDER BY created_at DESC, id DESC LIMIT ?',
      [limit]
    )

    res.json({ data: rows })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 新增分類
app.post('/api/categories', async (req, res) => {
  try {
    const { slug, name } = req.body || {}
    if (!slug || !name) return res.status(400).json({ error: 'slug 與 name 為必填' })
    const [result] = await pool.query('INSERT INTO categories (slug, name) VALUES (?, ?)', [slug, name])
    res.status(201).json({ id: result.insertId, slug, name })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 修改分類
app.put('/api/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { slug, name } = req.body || {}
    if (!slug && !name) return res.status(400).json({ error: '至少提供 slug 或 name' })

    const fields = []
    const params = []
    if (slug) { fields.push('slug = ?'); params.push(slug) }
    if (name) { fields.push('name = ?'); params.push(name) }
    params.push(id)

    const [result] = await pool.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, params)
    if (!result.affectedRows) return res.status(404).json({ error: '分類不存在' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 刪除分類
app.delete('/api/categories/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id])
    if (!result.affectedRows) return res.status(404).json({ error: '分類不存在或已刪除' })
    res.json({ ok: true })
  } catch (err) {
    // 外鍵約束美化
    if (String(err.message).includes('foreign key constraint fails')) {
      return res.status(400).json({ error: '該分類仍有產品，無法刪除' })
    }
    res.status(500).json({ error: String(err.message || err) })
  }
})

// ===================== Products =====================

// 列出產品（支援 ?cat=slug & ?q=關鍵字）
app.get('/api/products', async (req, res) => {
  try {
    const { cat, q } = req.query
    const where = []
    const params = []

    if (cat) { where.push('c.slug = ?'); params.push(cat) }
    if (q) { where.push('(p.name LIKE ? OR p.detail LIKE ?)'); params.push(`%${q}%`, `%${q}%`) }

    const [rows] = await pool.query(
      `
      SELECT
        p.id, p.name, p.price, p.image_url, p.detail, p.created_at,
        c.id AS category_id, c.slug AS category_slug, c.name AS category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
      ORDER BY p.id ASC
      `,
      params
    )

    const data = rows.map(r => ({
      id: r.id,
      name: r.name,
      price: Number(r.price),
      image_url: r.image_url,
      detail: r.detail,
      category: { id: r.category_id, slug: r.category_slug, name: r.category_name },
      created_at: r.created_at
    }))

    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 取得單一產品
app.get('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [rows] = await pool.query(
      `
      SELECT
        p.id, p.name, p.price, p.image_url, p.detail, p.created_at,
        c.id AS category_id, c.slug AS category_slug, c.name AS category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
      `,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: '找不到此產品' })

    const r = rows[0]
    res.json({
      id: r.id,
      name: r.name,
      price: Number(r.price),
      image_url: r.image_url,
      detail: r.detail,
      category: { id: r.category_id, slug: r.category_slug, name: r.category_name },
      created_at: r.created_at
    })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 新增產品（可用 category_id 或 category_slug）
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image_url, detail, category_id, category_slug, category_name } = req.body || {}
    if (!name || price == null) return res.status(400).json({ error: 'name, price 為必填' })

    const cid = await ensureCategoryId({ category_id, category_slug, category_name })

    const [result] = await pool.query(
      'INSERT INTO products (category_id, name, price, image_url, detail) VALUES (?, ?, ?, ?, ?)',
      [cid, name, price, image_url ?? null, detail ?? null]
    )

    res.status(201).json({ id: result.insertId })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 修改產品
app.put('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name, price, image_url, detail, category_id, category_slug, category_name } = req.body || {}

    const fields = []
    const params = []

    if (name != null) { fields.push('name = ?'); params.push(name) }
    if (price != null) { fields.push('price = ?'); params.push(price) }
    if (image_url !== undefined) { fields.push('image_url = ?'); params.push(image_url) }
    if (detail !== undefined) { fields.push('detail = ?'); params.push(detail) }

    if (category_id || category_slug) {
      const cid = await ensureCategoryId({ category_id, category_slug, category_name })
      fields.push('category_id = ?')
      params.push(cid)
    }

    if (!fields.length) return res.status(400).json({ error: '未提供要更新的欄位' })

    params.push(id)
    const [result] = await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, params)
    if (!result.affectedRows) return res.status(404).json({ error: '產品不存在' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// 刪除產品
app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id])
    if (!result.affectedRows) return res.status(404).json({ error: '產品不存在或已刪除' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) })
  }
})

// ---- 靜態檔案（前端） ----
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// 非 API 路徑一律回傳 index.html，支援前端 Router
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = Number(process.env.PORT ?? 1346)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://127.0.0.1:${PORT}`)
})
