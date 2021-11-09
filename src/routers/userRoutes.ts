import { Router } from 'express'
import { signup, getAllUsers, login } from '../controllers/userController'
import authController from '../controllers/authController'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)

// require protected route: authentication
// router.use(authController.checkAuth)
router.get('/', authController.checkAuth, getAllUsers)

export default router
