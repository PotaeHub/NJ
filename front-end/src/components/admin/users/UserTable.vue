<script setup>
const props = defineProps({
    users: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(["edit", "delete", "toggle-ban"])

const BASE_URL = import.meta.env.VITE_BACKEND || ""

const getRoleClass = (role) => {
    switch (role) {
        case "ADMIN":
            return "bg-purple-50 text-purple-600 border-purple-100"
        case "SELLER":
            return "bg-blue-50 text-blue-600 border-blue-100"
        default:
            return "bg-slate-50 text-slate-600 border-slate-100"
    }
}
</script>

<template>
    <div class="overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">

                <!-- Header -->
                <thead class="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                            โปรไฟล์ผู้ใช้งาน
                        </th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                            สิทธิ์
                        </th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                            สถานะ
                        </th>
                        <th class="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                            Actions
                        </th>
                    </tr>
                </thead>

                <!-- Body -->
                <tbody class="divide-y divide-slate-100">
                    <tr v-for="u in users" :key="u.id" class="transition-colors hover:bg-slate-50">

                        <!-- USER PROFILE -->
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center gap-3">

                                <!-- Avatar -->
                                <div class="h-10 w-10 rounded-full overflow-hidden
                         border border-indigo-200 shadow-sm
                         bg-indigo-100 flex items-center justify-center
                         text-indigo-600 font-bold">
                                    <img v-if="u.avatar" :src="`${BASE_URL}${u.avatar}`" :alt="u.username"
                                        class="w-full h-full object-cover"
                                        @error="$event.target.src = '/default-avatar.png'" />
                                    <span v-else>
                                        No image
                                    </span>
                                </div>

                                <!-- Info -->
                                <div class="flex flex-col text-sm">
                                    <span class="font-bold text-slate-700 leading-tight">
                                        {{ u.username }}
                                    </span>
                                    <span class="text-slate-400">
                                        {{ u.email }}
                                    </span>
                                </div>

                            </div>
                        </td>

                        <!-- ROLE -->
                        <td class="px-6 py-4 text-center">
                            <span :class="getRoleClass(u.role)"
                                class="px-3 py-1 rounded-md text-[10px] font-black border uppercase">
                                {{ u.role }}
                            </span>
                        </td>

                        <!-- STATUS -->
                        <td class="px-6 py-4 text-center">
                            <span v-if="u.banned" class="inline-flex items-center px-2.5 py-0.5
                       rounded-full text-xs font-medium
                       bg-red-100 text-red-700">
                                แบน
                            </span>
                            <span v-else class="inline-flex items-center px-2.5 py-0.5
                       rounded-full text-xs font-medium
                       bg-emerald-100 text-emerald-700">
                                Active
                            </span>
                        </td>

                        <!-- ACTIONS -->
                        <td class="px-6 py-4">
                            <div class="flex items-center justify-center gap-1">

                                <!-- Edit -->
                                <button @click="$emit('edit', u)"
                                    class="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                    ✏️
                                </button>

                                <!-- Ban / Unban -->
                                <button @click="$emit('toggle-ban', u)" :disabled="u.role === 'ADMIN'"
                                    :title="u.banned ? 'Unban' : 'Ban'" class="p-2 rounded-lg transition" :class="u.role === 'ADMIN'
                                        ? 'opacity-20 cursor-not-allowed text-slate-300'
                                        : u.banned
                                            ? 'text-emerald-500 hover:bg-emerald-50'
                                            : 'text-amber-500 hover:bg-amber-50'
                                        ">
                                    {{ u.banned ? "✅" : "🚫" }}
                                </button>

                                <!-- Delete -->
                                <button @click="$emit('delete', u)"
                                    class="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Delete">
                                    🗑️
                                </button>

                            </div>
                        </td>

                    </tr>
                </tbody>

            </table>
        </div>
    </div>
</template>
