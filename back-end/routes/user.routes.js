import { Router } from 'express'
import { Roles } from '../middleware/checkRole.js'
import { auth } from '../middleware/auth.middleware.js'
import { updateProfile } from '../controller/user.controller.js'
import { uploadGameMedia } from '../middleware/upload.middleware.js'

const router = Router()

router.put('/profile', auth, uploadGameMedia.single('avatar'), Roles("BUYER"), updateProfile)

export default router