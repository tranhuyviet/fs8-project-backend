import { Router } from 'express'
import authController from '../controllers/authController'
import { addToCart } from '../controllers/cartController'

const router = Router()

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

//add to cart
router.post('/', addToCart)

export default router
