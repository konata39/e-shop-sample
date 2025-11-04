<template>
<section class="py-5 text-center">
<div class="container">
  <div class="row align-items-center g-4">
    <div class="col-12 col-lg-6 order-2 order-lg-1 text-lg-start">
      <h1 class="display-5 fw-bold">打造你的個人品牌網站</h1>
      <p class="lead text-muted mb-4">結合個人介紹與簡易電商，展現風格、分享消息、開始販售你的設計！</p>
      <div class="d-flex gap-2 justify-content-center justify-content-lg-start">
        <RouterLink to="/shop" class="btn btn-primary btn-lg">逛逛商店</RouterLink>
        <RouterLink to="/about" class="btn btn-outline-secondary btn-lg">了解品牌</RouterLink>
      </div>
    </div>
    <div class="col-12 col-lg-6 order-1 order-lg-2">
      <img src="https://images.unsplash.com/photo-1519337265831-281ec6cc8514?q=80&w=1600&auto=format&fit=crop" class="img-fluid rounded-4 shadow-sm" alt="hero" />
    </div>
  </div>
</div>
</section>


<section class="py-5 bg-white">
  <div class="container">
    <h2 class="h3 fw-bold mb-4 text-center text-lg-start">最新消息</h2>
    <div class="row g-4">
      <div class="col-12 col-md-6 col-lg-4" v-for="n in 3" :key="n">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">消息標題 {{ n }}</h5>
            <p class="card-text text-muted">這裡是簡短的消息摘要，展示近期活動或文章連結。</p>
            <a href="#" class="btn btn-sm btn-outline-primary">閱讀更多</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section class="py-5">
  <div class="container">
    <h2 class="h3 fw-bold mb-4 text-center text-lg-start">熱門商品</h2>
    <div v-if="store.state.loading" class="text-center text-muted py-5">商品載入中...</div>
    <div v-else-if="store.state.error" class="alert alert-danger" role="alert">{{ store.state.error }}</div>
    <div v-else-if="!demoProducts.length" class="text-center text-muted py-5">目前沒有商品。</div>
    <div v-else class="row g-4">
      <div class="col-12 col-sm-6 col-lg-3" v-for="p in demoProducts" :key="p.id">
        <ProductCard v-bind="p" @preview="onPreview(p)" />
      </div>
    </div>
  </div>
</section>
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

const demoProducts = computed(() => store.products.value.slice(0, 4))
const selected = ref(null)

function onPreview(p) {
  selected.value = p
}

function closePreview() {
  selected.value = null
}
</script>
