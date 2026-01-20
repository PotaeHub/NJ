<template>
    <div v-if="show" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-lg font-semibold">
                    <slot name="title" />
                </h2>
                <button @click="$emit('close')" class="text-gray-500">✕</button>
            </div>

            <slot />

            <div class="mt-6 text-right">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    show: Boolean
})
</script>
