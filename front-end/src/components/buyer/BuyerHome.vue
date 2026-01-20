<script setup>
import { useAuthStore } from '../../store/auth'
const auth = useAuthStore()
</script>

<template>
    <div>
        <h2 class="text-2xl font-bold mb-4">
            ยินดีต้อนรับ {{ auth.user.username }}
        </h2>

        <p class="text-gray-600">
            เลือกซื้อเกมใหม่ โปรโมชั่น และดูคำสั่งซื้อของคุณได้ที่นี่
        </p>
    </div>
</template>
