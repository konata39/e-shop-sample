<template>
  <section class="py-5 bg-light">
    <div class="container">
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <p class="text-uppercase text-muted mb-1 small">MyBrand</p>
          <h1 class="h3 fw-bold mb-0">最新消息</h1>
        </div>
        <button class="btn btn-outline-secondary" :disabled="store.state.loading" @click="refresh">
          重新整理
        </button>
      </div>

      <div v-if="store.state.loading" class="text-center text-muted py-5">最新消息載入中...</div>
      <div v-else-if="store.state.error" class="alert alert-danger" role="alert">{{ store.state.error }}</div>
      <div v-else-if="!items.length" class="text-center text-muted py-5">目前沒有任何消息，敬請期待！</div>

      <div v-else class="row g-4">
        <div class="col-12 col-lg-6" v-for="item in items" :key="item.id ?? item.title">
          <div class="card h-100 shadow-sm">
            <div class="card-body d-flex flex-column">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <span class="badge bg-primary-subtle text-primary">最新消息</span>
                <span class="small text-muted">{{ formatDate(item.created_at) }}</span>
              </div>
              <h5 class="card-title">{{ item.title }}</h5>
              <p class="card-text text-muted flex-grow-1">{{ item.summary || '敬請期待更多資訊！' }}</p>
              <button class="btn btn-outline-primary mt-3" type="button" @click="openNews(item)">閱讀更多</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <NewsModal v-if="activeNews" :item="activeNews" @close="closeNews" />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import newsStore from '../stores/newsStore'
import NewsModal from '../components/NewsModal.vue'

const store = newsStore

onMounted(() => {
  store.fetchNews({ limit: 50 })
})

const items = computed(() => store.news.value)
const activeNews = ref(null)

function refresh() {
  store.fetchNews({ limit: 50, force: true })
}

function formatDate(input) {
  const parsed = input ? new Date(input) : null
  if (!parsed || Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('zh-TW')
}

function openNews(item) {
  activeNews.value = item
}

function closeNews() {
  activeNews.value = null
}
</script>
