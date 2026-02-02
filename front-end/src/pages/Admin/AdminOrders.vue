<template>
    <div class="min-h-screen bg-[#70707013] text-black font-sans p-6 lg:p-12 space-y-12">

        <!-- ================= HEADER ================= -->
        <header
            class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-10">
            <div class="space-y-1">
                <div class="flex items-center gap-4 mb-2">
                    <div class="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue/10">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="2.5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h1 class="text-4xl font-black tracking-tighter text-white uppercase">
                        จัดการคำสั่งซื้อ
                    </h1>
                </div>
                <div class="h-1 w-12 bg-black ml-1"></div>
                <p class="text-zinc-400 text-sm font-medium tracking-wide ml-1 uppercase">
                    ประวัติการทำธุรกรรมและการดำเนินการตามคำสั่งซื้อ
                </p>
            </div>
        </header>

        <!-- ================= TABLE ================= -->
        <div
            class="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-zinc-50 border-b border-zinc-100">
                        <th class="th">Order ID</th>
                        <th class="th">Customer</th>
                        <th class="th text-right">Revenue</th>
                        <th class="th text-center">Status</th>
                        <th class="th text-center">Timestamp</th>
                        <th class="th text-right">Action</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-zinc-100">
                    <tr v-for="order in orders" :key="order.id" class="group hover:bg-zinc-50 transition-colors">

                        <td class="td font-black">
                            #{{ order.id.toString().slice(-6).toUpperCase() }}
                        </td>

                        <td class="td">
                            <div class="flex items-center gap-4">
                                <img :src="getAvatar(order.buyer.avatar)"
                                    class="w-10 h-10 rounded-xl object-cover border border-zinc-200" />
                                <div>
                                    <p class="font-black">{{ order.buyer.username }}</p>
                                    <p class="text-xs text-zinc-400">{{ order.buyer.email }}</p>
                                </div>
                            </div>
                        </td>

                        <td class="td text-right font-black">
                            ฿{{ format(order.totalPrice) }}
                        </td>

                        <td class="td text-center">
                            <span class="status-badge" :class="statusClass(order.status)">
                                {{ statusLabel(order.status) }}
                            </span>
                        </td>

                        <td class="td text-center text-xs text-zinc-400">
                            {{ formatDate(order.createdAt) }}
                        </td>

                        <td class="td text-right">
                            <div class="flex justify-end gap-2">

                                <button class="action-btn hover:bg-zinc-900 hover:text-white"
                                    @click="openDetail(order)">
                                    👁
                                </button>

                                <button v-if="order.status === 'PENDING'"
                                    class="action-btn hover:bg-zinc-900 hover:text-white"
                                    @click="approvePayment(order.id)">
                                    ✔
                                </button>

                                <button v-if="order.status === 'PAID'"
                                    class="action-btn hover:bg-emerald-600 hover:text-white"
                                    @click="complete(order.id)">
                                    ✓✓
                                </button>

                                <button v-if="order.status !== 'COMPLETED' && order.status !== 'CANCELLED'"
                                    class="action-btn hover:bg-rose-500 hover:text-white" @click="cancel(order.id)">
                                    ✖
                                </button>

                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- ================= MODAL ================= -->
        <Transition name="fade">
            <div v-if="selectedOrder"
                class="fixed inset-0 bg-white/70 backdrop-blur-md flex items-center justify-center z-50"
                @click.self="selectedOrder = null">

                <div class="bg-white rounded-3xl w-full max-w-2xl p-8 space-y-6
                           border border-zinc-200 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.18)]">

                    <header class="flex justify-between items-center">
                        <h2 class="text-xl font-black">
                            Order #{{ selectedOrder.id }}
                        </h2>
                        <button class="text-zinc-400 hover:text-black" @click="selectedOrder = null">
                            ✕
                        </button>
                    </header>

                    <div>
                        <span class="status-badge" :class="statusClass(selectedOrder.status)">
                            {{ statusLabel(selectedOrder.status) }}
                        </span>
                    </div>

                    <div v-for="item in selectedOrder.items" :key="item.id" class="flex justify-between text-sm">
                        <span>{{ item.game.title }} x{{ item.quantity }}</span>
                        <span class="font-black">
                            ฿{{ format(item.price * item.quantity) }}
                        </span>
                    </div>

                    <div class="text-right text-2xl font-black pt-4 border-t">
                        ฿{{ format(selectedOrder.totalPrice) }}
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

/* ================= API ================= */
const loadOrders = async () => {
    const { data } = await api.get("/admin/orders")
    orders.value = data
}

const complete = async (id) => {
    if (!confirm("Complete this order?")) return
    await api.patch(`/admin/orders/${id}/complete`)
    loadOrders()
}

const cancel = async (id) => {
    if (!confirm("Cancel this order?")) return
    await api.patch(`/admin/orders/${id}/cancel`)
    loadOrders()
}

const approvePayment = async (id) => {
    if (!confirm("ยืนยันการอนุมัติการชำระเงิน?")) return
    await api.patch(`/admin/orders/${id}/status`, { status: "PAID" })
    loadOrders()
}

/* ================= HELPERS ================= */
const openDetail = (order) => selectedOrder.value = order

const getAvatar = (avatar) =>
    avatar?.startsWith("http") ? avatar : `${BASE_URL}${avatar || "/default-avatar.png"}`

const format = (n) => new Intl.NumberFormat("th-TH").format(n || 0)

const formatDate = (d) =>
    new Date(d).toLocaleDateString("th-TH", { dateStyle: "medium" })

/* ================= STATUS ================= */
const statusLabel = (s) => ({
    PENDING: "รอการตรวจสอบ",
    PAID: "ชำระเงินแล้ว",
    COMPLETED: "สำเร็จ",
    CANCELLED: "ยกเลิก"
}[s])

const statusClass = (s) => ({
    PENDING: "bg-zinc-100 text-zinc-600",
    PAID: "bg-zinc-900 text-white",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    CANCELLED: "bg-rose-100 text-rose-600"
}[s])

onMounted(loadOrders)
</script>

<style scoped>
@import "tailwindcss";

.th {
    @apply px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400;
}

.td {
    @apply px-8 py-5;
}

.status-badge {
    @apply px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest;
}

.action-btn {
    @apply px-3 py-2 rounded-xl border border-zinc-200 text-sm text-zinc-600;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .25s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
