<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const goToPayment = (orderId) => {
    router.push(`/buyer/payment/${orderId}`)
}

const orders = ref([])
const loading = ref(true)
const searchQuery = ref('')
const activeTab = ref('ALL') // ALL, PENDING, COMPLETED, CANCELLED
const BASE_URL = import.meta.env.VITE_BACKEND || ""

// ฟังก์ชันดึงสีตามสถานะ (ปรับโทน Neon สำหรับ Dark Mode)
const getStatusColor = (status) => {
    switch (status) {
        case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
        case 'PAID': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
        case 'PENDING': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
        case 'CANCELLED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
        default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
    }
}

// กรองข้อมูลด้วย Computed
const filteredOrders = computed(() => {
    return orders.value.filter(o => {
        const matchesTab = activeTab.value === 'ALL' || o.status === activeTab.value
        const matchesSearch = o.id.toString().includes(searchQuery.value) ||
            o.items.some(i => i.game.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
        return matchesTab && matchesSearch
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงจากล่าสุดขึ้นก่อน
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}

onMounted(async () => {
    try {
        const res = await api.get('/orders/my')
        orders.value = res.data.data
    } catch (err) {
        console.error("Fetch orders error:", err)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="min-h-screen bg-[#0a0a0b] w-full text-white pb-32 selection:bg-blue-500/30">

        <div class="fixed top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 blur-[140px] pointer-events-none z-0"></div>
        <div class="fixed bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] pointer-events-none z-0">
        </div>

        <div class="relative z-10 max-w-6xl mx-auto py-12 px-6 animate-in">

            <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
                <div class="space-y-2">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-2 h-8 bg-blue-600 rounded-full"></div>
                        <span class="text-zinc-500 font-black text-xs uppercase tracking-[0.4em]">Transaction
                            History</span>
                    </div>
                    <h2 class="text-6xl font-black tracking-tighter italic uppercase leading-none">
                        My <span class="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">Orders</span>
                    </h2>
                </div>

                <div class="relative w-full md:w-96 group">
                    <span
                        class="absolute inset-y-0 left-5 flex items-center text-zinc-600 group-focus-within:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input v-model="searchQuery" type="text" placeholder="ORDER ID OR GAME TITLE..."
                        class="w-full pl-14 pr-6 py-5 bg-white/[0.02] border border-white/5 rounded-2xl focus:border-blue-500/50 focus:bg-white/[0.04] outline-none transition-all text-sm font-bold tracking-widest shadow-2xl" />
                </div>
            </div>

            <div
                class="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-[24px] w-fit mb-12 shadow-inner">
                <button v-for="tab in ['ALL', 'PENDING', 'COMPLETED', 'CANCELLED']" :key="tab" @click="activeTab = tab"
                    :class="[
                        'px-10 py-3 rounded-[18px] text-[11px] font-black transition-all uppercase tracking-[0.2em]',
                        activeTab === tab
                            ? 'bg-blue-600 text-white shadow-[0_10px_25px_rgba(37,99,235,0.4)] scale-105'
                            : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    ]">
                    {{ tab }}
                </button>
            </div>

            <div v-if="loading" class="space-y-8">
                <div v-for="n in 3" :key="n"
                    class="h-56 bg-white/[0.02] border border-white/5 animate-pulse rounded-[40px]"></div>
            </div>

            <div v-else-if="filteredOrders.length === 0"
                class="text-center py-40 bg-white/[0.01] rounded-[60px] border border-dashed border-white/10 shadow-inner">
                <div class="text-8xl mb-8 opacity-10 italic font-black uppercase tracking-tighter select-none">Empty
                </div>
                <h3 class="text-2xl font-black text-zinc-400 italic uppercase">ไม่พบรายการคำสั่งซื้อของคุณ</h3>
                <p class="text-zinc-600 mt-4 text-xs uppercase tracking-[0.4em] font-bold">Try adjusting your filters or
                    store search</p>
                <button @click="router.push('/')"
                    class="mt-10 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Return to Store
                </button>
            </div>

            <div v-else class="space-y-10">
                <div v-for="o in filteredOrders" :key="o.id"
                    class="bg-white/[0.02] rounded-[45px] border border-white/5 overflow-hidden hover:border-blue-500/40 transition-all duration-700 group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">

                    <div
                        class="px-12 py-10 flex flex-wrap items-center justify-between gap-8 border-b border-white/5 bg-white/[0.01] group-hover:bg-white/[0.03] transition-colors">
                        <div class="flex items-center gap-12">
                            <div class="relative">
                                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 italic">
                                    Ref Code</p>
                                <p
                                    class="font-mono font-black text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-xl text-sm border border-blue-500/20 shadow-lg">
                                    #{{ o.id.toString().padStart(6, '0') }}
                                </p>
                            </div>
                            <div class="hidden lg:block">
                                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 italic">
                                    Transaction Date</p>
                                <p class="font-black text-zinc-200 text-sm italic tracking-wide">{{
                                    formatDate(o.createdAt) }}</p>
                            </div>
                            <div>
                                <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-3 italic">
                                    Current Status</p>
                                <div :class="getStatusColor(o.status)"
                                    class="px-5 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-[0.2em]">
                                    {{ o.status }}
                                </div>
                            </div>
                        </div>

                        <div class="text-right">
                            <p class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-2 italic">Total
                                Amount</p>
                            <p
                                class="text-4xl font-black text-white italic tracking-tighter leading-none group-hover:text-blue-500 transition-colors">
                                ฿{{(o.totalPrice || o.items.reduce((acc, i) => acc + (i.price * i.quantity),
                                0)).toLocaleString()}}
                            </p>
                        </div>
                    </div>

                    <div class="p-12">
                        <div class="space-y-8">
                            <div v-for="i in o.items" :key="i.id" class="flex items-center gap-10 group/item">
                                <div
                                    class="w-24 h-24 bg-zinc-900 rounded-[28px] overflow-hidden flex-shrink-0 border border-white/10 shadow-2xl relative">
                                    <img v-if="i.game.gameMedias?.[0]" :src="BASE_URL + i.game.gameMedias[0].url"
                                        class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-1000" />
                                    <div v-else class="w-full h-full flex items-center justify-center text-3xl">🎮</div>
                                    <div
                                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity">
                                    </div>
                                </div>

                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="text-2xl font-black text-white tracking-tight truncate italic group-hover/item:text-blue-400 transition-colors uppercase leading-tight">
                                        {{ i.game.title }}
                                    </h4>
                                    <div class="flex items-center gap-5 mt-3">
                                        <span
                                            class="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                            Quantity: {{ i.quantity }}
                                        </span>
                                        <span
                                            class="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase italic tracking-[0.2em]">
                                            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                            Instant Digital Delivery
                                        </span>
                                    </div>
                                </div>

                                <div class="text-right">
                                    <p class="font-black text-2xl text-zinc-100 italic tracking-tighter">
                                        ฿{{ (i.price * i.quantity).toLocaleString() }}
                                    </p>
                                    <p class="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Per
                                        Unit: ฿{{ i.price.toLocaleString() }}</p>
                                </div>
                            </div>
                        </div>

                        <div
                            class="mt-12 pt-10 border-t border-white/5 flex flex-wrap gap-8 items-center justify-between">
                            <div class="flex items-center gap-4 text-zinc-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    viewBox="0 0 256 256">
                                    <path
                                        d="M208,80H176V56a48,48,0,0,0-96,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80ZM96,56a32,32,0,0,1,64,0V80H96ZM208,208H48V96H208V208Z">
                                    </path>
                                </svg>
                                <span class="text-[10px] font-black uppercase tracking-[0.5em] italic">Official NJ-Store
                                    License</span>
                            </div>

                            <div class="flex items-center gap-5">
                                <button v-if="o.status === 'PENDING'" @click="goToPayment(o.id)"
                                    class="group/btn relative px-12 py-5 rounded-[22px] font-black text-[12px] uppercase tracking-[0.3em] overflow-hidden transition-all active:scale-95 shadow-2xl shadow-blue-600/20">
                                    <div
                                        class="absolute inset-0 bg-blue-600 group-hover/btn:bg-blue-500 transition-colors">
                                    </div>
                                    <span class="relative z-10 flex items-center gap-3">
                                        <span class="text-lg">💳</span> Complete Payment
                                    </span>
                                </button>

                                <div v-else-if="o.status === 'PAID' || o.status === 'COMPLETED'"
                                    class="flex items-center gap-4 text-emerald-400 font-black text-[11px] uppercase tracking-[0.2em] bg-emerald-500/5 px-8 py-5 rounded-[22px] border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
                                    <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]">
                                    </div>
                                    Verified Purchase
                                </div>

                                <div v-else-if="o.status === 'CANCELLED'"
                                    class="text-zinc-600 font-black text-[11px] uppercase tracking-[0.2em] bg-white/[0.03] px-8 py-5 rounded-[22px] border border-white/5 opacity-60">
                                    Order Voided
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="filteredOrders.length > 5" class="flex justify-center pt-10">
                    <button
                        class="px-16 py-5 bg-white/[0.02] border border-white/5 rounded-[24px] text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-2xl hover:shadow-blue-600/20 active:scale-95">
                        Discover More History
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

/* 🚀 พรีเมียมแอนิเมชันตอนเข้าหน้า */
.animate-in {
    animation: cinematicIn 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cinematicIn {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.98);
        filter: blur(20px) brightness(0.5);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0) brightness(1);
    }
}

/* 🌑 ปรับแต่งฟอนต์หัวข้อให้มีมิติ */
h2 {
    text-shadow: 0 0 40px rgba(59, 130, 246, 0.2);
    letter-spacing: -0.05em;
}

/* 🎨 ปรับแต่ง Scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: #0a0a0b;
}

::-webkit-scrollbar-thumb {
    background: #1f1f23;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
}

/* Input Placeholder Color */
input::placeholder {
    color: #3f3f46;
    letter-spacing: 0.2em;
}
</style>