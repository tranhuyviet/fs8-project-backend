import { Request, Response, NextFunction } from 'express'
import User from '../models/userModel'
import { signupValidate, loginValidate } from '../util/validateUser'
import { errorParse, ErrorsObj } from '../util/errorParse'
import { resError, resSuccess } from '../util/returnRes'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
} from '../helpers/apiError'
import userService from '../services/userService'

// SIGNUP USER
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name, email, password and confirmPassword
        await signupValidate.validate(req.body, { abortEarly: false })

        const { name, email, image = '', password } = req.body
        // checking email is exist -> throw error, if not -> create new user
        const isUserExist = await userService.findUserByEmail(email)
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
        await userService.create(user)

        // create cookie
        res.cookie('jwt-ecommerce-website', user.returnAuthUser().token, {
            httpOnly: true,
        })

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

// GET ALL USERS
export const getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const users = await userService.getAllUsers()
        if (!users) throw new NotFoundError('Not found any user')

        return resSuccess(res, users)
    } catch (error) {
        next(error)
    }
}

// LOGIN USER
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: email, password
        await loginValidate.validate(req.body, { abortEarly: false })

        const { email, password } = req.body

        // find user by email
        const user = await userService.findUserByEmail(email)

        // check email and correct password
        // if email or password wrong -> only return errors.global = 'Invalid credentials'
        // not return: 'Email incorrect' or 'Password incorrect'
        if (!user || !user.isValidPassword(password))
            throw new NotFoundError('Invalid credentials', null, {
                global: 'Invalid credentials',
            })

        // create cookie
        res.cookie('jwt-ecommerce-website', user.returnAuthUser().token, {
            httpOnly: true,
        })

        // return user with authentication
        return resSuccess(res, user.returnAuthUser())
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Login Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// LOGOUT USER
export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.cookie('jwt-ecommerce-website', 'loggedout', {
            httpOnly: true,
        })
        return resSuccess(res)
    } catch (error) {
        next(new InternalServerError())
    }
}
