import { Router } from 'express'
import { Roles } from '../middleware/checkRole.js'
import { auth } from '../middleware/auth.middleware.js'
import { getAllGames, getPublicCategories } from '../controller/public.controller.js'
const router = Router()

router.get("/public/games", getAllGames)

// ✅ หมวดหมู่
router.get("/public/categories", getPublicCategories)

export default router