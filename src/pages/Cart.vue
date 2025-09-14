<template>
<h2 class="h3 mb-3">購物車</h2>


<div v-if="!cart.state.items.length" class="text-center py-5 bg-white rounded-3 shadow-sm">
<p class="mb-3">你的購物車是空的</p>
<RouterLink to="/shop" class="btn btn-primary">前往商店</RouterLink>
</div>


<div v-else class="row g-4">
<div class="col-12 col-lg-8">
<div class="list-group shadow-sm">
<div
class="list-group-item d-flex align-items-center gap-3"
v-for="it in cart.state.items"
:key="it.id"
>
<img :src="it.image" :alt="it.name" class="rounded" style="width:72px;height:72px;object-fit:cover" />
<div class="flex-fill">
<div class="fw-semibold">{{ it.name }}</div>
<div class="text-muted small">NT$ {{ it.price.toLocaleString() }}</div>
</div>
<div class="input-group" style="width: 140px;">
<button class="btn btn-outline-secondary" @click="dec(it)">-</button>
<input class="form-control text-center" :value="it.qty" @input="onInputQty($event, it)" />
<button class="btn btn-outline-secondary" @click="inc(it)">+</button>
</div>
<div class="text-end" style="width:130px">NT$ {{ (it.qty * it.price).toLocaleString() }}</div>
<button class="btn btn-outline-danger" @click="cart.remove(it.id)">移除</button>
</div>
</div>
</div>
<div class="col-12 col-lg-4">
<div class="card shadow-sm">
<div class="card-body">
<h5 class="card-title">結帳資訊</h5>
<div class="d-flex justify-content-between mb-2">
<span>商品數量</span>
<span>{{ cart.count }}</span>
</div>
<div class="d-flex justify-content-between mb-3">
<span>小計</span>
<span>NT$ {{ cart.total.toLocaleString() }}</span>
</div>
<button class="btn btn-primary w-100" @click="checkout">前往結帳</button>
<button class="btn btn-outline-secondary w-100 mt-2" @click="cart.clear">清空購物車</button>
</div>
</div>
</div>
</div>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import cart from '../stores/cartStore'


function dec(it) { cart.setQty(it.id, it.qty - 1) }
function inc(it) { cart.setQty(it.id, it.qty + 1) }
function onInputQty(e, it) {
const val = parseInt(e.target.value || '1', 10)
cart.setQty(it.id, isNaN(val) ? 1 : val)
}


function checkout() {
alert(`結帳金額：NT$ ${cart.total.value.toLocaleString()}`)
}
</script>
