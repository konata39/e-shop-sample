import { reactive, computed } from 'vue'

const API_ENDPOINT = import.meta.env.VITE_NEWS_API ?? '/api/news'

const state = reactive({
  items: [],
  loading: false,
  error: null,
  hasLoaded: false,
})

function transformNews(raw) {
  return {
    id: raw?.id,
    title: typeof raw?.title === 'string' && raw.title.trim() ? raw.title : '未命名消息',
    summary: typeof raw?.summary === 'string' ? raw.summary : '',
    created_at: raw?.created_at,
  }
}

async function fetchNews({ limit = 20, force = false } = {}) {
  if (state.loading) return
  if (state.hasLoaded && !force) return

  state.loading = true
  state.error = null

  try {
    const response = await fetch(`${API_ENDPOINT}?limit=${encodeURIComponent(limit)}`)
    if (!response.ok) {
      throw new Error(`無法取得最新消息 (${response.status})`)
    }
    const payload = await response.json()
    const list = Array.isArray(payload?.data) ? payload.data : []
    state.items = list.map(transformNews)
    state.hasLoaded = true
  } catch (error) {
    state.error = error instanceof Error ? error.message : '取得最新消息時發生未知錯誤'
    state.items = []
  } finally {
    state.loading = false
  }
}

const news = computed(() => state.items)

export default {
  state,
  news,
  fetchNews,
}
