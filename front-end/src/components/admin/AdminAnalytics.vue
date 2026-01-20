<script setup>
import { onMounted, onBeforeUnmount } from "vue"
import api from "@/services/api"
import { Chart } from "chart.js/auto"

const charts = []

const createChart = async ({
    canvasId,
    type,
    url,
    labelKey,
    valueKey,
    title
}) => {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const res = await api.get(url)

    const chart = new Chart(canvas, {
        type,
        data: {
            labels: res.data.map(i => i[labelKey]),
            datasets: [{
                label: title,
                data: res.data.map(i => i[valueKey]),
                tension: 0.4,
                fill: true,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: type !== "pie"
                ? {
                    y: {
                        ticks: {
                            callback: v => `฿${v.toLocaleString()}`
                        }
                    }
                }
                : {}
        }
    })

    charts.push(chart)
}

onMounted(async () => {
    await createChart({
        canvasId: "dailyChart",
        type: "line",
        url: "/admin/stats/sales/daily?days=7",
        labelKey: "date",
        valueKey: "total",
        title: "Daily Revenue"
    })

    await createChart({
        canvasId: "monthlyChart",
        type: "bar",
        url: "/admin/stats/sales/monthly",
        labelKey: "month",
        valueKey: "total",
        title: "Monthly Revenue"
    })

    await createChart({
        canvasId: "topGamesChart",
        type: "bar",
        url: "/admin/stats/sales/games",
        labelKey: "title",
        valueKey: "sold",
        title: "Top Games"
    })

    await createChart({
        canvasId: "orderStatusChart",
        type: "pie",
        url: "/admin/stats/orders/status",
        labelKey: "status",
        valueKey: "_count",
        title: "Order Status"
    })
})

onBeforeUnmount(() => {
    charts.forEach(c => c.destroy())
})
</script>

<template>
    <section class="mt-12 space-y-8">

        <h2 class="text-xl font-black text-slate-700">
            Analytics Overview
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <!-- DAILY -->
            <div class="chart-card">
                <h3>Daily Revenue (7 Days)</h3>
                <div class="chart-box">
                    <canvas id="dailyChart"></canvas>
                </div>
            </div>

            <!-- MONTHLY -->
            <div class="chart-card">
                <h3>Monthly Revenue</h3>
                <div class="chart-box">
                    <canvas id="monthlyChart"></canvas>
                </div>
            </div>

            <!-- TOP GAMES -->
            <div class="chart-card">
                <h3>Top Selling Games</h3>
                <div class="chart-box">
                    <canvas id="topGamesChart"></canvas>
                </div>
            </div>

            <!-- ORDER STATUS -->
            <div class="chart-card">
                <h3>Order Status</h3>
                <div class="chart-box">
                    <canvas id="orderStatusChart"></canvas>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
@import "tailwindcss";

.chart-card {
    background: white;
    padding: 2rem;
    border-radius: 2rem;
    border: 1px solid #f1f5f9;
    box-shadow: 0 8px 30px rgba(0, 0, 0, .04);
}

.chart-card h3 {
    font-size: 0.85rem;
    font-weight: 900;
    color: #475569;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
}

.chart-box {
    height: 280px;
}
</style>
