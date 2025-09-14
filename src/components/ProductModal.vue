<template>
  <div
    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50"
    style="z-index: 1050"
    @click.self="close"
  >
    <div class="bg-white rounded shadow p-3" style="max-width: 400px; width: 90%">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="mb-0">{{ product.name }}</h5>
        <button type="button" class="btn-close" @click="close"></button>
      </div>
      <img :src="product.image" :alt="product.name" class="img-fluid mb-3" />
      <p class="mb-3">{{ product.detail }}</p>
      <div class="text-end">
        <button class="btn btn-primary" @click="addToCart">加入購物車</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import cart from '../stores/cartStore'

const props = defineProps({
  product: Object,
})

const emit = defineEmits(['close'])

function addToCart() {
  cart.add({
    id: props.product.id,
    name: props.product.name,
    price: props.product.price,
    image: props.product.image,
  })
}

function close() {
  emit('close')
}
</script>
