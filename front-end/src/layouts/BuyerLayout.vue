<!-- src/layouts/BuyerLayout.vue -->
<template>
    <div class="min-h-screen bg-gray-100">
        <Navbarpublic />

        <main class="max-w-7xl mx-auto px-6 py-6">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import Navbarpublic from '../components/Navbarpublic.vue';
</script>
