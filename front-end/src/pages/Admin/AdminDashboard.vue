<template>
    <div
        class="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 p-6 lg:p-12 relative overflow-hidden">

        <div
            class="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none">
        </div>
        <div
            class="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none">
        </div>

        <div class="max-w-7xl mx-auto space-y-12 relative z-10">
            <header class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
                <div class="space-y-4">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <div class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
                        <span class="text-[9px] font-black uppercase tracking-[0.2em] text-blue-400">Live Neural
                            Analysis</span>
                    </div>
                    <h1 class="text-6xl font-black tracking-tighter uppercase italic leading-none">
                        DATA <span class="text-blue-500">INSIGHTS</span>
                    </h1>
                    <p class="text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase max-w-md italic">
                        Strategic performance and real-time ecosystem growth
                    </p>
                </div>

                <button @click="refreshAll"
                    class="group flex items-center gap-4 px-10 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]">
                    <span>Synchronize Data</span>
                    <RefreshCw class="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                </button>
            </header>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="summary-card group relative overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-8">
                            <div
                                class="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-all">
                                <DollarSign class="w-5 h-5 text-blue-500" />
                            </div>
                            <TrendingUp class="w-4 h-4 text-emerald-500 opacity-50" />
                        </div>
                        <p class="label">Gross Revenue</p>
                        <p class="value italic text-white group-hover:text-blue-400 transition-colors">฿{{
                            format(summary.revenue) }}</p>
                    </div>
                </div>

                <div class="summary-card group relative overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-8">
                            <div
                                class="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-indigo-500/50 transition-all">
                                <Users class="w-5 h-5 text-indigo-500" />
                            </div>
                            <Activity class="w-4 h-4 text-blue-500 opacity-50" />
                        </div>
                        <p class="label">Network Citizens</p>
                        <p class="value italic text-white">{{ format(summary.users) }} <span
                                class="text-sm text-zinc-600 font-bold uppercase tracking-widest">Units</span></p>
                    </div>
                </div>

                <div class="summary-card group relative overflow-hidden">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                    <div class="relative z-10">
                        <div class="flex justify-between items-center mb-8">
                            <div
                                class="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-purple-500/50 transition-all">
                                <ShoppingBag class="w-5 h-5 text-purple-500" />
                            </div>
                            <Zap class="w-4 h-4 text-amber-500 opacity-50" />
                        </div>
                        <p class="label">Trade Operations</p>
                        <p class="value italic text-white">{{ format(summary.orders) }} <span
                                class="text-sm text-zinc-600 font-bold uppercase tracking-widest">Logs</span></p>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <section class="chart-card lg:col-span-4 group hover:border-blue-500/30 transition-all">
                    <div class="chart-header">
                        <div class="flex items-center gap-3">
                            <PieChart class="w-4 h-4 text-blue-500" />
                            <h2>Order Distribution</h2>
                        </div>
                    </div>
                    <div class="canvas-container h-[300px] mt-4"><canvas ref="orderStatusChart" /></div>
                </section>

                <section class="chart-card lg:col-span-8 group hover:border-blue-500/30 transition-all">
                    <div class="chart-header">
                        <div class="flex items-center gap-3">
                            <BarChart3 class="w-4 h-4 text-blue-500" />
                            <h2>Top Performing Assets (Sales)</h2>
                        </div>
                        <span
                            class="text-[9px] font-black text-zinc-600 uppercase tracking-widest border border-white/5 px-2 py-1 rounded-md">Realtime
                            Ranking</span>
                    </div>
                    <div class="canvas-container h-[300px] mt-4"><canvas ref="topGamesChart" /></div>
                </section>

                <section class="chart-card lg:col-span-12 group hover:border-blue-500/30 transition-all">
                    <div class="chart-header">
                        <div class="flex items-center gap-3">
                            <ShieldCheck class="w-4 h-4 text-blue-500" />
                            <h2>Elite Merchant Efficiency</h2>
                        </div>
                        <div class="flex gap-1">
                            <div class="w-12 h-1 bg-blue-600 rounded-full"></div>
                            <div class="w-4 h-1 bg-white/10 rounded-full"></div>
                        </div>
                    </div>
                    <div class="canvas-container h-[350px] mt-4"><canvas ref="topSellersChart" /></div>
                </section>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.summary-card {
    @apply bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] transition-all duration-500;
}

.chart-card {
    @apply bg-[#0a0a0b] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl;
}

.label {
    @apply text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mb-2 italic;
}

.value {
    @apply text-5xl font-black tracking-tighter;
}

.chart-header {
    @apply flex justify-between items-center mb-6;
}

.chart-header h2 {
    @apply text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 italic;
}

.canvas-container {
    @apply w-full relative;
}
</style>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Chart from 'chart.js/auto'
import {
    RefreshCw, DollarSign, Users, ShoppingBag,
    TrendingUp, Activity, Zap, PieChart, BarChart3, ShieldCheck
} from 'lucide-vue-next'

/* =========================
   REFS & CONFIG
========================= */
const orderStatusChart = ref()
const topGamesChart = ref()
const topSellersChart = ref()

const summary = ref({ revenue: 0, users: 0, orders: 0 })
let charts = []

const format = (n) => new Intl.NumberFormat('th-TH').format(n || 0)

const palette = {
    primary: '#3b82f6',   // Blue
    accent: '#6366f1',    // Indigo
    glow: 'rgba(59, 130, 246, 0.5)',
    dark: '#050505'
}

/* =========================
   CHART FACTORY
========================= */
const createChart = (el, type, labels, data, isDoughnut = false) => {
    if (!el) return
    const ctx = el.getContext('2d')

    // Create Gradient for Bars
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(59, 130, 246, 1)')
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)')

    const chart = new Chart(ctx, {
        type,
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: isDoughnut ?
                    ['#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#f43f5e'] : gradient,
                borderColor: isDoughnut ? '#0a0a0b' : '#3b82f6',
                borderWidth: isDoughnut ? 5 : 2,
                borderRadius: type === 'bar' ? 15 : 0,
                hoverBackgroundColor: '#ffffff',
                tension: 0.4,
                fill: true
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
                        boxWidth: 8,
                        usePointStyle: true,
                        padding: 25,
                        color: '#71717a',
                        font: { size: 9, weight: '900', family: 'Inter' }
                    }
                },
                tooltip: {
                    backgroundColor: '#111',
                    padding: 15,
                    titleFont: { size: 12, weight: 'bold' },
                    cornerRadius: 15,
                    displayColors: false
                }
            },
            scales: isDoughnut ? {} : {
                y: {
                    grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                    ticks: { color: '#52525b', font: { size: 10, weight: 'bold' } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#52525b', font: { size: 9, weight: '900' } }
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
            a.orderStatus.map(i => i.status.toUpperCase()),
            a.orderStatus.map(i => i.count),
            true
        )

        createChart(
            topGamesChart.value,
            'bar',
            a.topGames.map(i => i.game.toUpperCase()),
            a.topGames.map(i => i.total)
        )

        createChart(
            topSellersChart.value,
            'bar',
            a.topSellers.map(i => i.seller.toUpperCase()),
            a.topSellers.map(i => i.total)
        )
    } catch (e) {
        console.error(e)
    }
}

const refreshAll = () => loadAll()
onMounted(loadAll)
</script>