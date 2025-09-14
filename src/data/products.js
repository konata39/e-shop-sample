import { reactive } from 'vue'

export const products = reactive([
  {
    id: 1,
    name: '品牌馬克杯',
    price: 390,
    image:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=1200&auto=format&fit=crop',
    cat: 'cup',
    detail: '品牌馬克杯',
  },
  {
    id: 2,
    name: '品牌徽章',
    price: 180,
    image:
      'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200&auto=format&fit=crop',
    cat: 'badge',
    detail: '品牌徽章',
  },
  {
    id: 3,
    name: '品牌 T-Shirt',
    price: 690,
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    cat: 'shirt',
    detail: '品牌 T-Shirt',
  },
  {
    id: 4,
    name: '貼紙組合',
    price: 120,
    image:
      'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1200&auto=format&fit=crop',
    cat: 'badge',
    detail: '貼紙組合',
  },
  {
    id: 5,
    name: 'Logo 帆布袋',
    price: 520,
    image:
      'https://images.unsplash.com/photo-1604176424472-17cd740f74e9?q=80&w=1200&auto=format&fit=crop',
    cat: 'shirt',
    detail: 'Logo 帆布袋',
  },
])

export const catMap = {
  cup: '馬克杯',
  badge: '徽章',
  shirt: '衣服',
}
