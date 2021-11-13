import { Router } from 'express'
import {
    signup,
    getAllUsers,
    login,
    logout,
    updateUser,
    changePassword,
    deleteUser,
    toggleBannedUser,
    forgotPassword,
    resetPassword,
} from '../controllers/userController'
import authController from '../controllers/authController'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

// require protected route: authentication
router.use(authController.checkAuth)
router.patch('/', updateUser)
router.patch('/change-password', changePassword)
router.get('/', getAllUsers)
router.get('/logout', logout)

// require admin permission
router.use(authController.checkPermission(['admin']))
router.delete('/:_id', deleteUser)
router.get('/toggle-banned-user/:_id', toggleBannedUser)

export default router
