<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import api from '@/services/api'

const cart = useCartStore()
const router = useRouter()
const BASE_URL = import.meta.env.VITE_BACKEND

const total = computed(() => cart.totalPrice)

const checkout = async () => {
    if (cart.items.length === 0) return

    try {
        await api.post('/orders', {
            items: cart.items.map(g => ({
                gameId: g.id,
                price: g.price,
                quantity: 1
            }))
        })

        cart.clear()
        // เปลี่ยน alert เป็น UX ที่ดีขึ้น (เช่นใช้ SweetAlert หรือ Toast ในอนาคต)
        alert('สั่งซื้อสำเร็จ 🎉 เตรียมเข้าสู่คลังเกมของคุณ')
        router.push('/buyer/orders')
    } catch (err) {
        console.error(err)
        alert('การสั่งซื้อขัดข้อง โปรดตรวจสอบยอดเงินหรือลองใหม่อีกครั้ง')
    }
}
</script>

<template>
    <section class="max-w-5xl mx-auto px-6 py-16">
        <div class="flex items-center gap-4 mb-10">
            <div
                class="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <span class="text-2xl">🛒</span>
            </div>
            <div>
                <h1 class="text-4xl font-black text-white italic uppercase tracking-tighter">My Cart</h1>
                <p class="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">
                    มีทั้งหมด {{ cart.items.length }} รายการในตะกร้า
                </p>
            </div>
        </div>

        <div v-if="cart.items.length === 0"
            class="bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[3rem] py-24 text-center">
            <div class="text-7xl mb-6 opacity-20">📦</div>
            <h3 class="text-xl font-black text-slate-400 uppercase tracking-widest">ตะกร้าของคุณยังว่างเปล่า</h3>
            <p class="text-slate-600 mt-2 mb-8">ออกไปค้นหาเกมระดับตำนานกันเลย!</p>
            <router-link to="/"
                class="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                ไปที่หน้าร้านค้า
            </router-link>
        </div>

        <div v-else class="grid lg:grid-cols-3 gap-10">

            <div class="lg:col-span-2 space-y-4">
                <div v-for="g in cart.items" :key="g.id"
                    class="group relative bg-[#0b1224] border border-white/5 rounded-[2rem] p-5 flex flex-col sm:flex-row items-center gap-6 hover:border-indigo-500/30 transition-all duration-300">

                    <div
                        class="w-full sm:w-40 h-28 rounded-2xl overflow-hidden border border-white/5 flex-shrink-0 relative">
                        <img :src="BASE_URL + g.gameMedias?.[0]?.url"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        </div>
                    </div>

                    <div class="flex-1 text-center sm:text-left">
                        <h3 class="text-xl font-black text-white italic truncate uppercase">{{ g.title }}</h3>
                        <div class="flex flex-wrap justify-center sm:justify-start gap-3 mt-2">
                            <span
                                class="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-indigo-500/20">Digital
                                Key</span>
                            <span
                                class="bg-white/5 text-slate-500 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-white/5">Instant
                                Delivery</span>
                        </div>
                    </div>

                    <div
                        class="flex flex-row sm:flex-col items-center sm:items-end gap-6 sm:gap-2 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                        <p class="text-2xl font-black text-white italic">฿{{ g.price.toLocaleString() }}</p>
                        <button @click="cart.remove(g.id)"
                            class="text-slate-500 hover:text-rose-500 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>ลบออก</span>
                        </button>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1">
                <div
                    class="sticky top-24 bg-[#0b1224] border border-white/10 rounded-[2.5rem] p-8 space-y-6 overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] -z-10"></div>

                    <h2 class="text-xl font-black text-white uppercase italic tracking-tight">สรุปยอดชำระ</h2>

                    <div class="space-y-4 border-b border-white/5 pb-6">
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-bold uppercase tracking-widest">ราคาปกติ</span>
                            <span class="text-white font-black italic">฿{{ total.toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-slate-500 font-bold uppercase tracking-widest">ส่วนลด (0%)</span>
                            <span class="text-emerald-500 font-black italic">-฿0</span>
                        </div>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-xs font-black text-slate-400 uppercase tracking-widest">ยอดสุทธิ</span>
                        <span class="text-4xl font-black text-indigo-400 italic tracking-tighter">฿{{
                            total.toLocaleString() }}</span>
                    </div>

                    <button @click="checkout"
                        class="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] flex items-center justify-center gap-3">
                        <span>ชำระเงินตอนนี้</span>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>

                    <p class="text-[10px] text-center text-slate-600 font-bold uppercase tracking-tighter">
                        By clicking Checkout, you agree to our Terms of Service.
                    </p>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');

div {
    font-family: 'Inter', sans-serif;
}
</style>