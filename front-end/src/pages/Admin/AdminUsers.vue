<script setup>
import { ref, computed, onMounted } from "vue"
import api from "@/services/api"
import { useAuthStore } from "@/store/auth"

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
    try {
        const res = await api.get("/admin/users")
        users.value = res.data
    } catch (err) {
        alert("โหลดข้อมูลผู้ใช้ไม่สำเร็จ")
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

/* ================= CREATE ================= */
const openCreate = () => {
    showCreate.value = true
}

const submitCreate = async (data) => {
    if (loading.value) return
    loading.value = true

    try {
        const res = await api.post("/admin/users", data, {
            headers: { "Content-Type": "multipart/form-data" }
        })
        console.log(res.data)
        showCreate.value = false
        loadUsers()
    } catch (err) {
        alert(err.response?.data?.message || "Create user failed")
    } finally {
        loading.value = false
    }
}

/* ================= EDIT ================= */
const openEdit = (user) => {
    selectedUser.value = user
    showEdit.value = true
}

const submitEdit = async (data) => {
    await api.put(`/admin/users/${selectedUser.value.id}`, data)
    showEdit.value = false
    loadUsers()
}

/* ================= DELETE ================= */
const openDelete = (user) => {
    selectedUser.value = user
    showDelete.value = true
}

const confirmDelete = async () => {
    await api.delete(`/admin/users/${selectedUser.value.id}`)
    showDelete.value = false
    loadUsers()
}

/* ================= BAN ================= */
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
    <div class="p-6 space-y-6">

        <!-- Header -->
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">👤 Manage Users</h1>

            <button @click="openCreate" class="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                ➕ Add User
            </button>
        </div>

        <!-- Search & Filter -->
        <UserSearch v-model:keyword="keyword" v-model:status="statusFilter" />

        <!-- Table -->
        <UserTable :users="filteredUsers" @edit="openEdit" @delete="openDelete" @toggle-ban="openBan" />

        <!-- Modals -->
        <UserEditModal :show="showEdit" :user="selectedUser" @close="showEdit = false" @submit="submitEdit" />

        <UserDeleteModal :show="showDelete" :user="selectedUser" :currentUserId="auth.user?.id"
            @close="showDelete = false" @confirm="confirmDelete" />

        <BanConfirmModal :show="showBan" :user="selectedUser" @close="showBan = false" @confirm="confirmBan" />

        <UserCreateModal :show="showCreate" @close="showCreate = false" @submit="submitCreate" />

    </div>
</template>
