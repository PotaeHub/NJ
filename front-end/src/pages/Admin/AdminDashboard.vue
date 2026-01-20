<template>
    <div class="min-h-screen bg-slate-50 p-6 lg:p-10 space-y-8">

        <!-- HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-slate-800 tracking-tight">Analytics Overview</h1>
                <p class="text-slate-500 font-medium">สรุปข้อมูลสถิติและการเติบโตของแพลตฟอร์ม</p>
            </div>
            <button @click="refreshAll"
                class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                รีเฟรชข้อมูล
            </button>
        </div>

        <!-- ✅ SUMMARY -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="summary-card">
                <p class="label">รายได้รวม</p>
                <p class="value text-emerald-600">
                    ฿ {{ format(summary.revenue) }}
                </p>
            </div>

            <div class="summary-card">
                <p class="label">ผู้ใช้ทั้งหมด</p>
                <p class="value text-indigo-600">
                    {{ format(summary.users) }} คน
                </p>
            </div>

            <div class="summary-card">
                <p class="label">คำสั่งซื้อทั้งหมด</p>
                <p class="value text-rose-600">
                    {{ format(summary.orders) }} รายการ
                </p>
            </div>
        </div>

        <!-- CHARTS -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <section class="chart-card">
                <h2>ยอดขายรายวัน</h2>
                <div class="canvas-container"><canvas ref="dailyChart" /></div>
            </section>

            <section class="chart-card">
                <h2>ยอดขายรายเดือน</h2>
                <div class="canvas-container"><canvas ref="monthlyChart" /></div>
            </section>

            <section class="chart-card">
                <h2>รายได้สะสม</h2>
                <div class="canvas-container"><canvas ref="revenueChart" /></div>
            </section>

            <section class="chart-card">
                <h2>สถานะคำสั่งซื้อ</h2>
                <div class="canvas-container"><canvas ref="orderStatusChart" /></div>
            </section>

            <section class="chart-card">
                <h2>เกมขายดี</h2>
                <div class="canvas-container"><canvas ref="topGamesChart" /></div>
            </section>

            <section class="chart-card">
                <h2>ผู้ขายยอดนิยม</h2>
                <div class="canvas-container"><canvas ref="topSellersChart" /></div>
            </section>

            <section class="chart-card md:col-span-2 xl:col-span-3">
                <h2>ผู้ใช้ใหม่รายวัน</h2>
                <div class="canvas-container !h-64"><canvas ref="newUsersChart" /></div>
            </section>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Chart from 'chart.js/auto'

/* ===== REFS ===== */
const dailyChart = ref()
const monthlyChart = ref()
const revenueChart = ref()
const orderStatusChart = ref()
const topGamesChart = ref()
const topSellersChart = ref()
const newUsersChart = ref()

const summary = ref({
    revenue: 0,
    users: 0,
    orders: 0
})

let charts = []

/* ===== FORMAT ===== */
const format = (n) =>
    new Intl.NumberFormat('th-TH').format(n || 0)

/* ===== CHART HELPER ===== */
const createChart = (el, type, labels, data, color) => {
    const chart = new Chart(el.getContext('2d'), {
        type,
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: color + '33',
                borderColor: color,
                borderWidth: 3,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            }
        }
    })
    charts.push(chart)
}

/* ===== LOAD DASHBOARD (API เดียว) ===== */
const loadAll = async () => {
    charts.forEach(c => c.destroy())
    charts = []

    const { data } = await api.get('/admin/dashboard')

    /* SUMMARY */
    summary.value = data.summary

    const a = data.analytics

    createChart(
        dailyChart.value,
        'line',
        a.dailySales.map(i => i.date),
        a.dailySales.map(i => i.total),
        '#3b82f6'
    )

    createChart(
        monthlyChart.value,
        'bar',
        a.monthlySales.map(i => i.month),
        a.monthlySales.map(i => i.total),
        '#6366f1'
    )

    createChart(
        revenueChart.value,
        'line',
        a.cumulativeRevenue.map(i => i.date),
        a.cumulativeRevenue.map(i => i.total),
        '#10b981'
    )

    createChart(
        orderStatusChart.value,
        'doughnut',
        a.orderStatus.map(i => i.status),
        a.orderStatus.map(i => i.count),
        '#f59e0b'
    )

    createChart(
        topGamesChart.value,
        'bar',
        a.topGames.map(i => i.game),
        a.topGames.map(i => i.total),
        '#ef4444'
    )

    createChart(
        topSellersChart.value,
        'bar',
        a.topSellers.map(i => i.seller),
        a.topSellers.map(i => i.total),
        '#8b5cf6'
    )

    createChart(
        newUsersChart.value,
        'line',
        a.newUsers.map(i => `เดือน ${i.month}`),
        a.newUsers.map(i => i.total),
        '#0ea5e9'
    )
}

const refreshAll = () => loadAll()
onMounted(loadAll)
</script>

<style scoped>
@import "tailwindcss";

.summary-card {
    @apply bg-white rounded-2xl p-6 border border-slate-100 shadow-sm;
}

.label {
    @apply text-sm font-bold text-slate-500;
}

.value {
    @apply text-3xl font-black mt-2;
}

.chart-card {
    @apply bg-white rounded-2xl p-6 shadow-sm;
}

.canvas-container {
    @apply h-[200px];
}
</style>
