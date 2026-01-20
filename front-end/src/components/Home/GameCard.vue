<template>
    <div class="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer" @click="$emit('view', game)">
        <!-- IMAGE -->
        <img v-if="image" :src="BASE_URL + image.url" class="w-full h-48 object-cover rounded-t-xl" />

        <div class="p-4">
            <h3 class="font-bold text-lg truncate">{{ game.title }}</h3>
            <p class="text-indigo-600 font-bold mt-2">
                {{ game.price }} ฿
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    game: Object
})

const BASE_URL = import.meta.env.VITE_BACKEND

const image = computed(() =>
    props.game.gameMedias?.find(m => m.type === 'IMAGE')
)
</script>
