import { Router } from 'express'
import {
    signup,
    getAllUsers,
    login,
    logout,
    updateUser,
} from '../controllers/userController'
import authController from '../controllers/authController'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)

// require protected route: authentication
router.use(authController.checkAuth)
router.patch('/', updateUser)
router.get('/', getAllUsers)
router.get('/logout', logout)

export default router
