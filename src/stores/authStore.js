import { reactive, computed } from 'vue'

const API_ENDPOINT = '/api/auth/login'

const state = reactive({
  user: null,
  loading: false,
  error: null,
})

async function login(email, password) {
  state.loading = true
  state.error = null

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      const message = payload?.error ?? `登入失敗 (${response.status})`
      throw new Error(message)
    }

    state.user = payload?.user ?? null
    return state.user
  } catch (error) {
    state.error = error instanceof Error ? error.message : '登入失敗'
    throw error
  } finally {
    state.loading = false
  }
}

function logout() {
  state.user = null
  state.error = null
}

const isAuthenticated = computed(() => Boolean(state.user))
const roleLabel = computed(() => (state.user?.role === 'admin' ? '管理員' : '一般會員'))

export default {
  state,
  login,
  logout,
  isAuthenticated,
  roleLabel,
}
