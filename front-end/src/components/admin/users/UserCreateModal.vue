<script setup>
import { ref, watch } from "vue"

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(["close", "submit"])

const form = ref({
    username: "",
    email: "",
    password: "",
    role: "BUYER",
    avatar: null,
    avatarPreview: null
})

const fileInput = ref(null)

const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return

    form.value.avatar = file
    form.value.avatarPreview = URL.createObjectURL(file)
}

const onFileChange = (e) => {
    const file = e.target.files[0]
    handleFile(file)
}

const onDrop = (e) => {
    const file = e.dataTransfer.files[0]
    handleFile(file)
}

const removeAvatar = () => {
    form.value.avatar = null
    form.value.avatarPreview = null
    fileInput.value.value = ""
}

const handleSubmit = () => {
    if (!form.value.username || !form.value.email || !form.value.password) {
        alert("กรุณากรอกข้อมูลให้ครบ")
        return
    }

    const fd = new FormData()
    fd.append("username", form.value.username)
    fd.append("email", form.value.email)
    fd.append("password", form.value.password)
    fd.append("role", form.value.role)
    if (form.value.avatar) {
        fd.append("avatar", form.value.avatar)
    }

    emit("submit", fd)
    emit("close")
}

watch(() => props.show, (val) => {
    if (val) {
        form.value = {
            username: "",
            email: "",
            password: "",
            role: "BUYER",
            avatar: null,
            avatarPreview: null
        }
    }
})
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="$emit('close')">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">

            <!-- Header -->
            <div class="px-6 py-4 border-b flex justify-between items-center">
                <h2 class="text-lg font-semibold">➕ Create User</h2>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">

                <!-- Avatar Upload -->
                <div class="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition
                           hover:border-indigo-500" @click="fileInput.click()" @dragover.prevent
                    @drop.prevent="onDrop">
                    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

                    <div v-if="!form.avatarPreview" class="text-sm text-gray-400">
                        ลากรูปมาวางที่นี่ หรือคลิกเพื่อเลือกรูป
                    </div>

                    <div v-else class="relative inline-block">
                        <img :src="form.avatarPreview" class="w-32 h-32 object-cover rounded-full border shadow" />
                        <button @click.stop="removeAvatar"
                            class="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs">
                            ✕
                        </button>
                    </div>
                </div>

                <input v-model="form.username" placeholder="Username" class="input" />
                <input v-model="form.email" type="email" placeholder="Email" class="input" />
                <input v-model="form.password" type="password" placeholder="Password" class="input" />

                <select v-model="form.role" class="input">
                    <option value="ADMIN">Administrator</option>
                    <option value="SELLER">Seller</option>
                    <option value="BUYER">Buyer</option>
                </select>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button @click="$emit('close')" class="btn-secondary">Cancel</button>
                <button @click="handleSubmit" class="btn-primary">Create</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.input {
    @apply w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500;
}

.btn-primary {
    @apply px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700;
}

.btn-secondary {
    @apply px-4 py-2 text-gray-600 hover:text-gray-800;
}
</style>
