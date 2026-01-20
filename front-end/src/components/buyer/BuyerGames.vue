<script setup>
import { useCartStore } from '@/store/cart'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

const checkout = async () => {
    await api.post('/orders', {
        items: cart.items.map(i => ({
            gameId: i.gameId,
            quantity: i.quantity
        }))
    })

    cart.clear()
    router.push('/buyer/orders')
}
</script>

<template>
    <h2 class="text-2xl font-bold mb-4">🛒 ตะกร้าสินค้า</h2>

    <div v-for="i in cart.items" :key="i.gameId" class="bg-white p-4 mb-2">
        {{ i.title }} x {{ i.quantity }} = {{ i.price * i.quantity }}
    </div>

    <p class="font-bold">รวม: {{ cart.total }} ฿</p>

    <button class="btn-primary mt-3" @click="checkout">
        ยืนยันสั่งซื้อ
    </button>
</template>
