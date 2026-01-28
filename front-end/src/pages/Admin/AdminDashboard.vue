<template>
    <div class="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white p-6 lg:p-12">

        <!-- Header Section -->
        <div class="max-w-7xl mx-auto space-y-12">
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-100 pb-10">
                <div class="space-y-3">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
                        <div class="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                        <span class="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">System Live
                            Analysis</span>
                    </div>
                    <h1 class="text-5xl font-black tracking-tight uppercase leading-none">การวิเคราะห์<br /><span
                            class="text-zinc-400">แพลตฟอร์ม</span></h1>
                    <p class="text-zinc-400 text-sm font-medium tracking-wide max-w-md">
                        ตรวจสอบประสิทธิภาพเชิงกลยุทธ์และการเติบโตของระบบแบบ Real-time</p>
                </div>
                <button @click="refreshAll"
                    class="group flex items-center gap-3 px-8 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-800 transition-all active:scale-95 shadow-2xl shadow-black/10">
                    <span>รีเฟรชข้อมูล</span>
                    <span class="group-hover:rotate-180 transition-transform duration-500 text-lg">↻</span>
                </button>
            </header>

            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="summary-card group">
                    <div class="flex justify-between items-start mb-6">
                        <div
                            class="p-3 bg-zinc-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic group-hover:text-black">Revenue</span>
                    </div>
                    <p class="label">รายได้รวม</p>
                    <p class="value italic">฿{{ format(summary.revenue) }}</p>
                </div>

                <div class="summary-card group">
                    <div class="flex justify-between items-start mb-6">
                        <div
                            class="p-3 bg-zinc-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span
                            class="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic group-hover:text-black">Users</span>
                    </div>
                    <p class="label">ผู้ใช้งานทั้งหมด</p>
                    <p class="value italic">{{ format(summary.users) }} <span
                            class="text-sm text-zinc-400 font-medium tracking-normal">Account</span></p>
                </div>

                <div class="summary-card group">
                    <div class="flex justify-between items-start mb-6">
                        <div
                            class="p-3 bg-zinc-50 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <span
                            class="text-[10px] font-black text-zinc-300 uppercase tracking-widest italic group-hover:text-black">Orders</span>
                    </div>
                    <p class="label">ออเดอร์ทั้งหมด</p>
                    <p class="value italic">{{ format(summary.orders) }} <span
                            class="text-sm text-zinc-400 font-medium tracking-normal">Trades</span></p>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Doughnut Chart (Smaller Span) -->
                <section class="chart-card lg:col-span-4">
                    <div class="chart-header">
                        <h2>การกระจายคำสั่งซื้อ</h2>
                        <div class="w-2 h-2 rounded-full bg-zinc-200"></div>
                    </div>
                    <div class="canvas-container !h-[280px]"><canvas ref="orderStatusChart" /></div>
                </section>

                <!-- Bar Charts (Larger Span) -->
                <section class="chart-card lg:col-span-8">
                    <div class="chart-header">
                        <h2>ชื่อเกมระดับท็อป (ยอดขายสูงสุด)</h2>
                        <span class="text-[10px] font-bold text-zinc-400">RANKING</span>
                    </div>
                    <div class="canvas-container !h-[280px]"><canvas ref="topGamesChart" /></div>
                </section>

                <section class="chart-card lg:col-span-12">
                    <div class="chart-header">
                        <h2>พ่อค้าระดับพรีเมียมที่มีประสิทธิภาพสูงสุด</h2>
                        <div class="flex gap-2">
                            <div class="w-8 h-1 bg-black"></div>
                            <div class="w-8 h-1 bg-zinc-100"></div>
                        </div>
                    </div>
                    <div class="canvas-container !h-[320px]"><canvas ref="topSellersChart" /></div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.label {
    @apply text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-1;
}

.value {
    @apply text-4xl font-black tracking-tighter text-black;
}

.chart-header {
    @apply flex justify-between items-center mb-10;
}

.chart-header h2 {
    @apply text-xs font-black uppercase tracking-[0.2em] text-zinc-800;
}

.canvas-container {
    @apply w-full;
}
</style>


<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Chart from 'chart.js/auto'

/* =========================
   REFS
========================= */
const orderStatusChart = ref()
const topGamesChart = ref()
const topSellersChart = ref()

const summary = ref({ revenue: 0, users: 0, orders: 0 })
let charts = []

/* =========================
   UTILS
========================= */
const format = (n) => new Intl.NumberFormat('th-TH').format(n || 0)

/* =========================
   COLOR PALETTES
========================= */
const palette = {
    primary: '#6366f1',   // indigo
    success: '#22c55e',   // green
    warning: '#f59e0b',   // amber
    danger: '#ef4444',    // red
    info: '#0ea5e9',      // sky
    dark: '#020617',
    gray: '#94a3b8'
}

const doughnutColors = [
    palette.primary,
    palette.success,
    palette.warning,
    palette.danger,
    palette.info
]

/* =========================
   CHART FACTORY
========================= */
const createChart = (el, type, labels, data, isDoughnut = false) => {
    if (!el) return
    const ctx = el.getContext('2d')

    const chart = new Chart(ctx, {
        type,
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: isDoughnut ? doughnutColors : palette.primary,
                borderColor: '#ffffff',
                borderWidth: isDoughnut ? 2 : 0,
                borderRadius: type === 'bar' ? 12 : 0,
                hoverBackgroundColor: palette.info,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: isDoughnut,
                    position: 'bottom',
                    labels: {
                        boxWidth: 10,
                        padding: 20,
                        color: palette.dark,
                        font: {
                            size: 11,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#020617',
                    titleColor: '#fff',
                    bodyColor: '#e5e7eb',
                    padding: 12,
                    cornerRadius: 12
                }
            },
            scales: isDoughnut ? {} : {
                y: {
                    grid: {
                        color: '#f1f5f9',
                        drawBorder: false
                    },
                    ticks: {
                        color: palette.gray,
                        font: { size: 11, weight: 'bold' }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        color: palette.gray,
                        font: { size: 11, weight: 'bold' }
                    }
                }
            }
        }
    })

    charts.push(chart)
}

/* =========================
   LOAD DATA
========================= */
const loadAll = async () => {
    charts.forEach(c => c.destroy())
    charts = []

    try {
        const { data } = await api.get('/admin/dashboard')

        summary.value = data.summary
        const a = data.analytics

        createChart(
            orderStatusChart.value,
            'doughnut',
            a.orderStatus.map(i => i.status),
            a.orderStatus.map(i => i.count),
            true
        )

        createChart(
            topGamesChart.value,
            'bar',
            a.topGames.map(i => i.game),
            a.topGames.map(i => i.total)
        )

        createChart(
            topSellersChart.value,
            'bar',
            a.topSellers.map(i => i.seller),
            a.topSellers.map(i => i.total)
        )

    } catch (e) {
        console.error(e)
    }
}

/* =========================
   ACTIONS
========================= */
const refreshAll = () => loadAll()

onMounted(loadAll)
</script>
