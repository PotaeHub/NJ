<template>
    <div class="p-6 space-y-6 bg-slate-50 min-h-screen">

        <!-- HEADER -->
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-black text-slate-800">📦 Admin Orders</h1>
        </div>

        <!-- TABLE -->
        <div class="bg-white rounded-xl shadow overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-slate-100 text-slate-600">
                    <tr>
                        <th class="px-4 py-3 text-left">#</th>
                        <th class="px-4 py-3 text-left">ผู้ซื้อ</th>
                        <th class="px-4 py-3 text-right">ยอดรวม</th>
                        <th class="px-4 py-3 text-center">สถานะ</th>
                        <th class="px-4 py-3 text-center">วันที่</th>
                        <th class="px-4 py-3 text-center">จัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="order in orders" :key="order.id" class="border-t hover:bg-slate-50 transition">
                        <td class="px-4 py-3 font-bold">#{{ order.id }}</td>

                        <!-- BUYER + AVATAR -->
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <img :src="getAvatar(order.buyer.avatar)"
                                    class="w-9 h-9 rounded-full object-cover border" />
                                <span class="font-semibold">
                                    {{ order.buyer.username }}
                                </span>
                            </div>
                        </td>

                        <td class="px-4 py-3 text-right">
                            ฿ {{ format(order.totalPrice) }}
                        </td>

                        <td class="px-4 py-3 text-center">
                            <span :class="statusClass(order.status)">
                                {{ order.status }}
                            </span>
                        </td>

                        <td class="px-4 py-3 text-center">
                            {{ formatDate(order.createdAt) }}
                        </td>

                        <td class="px-4 py-3 text-center space-x-2">
                            <button @click="openDetail(order)" class="btn-blue">
                                ดู
                            </button>

                            <button v-if="order.status === 'PAID'" @click="complete(order.id)" class="btn-green">
                                Complete
                            </button>

                            <button v-if="order.status !== 'COMPLETED'" @click="cancel(order.id)" class="btn-red">
                                Cancel
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- MODAL -->
        <div v-if="selectedOrder" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div class="bg-white rounded-xl w-full max-w-2xl p-6 space-y-4">

                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-black">
                        Order #{{ selectedOrder.id }}
                    </h2>
                    <button @click="selectedOrder = null" class="text-slate-500 hover:text-black">
                        ✕
                    </button>
                </div>

                <!-- BUYER INFO -->
                <div class="flex items-center gap-4">
                    <img :src="getAvatar(selectedOrder.buyer.avatar)"
                        class="w-14 h-14 rounded-full object-cover border" />
                    <div>
                        <p class="font-bold text-lg">
                            {{ selectedOrder.buyer.username }}
                        </p>
                        <p class="text-sm text-slate-500">
                            ผู้ซื้อ
                        </p>
                    </div>
                </div>

                <p>
                    <b>สถานะ:</b>
                    <span :class="statusClass(selectedOrder.status)" class="ml-2">
                        {{ selectedOrder.status }}
                    </span>
                </p>

                <!-- ITEMS -->
                <table class="w-full text-sm mt-4">
                    <thead class="bg-slate-100">
                        <tr>
                            <th class="px-3 py-2 text-left">เกม</th>
                            <th class="px-3 py-2 text-center">จำนวน</th>
                            <th class="px-3 py-2 text-right">ราคา</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in selectedOrder.items" :key="item.id" class="border-t">
                            <td class="px-3 py-2">
                                {{ item.game.title }}
                            </td>
                            <td class="px-3 py-2 text-center">
                                {{ item.quantity }}
                            </td>
                            <td class="px-3 py-2 text-right">
                                ฿ {{ format(item.price * item.quantity) }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="text-right font-black text-lg">
                    รวม: ฿ {{ format(selectedOrder.totalPrice) }}
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"

const BASE_URL = import.meta.env.VITE_BACKEND || ""

/* STATE */
const orders = ref([])
const selectedOrder = ref(null)

/* LOAD */
const loadOrders = async () => {
    const { data } = await api.get("/admin/orders")
    orders.value = data
}

/* ACTIONS */
const openDetail = (order) => {
    selectedOrder.value = order
}

const complete = async (id) => {
    if (!confirm("ยืนยัน Complete Order ?")) return
    await api.patch(`/admin/orders/${id}/complete`)
    loadOrders()
}

const cancel = async (id) => {
    if (!confirm("ยกเลิก Order ?")) return
    await api.patch(`/admin/orders/${id}/cancel`)
    loadOrders()
}

/* HELPERS */
const getAvatar = (avatar) => {
    if (!avatar) return "/default-avatar.png"

    if (avatar.startsWith("http")) return avatar

    return `${BASE_URL}${avatar}`
}

const format = (n) =>
    new Intl.NumberFormat("th-TH").format(n || 0)

const formatDate = (d) =>
    new Date(d).toLocaleDateString("th-TH")

const statusClass = (status) => ({
    PENDING: "badge-gray",
    PAID: "badge-blue",
    COMPLETED: "badge-green",
    CANCELLED: "badge-red"
}[status])

onMounted(loadOrders)
</script>

<style scoped>
@import "tailwindcss";

.btn-blue {
    @apply px-3 py-1 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600;
}

.btn-green {
    @apply px-3 py-1 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600;
}

.btn-red {
    @apply px-3 py-1 rounded-lg bg-rose-500 text-white text-xs font-bold hover:bg-rose-600;
}

.badge-gray {
    @apply px-2 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold;
}

.badge-blue {
    @apply px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold;
}

.badge-green {
    @apply px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold;
}

.badge-red {
    @apply px-2 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold;
}
</style>
