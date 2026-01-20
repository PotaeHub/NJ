<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '@/store/auth'

const auth = useAuthStore()

const form = ref({
    username: '',
    email: '',
    avatar: null
})

const preview = ref('')
const loading = ref(false)
const success = ref('')
const error = ref('')

onMounted(() => {
    if (auth.user) {
        form.value.username = auth.user.username
        form.value.email = auth.user.email
        preview.value = auth.user.avatar
            ? import.meta.env.VITE_BACKEND + auth.user.avatar
            : ''
    }
})

const onFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    form.value.avatar = file
    preview.value = URL.createObjectURL(file)
}

const updateProfile = async () => {
    try {
        loading.value = true
        error.value = success.value = ''

        const fd = new FormData()
        fd.append('username', form.value.username)
        if (form.value.avatar) fd.append('avatar', form.value.avatar)

        const res = await api.put('/profile', fd)

        auth.user = res.data
        localStorage.setItem('user', JSON.stringify(res.data))
        success.value = 'อัปเดตโปรไฟล์สำเร็จ'
    } catch (e) {
        error.value = e.response?.data?.message || 'เกิดข้อผิดพลาด'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="max-w-xl mx-auto bg-[#020617] border border-white/10
              rounded-3xl p-8 text-slate-200 shadow-xl">

        <h2 class="text-3xl font-black mb-8">👤 โปรไฟล์ของฉัน</h2>

        <p v-if="error" class="text-red-400 mb-3">{{ error }}</p>
        <p v-if="success" class="text-green-400 mb-3">{{ success }}</p>

        <div class="flex flex-col items-center mb-6">
            <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500/40">
                <img v-if="preview" :src="preview" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center bg-white/5">🎮</div>
            </div>

            <label class="mt-4 text-indigo-400 cursor-pointer">
                เปลี่ยนรูปโปรไฟล์
                <input type="file" hidden accept="image/*" @change="onFileChange" />
            </label>
        </div>

        <div class="space-y-4">
            <input v-model="form.username" class="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl"
                placeholder="Username" />

            <input v-model="form.email" disabled
                class="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl opacity-60" />

            <input :value="auth.user.role" disabled
                class="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl opacity-60" />

            <button @click="updateProfile" :disabled="loading"
                class="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-bold">
                {{ loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง' }}
            </button>
        </div>
    </div>
</template>
