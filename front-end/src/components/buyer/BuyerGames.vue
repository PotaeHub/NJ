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
    <section class="max-w-3xl mx-auto mt-24 px-6">

        <!-- Header -->
        <div class="flex items-center gap-4 mb-10">
            <div
                class="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(37_99_235_0.4)]">
                🛒
            </div>
            <h2 class="text-3xl font-black text-white uppercase tracking-tighter italic">
                Shopping Cart
            </h2>
        </div>

        <!-- Cart Items -->
        <div v-if="cart.items.length"
            class="space-y-4 bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">

            <div v-for="i in cart.items" :key="i.gameId"
                class="flex justify-between items-center bg-[#0f0f11] rounded-2xl p-5 border border-white/5 hover:border-blue-500/30 transition-all">

                <div>
                    <p class="text-white font-black uppercase tracking-tight">
                        {{ i.title }}
                    </p>
                    <p class="text-[10px] text-zinc-500 uppercase tracking-[0.3em] mt-1">
                        จำนวน: {{ i.quantity }}
                    </p>
                </div>

                <div class="text-right">
                    <p class="text-lg font-black text-white">
                        {{ i.price * i.quantity }} ฿
                    </p>
                    <p class="text-[9px] text-zinc-500 uppercase tracking-[0.3em]">
                        {{ i.price }} ฿ / item
                    </p>
                </div>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center pt-6 mt-6 border-t border-white/10">
                <span class="text-sm text-zinc-400 uppercase tracking-[0.4em] font-black">
                    รวมทั้งหมด
                </span>
                <span class="text-3xl font-black text-white">
                    {{ cart.total }} ฿
                </span>
            </div>

            <!-- Checkout Button -->
            <button @click="checkout" class="w-full mt-8 py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.3em]
                hover:bg-blue-500 hover:-translate-y-1
                shadow-[0_20px_50px_-15px_rgba(37_99_235_0.6)]
                active:scale-95 transition-all">
                ยืนยัน การสั่งซื้อ
            </button>
        </div>

        <!-- Empty State -->
        <div v-else class="mt-20 text-center bg-white/[0.02] border border-white/10 rounded-3xl p-16 backdrop-blur-xl">
            <p class="text-xl text-zinc-400 font-black uppercase tracking-wide mb-4">
                ตะกร้าของคุณยังว่างเปล่า
            </p>
            <RouterLink to="/games" class="inline-block mt-4 px-10 py-4 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-[0.3em]
                hover:bg-blue-500 transition-all">
                ไปที่หน้าร้านค้า
            </RouterLink>
        </div>

    </section>
</template>
