import { Request, Response, NextFunction } from 'express'
import User, { UserDocument } from '../models/userModel'
import {
    signupValidate,
    loginValidate,
    updateUserValidate,
    changePasswordValidate,
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

        // check user banned (true)
        if (user.banned)
            throw new UnauthorizedError('Banned User', null, {
                global: 'This user is banned. Please contact to admin',
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
        const { name, email, image } = req.body

        if (name) variables.name = name
        if (email) variables.email = email
        if (image) variables.image = image

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
        res.cookie('jwt-ecommerce-website', user.returnAuthUser().token, {
            httpOnly: true,
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
        // check user id is correct
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
