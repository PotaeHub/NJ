import { Router } from 'express'
import { Roles } from '../middleware/checkRole.js'
import { auth } from '../middleware/auth.middleware.js'
import { createReview } from '../controller/review.controller.js'

const router = Router()

router.post('/reviews', auth, Roles("BUYER"), createReview)

export default router