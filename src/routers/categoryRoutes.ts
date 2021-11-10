import { Router } from 'express'
import {
    createCategory,
    getAllCategories,
    updateCategory,
} from '../controllers/categoryController'
import authController from '../controllers/authController'

const router = Router()

// NOT REQUIRE LOGGIN (GUEST USER)
// get all categories
router.get('/', getAllCategories)

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

// REQUIRE ADMIN PERMISSION
router.use(authController.checkPermission(['admin']))
// create new category
router.post('/', createCategory)
// update category
router.patch('/:_id', updateCategory)

export default router
