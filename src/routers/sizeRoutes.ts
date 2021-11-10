import { Router } from 'express'
import {
    createSize,
    getAllSizes,
    updateSize,
    deleteSize,
} from '../controllers/sizeController'
import authController from '../controllers/authController'

const router = Router()

// NOT REQUIRE LOGGIN (GUEST USER)
// get all sizes
router.get('/', getAllSizes)

// REQUIRE PROTECTED ROUTE: AUTHENTICATION
router.use(authController.checkAuth)

// REQUIRE ADMIN PERMISSION
router.use(authController.checkPermission(['admin']))
// create new Size
router.post('/', createSize)
// update Size
router.patch('/:_id', updateSize)
// delete Size
router.delete('/:_id', deleteSize)

export default router
