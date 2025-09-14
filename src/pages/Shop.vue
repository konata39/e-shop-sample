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


<div class="row g-4">
  <div class="col-12 col-sm-6 col-lg-3" v-for="p in filtered" :key="p.id">
    <ProductCard v-bind="p" @preview="onPreview(p)" />
  </div>
</div>
<ProductModal v-if="selected" :product="selected" @close="closePreview" />
</template>


<script setup>
import { computed, ref } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ProductModal from '../components/ProductModal.vue'
import { products, catMap } from '../data/products'

const categories = computed(() => {
  const unique = Array.from(new Set(products.map(p => p.cat)))
  return [
    { key: 'all', label: '全部' },
    ...unique.map(c => ({ key: c, label: catMap[c] || c }))
  ]
})

const activeCat = ref('all')

const filtered = computed(() => {
  if (activeCat.value === 'all') return products
  return products.filter(p => p.cat === activeCat.value)
})

const selected = ref(null)

function onPreview(p) {
  selected.value = p
}

function closePreview() {
  selected.value = null
}
</script>
