import { Request, Response, NextFunction } from 'express'
import { createProductValidate } from '../util/validateProduct'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import { errorParse } from '../util/errorParse'
import { resSuccess } from '../util/returnRes'
import mongoose from 'mongoose'
import Product, { ProductDocument } from '../models/productModel'

// import services
import categoryService from '../services/categoryService'
import userService from '../services/userService'
import variantService from '../services/variantService'
import sizeService from '../services/sizeService'
import productService from '../services/productService'

// CREATE NEW PRODUCT
export const createProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // console.log(req.body)
        await createProductValidate.validate(req.body, { abortEarly: false })

        const {
            name,
            description,
            price,
            discount,
            images,
            category,
            user,
            variants,
            sizes,
        } = req.body as ProductDocument

        // checking isValid id category:
        const isValidIdCategory = mongoose.Types.ObjectId.isValid(category)
        if (!isValidIdCategory)
            throw new BadRequestError('Error input', null, {
                category: 'ID category proviced invalid',
            })

        // checking isValid id user:
        const isValidIdUser = mongoose.Types.ObjectId.isValid(user)
        if (!isValidIdUser)
            throw new BadRequestError('Error input', null, {
                user: 'ID user proviced invalid',
            })

        // checking array variants empty
        if (typeof variants !== 'object' || variants.length === 0)
            throw new BadRequestError('Error input', null, {
                variants: 'Must have at least one variant in array',
            })

        // checking item in array variants is ObjectId
        variants.forEach((variant) => {
            if (!mongoose.Types.ObjectId.isValid(variant))
                throw new BadRequestError('Error input', null, {
                    variants:
                        'Variant item in variants array must be object id',
                })
        })

        // checking array sizes empty
        if (typeof sizes !== 'object' || sizes.length === 0)
            throw new BadRequestError('Error input', null, {
                sizes: 'Must have at least one size in array',
            })

        // checking item in array sizes is ObjectId
        sizes.forEach((size) => {
            if (!mongoose.Types.ObjectId.isValid(size))
                throw new BadRequestError('Error input', null, {
                    sizes: 'Size item in sizes array must be object id',
                })
        })

        // USING SERVICES CHECKING THE ID IS EXIST IN DATABASE
        // checking category
        const categoryExist = await categoryService.findById(category)
        if (!categoryExist)
            throw new BadRequestError('Error input', null, {
                cagegory: 'Can not found category with the ID',
            })

        // checking user
        const userExist = await userService.findUserById(user)
        if (!userExist)
            throw new BadRequestError('Error input', null, {
                user: 'Can not found user with the ID',
            })

        // checking variants
        for (const variant of variants) {
            const variantExist = await variantService.findById(variant)
            if (!variantExist) {
                throw new BadRequestError('Error input', null, {
                    variants: 'Can not found variant with the ID',
                })
            }
        }

        // checking sizes
        for (const size of sizes) {
            const sizeExist = await sizeService.findById(size)
            if (!sizeExist) {
                throw new BadRequestError('Error input', null, {
                    sizes: 'Can not found size with the ID',
                })
            }
        }

        // AFTER CHECKING VALIDATE AND IS EXIST IN DATABASE -> CREATE NEW PRODUCT
        const product = new Product({
            name,
            description,
            price,
            discount,
            images,
            category,
            user,
            variants,
            sizes,
        })

        // save product to database
        await productService.save(product)

        // return product
        return resSuccess(res, product)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Create Product Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            console.log('heeeeere')
            next(error)
        }
    }
}

// GET All PRODUCTS
export const getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await productService.getAllProducts()
        if (!products) throw new NotFoundError('Not found any products')

        return resSuccess(res, products)
    } catch (error) {
        next(error)
    }
}

// GET PRODUCT BY ID
export const getProductById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        console.log(req.params._id)
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // find the product
        const product = await productService.findById(req.params._id)
        if (!product)
            throw new BadRequestError('Product not found, ID proviced invalid')

        // populate
        await product.populate({
            path: 'category',
            select: 'name',
        })
        await product.populate({
            path: 'user',
            select: 'name email image',
        })
        await product.populate({
            path: 'variants',
            select: 'name',
        })
        await product.populate({
            path: 'sizes',
            select: 'name',
        })

        // return product
        return resSuccess(res, product)
    } catch (error) {
        next(error)
    }
}
