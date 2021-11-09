import { Router } from 'express'
import { signup, getAllUsers, login } from '../controllers/userController'

const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.get('/', getAllUsers)
//router.route('/').post(signup).get(getAllUsers)

export default router
