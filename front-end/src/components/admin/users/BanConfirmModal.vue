<script setup>
defineProps({
    show: Boolean,
    user: Object
})

const emit = defineEmits(["close", "confirm"])
</script>

<template>
    <transition name="fade-scale">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">

            <div class="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-2xl p-8">

                <!-- TITLE -->
                <h2 class="text-xl font-black tracking-tight mb-2 flex items-center gap-2">
                    <span :class="user?.banned ? 'text-blue-600' : 'text-rose-600'">
                        {{ user?.banned ? 'Unban User' : 'Ban User' }}
                    </span>
                </h2>

                <!-- DESC -->
                <p class="text-zinc-600 text-sm leading-relaxed mb-8">
                    คุณแน่ใจหรือไม่ว่าต้องการ
                    <span class="font-bold" :class="user?.banned ? 'text-blue-600' : 'text-rose-600'">
                        {{ user?.banned ? 'ปลดแบน' : 'แบน' }}
                    </span>
                    ผู้ใช้
                    <span class="font-bold text-zinc-800">
                        {{ user?.username }}
                    </span>
                    ?
                </p>

                <!-- ACTION -->
                <div class="flex justify-end gap-3">
                    <button @click="emit('close')" class="px-5 py-2.5 rounded-xl border border-zinc-300
                               text-zinc-600 font-semibold
                               hover:bg-zinc-100 transition">
                        Cancel
                    </button>

                    <button @click="emit('confirm')" class="px-6 py-2.5 rounded-xl font-bold text-white
                               transition active:scale-95" :class="user?.banned
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-rose-600 hover:bg-rose-700'">
                        Confirm
                    </button>
                </div>

            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
    transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
    opacity: 0;
    transform: scale(0.96);
}
</style>
