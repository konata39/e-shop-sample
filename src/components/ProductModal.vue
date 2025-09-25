<template>
  <div
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
    style="z-index: 1050"
    @click.self="close"
  >
    <div class="bg-white rounded shadow p-3" style="max-width: 400px; width: 90%">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="mb-0">{{ product?.name || '未命名商品' }}</h5>
        <button type="button" class="btn-close" @click="close"></button>
      </div>
      <img :src="imageSrc" :alt="product?.name || '商品圖片'" class="img-fluid mb-3" />
      <p class="mb-3" v-if="detailText">{{ detailText }}</p>
      <p class="mb-3 text-muted" v-else>目前沒有商品敘述。</p>
      <div class="text-end">
        <button class="btn btn-primary" @click="addToCart">加入購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import cart from '../stores/cartStore'
import productStore from '../stores/productStore'

const props = defineProps({
  product: Object,
})

const emit = defineEmits(['close'])

function addToCart() {
  cart.add({
    id: props.product?.id,
    name: props.product?.name || '未命名商品',
    price: displayPrice.value,
    image: imageSrc.value,
  })
}

function close() {
  emit('close')
}

const detailText = computed(() => {
  const detail = props.product?.detail
  if (!detail) return ''
  if (typeof detail === 'string') return detail
  if (!Array.isArray(detail)) return ''
  return detail
    .map((block) => {
      const children = Array.isArray(block.children) ? block.children : []
      return children.map((child) => child?.text ?? '').join('')
    })
    .filter(Boolean)
    .join('\n\n')
})

const displayPrice = computed(() => {
  const value = Number(props.product?.price)
  return Number.isFinite(value) ? value : 0
})

const imageSrc = computed(
  () => props.product?.image || productStore.FALLBACK_IMAGE,
)
</script>
