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
    icon: 'Gamepad',
})

/* ================= GAME ICONS ================= */
const gameOnlyIcons = [
    'Gamepad', 'Joystick', 'Monitor', 'Laptop', 'Disc',
    'Download', 'Flame', 'Star', 'Trophy', 'Swords', 'Shield'
]

/* ================= HELPERS ================= */
const getIcon = (icon) => Icons[icon] || Icons.Gamepad

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
    form.value = { name: '', icon: 'Gamepad' }
}

const openEditModal = (cat) => {
    isEdit.value = true
    editId.value = cat.id
    form.value = {
        name: cat.name,
        icon: cat.icon || 'Gamepad',
    }
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
    <div class="min-h-screen bg-[#FDFDFD] text-black font-sans">

        <div class="max-w-6xl mx-auto px-6 py-12">
            <!-- HEADER -->
            <header class="flex justify-between items-end mb-16">
                <div>
                    <h1 class="text-4xl font-black uppercase">หมวดหมู่</h1>
                    <div class="h-1 w-12 bg-black mt-2"></div>
                    <p class="text-zinc-400 text-sm mt-2">
                        จัดการโครงสร้างคอลเลกชันเกมของคุณ
                    </p>
                </div>

                <button @click="openModal"
                    class="bg-black text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition">
                    + หมวดหมู่ใหม่
                </button>
            </header>

            <!-- TABLE -->
            <table class="w-full border-separate border-spacing-y-4">
                <thead>
                    <tr class="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                        <th class="px-6 py-2 text-left">ชื่อหมวดหมู๋</th>
                        <th class="px-6 py-2 text-left">Icon</th>
                        <th class="px-6 py-2 text-right">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="cat in categories" :key="cat.id"
                        class="bg-white border border-zinc-100 shadow-sm hover:border-black transition">
                        <td class="px-6 py-5 rounded-l-xl font-bold">
                            {{ cat.name }}
                        </td>

                        <td class="px-6 py-5">
                            <div class="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-50 border">
                                <component :is="getIcon(cat.icon)" class="w-5 h-5" />
                            </div>
                        </td>

                        <td class="px-6 py-5 text-right rounded-r-xl space-x-4">
                            <button @click="openEditModal(cat)"
                                class="text-xs font-bold text-zinc-400 hover:text-black">
                                แก้ไข
                            </button>
                            <button @click="openDeleteModal(cat)"
                                class="text-xs font-bold text-zinc-300 hover:text-red-500">
                                ลบ
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- CREATE / EDIT MODAL -->
        <Transition name="fade">
            <div v-if="showModal" class="fixed inset-0 bg-white/80 backdrop-blur flex items-center justify-center">
                <div class="bg-white w-full max-w-lg p-10 rounded-3xl shadow-xl">
                    <h2 class="text-2xl font-black text-center mb-6">
                        {{ isEdit ? 'Edit Category' : 'New Category' }}
                    </h2>

                    <div class="space-y-6">
                        <div>
                            <label class="text-xs font-bold">ชื่อ</label>
                            <input v-model="form.name" class="input-minimal" />
                            <p v-if="errorMessage" class="text-red-500 text-xs mt-1">
                                {{ errorMessage }}
                            </p>
                        </div>

                        <div>
                            <label class="text-xs font-bold block mb-3 text-center">Icon</label>
                            <div class="grid grid-cols-6 gap-3">
                                <button v-for="icon in gameOnlyIcons" :key="icon" @click="form.icon = icon"
                                    class="aspect-square rounded-xl border flex items-center justify-center" :class="form.icon === icon
                                        ? 'bg-black text-white border-black'
                                        : 'border-zinc-100 text-zinc-400 hover:border-black'">
                                    <component :is="getIcon(icon)" class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="mt-8 space-y-3">
                        <button @click="submitCategory"
                            class="w-full bg-black text-white py-4 rounded-xl font-bold uppercase">
                            Save
                        </button>
                        <button @click="closeModal" class="w-full text-xs font-bold text-zinc-400 hover:text-black">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- DELETE MODAL -->
        <Transition name="fade">
            <div v-if="showDeleteModal"
                class="fixed inset-0 bg-black/20 backdrop-blur flex items-center justify-center">
                <div class="bg-white p-8 rounded-3xl text-center shadow-xl">
                    <Icons.Trash2 class="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h3 class="font-black text-lg mb-2">ลบหมวดหมู่หรือไม่?</h3>
                    <p class="text-sm text-zinc-500 mb-6">
                        "{{ deleteTarget?.name }}" จะถูกลบออกอย่างถาวร
                    </p>

                    <div class="flex gap-3">
                        <button @click="closeDeleteModal" class="flex-1 border rounded-xl py-2 text-xs font-bold">
                            Cancel
                        </button>
                        <button @click="confirmDelete"
                            class="flex-1 bg-red-500 text-white rounded-xl py-2 text-xs font-bold">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.input-minimal {
    @apply w-full bg-zinc-50 border border-zinc-100 rounded-xl px-5 py-3 text-sm font-bold focus:border-black outline-none;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
