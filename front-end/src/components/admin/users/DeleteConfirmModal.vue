<script setup>
defineProps({
    show: Boolean,
    title: {
        type: String,
        default: "ยืนยันการลบข้อมูล"
    },
    itemName: String // ชื่อของสิ่งที่จะลบ เช่น ชื่อเกม หรือ ชื่อ User
})

const emit = defineEmits(["close", "confirm"])
</script>

<template>
    <Transition name="fade">
        <div v-if="show"
            class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            @click.self="emit('close')">

            <div
                class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-pop">

                <div class="flex flex-col items-center pt-10 pb-4">
                    <div
                        class="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <h2 class="text-2xl font-black text-slate-800 tracking-tight">{{ title }}</h2>
                </div>

                <div class="px-10 py-2 text-center">
                    <p class="text-slate-500 leading-relaxed">
                        คุณแน่ใจหรือไม่ว่าต้องการลบรายการ <br>
                        <span class="font-bold text-slate-900 text-lg">"{{ itemName }}"</span>?
                    </p>
                    <p class="mt-2 text-sm text-red-400 font-medium bg-red-50 py-1 px-3 rounded-full inline-block">
                        ⚠️ การกระทำนี้ไม่สามารถย้อนกลับได้
                    </p>
                </div>

                <div class="p-8 flex flex-col gap-3">
                    <button @click="emit('confirm')"
                        class="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                        ยืนยันการลบข้อมูล
                    </button>
                    <button @click="emit('close')"
                        class="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-all active:scale-95">
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@import "tailwindcss";

@keyframes pop {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-pop {
    animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Fade Transition สำหรับ Overlay */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>