import { Router } from 'express'
import { createCategory } from '../controllers/categoryController'
import authController from '../controllers/authController'

const router = Router()

// require protected route: authentication
router.use(authController.checkAuth)

// require admin permission
router.use(authController.checkPermission(['admin']))
router.post('/', createCategory)

export default router
