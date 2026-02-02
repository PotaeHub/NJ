<script setup>
import { onMounted, ref } from 'vue'
import api from '@/services/api'
import * as Icons from 'lucide-vue-next'

/* ================= STATE ================= */
const categories = ref([])
const showModal = ref(false)
const showDeleteModal = ref(false)
const errorMessage = ref('')
const isEdit = ref(false)
const editId = ref(null)
const deleteTarget = ref(null)

const form = ref({
    name: '',
})

/* ================= API ================= */
const fetchCategories = async () => {
    try {
        const res = await api.get('/admin/category')
        categories.value = res.data.data
    } catch (e) {
        console.error(e)
    }
}

const submitCategory = async () => {
    errorMessage.value = ''
    if (!form.value.name.trim()) {
        errorMessage.value = 'กรุณาระบุชื่อหมวดหมู่'
        return
    }

    try {
        if (isEdit.value) {
            await api.put(`/admin/category/${editId.value}`, form.value)
        } else {
            await api.post('/admin/category', form.value)
        }
        closeModal()
        fetchCategories()
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'เกิดข้อผิดพลาด'
    }
}

/* ================= MODAL ================= */
const openModal = () => {
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    errorMessage.value = ''
    isEdit.value = false
    editId.value = null
    form.value = { name: '' }
}

const openEditModal = (cat) => {
    isEdit.value = true
    editId.value = cat.id
    form.value = { name: cat.name }
    showModal.value = true
}

/* ================= DELETE ================= */
const openDeleteModal = (cat) => {
    deleteTarget.value = cat
    showDeleteModal.value = true
}

const closeDeleteModal = () => {
    showDeleteModal.value = false
    deleteTarget.value = null
}

const confirmDelete = async () => {
    try {
        await api.delete(`/admin/category/${deleteTarget.value.id}`)
        closeDeleteModal()
        fetchCategories()
    } catch (error) {
        alert('ลบไม่สำเร็จ')
    }
}

onMounted(fetchCategories)
</script>

