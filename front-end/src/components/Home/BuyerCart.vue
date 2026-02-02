<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import api from '@/services/api'
import { ShoppingCart, Trash2, ArrowRight, CreditCard, ShieldCheck } from 'lucide-vue-next'

const cart = useCartStore()
const router = useRouter()
const BASE_URL = import.meta.env.VITE_BACKEND

const isSubmitting = ref(false)
const total = computed(() => cart.totalPrice)

const checkout = async () => {
    if (cart.items.length === 0 || isSubmitting.value) return

    isSubmitting.value = true
    try {
        const res = await api.post('/orders', {
            items: cart.items.map(g => ({
                gameId: g.id,
                price: g.price,
                quantity: 1
            }))
        })

        const orderId = res.data.data.id
        cart.clear()
        router.push(`/buyer/payment/${orderId}`)

    } catch (err) {
        console.error(err)
        alert('การสั่งซื้อขัดข้อง โปรดลองใหม่อีกครั้ง')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <section class="max-w-6xl mx-auto px-6 py-16 min-h-screen">
        <div class="flex items-end gap-6 mb-12">
            <div
                class="w-16 h-16 bg-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)]">
                <ShoppingCart class="text-white" :size="32" />
            </div>
            <div>
                <h1 class="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">My Cart</h1>
                <p class="text-slate-500 font-black text-xs uppercase tracking-[0.3em] mt-2 ml-1">
                    {{ cart.items.length }} Items Secured in Terminal
                </p>
            </div>
        </div>

        <div v-if="cart.items.length === 0"
            class="bg-white/[0.02] border border-white/5 rounded-[4rem] py-32 text-center backdrop-blur-sm relative overflow-hidden">
            <div class="absolute inset-0 bg-indigo-600/5 blur-[100px] -z-10"></div>
            <div class="text-8xl mb-8 opacity-10 animate-pulse">🛸</div>
            <h3 class="text-2xl font-black text-slate-300 uppercase tracking-widest">Inventory Empty</h3>
            <p class="text-slate-500 mt-3 mb-10 max-w-md mx-auto font-medium">
                ดูเหมือนคุณจะยังไม่ได้เลือกไอเทมชิ้นไหนเข้าสู่คลังแสงส่วนตัวเลย</p>
            <router-link to="/"
                class="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-indigo-500 hover:text-white active:scale-95 shadow-2xl">
                สำรวจร้านค้า
                <ArrowRight :size="18" />
            </router-link>
        </div>

        <div v-else class="grid lg:grid-cols-12 gap-12">

            <div class="lg:col-span-8 space-y-5">
                <div v-for="g in cart.items" :key="g.id"
                    class="group relative bg-[#0d0d0f] border border-white/5 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-8 hover:border-indigo-500/40 hover:bg-[#121215] transition-all duration-500">

                    <div
                        class="w-full sm:w-48 h-32 rounded-[1.5rem] overflow-hidden border border-white/5 flex-shrink-0 relative">
                        <img :src="BASE_URL + g.gameMedias?.[0]?.url"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>

                    <div class="flex-1 text-center sm:text-left">
                        <h3
                            class="text-2xl font-black text-white italic uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                            {{ g.title }}
                        </h3>
                        <div class="flex flex-wrap justify-center sm:justify-start gap-2 mt-3">
                            <span
                                class="bg-white/5 text-zinc-400 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-white/5">
                                Digital License
                            </span>
                            <span
                                class="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-emerald-500/20">
                                Available Now
                            </span>
                        </div>
                    </div>

                    <div
                        class="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-6 sm:min-w-[120px]">
                        <p class="text-2xl font-black text-white italic tracking-tighter">฿{{ g.price.toLocaleString()
                            }}</p>
                        <button @click="cart.remove(g.id)"
                            class="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/5 text-rose-500/40 hover:bg-rose-500 hover:text-white transition-all duration-300">
                            <Trash2 :size="18" />
                        </button>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-4">
                <div
                    class="sticky top-24 bg-gradient-to-b from-[#16161a] to-[#0d0d0f] border border-white/10 rounded-[3rem] p-10 shadow-2xl overflow-hidden">
                    <div class="absolute -top-20 -right-20 w-48 h-48 bg-indigo-600/20 blur-[80px] -z-10"></div>

                    <h2
                        class="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                        <CreditCard :size="14" /> สรุปการสั่งซื้อ
                    </h2>

                    <div class="space-y-5 mb-10">
                        <div class="flex justify-between items-center text-sm font-bold">
                            <span class="text-zinc-500 uppercase tracking-widest">ผลรวมย่อย</span>
                            <span class="text-white italic">฿{{ total.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between items-center text-sm font-bold">
                            <span class="text-zinc-500 uppercase tracking-widest">ค่าธรรมเนียมการดำเนินการ</span>
                            <span class="text-emerald-500 italic">FREE</span>
                        </div>
                        <div class="pt-5 border-t border-white/5 flex justify-between items-end">
                            <span class="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] pb-1">ราคา
                                รวม</span>
                            <span class="text-5xl font-black text-white italic tracking-tighter">
                                <span class="text-sm not-italic opacity-30">฿ </span>{{ total.toLocaleString() }}
                            </span>
                        </div>
                    </div>

                    <button @click="checkout" :disabled="isSubmitting"
                        class="relative w-full group overflow-hidden bg-indigo-600 disabled:bg-zinc-800 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_-10px_rgba(79,70,229,0.4)] transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3">

                        <div v-if="isSubmitting"
                            class="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <template v-else>
                            <span>ชำระเงิน</span>
                            <ArrowRight :size="20" class="group-hover:translate-x-2 transition-transform" />
                        </template>

                        <div
                            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine">
                        </div>
                    </button>

                    <div class="mt-8 flex items-center justify-center gap-2 opacity-30">
                        <ShieldCheck :size="12" class="text-white" />
                        <span class="text-[8px] font-black text-white uppercase tracking-[0.2em]">End-to-End
                            Encryption</span>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
@import "tailwindcss";

/* Shine Animation สำหรับปุ่ม Checkout */
@keyframes shine {
    100% {
        transform: translateX(100%);
    }
}

.animate-shine {
    animation: shine 0.8s ease-in-out;
}

/* ปรับปรุงฟอนต์และการแสดงผล */
section {
    font-family: 'Inter', sans-serif;
}

h1,
h2,
h3,
p {
    text-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}
</style>