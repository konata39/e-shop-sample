<template>
<nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top">
<div class="container">
<a class="navbar-brand fw-bold" href="#" @click.prevent="$router.push('/')">MyBrand</a>
<button
class="navbar-toggler"
type="button"
data-bs-toggle="collapse"
data-bs-target="#mainNavbar"
aria-controls="mainNavbar"
aria-expanded="false"
aria-label="Toggle navigation"
>
<span class="navbar-toggler-icon"></span>
</button>


<div class="collapse navbar-collapse" id="mainNavbar">
<ul class="navbar-nav me-auto mb-2 mb-lg-0">
<li class="nav-item"><RouterLink class="nav-link" to="/">首頁</RouterLink></li>
<li class="nav-item"><RouterLink class="nav-link" to="/shop">商店</RouterLink></li>
<li class="nav-item"><RouterLink class="nav-link" to="/about">關於我</RouterLink></li>
</ul>
<div class="d-flex align-items-center gap-3">
<button class="btn btn-outline-secondary d-none d-lg-inline" data-bs-toggle="modal" data-bs-target="#loginModal">會員登入</button>
<RouterLink class="btn btn-primary position-relative" to="/cart">
購物車
<span v-if="cart.count" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{{ cart.count }}</span>
</RouterLink>
</div>
</div>
</div>
</nav>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import cart from '../stores/cartStore'
</script>


<style scoped>
.navbar-toggler {
border: none;
}
.navbar-toggler:focus { box-shadow: none; }
</style>
