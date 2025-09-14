import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Shop from '../pages/Shop.vue'
import Cart from '../pages/Cart.vue'
import About from '../pages/About.vue'


const routes = [
{ path: '/', name: 'home', component: Home },
{ path: '/shop', name: 'shop', component: Shop },
{ path: '/cart', name: 'cart', component: Cart },
{ path: '/about', name: 'about', component: About },
]


const router = createRouter({
history: createWebHistory(),
routes,
scrollBehavior() {
return { top: 0 }
},
})


export default router
