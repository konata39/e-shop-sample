import { reactive, computed } from 'vue'


// 商品型別參考：{ id, name, price, image, qty }
const state = reactive({
  items: [],
})


function add(item) {
  const found = state.items.find((it) => it.id === item.id)
  if (found) {
    found.qty += item.qty || 1
  } else {
    state.items.push({ ...item, qty: item.qty || 1 })
  }
}


function remove(id) {
  state.items = state.items.filter((it) => it.id !== id)
}


function setQty(id, qty) {
  const t = state.items.find((it) => it.id === id)
  if (!t) return
  t.qty = Math.max(1, qty)
}


function clear() {
  state.items = []
}


const count = computed(() => state.items.reduce((s, it) => s + it.qty, 0))
const total = computed(() => state.items.reduce((s, it) => s + it.price * it.qty, 0))


export default {
  state,
  add,
  remove,
  setQty,
  clear,
  count,
  total,
}
