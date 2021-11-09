import { Request, Response, NextFunction } from 'express'
import User from '../models/userModel'
import { signupValidate } from '../util/validateUser'
import { errorParse, ErrorsObj } from '../util/errorParse'
import { resError, resSuccess } from '../util/returnRes'
import { BadRequestError } from '../helpers/apiError'
import UserService from '../services/userService'

// SIGNUP USER
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(req.body)
        // checking validate: name, email, password and confirmPassword
        await signupValidate.validate(req.body, { abortEarly: false })

        const { name, email, image = '', password } = req.body
        // checking email is exist -> throw error, if not -> create new user
        const isUserExist = await User.findOne({ email })
        if (isUserExist) {
            throw new BadRequestError('Signup Validate Email Error', null, {
                email: 'This email is already taken',
            })
        }

        // create new user
        const user = new User({ name, email, image })

        // hash password
        user.hashPassword(password)

        // save user
        await UserService.create(user)

        // return user with authentication
        return resSuccess(res, user.returnAuthUser())
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Signup Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}
