<template>
<div class="min-vh-100 d-flex flex-column">
<NavBar />
<main class="flex-fill bg-light">
<div class="container py-4">
<RouterView />
</div>
</main>
<footer class="border-top py-3 text-center text-muted small">
© {{ new Date().getFullYear() }} MyBrand. All rights reserved.
</footer>
<LoginModal />
</div>
</template>


<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import LoginModal from './components/LoginModal.vue'
</script>
