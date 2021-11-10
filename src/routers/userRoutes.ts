import { Router } from 'express'
import {
    signup,
    getAllUsers,
    login,
    logout,
    updateUser,
    changePassword,
} from '../controllers/userController'
import authController from '../controllers/authController'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)

// require protected route: authentication
router.use(authController.checkAuth)
router.patch('/', updateUser)
router.patch('/change-password', changePassword)
router.get('/', getAllUsers)
router.get('/logout', logout)

export default router
