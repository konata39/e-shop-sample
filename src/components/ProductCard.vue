<template>
<div class="card h-100 shadow-sm">
<img :src="image" class="card-img-top" :alt="name" style="object-fit:cover;height:180px" />
<div class="card-body d-flex flex-column">
<h5 class="card-title">{{ name }}</h5>
<p class="card-text text-muted mb-4">NT$ {{ price.toLocaleString() }}</p>
<div class="mt-auto d-grid gap-2">
<button class="btn btn-outline-primary" @click="emit('preview')">查看</button>
<button class="btn btn-primary" @click="addToCart">加入購物車</button>
</div>
</div>
</div>
</template>


<script setup>
import cart from '../stores/cartStore'


const props = defineProps({
id: [String, Number],
name: String,
price: Number,
image: String,
})
const emit = defineEmits(['preview'])


function addToCart() {
cart.add({ id: props.id, name: props.name, price: props.price, image: props.image })
}
</script>
