<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'

const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref('ALL') // ALL, PENDING, COMPLETED, CANCELLED
const BASE_URL = import.meta.env.VITE_BACKEND || ""

// ฟังก์ชันดึงสีตามสถานะ
const getStatusColor = (status) => {
    switch (status) {
        case 'COMPLETED': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100'
        case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100'
        default: return 'bg-slate-50 text-slate-600 border-slate-100'
    }
}

// กรองข้อมูล (Filter Logic) - รองรับข้อมูลจำนวนมาก
const filteredOrders = computed(() => {
    return orders.value.filter(o => {
        const matchesTab = activeTab.value === 'ALL' || o.status === activeTab.value
        const matchesSearch = o.id.toString().includes(searchQuery.value) ||
            o.items.some(i => i.game.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
        return matchesTab && matchesSearch
    })
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric'
    })
}

onMounted(async () => {
    try {
        const res = await api.get('/orders/my')
        orders.value = res.data.data
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="max-w-5xl mx-auto py-12 px-6">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <h2 class="text-4xl font-black text-slate-900 tracking-tight">Orders</h2>
                <p class="text-slate-500 font-medium mt-1">ติดตามและจัดการคำสั่งซื้อทั้งหมดของคุณ</p>
            </div>

            <div class="relative w-full md:w-80">
                <span class="absolute inset-y-0 left-4 flex items-center text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <input v-model="searchQuery" type="text" placeholder="ค้นหาเลขออเดอร์ หรือชื่อเกม..."
                    class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm text-sm" />
            </div>
        </div>

        <div class="flex items-center gap-2 p-1.5 bg-slate-200/50 rounded-2xl w-fit mb-8">
            <button v-for="tab in ['ALL', 'PENDING', 'COMPLETED', 'CANCELLED']" :key="tab" @click="activeTab = tab"
                :class="[
                    'px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest',
                    activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                ]">
                {{ tab }}
            </button>
        </div>

        <div v-if="loading" class="space-y-4">
            <div v-for="n in 3" :key="n" class="h-40 bg-slate-100 animate-pulse rounded-[2rem]"></div>
        </div>

        <div v-else-if="filteredOrders.length === 0"
            class="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🔍
            </div>
            <h3 class="text-xl font-bold text-slate-800">ไม่พบรายการที่ตรงกัน</h3>
            <p class="text-slate-400 mt-2">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูนะครับ</p>
        </div>

        <div v-else class="space-y-6">
            <div v-for="o in filteredOrders" :key="o.id"
                class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group">

                <div
                    class="px-8 py-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 group-hover:bg-slate-50/50 transition-colors">
                    <div class="flex items-center gap-8">
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Ref
                            </p>
                            <p class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-sm">#{{
                                o.id.toString().padStart(6, '0') }}</p>
                        </div>
                        <div class="hidden sm:block">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Placed On
                            </p>
                            <p class="font-bold text-slate-700 text-sm">{{ formatDate(o.createdAt) }}</p>
                        </div>
                        <div>
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <div :class="getStatusColor(o.status)"
                                class="px-3 py-1 rounded-lg text-[10px] font-black border uppercase tracking-tighter">
                                {{ o.status }}
                            </div>
                        </div>
                    </div>

                    <button
                        class="p-2 hover:bg-white rounded-full transition-colors text-slate-300 hover:text-indigo-600 border border-transparent hover:border-slate-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                <div class="p-8">
                    <div class="divide-y divide-slate-50">
                        <div v-for="i in o.items" :key="i.id" class="flex items-center gap-6 py-4 first:pt-0 last:pb-0">
                            <div
                                class="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 shadow-inner">
                                <img v-if="i.game.gameMedias?.[0]" :src="BASE_URL + i.game.gameMedias[0].url"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div v-else class="w-full h-full flex items-center justify-center text-xl">🎮</div>
                            </div>

                            <div class="flex-1 min-w-0">
                                <h4 class="font-bold text-slate-800 truncate leading-tight">{{ i.game.title }}</h4>
                                <p class="text-xs text-slate-400 font-bold mt-1">QTY: {{ i.quantity }}</p>
                            </div>

                            <div class="text-right">
                                <p class="font-black text-slate-900 italic">฿{{ (i.price * i.quantity).toLocaleString()
                                    }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 pt-6 border-t border-slate-100 flex items-end justify-between">
                        <div class="hidden md:block">
                            <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Thank you for
                                your purchase</span>
                        </div>
                        <div class="flex items-baseline gap-3">
                            <span class="text-xs font-black text-slate-400 uppercase">Total Amount</span>
                            <span class="text-3xl font-black text-indigo-600 tracking-tighter">
                                ฿{{(o.totalPrice || o.items.reduce((acc, i) => acc + (i.price * i.quantity),
                                0)).toLocaleString() }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="filteredOrders.length > 10" class="flex justify-center pt-10">
                <button
                    class="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    โหลดเพิ่มเติม...
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@400;500;600;700;800&display=swap');

div {
    font-family: 'Anuphan', sans-serif;
}

/* ซ่อน Scrollbar สำหรับ Tabs เผื่อบนมือถือ */
::-webkit-scrollbar {
    width: 0px;
    background: transparent;
}
</style>