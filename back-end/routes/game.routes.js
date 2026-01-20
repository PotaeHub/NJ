// src/routes/game.routes.js
import { Router } from 'express'
import { Roles } from '../middleware/checkRole.js'
import { auth } from '../middleware/auth.middleware.js'
import { checkOwnership, createGame, getGameById, getGames } from '../controller/game.controller.js'

const router = Router()

router.get('/games', getGames)
router.get('/games/:id', getGameById)
router.get('/games/:id/ownership', checkOwnership)
router.post('/', auth, Roles('SELLER'), createGame)
router.get('/admin/games', auth, Roles('ADMIN'), getGames)

export default router
