<template>
<div class="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
  <h2 class="h3 mb-0">商店</h2>
  <div class="btn-group" role="group" aria-label="filters">
    <button
        v-for="c in categories"
        :key="c.key"
        class="btn btn-outline-secondary"
        :class="{ active: activeCat === c.key }"
        @click="activeCat = c.key"
      >
      {{ c.label }}
    </button>
  </div>
</div>

<div v-if="store.state.loading" class="w-100 text-center py-5 text-muted">商品載入中...</div>
<div v-else-if="store.state.error" class="alert alert-danger" role="alert">
  {{ store.state.error }}
</div>
<div v-else-if="!filtered.length" class="w-100 text-center py-5 text-muted">目前沒有可顯示的商品。</div>
<div v-else class="row g-4">
  <div class="col-12 col-sm-6 col-lg-3" v-for="p in filtered" :key="p.id">
    <ProductCard v-bind="p" @preview="onPreview(p)" />
  </div>
</div>
<ProductModal v-if="selected" :product="selected" @close="closePreview" />
</template>


<script setup>
import { computed, ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'
import productStore from '../stores/productStore'

const store = productStore

onMounted(() => {
  store.fetchProducts()
})

const categories = computed(() => {
  const options = store.categoryOptions.value
  if (!options.length) {
    return [{ key: 'all', label: '全部' }]
  }

  return [{ key: 'all', label: '全部' }, ...options]
})

const activeCat = ref('all')

const filtered = computed(() => {
  if (activeCat.value === 'all') return store.products.value
  return store.products.value.filter(p => p.cat === activeCat.value)
})

const selected = ref(null)

function onPreview(p) {
  selected.value = p
}

function closePreview() {
  selected.value = null
}
</script>
