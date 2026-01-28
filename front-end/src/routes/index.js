import { createRouter, createWebHistory } from 'vue-router'

// pages
import Home from '../pages/Home.vue'
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'

// layouts
import AdminLayout from '@/layouts/AdminLayout.vue'
import BuyerLayout from '@/layouts/BuyerLayout.vue'

// admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard.vue'
import AdminGames from '@/pages/admin/AdminGames.vue'
import AdminUsers from '@/pages/admin/AdminUsers.vue'
import AdminOrders from '@/pages/admin/AdminOrders.vue'

// buyer pages
import BuyerHome from '@/components/buyer/BuyerHome.vue'
import BuyerOrders from '@/components/buyer/BuyerOrders.vue'
import BuyerProfile from '@/components/buyer/BuyerProfile.vue'

// pinia
import { useAuthStore } from '@/store/auth'
import GameDetail from '../pages/GameDetail.vue'
import BuyerCart from '../components/Home/BuyerCart.vue'
import GamesList from '../pages/GamesList.vue'
import AdminCategories from '../pages/Admin/AdminCategories.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },

    {
        path: '/login',
        component: Login,
        meta: { guest: true }
    },

    {
        path: '/register',
        component: Register,
        meta: { guest: true }
    },
    {
        path: '/games/:id',
        name: 'game-detail',
        component: GameDetail
    },
    {
        path: '/games',
        name: 'Games',
        component: GamesList
    },
    /* ================= ADMIN ================= */
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: 'ADMIN' },
        children: [
            { path: 'dashboard', component: AdminDashboard },
            { path: 'games', component: AdminGames },
            { path: 'users', component: AdminUsers },
            { path: 'orders', component: AdminOrders },
            { path: 'category', component: AdminCategories }
        ]
    },

    /* ================= BUYER ================= */
    {
        path: '/buyer',
        component: BuyerLayout,
        meta: { requiresAuth: true, role: 'BUYER' },
        children: [
            { path: 'home', component: BuyerHome },
            { path: 'games', component: BuyerCart },
            { path: 'orders', component: BuyerOrders },
            { path: 'profile', component: BuyerProfile }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

/* ================= GUARD ================= */
router.beforeEach((to, from, next) => {
    const auth = useAuthStore()

    // ต้อง login
    if (to.meta.requiresAuth && !auth.token) {
        return next('/login')
    }

    // guest only
    if (to.meta.guest && auth.token) {
        if (auth.user.role === 'ADMIN') return next('/admin/dashboard')
        if (auth.user.role === 'BUYER') return next('/buyer/home')
        return next('/')
    }

    // role check
    if (to.meta.role && auth.user?.role !== to.meta.role) {
        return next('/')
    }

    next()
})

export default router
