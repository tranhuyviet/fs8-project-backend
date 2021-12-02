import { Request, Response, NextFunction } from 'express'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import mongoose from 'mongoose'
import { CartItems, Item } from '../models/userModel'
import productService from '../services/productService'
import userService from '../services/userService'
import { resSuccess } from '../util/returnRes'

// ADD TO CART AND UPDATE ITEMS CART (OVERWRIDE WITH CART PAYMENT = FALSE)
export const addToCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const cartItems: CartItems = req.body as CartItems

        console.log(cartItems)
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
        let carts = [...user.carts]

        // find the cart payment = true and copy it
        carts = carts.filter((cart) => cart.payment === true)

        // only have one cart with payment = false
        // overwrite the cart with payment = false
        const updatedCarts = [...carts, cartItems]
        user.carts = updatedCarts

        await userService.save(user)

        //populate
        await user.populate({
            path: 'carts',
            populate: {
                path: 'items',
                populate: [
                    {
                        path: 'product',
                        select: 'name price discount images',
                    },
                    {
                        path: 'variant',
                        select: 'name colorHex',
                    },
                    {
                        path: 'size',
                        select: 'name',
                    },
                ],
            },
        })

        // console.log('USER', user)

        // find the cart have just save (payment = false)
        const returnCart = user.carts.find((cart) => cart.payment === false)
        return resSuccess(res, returnCart)
    } catch (error) {
        next(error)
    }
}

// CLEAR CART (DELETE CART - ONLY DELETE CART WITH PAYMENT = FALSE)
export const clearCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // get the user carts (logged in user)
        const userLoggedIn = req.user as any
        const user = await userService.findUserById(userLoggedIn._id)
        let carts = [...user.carts]

        // find the cart payment = true and copy it
        carts = carts.filter((cart) => cart.payment === true)

        // clear cart that mean remove cart with payment = false, only keep carts payment = true
        user.carts = carts
        await userService.save(user)

        return resSuccess(res, null)
    } catch (error) {
        next(error)
    }
}

// PAYMENT THE CART
export const paymentCart = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // get the user carts (logged in user)
        const userLoggedIn = req.user as any
        const user = await userService.findUserById(userLoggedIn._id)
        const carts = [...user.carts]

        carts.map((cart) => {
            // check payment = false and cart id is correct -> set payment = true
            if (
                cart.payment === false &&
                cart._id.toString() === req.params._id.toString()
            ) {
                cart.payment = true
            }
            return cart
        })

        user.carts = carts
        await userService.save(user)

        return resSuccess(res, user.carts)
    } catch (error) {
        next(error)
    }
}
