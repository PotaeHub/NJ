<template>
    <button :class="[
        'px-4 py-2 rounded font-medium transition',
        variantClasses
    ]" :disabled="disabled">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary'
    },
    disabled: Boolean
})

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'danger':
            return 'bg-red-600 hover:bg-red-700 text-white'
        case 'outline':
            return 'border border-gray-300 hover:bg-gray-100'
        default:
            return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
})
</script>
