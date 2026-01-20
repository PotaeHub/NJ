<script setup>
const props = defineProps({
    keyword: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "ALL"
    }
})

const emit = defineEmits([
    "update:keyword",
    "update:status"
])
</script>

<template>
    <div
        class="flex flex-col md:flex-row items-center gap-4 bg-white p-2 md:p-3 rounded-2xl border border-slate-200 shadow-sm">

        <div class="relative flex-1 w-full group">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input :value="keyword" @input="emit('update:keyword', $event.target.value)" type="text"
                placeholder="Search username or email..."
                class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 placeholder:text-slate-400" />
        </div>

        <div class="hidden md:block w-px h-8 bg-slate-200"></div>

        <div class="flex items-center gap-2 w-full md:w-auto">
            <span class="hidden lg:block text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">Status:</span>
            <div class="relative w-full md:w-44">
                <select :value="status" @change="emit('update:status', $event.target.value)"
                    class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-700 appearance-none cursor-pointer font-medium">
                    <option value="ALL">All Accounts</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="BANNED">Banned Only</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>

    </div>
</template>