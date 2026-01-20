<template>
    <div class="min-h-screen bg-[#FDFDFD] text-black font-sans p-6 lg:p-12 space-y-12">

        <header
            class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-10">
            <div class="space-y-1">
                <div class="flex items-center gap-4 mb-2">
                    <div class="p-3 bg-black text-white rounded-2xl shadow-xl shadow-black/10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 class="text-4xl font-black tracking-tighter uppercase">Order Ledger</h1>
                </div>
                <div class="h-1 w-12 bg-black ml-1"></div>
                <p class="text-zinc-400 text-sm font-medium tracking-wide ml-1 uppercase">Transaction History &
                    Fulfillment</p>
            </div>

            <div class="flex gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Live
                    Processing</span>
            </div>
        </header>

        <div
            class="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden relative">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-zinc-50/50 border-b border-zinc-100">
                        <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Order ID
                        </th>
                        <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Customer
                        </th>
                        <th
                            class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                            Revenue</th>
                        <th
                            class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                            Status</th>
                        <th
                            class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                            Timestamp</th>
                        <th
                            class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                            Execution</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-zinc-50">
                    <tr v-for="order in orders" :key="order.id"
                        class="group hover:bg-zinc-50/50 transition-all duration-300">
                        <td class="px-8 py-6 font-black text-sm tracking-tighter">
                            #{{ order.id.toString().slice(-6).toUpperCase() }}
                        </td>

                        <td class="px-8 py-6">
                            <div class="flex items-center gap-4">
                                <img :src="getAvatar(order.buyer.avatar)"
                                    class="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all border border-zinc-100 shadow-sm" />
                                <div class="flex flex-col">
                                    <span class="text-sm font-black tracking-tight text-zinc-800">{{
                                        order.buyer.username }}</span>
                                    <span
                                        class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-1 italic">Verified
                                        Client</span>
                                </div>
                            </div>
                        </td>

                        <td class="px-8 py-6 text-right font-black text-sm tracking-tighter">
                            ฿{{ format(order.totalPrice) }}
                        </td>

                        <td class="px-8 py-6 text-center">
                            <span :class="statusClass(order.status)" class="status-badge">
                                {{ order.status }}
                            </span>
                        </td>

                        <td
                            class="px-8 py-6 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">
                            {{ formatDate(order.createdAt) }}
                        </td>

                        <td class="px-8 py-6 text-right">
                            <div class="flex justify-end gap-2">
                                <button @click="openDetail(order)" class="action-btn hover:bg-black hover:text-white"
                                    title="View Details">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>

                                <button v-if="order.status === 'PAID'" @click="complete(order.id)"
                                    class="action-btn hover:bg-emerald-500 hover:text-white"
                                    title="Complete Fulfillment">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>

                                <button v-if="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'"
                                    @click="cancel(order.id)" class="action-btn hover:bg-rose-500 hover:text-white"
                                    title="Void Transaction">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <Transition name="fade">
            <div v-if="selectedOrder"
                class="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-6"
                @click.self="selectedOrder = null">
                <div
                    class="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

                    <div class="bg-zinc-50 px-10 py-8 flex justify-between items-center border-b border-zinc-100">
                        <div>
                            <p class="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-1">Electronic
                                Receipt</p>
                            <h2 class="text-2xl font-black tracking-tighter uppercase">Order #{{
                                selectedOrder.id.toString().slice(-6).toUpperCase() }}</h2>
                        </div>
                        <button @click="selectedOrder = null"
                            class="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center hover:bg-black hover:text-white transition-all">✕</button>
                    </div>

                    <div class="p-10 space-y-8">
                        <div class="flex items-center gap-6 p-6 rounded-3xl border border-zinc-100">
                            <img :src="getAvatar(selectedOrder.buyer.avatar)"
                                class="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg" />
                            <div class="flex-1">
                                <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Purchaser</p>
                                <p class="text-xl font-black">{{ selectedOrder.buyer.username }}</p>
                                <p class="text-xs text-zinc-400 font-medium">{{ selectedOrder.buyer.email }}</p>
                            </div>
                            <div class="text-right">
                                <span :class="statusClass(selectedOrder.status)" class="status-badge !px-4 !py-2">
                                    {{ selectedOrder.status }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <h3
                                class="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-50 pb-2">
                                Purchased Assets</h3>
                            <div class="space-y-3">
                                <div v-for="item in selectedOrder.items" :key="item.id"
                                    class="flex justify-between items-center text-sm">
                                    <div class="flex items-center gap-3">
                                        <div class="w-2 h-2 rounded-full bg-black"></div>
                                        <span class="font-bold text-zinc-700">{{ item.game.title }}</span>
                                        <span class="text-[10px] text-zinc-300 font-black italic">x{{ item.quantity
                                            }}</span>
                                    </div>
                                    <span class="font-black">฿{{ format(item.price * item.quantity) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-8 border-t border-zinc-100 flex justify-between items-end">
                            <div>
                                <p class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Grand Total
                                </p>
                                <p class="text-sm text-zinc-400 font-medium">Included all platform fees</p>
                            </div>
                            <div class="text-4xl font-black tracking-tighter italic">
                                ฿{{ format(selectedOrder.totalPrice) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"

const BASE_URL = import.meta.env.VITE_BACKEND || ""
const orders = ref([])
const selectedOrder = ref(null)

const loadOrders = async () => {
    try {
        const { data } = await api.get("/admin/orders")
        orders.value = data
    } catch (e) { console.error(e) }
}

const openDetail = (order) => selectedOrder.value = order

const complete = async (id) => {
    if (!confirm("Confirm order completion?")) return
    await api.patch(`/admin/orders/${id}/complete`)
    loadOrders()
}

const cancel = async (id) => {
    if (!confirm("Execute transaction void?")) return
    await api.patch(`/admin/orders/${id}/cancel`)
    loadOrders()
}

const getAvatar = (avatar) => {
    if (!avatar) return "/default-avatar.png"
    return avatar.startsWith("http") ? avatar : `${BASE_URL}${avatar}`
}

const format = (n) => new Intl.NumberFormat("th-TH").format(n || 0)
const formatDate = (d) => new Date(d).toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' })

const statusClass = (status) => ({
    PENDING: "bg-zinc-100 text-zinc-400",
    PAID: "bg-black text-white",
    COMPLETED: "bg-zinc-100 text-black border border-zinc-200",
    CANCELLED: "bg-rose-50 text-rose-500 border border-rose-100"
}[status])

onMounted(loadOrders)
</script>

<style scoped>
@import "tailwindcss";

.status-badge {
    @apply px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] inline-block min-w-[100px] text-center;
}

.action-btn {
    @apply p-2.5 rounded-xl border border-zinc-100 text-zinc-300 transition-all duration-300;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

::-webkit-scrollbar {
    width: 5px;
}

::-webkit-scrollbar-thumb {
    @apply bg-zinc-200 rounded-full;
}
</style>