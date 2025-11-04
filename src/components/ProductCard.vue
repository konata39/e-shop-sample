<template>
<div class="card h-100 shadow-sm">
  <img
    :src="imageSrc"
    class="card-img-top"
    :alt="name || '商品圖片'"
    style="object-fit:cover;height:180px"
  />
  <div class="card-body d-flex flex-column">
    <h5 class="card-title">{{ name || '未命名商品' }}</h5>
    <p class="card-text text-muted mb-4">NT$ {{ displayPrice.toLocaleString() }}</p>
    <div class="mt-auto d-grid gap-2">
      <button class="btn btn-outline-primary" @click="emit('preview')">查看</button>
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
  id: [String, Number],
  name: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['preview'])


function addToCart() {
  cart.add({
    id: props.id,
    name: props.name || '未命名商品',
    price: displayPrice.value,
    image: imageSrc.value,
  })
}

const displayPrice = computed(() => {
  const value = Number(props.price)
  return Number.isFinite(value) ? value : 0
})
const imageSrc = computed(() => props.image || productStore.FALLBACK_IMAGE)
</script>
