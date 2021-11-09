import { Router } from 'express'
import { signup } from '../controllers/userController'

const router = Router()

router.route('/').post(signup)

export default router
