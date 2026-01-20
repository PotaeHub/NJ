<script setup>
import { onMounted, ref } from "vue"
import { Chart } from "chart.js/auto"
import api from "@/services/api"

const canvas = ref(null)
let chartInstance = null

const loadDaily = async () => {
    const res = await api.get("/admin/stats/sales/daily?days=7")

    const labels = res.data.map(d => d.date)
    const values = res.data.map(d => d.total)

    if (chartInstance) chartInstance.destroy()

    chartInstance = new Chart(canvas.value, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Daily Revenue (฿)",
                data: values,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    })
}

onMounted(loadDaily)
</script>

<template>
    <div class="bg-white p-6 rounded-3xl shadow-sm border">
        <h3 class="font-black text-slate-700 mb-4">
            📈 ยอดขายรายวัน (7 วันล่าสุด)
        </h3>
        <canvas ref="canvas" height="120"></canvas>
    </div>
</template>
