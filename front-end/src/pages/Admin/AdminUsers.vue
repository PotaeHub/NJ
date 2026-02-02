<script setup>
import { ref, computed, onMounted } from "vue"
import api from "@/services/api"
import { useAuthStore } from "@/store/auth"
import { UserPlus, Users, Search } from 'lucide-vue-next'

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
        console.error(err)
    } finally {
        loading.value = false
    }
}

/* ================= FILTER ================= */
const filteredUsers = computed(() =>
    users.value.filter(u => {
        const kw = keyword.value.toLowerCase()
        const matchKeyword =
            u.username.toLowerCase().includes(kw) ||
            u.email.toLowerCase().includes(kw)

        const matchStatus =
            statusFilter.value === "ALL" ||
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
        await api.post("/admin/users", data, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        showCreate.value = false
        loadUsers()
    } finally {
        loading.value = false
    }
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
    <div class="min-h-screen bg-[#70707013] text-zinc-800 p-6 lg:p-12 relative overflow-hidden">

        <!-- Glow -->
        <div
            class="fixed -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/10 blur-[140px] rounded-full pointer-events-none">
        </div>

        <div class="max-w-7xl mx-auto space-y-12 relative z-10">

            <!-- HEADER -->
            <header
                class="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-zinc-200 pb-10">

                <div class="flex items-center gap-5">
                    <div class="p-4 bg-blue-600 text-white rounded-2xl shadow-lg rotate-3">
                        <Users :size="30" stroke-width="2.5" />
                    </div>

                    <div>
                        <h1 class="text-4xl font-black tracking-tight uppercase italic">
                            Citizen <span class="text-blue-600">Matrix</span>
                        </h1>
                        <p class="text-zinc-500 text-xs font-semibold tracking-widest mt-1">
                            User Management System
                        </p>
                    </div>
                </div>

                <button @click="openCreate" class="flex items-center gap-4 bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl
                           shadow-lg hover:bg-blue-700 active:scale-95 transition">
                    <UserPlus class="w-4 h-4" />
                    เพิ่มผู้ใช้งาน
                </button>
            </header>

            <!-- SEARCH -->
            <section>
                <div class="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm">
                    <UserSearch v-model:keyword="keyword" v-model:status="statusFilter" />
                </div>
            </section>

            <!-- TABLE -->
            <main class="bg-white rounded-3xl border border-zinc-200 shadow-lg overflow-hidden relative min-h-[400px]">

                <div v-if="loading"
                    class="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin">
                    </div>
                </div>

                <UserTable :users="filteredUsers" @edit="openEdit" @delete="openDelete" @toggle-ban="openBan" />

                <div v-if="filteredUsers.length === 0 && !loading" class="py-32 text-center text-zinc-400">
                    <Search :size="48" class="mx-auto mb-4" />
                    <p class="text-xs tracking-widest uppercase font-semibold">
                        No matching user found
                    </p>
                </div>
            </main>
        </div>

        <!-- MODALS -->
        <UserCreateModal :show="showCreate" @close="showCreate = false" @submit="submitCreate" />
        <UserEditModal :show="showEdit" :user="selectedUser" @close="showEdit = false" @submit="submitEdit" />
        <UserDeleteModal :show="showDelete" :user="selectedUser" :currentUserId="auth.user?.id"
            @close="showDelete = false" @confirm="confirmDelete" />
        <BanConfirmModal :show="showBan" :user="selectedUser" @close="showBan = false" @confirm="confirmBan" />
    </div>
</template>

<style scoped>
@import "tailwindcss";

/* Header Table */
:deep(.user-table-header) {
    @apply bg-zinc-50 text-zinc-500 font-bold uppercase tracking-widest text-[10px] border-b border-zinc-200;
}

/* Status Badge */
:deep(.status-badge-active) {
    @apply bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-200;
}

:deep(.status-badge-banned) {
    @apply bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-rose-200;
}

/* Table Row */
:deep(tr) {
    @apply border-b border-zinc-200 transition;
}

:deep(tr:hover) {
    @apply bg-blue-50/40;
}

:deep(td) {
    @apply py-5 px-6;
}
</style>