<template>
    <div class="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 pb-20 relative overflow-hidden">

        <div
            class="fixed top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none">
        </div>
        <div
            class="fixed bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none">
        </div>

        <div class="max-w-5xl mx-auto px-6 pt-32 relative z-10">
            <header class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                <div class="space-y-2">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                            <Icons.LayoutGrid class="w-4 h-4 text-blue-500" />
                        </div>
                        <span class="text-[9px] font-black text-blue-500 uppercase tracking-[0.5em] italic">System
                            Architecture</span>
                    </div>
                    <h1 class="text-6xl font-black italic uppercase tracking-tighter leading-none">
                        GENRE <span
                            class="text-blue-500 underline decoration-blue-500/20 underline-offset-8">VAULT</span>
                    </h1>
                    <p
                        class="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-6 flex items-center gap-3">
                        Total Registered Segments <span class="w-8 h-[1px] bg-zinc-800"></span>
                        <span class="text-white">{{ categories.length.toString().padStart(2, '0') }}</span>
                    </p>
                </div>

                <button @click="openModal"
                    class="group relative flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-500 hover:text-white active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.1)]">
                    <span>Initialize New Segment</span>
                    <Icons.Plus class="w-4 h-4 transition-transform group-hover:rotate-90" />
                </button>
            </header>

            <div class="relative group">
                <div
                    class="absolute -inset-[1px] bg-gradient-to-b from-white/10 to-transparent rounded-[2.5rem] pointer-events-none">
                </div>

                <div
                    class="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0a0a0b]/60 backdrop-blur-3xl shadow-2xl">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-white/5 bg-white/[0.01]">
                                <th
                                    class="px-10 py-8 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">
                                    Segment Identity</th>
                                <th
                                    class="px-10 py-8 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600 italic text-right">
                                    System Control</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-white/[0.03]">
                            <tr v-for="cat in categories" :key="cat.id"
                                class="group/row hover:bg-white/[0.02] transition-all duration-500">
                                <td class="px-10 py-7">
                                    <div class="flex items-center gap-6">
                                        <div class="relative">
                                            <div
                                                class="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover/row:opacity-100 transition-opacity">
                                            </div>
                                            <div
                                                class="relative w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover/row:border-blue-500/50 transition-all duration-500 shadow-inner">
                                                <Icons.Tag
                                                    class="w-5 h-5 text-zinc-500 group-hover/row:text-blue-400 transition-colors" />
                                            </div>
                                        </div>
                                        <div class="flex flex-col">
                                            <span
                                                class="text-base font-black tracking-widest uppercase group-hover/row:text-white transition-colors">
                                                {{ cat.name }}
                                            </span>
                                            <span
                                                class="text-[8px] text-zinc-700 font-bold tracking-tighter uppercase mt-1">UID:
                                                {{ cat.id }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-10 py-7 text-right">
                                    <div
                                        class="flex justify-end gap-4 opacity-0 group-hover/row:opacity-100 translate-x-4 group-hover/row:translate-x-0 transition-all duration-500">
                                        <button @click="openEditModal(cat)"
                                            class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-400 hover:bg-white hover:text-black transition-all">
                                            <Icons.Edit3 class="w-4 h-4" />
                                        </button>
                                        <button @click="openDeleteModal(cat)"
                                            class="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                                            <Icons.Trash2 class="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="categories.length === 0">
                                <td colspan="2" class="px-10 py-32 text-center">
                                    <div class="relative inline-block mb-6">
                                        <Icons.Inbox class="w-16 h-16 text-zinc-800" />
                                        <div class="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
                                    </div>
                                    <p class="text-zinc-600 font-black uppercase tracking-[0.5em] text-[10px] italic">
                                        Void Detected: No Records Found</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <Transition name="modal">
            <div v-if="showModal" class="fixed inset-0 z-[150] flex items-center justify-center p-6">
                <div class="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl" @click="closeModal"></div>

                <div
                    class="relative bg-[#0d0d0e] w-full max-w-lg overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent">
                    </div>

                    <div class="p-12">
                        <div class="flex justify-between items-center mb-12">
                            <h2 class="text-3xl font-black italic uppercase tracking-tighter">
                                {{ isEdit ? 'Modify' : 'Initialize' }} <span class="text-blue-500">Segment</span>
                            </h2>
                            <button @click="closeModal"
                                class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-500 hover:text-white transition-colors">
                                <Icons.X class="w-5 h-5" />
                            </button>
                        </div>

                        <div class="space-y-8">
                            <div class="space-y-4">
                                <label class="text-[9px] font-black text-zinc-500 uppercase tracking-[0.4em] ml-2">Label
                                    Identity</label>
                                <input v-model="form.name" placeholder="E.G. SURVIVAL / HORROR"
                                    class="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-8 py-5 text-white outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all placeholder:text-zinc-800 text-sm font-bold tracking-[0.2em] uppercase" />

                                <Transition name="fade">
                                    <p v-if="errorMessage"
                                        class="text-rose-500 text-[9px] font-black uppercase tracking-widest mt-3 flex items-center gap-2">
                                        <Icons.AlertCircle class="w-3 h-3" /> {{ errorMessage }}
                                    </p>
                                </Transition>
                            </div>

                            <div class="pt-6 flex flex-col gap-4">
                                <button @click="submitCategory"
                                    class="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] italic text-xs shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]">
                                    Execute Protocol
                                </button>
                                <button @click="closeModal"
                                    class="text-[9px] font-black text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-all">
                                    Decline Operation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>

        <Transition name="modal">
            <div v-if="showDeleteModal" class="fixed inset-0 z-[150] flex items-center justify-center p-6">
                <div class="absolute inset-0 bg-rose-950/40 backdrop-blur-xl" @click="closeDeleteModal"></div>

                <div
                    class="relative bg-[#0d0d0e] p-12 rounded-[3rem] border border-rose-500/20 shadow-2xl text-center max-w-md w-full">
                    <div
                        class="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/20 animate-pulse">
                        <Icons.AlertTriangle class="w-10 h-10 text-rose-500" />
                    </div>

                    <h3 class="font-black text-3xl italic uppercase tracking-tighter mb-4 text-white">Purge <span
                            class="text-rose-500">Segment?</span></h3>
                    <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-10">
                        Warning: "{{ deleteTarget?.name }}" will be erased from the core database. This action is
                        irreversible.
                    </p>

                    <div class="grid grid-cols-2 gap-4">
                        <button @click="closeDeleteModal"
                            class="bg-white/5 hover:bg-white/10 text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                            Abort
                        </button>
                        <button @click="confirmDelete"
                            class="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl py-5 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-500/30">
                            Confirm Purge
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.modal-enter-active,
.modal-leave-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(30px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

::-webkit-scrollbar {
    width: 4px;
}

::-webkit-scrollbar-track {
    background: #050505;
}

::-webkit-scrollbar-thumb {
    background: #1a1a1b;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #3b82f6;
}
</style>