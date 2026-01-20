<script setup>
import { ref, onMounted } from "vue"
import api from "@/services/api"
import GameFormModal from "@/components/admin/GameFormModal.vue"
import DeleteConfirmModal from "../../components/admin/users/DeleteConfirmModal.vue"
import { Plus, LayoutGrid, Trash2, Edit3, Image as ImageIcon } from 'lucide-vue-next'

const games = ref([])
const loading = ref(false)
const BACKEND_URL = import.meta.env.VITE_BACKEND

const showModal = ref(false)
const showDeletePopup = ref(false)
const selectedGame = ref(null)

const loadGames = async () => {
    loading.value = true
    try {
        const res = await api.get("/admin/games")
        games.value = res.data
    } catch (err) {
        console.error(err)
    } finally {
        loading.value = false
    }
}

const openCreate = () => {
    selectedGame.value = null
    showModal.value = true
}

const openEdit = (game) => {
    selectedGame.value = game
    showModal.value = true
}

const handleDeleteClick = (game) => {
    selectedGame.value = game
    showDeletePopup.value = true
}

const onConfirmDelete = async () => {
    if (!selectedGame.value) return
    try {
        await api.delete(`/admin/games/${selectedGame.value.id}`)
        showDeletePopup.value = false
        loadGames()
    } catch (err) {
        console.error(err)
        alert("Delete failed")
    }
}

onMounted(loadGames)
</script>

<template>
    <div
        class="min-h-screen bg-[#FDFDFD] text-black font-sans selection:bg-black selection:text-white p-6 lg:p-12 space-y-12">

        <header
            class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-10">
            <div class="space-y-1">
                <div class="flex items-center gap-4 mb-2">
                    <div class="p-3 bg-black text-white rounded-2xl shadow-xl shadow-black/10">
                        <LayoutGrid :size="28" stroke-width="2.5" />
                    </div>
                    <h1 class="text-4xl font-black tracking-tighter uppercase">Inventory</h1>
                </div>
                <div class="h-1 w-12 bg-black ml-1"></div>
                <p class="text-zinc-400 text-sm font-medium tracking-wide ml-1 uppercase">Asset & Stock Distribution
                    Center</p>
            </div>

            <button @click="openCreate"
                class="group flex items-center gap-3 bg-black text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-black/20 transition-all active:scale-95 hover:bg-zinc-800 tracking-widest text-[10px] uppercase">
                <Plus class="h-4 w-4 transition-transform group-hover:rotate-90" stroke-width="3" />
                Register New Asset
            </button>
        </header>

        <div
            class="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden relative">

            <Transition name="fade">
                <div v-if="loading"
                    class="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex items-center justify-center">
                    <div class="flex flex-col items-center gap-4">
                        <div class="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin">
                        </div>
                        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-black">Syncing
                            Database</span>
                    </div>
                </div>
            </Transition>

            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-zinc-50/50 border-b border-zinc-100">
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Media
                            </th>
                            <th class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                Identity</th>
                            <th
                                class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                                Valuation</th>
                            <th
                                class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                                Stock</th>
                            <th
                                class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center">
                                Status</th>
                            <th
                                class="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                                Commands</th>
                        </tr>
                    </thead>

                    <tbody class="divide-y divide-zinc-50">
                        <tr v-for="g in games" :key="g.id"
                            class="group hover:bg-zinc-50/50 transition-all duration-300">

                            <td class="px-8 py-6">
                                <div v-if="g.gameMedias?.length"
                                    class="flex -space-x-3 group-hover:space-x-1 transition-all duration-500">
                                    <div v-for="(img, idx) in g.gameMedias.filter(m => m.type === 'IMAGE').slice(0, 3)"
                                        :key="img.id" class="relative" :style="{ zIndex: 10 - idx }">
                                        <img :src="BACKEND_URL + img.url"
                                            class="w-14 h-14 object-cover rounded-xl border-2 border-white shadow-md ring-1 ring-zinc-100 group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div v-if="g.gameMedias.length > 3"
                                        class="w-14 h-14 rounded-xl bg-black border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-md">
                                        +{{ g.gameMedias.length - 3 }}
                                    </div>
                                </div>
                                <div v-else
                                    class="w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300">
                                    <ImageIcon :size="20" />
                                </div>
                            </td>

                            <td class="px-8 py-6">
                                <div class="flex flex-col">
                                    <span
                                        class="text-base font-black tracking-tight text-zinc-800 group-hover:text-black transition-colors">
                                        {{ g.title }}
                                    </span>
                                    <span
                                        class="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest leading-none">
                                        SKU-{{ g.id.toString().slice(-6).toUpperCase() }}
                                    </span>
                                </div>
                            </td>

                            <td class="px-8 py-6 text-center">
                                <span class="text-sm font-black tracking-tighter">
                                    ฿{{ g.price.toLocaleString() }}
                                </span>
                            </td>

                            <td class="px-8 py-6 text-center">
                                <div class="flex flex-col items-center">
                                    <span :class="g.stock <= 5 ? 'text-red-500 font-black' : 'text-zinc-600 font-bold'"
                                        class="text-sm leading-none">
                                        {{ g.stock }}
                                    </span>
                                    <span
                                        class="text-[8px] font-black uppercase tracking-widest text-zinc-300 mt-1">Units
                                        Available</span>
                                </div>
                            </td>

                            <td class="px-8 py-6 text-center">
                                <span :class="{
                                    'bg-black text-white border-black': g.status === 'PUBLISHED',
                                    'bg-white text-zinc-400 border-zinc-200': g.status === 'DRAFT',
                                    'bg-zinc-100 text-zinc-800 border-zinc-300': g.status === 'SOLD'
                                }"
                                    class="px-3 py-1.5 rounded-lg text-[9px] font-black border uppercase tracking-[0.15em] inline-block min-w-[90px]">
                                    {{ g.status }}
                                </span>
                            </td>

                            <td class="px-8 py-6 text-right">
                                <div class="flex justify-end gap-4">
                                    <button @click="openEdit(g)"
                                        class="p-2 text-zinc-300 hover:text-black transition-colors"
                                        title="Modify Asset">
                                        <Edit3 :size="18" stroke-width="2.5" />
                                    </button>
                                    <button @click="handleDeleteClick(g)"
                                        class="p-2 text-zinc-200 hover:text-red-500 transition-colors"
                                        title="Decommission">
                                        <Trash2 :size="18" stroke-width="2.5" />
                                    </button>
                                </div>
                            </td>
                        </tr>

                        <tr v-if="games.length === 0 && !loading">
                            <td colspan="6" class="px-8 py-32 text-center">
                                <div class="flex flex-col items-center">
                                    <div
                                        class="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                                        <LayoutGrid :size="32" class="text-zinc-200" />
                                    </div>
                                    <p class="font-black text-zinc-300 uppercase tracking-[0.3em] text-[10px]">Vault is
                                        currently empty</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <DeleteConfirmModal :show="showDeletePopup" :itemName="selectedGame?.title" @close="showDeletePopup = false"
            @confirm="onConfirmDelete" />
        <GameFormModal :show="showModal" :game="selectedGame" @close="showModal = false" @success="loadGames" />
    </div>
</template>

<style scoped>
@import "tailwindcss";

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Custom Scrollbar สำหรับ Table */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #e4e4e7;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #18181b;
}
</style>