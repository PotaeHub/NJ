<template>
    <div class="card">
        <h3>{{ title }}</h3>
        <p>{{ value }}</p>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    value: [String, Number]
})
</script>
