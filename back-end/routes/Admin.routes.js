import { Router } from 'express'
import { auth } from '../middleware/auth.middleware.js'
import { adminApprovePayment, adminCancelOrder, adminCompleteOrder, adminCreateCategory, adminDeleteCategory, adminGetAllCategories, adminGetCategoryById, adminGetOrderById, adminGetOrders, adminUpdateCategory, adminUpdateStatus, createGame, createUser, deleteGame, deleteUser, getAdminDashboard, getAllGames, getOrders, getUsers, orderMy, toggleBanUser, updateGame, updateRole, updateUser } from '../controller/Admin.controller.js'
import { Roles } from '../middleware/checkRole.js'
import { uploadGameMedia } from '../middleware/upload.middleware.js'
const router = Router()

// Games
router.post('/admin/games', auth, Roles("ADMIN"), uploadGameMedia.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }
]), createGame)

router.get('/admin/games', auth, Roles("ADMIN"), getAllGames)

router.put('/admin/games/:id', auth, Roles("ADMIN"), uploadGameMedia.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 }
]), updateGame)

router.delete('/admin/games/:id', auth, Roles("ADMIN"), deleteGame)

// Dashboard
router.get('/admin/dashboard', auth, Roles("ADMIN"), getAdminDashboard)
// Users
router.post('/admin/users', auth, Roles("ADMIN"), uploadGameMedia.single("avatar"), createUser)
router.get('/admin/users', auth, Roles("ADMIN"), getUsers)
router.put('/admin/users/:id', auth, Roles("ADMIN"), uploadGameMedia.single("avatar"), updateUser)
router.put('/admin/users/:id/role', auth, Roles("ADMIN"), updateRole)
router.put('/admin/users/:id/ban', auth, Roles("ADMIN"), toggleBanUser)
router.delete('/admin/users/:id', auth, Roles("ADMIN"), deleteUser)

// Orders
router.get("/admin/orders", auth, Roles("ADMIN"), adminGetOrders)
router.get("/admin/orders/:id", auth, Roles("ADMIN"), adminGetOrderById)
router.patch("/admin/orders/:id/status", auth, Roles("ADMIN"), adminUpdateStatus)
router.patch("/admin/orders/:id/complete", auth, Roles("ADMIN"), adminCompleteOrder)
router.patch("/admin/orders/:id/cancel", auth, Roles("ADMIN"), adminCancelOrder)

// Category 
router.post("/admin/category", auth, Roles("ADMIN"), adminCreateCategory)
router.get("/admin/category", auth, Roles("ADMIN"), adminGetAllCategories)

router.get(
    '/admin/category/:id',
    auth,
    Roles('ADMIN'),
    adminGetCategoryById
)

router.put(
    '/admin/category/:id',
    auth,
    Roles('ADMIN'),
    adminUpdateCategory
)

router.delete(
    '/admin/category/:id',
    auth,
    Roles('ADMIN'),
    adminDeleteCategory
)
router.post(
    "/admin/approve",
    auth,
    Roles("ADMIN"),
    adminApprovePayment
)
export default router
