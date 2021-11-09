import { Request, Response, NextFunction } from 'express'
import { UnauthorizedError, BadRequestError } from '../helpers/apiError'
import jwtDecode from 'jwt-decode'
import userService from '../services/userService'

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Getting token and check of it's there
        let token = ''
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies['jwt-ecommerce-website']) {
            token = req.cookies['jwt-ecommerce-website']
        }
        // console.log('TOKEN:', token)
        if (!token)
            return next(
                new UnauthorizedError(
                    'You are not logged in! Please log in to get access.'
                )
            )

        // Verification token
        const decode: { _id: string } = jwtDecode(token)

        // Check if user exist
        const user = await userService.findUserById(decode._id)

        if (!user)
            return next(
                new UnauthorizedError(
                    'The user belonging to this token does no longer exists.'
                )
            )

        // CHECK AUTH PASS -> GRANT ACCESS TO PROTECTED ROUTE
        req.user = user
        res.locals.user = user
        next()
    } catch (error) {
        if (error instanceof Error && error.name == 'InvalidTokenError') {
            next(new BadRequestError('Token Error', error))
        } else {
            next(error)
        }
    }
}

export default {
    checkAuth,
}
