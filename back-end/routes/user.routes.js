import { Router } from 'express'
import { Roles } from '../middleware/checkRole.js'
import { auth } from '../middleware/auth.middleware.js'
import { checkOwnership, getMyLibrary, updateProfile } from '../controller/user.controller.js'
import { uploadGameMedia } from '../middleware/upload.middleware.js'

const router = Router()

router.put('/profile', auth, uploadGameMedia.single('avatar'), Roles("BUYER"), updateProfile)
router.get("/buyer/library", auth, Roles("BUYER"), getMyLibrary)
router.get("/buyer/ownership/:gameId", auth, Roles("BUYER"), checkOwnership)
export default router