import { reactive, computed } from 'vue'

const API_ENDPOINT =
  import.meta.env.VITE_PRODUCTS_API ?? 'http://localhost:1337/api/products?populate=*'
const STRAPI_BASE_URL = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop'

const state = reactive({
  items: [],
  loading: false,
  error: null,
  hasLoaded: false,
})

function resolveImageURL(image) {
  if (!image) return FALLBACK_IMAGE

  if (typeof image === 'string') {
    return image.startsWith('http') ? image : `${STRAPI_BASE_URL}${image}`
  }

  const candidates = []

  const pushCandidate = (entry) => {
    if (!entry) return
    const attributes = entry.attributes ?? entry
    if (!attributes) return

    const formats = attributes.formats
    if (formats) {
      const preferredOrder = ['large', 'medium', 'small', 'thumbnail']
      for (const key of preferredOrder) {
        const formatUrl = formats[key]?.url
        if (formatUrl) {
          candidates.push(formatUrl)
          break
        }
      }
    }

    if (attributes.url) {
      candidates.push(attributes.url)
    } else if (attributes.src) {
      candidates.push(attributes.src)
    }
  }

  if (Array.isArray(image)) {
    image.forEach(pushCandidate)
  } else if (Array.isArray(image?.data)) {
    image.data.forEach(pushCandidate)
  } else if (image?.data) {
    pushCandidate(image.data)
  } else {
    pushCandidate(image)
  }

  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue
    const trimmed = candidate.trim()
    if (!trimmed) continue
    return trimmed.startsWith('http') ? trimmed : `${STRAPI_BASE_URL}${trimmed}`
  }

  return FALLBACK_IMAGE
}

function flattenRichText(detail) {
  if (!detail) return ''
  if (typeof detail === 'string') return detail
  if (!Array.isArray(detail)) return ''

  return detail
    .map((block) => {
      if (!block) return ''
      const children = Array.isArray(block.children) ? block.children : []
      return children
        .map((child) => (typeof child?.text === 'string' ? child.text : ''))
        .join('')
    })
    .filter(Boolean)
    .join('\n\n')
}

function extractCategory(data) {
  const rawCategory =
    data.catagory ?? data.category ?? data.cat ?? data.categories ?? data.categoryId

  const normalizeEntry = (entry) => {
    if (!entry) return null
    const attributes = entry.attributes ?? entry
    if (!attributes) return null

    const slug = attributes.slug || attributes.id || attributes.code || attributes.name
    const name = attributes.name || attributes.title || attributes.label || slug

    return {
      slug: typeof slug === 'string' && slug.trim() ? slug : 'uncategorized',
      name: typeof name === 'string' && name.trim() ? name : '未分類',
    }
  }

  const tryNormalize = (value) => {
    if (!value) return null
    if (Array.isArray(value)) {
      for (const entry of value) {
        const normalized = normalizeEntry(entry)
        if (normalized) return normalized
      }
      return null
    }

    if (value?.data) {
      return tryNormalize(value.data)
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return null
      return { slug: trimmed, name: trimmed }
    }

    return normalizeEntry(value)
  }

  return tryNormalize(rawCategory) ?? { slug: 'uncategorized', name: '未分類' }
}

function transformProduct(raw) {
  const attributes = raw?.attributes ?? raw ?? {}

  const fallbackId =
    attributes.documentId ?? `product-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const id = raw?.id ?? attributes.id ?? fallbackId
  const name = attributes.name ?? '未命名商品'
  const price = Number(attributes.price ?? 0) || 0
  const detail = flattenRichText(attributes.detail)
  const image = resolveImageURL(attributes.image ?? attributes.cover)
  const category = extractCategory(attributes)

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
    const response = await fetch(API_ENDPOINT)
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
