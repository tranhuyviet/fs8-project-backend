import { Router } from 'express'
import { createProduct, getAllProducts } from '../controllers/productController'
import authController from '../controllers/authController'

const router = Router()

// NOT REQUIRE LOGGIN (GUEST USER)
// get all products
router.get('/', getAllProducts)

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

// REQUIRE ADMIN PERMISSION
router.use(authController.checkPermission(['admin']))
// create new product
router.post('/', createProduct)
// update product

// delete product

export default router