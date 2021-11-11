import { Router } from 'express'
import {
    createProduct,
    getAllProducts,
    getProductById,
    deleteProduct,
} from '../controllers/productController'
import authController from '../controllers/authController'

const router = Router()

// NOT REQUIRE LOGGIN (GUEST USER)
// get all products
router.get('/', getAllProducts)
router.get('/:_id', getProductById)

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

// REQUIRE ADMIN PERMISSION
router.use(authController.checkPermission(['admin']))
// create new product
router.post('/', createProduct)
// update product

// delete product
router.delete('/:_id', deleteProduct)
export default router
