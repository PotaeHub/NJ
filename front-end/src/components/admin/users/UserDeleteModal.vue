<script setup>
defineProps({
    show: Boolean,
    user: Object
})

const emit = defineEmits(["close", "confirm"])
</script>

<template>
    <div v-if="show"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
        @click.self="emit('close')">

        <div
            class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">

            <div class="flex flex-col items-center pt-8 pb-4">
                <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </div>
                <h2 class="text-xl font-bold text-slate-800">ลบ User ออกจากระบบ</h2>
            </div>

            <div class="px-8 py-2 text-center">
                <p class="text-slate-500 leading-relaxed">
                    คุณต้องการลบ User นี้หรือไม่? <span class="font-bold text-slate-800">{{ user?.username }}</span>?
                    การดำเนินการนี้ไม่สามารถย้อนกลับได้ และข้อมูลทั้งหมดที่เกี่ยวข้องกับผู้ใช้รายนี้จะถูกลบออกอย่างถาวร
                </p>
            </div>

            <div class="p-6 mt-4 flex flex-col sm:flex-row-reverse gap-3 bg-slate-50">
                <button @click="emit('confirm')"
                    class="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200 transition-all active:scale-95">
                    Confirm Delete
                </button>
                <button @click="emit('close')"
                    class="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-all">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import "tailwindcss";

.animate-in {
    animation: modal-in 0.2s ease-out;
}

@keyframes modal-in {
    0% {
        opacity: 0;
        transform: scale(0.95);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>