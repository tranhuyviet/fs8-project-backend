import { Router } from 'express'
import {
    createVariant,
    getAllVariants,
    updateVariant,
    deleteVariant,
} from '../controllers/variantController'
import authController from '../controllers/authController'

const router = Router()

// NOT REQUIRE LOGGIN (GUEST USER)
// get all variants
router.get('/', getAllVariants)

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

// REQUIRE ADMIN PERMISSION
router.use(authController.checkPermission(['admin']))
// create new variant
router.post('/', createVariant)
// update variant
router.patch('/:_id', updateVariant)
// delete variant
router.delete('/:_id', deleteVariant)

export default router
