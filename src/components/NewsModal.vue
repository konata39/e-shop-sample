<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-card" role="dialog" aria-modal="true">
      <div class="modal-header d-flex justify-content-between align-items-start">
        <div>
          <p class="text-uppercase text-muted small mb-1">MyBrand</p>
          <h2 class="h5 fw-bold mb-0">{{ item.title }}</h2>
        </div>
        <button type="button" class="btn-close" aria-label="Close" @click="close"></button>
      </div>
      <div class="modal-body">
        <p class="text-muted small mb-2">{{ formatDate(item.created_at) }}</p>
        <p class="mb-0" v-if="item.summary">{{ item.summary }}</p>
        <p class="text-muted mb-0" v-else>目前尚無更詳細內容，敬請期待！</p>
      </div>
      <div class="modal-footer text-end">
        <button class="btn btn-primary" type="button" @click="close">關閉</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    close()
  }
}

function formatDate(input) {
  const parsed = input ? new Date(input) : null
  if (!parsed || Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('zh-TW')
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1050;
}

.modal-card {
  background: #fff;
  width: min(640px, 100%);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.modal-header,
.modal-footer {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-body {
  padding: 1.25rem;
}

.modal-footer {
  border-top: 1px solid #e5e7eb;
  border-bottom: 0;
}
</style>
