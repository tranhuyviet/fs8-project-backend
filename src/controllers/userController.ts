import { Request, Response, NextFunction } from 'express'
import User, { UserDocument } from '../models/userModel'
import {
    signupValidate,
    loginValidate,
    updateUserValidate,
    changePasswordValidate,
    forgotPasswordValidate,
    resetPasswordValidate,
} from '../util/validateUser'
import { errorParse } from '../util/errorParse'
import { resSuccess } from '../util/returnRes'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import userService from '../services/userService'
import mongoose from 'mongoose'
import { sendEmail } from '../util/mailer'
import crypto from 'crypto'

export const COOKIE_NAME = 'ecommerceJwt'

// SIGNUP USER
export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name, email, password and confirmPassword
        await signupValidate.validate(req.body, { abortEarly: false })

        const { name, email, image, password } = req.body
        // checking email is exist -> throw error, if not -> create new user
        const isUserExist = await userService.findUserByEmail(email)
        if (isUserExist) {
            throw new BadRequestError('Signup Validate Email Error', null, {
                email: 'This email is already taken',
            })
        }

        // create new user
        let user: UserDocument
        if (image) {
            user = new User({ name, email, image })
        } else {
            user = new User({ name, email })
        }

        // hash password
        user.hashPassword(password)

        // save user
        await userService.save(user)

        // create cookie
        res.cookie(COOKIE_NAME, user.returnAuthUser().token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            path: '/',
            domain: 'http://localhost:3000',
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
                global: 'Invalid credentials. Please make sure you entered the correct email address and password.',
            })

        // check user banned (true)
        if (user.banned)
            throw new UnauthorizedError('Banned User', null, {
                global: 'This user is banned. Please contact to admin',
            })

        // create cookie
        res.cookie(COOKIE_NAME, user.returnAuthUser().token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            path: '/',
            domain: 'http://localhost:3000',
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
        res.cookie(COOKIE_NAME, 'loggedout', {
            httpOnly: true,
            secure: true,
            expires: new Date(0),
            sameSite: 'none',
            path: '/',
            domain: 'http://localhost:3000',
        })
        return resSuccess(res)
    } catch (error) {
        next(new InternalServerError())
    }
}

// UPDATE USER PROFILE (name, email, image)
export const updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name, email
        // image can be empty
        type Variables = {
            name?: string
            email?: string
            image?: string
        }
        const variables: Variables = {}
        const { name, email, image = '' } = req.body

        if (name) variables.name = name
        if (email) variables.email = email
        // if (image) variables.image = image
        variables.image = image

        await updateUserValidate.validate(req.body, { abortEarly: false })

        const userLoggedIn = req.user as any
        // checke change email or not
        if (email !== userLoggedIn.email) {
            // user changed the email (entered another email)
            // check email is exist
            const isExistEmail = await userService.findUserByEmail(email)

            // if email entered is exist in database
            if (isExistEmail) {
                throw new BadRequestError(
                    'Update User Validate Email Error',
                    null,
                    {
                        email: 'This email is already taken',
                    }
                )
            }
        } else {
            // user not change the email
            delete variables.email
        }

        const user = await userService.updateUser(userLoggedIn._id, variables)
        return resSuccess(res, user)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Update User Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// CHANGE PASSWORD
export const changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name, email
        await changePasswordValidate.validate(req.body, { abortEarly: false })

        // check current password is correct
        const userLoggedIn = req.user as any

        const user = await userService.findUserById(userLoggedIn._id)
        const { currentPassword, password } = req.body

        if (!user || !user.isValidPassword(currentPassword))
            return next(
                new BadRequestError('Bad request', null, {
                    currentPassword: 'Current password is incorrect',
                })
            )

        // update password
        // hash password
        user.hashPassword(password)
        await userService.save(user)

        // create new cookie
        res.cookie(COOKIE_NAME, user.returnAuthUser().token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 30,
            sameSite: 'none',
            path: '/',
            domain: 'http://localhost:3000',
        })

        // return user with authentication
        return resSuccess(res, user.returnAuthUser())
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Change Password Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// DELETE USER
export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // if id isValid -> check user id is correct
        const user = await userService.findUserById(req.params._id)

        // if not found user
        if (!user)
            return next(
                new BadRequestError('Bad request - user id is incorrect')
            )

        // if user id correct -> proceed to delete the user
        await userService.deleteUser(user._id)
        return resSuccess(res, null)
    } catch (error) {
        next(error)
    }
}

// BAN USER
export const toggleBannedUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // find the user
        const user = await userService.findUserById(req.params._id)

        // if not found user
        if (!user)
            return next(
                new BadRequestError('Bad request - user id is incorrect')
            )

        // toggle banner
        user.banned = !user.banned

        // save the changed
        await userService.save(user)

        return resSuccess(res, user.returnUser())
    } catch (error) {
        next(error)
    }
}

// FORGOT PASSWORD
export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: email
        await forgotPasswordValidate.validate(req.body, { abortEarly: false })

        // get user base on email
        const { email } = req.body
        const user = await userService.findUserByEmail(email)
        if (!user)
            throw new BadRequestError('Email is not available', null, {
                email: 'Email is not available, please enter correct email',
            })

        // create token reset password
        const resetToken = user.createTokenResetPassword()
        await userService.save(user)

        // const resetUrl = `http://localhost:5001/api/v1/users/reset-password/${resetToken}`
        const resetUrl = `http://localhost:3000/user/reset-password/${resetToken}`

        // sent the email
        try {
            sendEmail(email, resetUrl)
        } catch (error) {
            throw new Error('Send email error')
        }

        res.status(200).json({
            status: 'success',
            message:
                'Token sent to email! Please check your email to reset password',
        })
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Forgot Password Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// RESET PASSWORD
export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get user based on the token
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')

        // console.log(hashedToken)

        // find user with have the token
        const user = await userService.findUserByTokenResetPassword(hashedToken)

        if (!user)
            throw new BadRequestError(
                'Can not find the user, token reset password is invalid'
            )

        // validate password and confirmPassword
        await resetPasswordValidate.validate(req.body, { abortEarly: false })

        user.hashPassword(req.body.password)
        user.tokenResetPassword = ''

        await userService.save(user)

        return resSuccess(res, null)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Reset Password Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}
