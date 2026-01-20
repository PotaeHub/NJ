// src/routes/game.routes.js
import { Router } from 'express'
import { Roles } from '../middleware/checkRole.js'
import { auth } from '../middleware/auth.middleware.js'
import { createOrder, myOrders } from '../controller/order.controller.js'

const router = Router()

router.post('/orders', auth, Roles("BUYER"), createOrder)
router.get('/orders/my', auth, Roles("BUYER"), myOrders)
export default router
