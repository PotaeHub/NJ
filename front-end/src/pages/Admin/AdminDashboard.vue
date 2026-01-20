<template>
    <div
        class="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white p-6 lg:p-12 space-y-12">

        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
            <div class="space-y-1">
                <h1 class="text-4xl font-black tracking-tighter uppercase">การวิเคราะห์แพลตฟอร์ม</h1>
                <div class="h-1 w-12 bg-black"></div>
                <p class="text-zinc-400 text-sm font-medium tracking-wide">การเติบโตของแพลตฟอร์มและประสิทธิภาพเชิงกลยุทธ์
ตัวชี้วัด</p>
            </div>
            <button @click="refreshAll"
                class="px-8 py-3 bg-black text-white text-[20px] font-black uppercase  rounded-full hover:bg-zinc-800 transition-all active:scale-95 shadow-xl shadow-black/10">
                รีเฟรช
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="summary-card group">
                <div class="flex justify-between items-start">
                    <p class="label">Total Revenue</p>
                    <div class="w-2 h-2 rounded-full bg-black group-hover:animate-ping"></div>
                </div>
                <p class="value">฿{{ format(summary.revenue) }}</p>
                <div class="mt-4 flex items-center gap-2">
                    <span
                        class="text-[10px] font-black bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-tighter">Gross
                        Income</span>
                </div>
            </div>

            <div class="summary-card group">
                <p class="label">Total Active Users</p>
                <p class="value">{{ format(summary.users) }}</p>
                <div class="mt-4 flex items-center gap-2">
                    <span
                        class="text-[10px] font-black bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-tighter">Verified
                        Accounts</span>
                </div>
            </div>

            <div class="summary-card group">
                <p class="label">Processed Orders</p>
                <p class="value">{{ format(summary.orders) }}</p>
                <div class="mt-4 flex items-center gap-2">
                    <span
                        class="text-[10px] font-black bg-zinc-100 px-2 py-0.5 rounded uppercase tracking-tighter">Successful
                        Trades</span>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            <section class="chart-card">
                <div class="chart-header">
                    <h2>Daily Sales Performance</h2>
                    <span class="dot"></span>
                </div>
                <div class="canvas-container"><canvas ref="dailyChart" /></div>
            </section>

            <section class="chart-card">
                <div class="chart-header">
                    <h2>Monthly Revenue Cycle</h2>
                </div>
                <div class="canvas-container"><canvas ref="monthlyChart" /></div>
            </section>

            <section class="chart-card">
                <div class="chart-header">
                    <h2>Cumulative Growth</h2>
                </div>
                <div class="canvas-container"><canvas ref="revenueChart" /></div>
            </section>

            <section class="chart-card">
                <div class="chart-header">
                    <h2>Order Distribution</h2>
                </div>
                <div class="canvas-container h-[250px]"><canvas ref="orderStatusChart" /></div>
            </section>

            <section class="chart-card">
                <div class="chart-header">
                    <h2>Top Tier Titles</h2>
                </div>
                <div class="canvas-container"><canvas ref="topGamesChart" /></div>
            </section>

            <section class="chart-card">
                <div class="chart-header">
                    <h2>Premium Merchants</h2>
                </div>
                <div class="canvas-container"><canvas ref="topSellersChart" /></div>
            </section>

            <section class="chart-card md:col-span-2 xl:col-span-3">
                <div class="chart-header border-none">
                    <h2 class="text-xl">User Acquisition Timeline</h2>
                    <p class="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Growth analysis over
                        the fiscal year</p>
                </div>
                <div class="canvas-container !h-72 mt-6"><canvas ref="newUsersChart" /></div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import Chart from 'chart.js/auto'

const dailyChart = ref()
const monthlyChart = ref()
const revenueChart = ref()
const orderStatusChart = ref()
const topGamesChart = ref()
const topSellersChart = ref()
const newUsersChart = ref()

const summary = ref({ revenue: 0, users: 0, orders: 0 })
let charts = []

const format = (n) => new Intl.NumberFormat('th-TH').format(n || 0)

/* ปรับแต่ง Chart Config ให้เป็นธีมขาวดำ */
const createChart = (el, type, labels, data, isDoughnut = false) => {
    const ctx = el.getContext('2d');

    // Gradient สำหรับพื้นที่ใต้กราฟเส้น
    let gradient = null;
    if (type === 'line') {
        gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }

    const chart = new Chart(ctx, {
        type,
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: isDoughnut
                    ? ['#000000', '#27272a', '#52525b', '#a1a1aa', '#e4e4e7']
                    : (type === 'bar' ? '#000000' : gradient),
                borderColor: '#000000',
                borderWidth: type === 'bar' ? 0 : 2.5,
                pointBackgroundColor: '#000000',
                pointRadius: 0,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#000',
                    titleFont: { size: 10, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    displayColors: false,
                    cornerRadius: 8
                }
            },
            scales: isDoughnut ? {} : {
                y: {
                    grid: { color: '#f4f4f5', drawBorder: false },
                    ticks: { font: { size: 10, family: 'Inter' }, color: '#a1a1aa' }
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 10, family: 'Inter' }, color: '#a1a1aa' }
                }
            }
        }
    })
    charts.push(chart)
}

const loadAll = async () => {
    charts.forEach(c => c.destroy())
    charts = []

    try {
        const { data } = await api.get('/admin/dashboard')
        summary.value = data.summary
        const a = data.analytics

        createChart(dailyChart.value, 'line', a.dailySales.map(i => i.date), a.dailySales.map(i => i.total))
        createChart(monthlyChart.value, 'bar', a.monthlySales.map(i => i.month), a.monthlySales.map(i => i.total))
        createChart(revenueChart.value, 'line', a.cumulativeRevenue.map(i => i.date), a.cumulativeRevenue.map(i => i.total))
        createChart(orderStatusChart.value, 'doughnut', a.orderStatus.map(i => i.status), a.orderStatus.map(i => i.count), true)
        createChart(topGamesChart.value, 'bar', a.topGames.map(i => i.game), a.topGames.map(i => i.total))
        createChart(topSellersChart.value, 'bar', a.topSellers.map(i => i.seller), a.topSellers.map(i => i.total))
        createChart(newUsersChart.value, 'line', a.newUsers.map(i => `M${i.month}`), a.newUsers.map(i => i.total))
    } catch (e) { console.error(e) }
}

const refreshAll = () => loadAll()
onMounted(loadAll)
</script>

<style scoped>
@import "tailwindcss";

.summary-card {
    @apply bg-white rounded-[2rem] p-8 border border-zinc-100 shadow-[0_10px_30px_-15px_rgba(0, 0, 0, 0.05)] hover:border-black transition-all duration-500;
}

.label {
    @apply text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em];
}

.value {
    @apply text-4xl font-black mt-3 tracking-tighter;
}

.chart-card {
    @apply bg-white rounded-[2.5rem] p-10 border border-zinc-100 shadow-sm transition-all;
}

.chart-header {
    @apply flex items-center justify-between mb-8 pb-4 border-b border-zinc-50;
}

.chart-header h2 {
    @apply text-xs font-black uppercase tracking-widest text-zinc-800;
}

.dot {
    @apply w-1.5 h-1.5 bg-black rounded-full;
}

.canvas-container {
    @apply h-[220px] w-full;
}
</style>