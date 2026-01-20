<script setup>
import { ref, computed, onMounted } from "vue"
import api from "@/services/api"
import { useAuthStore } from "@/store/auth"
import { UserPlus, Users, ShieldCheck, Search } from 'lucide-vue-next'

import UserSearch from "@/components/admin/users/UserSearch.vue"
import UserTable from "@/components/admin/users/UserTable.vue"
import UserEditModal from "@/components/admin/users/UserEditModal.vue"
import UserDeleteModal from "@/components/admin/users/UserDeleteModal.vue"
import BanConfirmModal from "@/components/admin/users/BanConfirmModal.vue"
import UserCreateModal from "@/components/admin/users/UserCreateModal.vue"

/* ================= STATE ================= */
const users = ref([])
const keyword = ref("")
const statusFilter = ref("ALL")

const showEdit = ref(false)
const showDelete = ref(false)
const showBan = ref(false)
const showCreate = ref(false)

const selectedUser = ref(null)
const loading = ref(false)

const auth = useAuthStore()

/* ================= LOAD ================= */
const loadUsers = async () => {
    loading.value = true
    try {
        const res = await api.get("/admin/users")
        users.value = res.data
    } catch (err) {
        console.error("Fetch error:", err)
    } finally {
        loading.value = false
    }
}

/* ================= FILTER ================= */
const filteredUsers = computed(() =>
    users.value.filter(u => {
        const kw = keyword.value.toLowerCase()
        const matchKeyword = u.username.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw)
        const matchStatus = statusFilter.value === "ALL" ||
            (statusFilter.value === "ACTIVE" && !u.banned) ||
            (statusFilter.value === "BANNED" && u.banned)
        return matchKeyword && matchStatus
    })
)

/* ================= ACTIONS ================= */
const openCreate = () => showCreate.value = true
const submitCreate = async (data) => {
    if (loading.value) return
    loading.value = true
    try {
        await api.post("/admin/users", data, { headers: { "Content-Type": "multipart/form-data" } })
        showCreate.value = false
        loadUsers()
    } catch (err) {
        alert(err.response?.data?.message || "Create user failed")
    } finally { loading.value = false }
}

const openEdit = (user) => {
    selectedUser.value = user
    showEdit.value = true
}
const submitEdit = async (data) => {
    await api.put(`/admin/users/${selectedUser.value.id}`, data)
    showEdit.value = false
    loadUsers()
}

const openDelete = (user) => {
    selectedUser.value = user
    showDelete.value = true
}
const confirmDelete = async () => {
    await api.delete(`/admin/users/${selectedUser.value.id}`)
    showDelete.value = false
    loadUsers()
}

const openBan = (user) => {
    if (user.role === "ADMIN") return
    selectedUser.value = user
    showBan.value = true
}
const confirmBan = async () => {
    await api.put(`/admin/users/${selectedUser.value.id}/ban`)
    showBan.value = false
    loadUsers()
}

onMounted(loadUsers)
</script>

<template>
    <div class="min-h-screen bg-[#FDFDFD] text-black font-sans p-6 lg:p-12 space-y-12">

        <header
            class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-zinc-100 pb-10">
            <div class="space-y-1">
                <div class="flex items-center gap-4 mb-2">
                    <div class="p-3 bg-black text-white rounded-2xl shadow-xl shadow-black/10">
                        <Users :size="28" stroke-width="2.5" />
                    </div>
                    <h1 class="text-4xl font-black tracking-tighter uppercase">การลงทะเบียนผู้ใช้</h1>
                </div>
                <div class="h-1 w-12 bg-black ml-1"></div>
                <p class="text-zinc-400 text-sm font-medium tracking-wide ml-1 uppercase">การตรวจสอบสิทธิ์และการอนุญาต
                    การควบคุม</p>
            </div>

            <button @click="openCreate"
                class="group flex items-center gap-3 bg-black text-white font-black px-8 py-4 rounded-2xl shadow-2xl shadow-black/20 transition-all active:scale-95 hover:bg-zinc-800 tracking-widest text-[10px] uppercase">
                <UserPlus class="h-4 w-4" stroke-width="3" />
                เชิญสมาชิกใหม่
            </button>
        </header>

        <section class="grid grid-cols-1 gap-6">
            <div class="bg-white p-2 rounded-3xl border border-zinc-100 shadow-sm">
                <UserSearch v-model:keyword="keyword" v-model:status="statusFilter" />
            </div>
        </section>

        <main
            class="bg-white rounded-[2.5rem] border border-zinc-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] overflow-hidden">
            <UserTable :users="filteredUsers" @edit="openEdit" @delete="openDelete" @toggle-ban="openBan" />

            <div v-if="filteredUsers.length === 0 && !loading" class="py-32 text-center">
                <div class="inline-flex p-6 bg-zinc-50 rounded-full mb-4 text-zinc-200">
                    <Search :size="40" />
                </div>
                <p class="font-black text-zinc-300 uppercase tracking-[0.3em] text-[10px]">
                    ไม่พบข้อมูลที่ตรงกันในฐานข้อมูล
                </p>
            </div>
        </main>

        <UserCreateModal :show="showCreate" @close="showCreate = false" @submit="submitCreate" />

        <UserEditModal :show="showEdit" :user="selectedUser" @close="showEdit = false" @submit="submitEdit" />

        <UserDeleteModal :show="showDelete" :user="selectedUser" :currentUserId="auth.user?.id"
            @close="showDelete = false" @confirm="confirmDelete" />

        <BanConfirmModal :show="showBan" :user="selectedUser" @close="showBan = false" @confirm="confirmBan" />

    </div>
</template>

<style scoped>
@import "tailwindcss";

:deep(.user-table-header) {
    @apply bg-zinc-50/50 text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px];
}

:deep(.status-badge-active) {
    @apply bg-black text-white px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest;
}

:deep(.status-badge-banned) {
    @apply bg-zinc-100 text-zinc-400 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest;
}
</style>