<script setup>
defineProps({
    show: Boolean,
    user: Object
})

const emit = defineEmits(["close", "confirm"])
</script>

<template>
    <div v-if="show" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl p-6 w-full max-w-sm">
            <h2 class="text-lg font-bold mb-3">
                {{ user?.banned ? "Unban User" : "Ban User" }}
            </h2>

            <p class="text-gray-600 mb-5">
                คุณแน่ใจหรือไม่ว่าต้องการ
                <b>{{ user?.banned ? "ปลดแบน" : "แบน" }}</b>
                ผู้ใช้ <b>{{ user?.username }}</b> ?
            </p>

            <div class="flex justify-end gap-3">
                <button @click="$emit('close')" class="px-4 py-2 border rounded">
                    Cancel
                </button>
                <button @click="$emit('confirm')" class="px-4 py-2 bg-red-600 text-white rounded">
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>
