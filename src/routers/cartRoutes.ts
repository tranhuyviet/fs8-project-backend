import { Router } from 'express'
import authController from '../controllers/authController'
import {
    addToCart,
    clearCart,
    paymentCart,
} from '../controllers/cartController'

const router = Router()

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

//add to cart
router.post('/', addToCart)

// clear cart
router.get('/clear', clearCart)

// payment cart
router.get('/payment/:_id', paymentCart)
export default router
