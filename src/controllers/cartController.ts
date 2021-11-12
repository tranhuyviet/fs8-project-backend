import { Request, Response, NextFunction } from 'express'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import mongoose from 'mongoose'
import { CartItems } from '../models/userModel'
import productService from '../services/productService'
import userService from '../services/userService'
import { resSuccess } from '../util/returnRes'
// ADD TO CART
export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cartItems: CartItems = req.body as CartItems

        // checking isValid ids
        for (const item of cartItems.items) {
            const isCorrectId = mongoose.Types.ObjectId.isValid(item.product)
            if (!isCorrectId) throw new BadRequestError('ID proviced invalid')
        }

        // check product exist
        for (const item of cartItems.items) {
            const isExistProduct = await productService.findById(item.product)
            if (!isExistProduct)
                throw new BadRequestError('Error Input', null, {
                    product: 'Not found the product with the ID',
                })
        }

        // check quantity is integer and > 0
        for (const item of cartItems.items) {
            if (!(Number.isInteger(item.quantity) && item.quantity > 0))
                throw new BadRequestError('Error Input', null, {
                    quantity: 'Quantity have to be integer and greater than 0',
                })
        }

        // update cart to user
        const userLoggedIn = req.user as any
        const user = await userService.findUserById(userLoggedIn._id)
        const carts = [...user.carts]
        const updatedCarts = [...carts, cartItems]
        user.carts = updatedCarts
        await userService.save(user)

        return resSuccess(res, user)
    } catch (error) {
        next(error)
    }
}
