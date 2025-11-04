import { reactive, computed } from 'vue'

// ❶ 預設改成相對路徑；若有需要可在 .env 設定：VITE_PRODUCTS_API=/api/products
const API_ENDPOINT = import.meta.env.VITE_PRODUCTS_API ?? '/api/products'
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop'

const state = reactive({
  items: [],
  loading: false,
  error: null,
  hasLoaded: false,
})

// ❷ 後端直接回傳 image_url（完整 URL 或相對路徑皆可）—保留容錯
function resolveImageURL(url) {
  if (!url || typeof url !== 'string') return FALLBACK_IMAGE
  const trimmed = url.trim()
  return trimmed ? trimmed : FALLBACK_IMAGE
}

// ❸ 後端的 detail 為純文字；保留舊函式容錯
function flattenRichText(detail) {
  if (!detail) return ''
  if (typeof detail === 'string') return detail
  if (!Array.isArray(detail)) return ''
  return detail
    .map((block) => {
      if (!block) return ''
      const children = Array.isArray(block.children) ? block.children : []
      return children.map((c) => (typeof c?.text === 'string' ? c.text : '')).join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

// ❹ 後端輸出已是 { category: { id, slug, name } }，簡化為直讀
function extractCategory(raw) {
  const cat = raw?.category
  const slug = typeof cat?.slug === 'string' && cat.slug.trim() ? cat.slug : 'uncategorized'
  const name = typeof cat?.name === 'string' && cat.name.trim() ? cat.name : '未分類'
  return { slug, name }
}

// ❺ 映射後端資料形狀：
// { id, name, price, image_url, detail, category: { slug, name }, created_at }
function transformProduct(raw) {
  const id = raw?.id
  const name = raw?.name ?? '未命名商品'
  const price = Number(raw?.price ?? 0) || 0
  const detail = flattenRichText(raw?.detail)
  const image = resolveImageURL(raw?.image_url)
  const category = extractCategory(raw)

  return {
    id,
    name,
    price,
    detail,
    image,
    cat: category.slug,
    categoryLabel: category.name,
  }
}

async function fetchProducts(force = false) {
  if (state.loading) return
  if (state.hasLoaded && !force) return

  state.loading = true
  state.error = null

  try {
    const response = await fetch(API_ENDPOINT) // 已不需 ?populate=*
    if (!response.ok) {
      throw new Error(`無法取得商品資料 (${response.status})`)
    }
    const payload = await response.json()
    const list = Array.isArray(payload?.data) ? payload.data : []
    state.items = list.map(transformProduct)
    state.hasLoaded = true
  } catch (error) {
    state.error = error instanceof Error ? error.message : '取得商品資料時發生未知錯誤'
    state.items = []
  } finally {
    state.loading = false
  }
}

const products = computed(() => state.items)
const categoryOptions = computed(() => {
  const seen = new Set()
  const result = []
  for (const product of state.items) {
    const key = product.cat || 'uncategorized'
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ key, label: product.categoryLabel || '未分類' })
  }
  return result
})

export default {
  state,
  products,
  categoryOptions,
  fetchProducts,
  FALLBACK_IMAGE,
}
