import { Request, Response, NextFunction } from 'express'
import { categoryValidate } from '../util/validateCategory'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import { errorParse } from '../util/errorParse'
import { resSuccess } from '../util/returnRes'
import Category from '../models/categoryModel'
import categoryService from '../services/categoryService'

// CREATE NEW CATEGORY
export const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name
        await categoryValidate.validate(req.body, { abortEarly: false })

        // check the name of category exist
        const { name } = req.body
        const isExist = await categoryService.findByName(name)
        if (isExist)
            throw new BadRequestError('Category name error', null, {
                name: 'This category name is already taken',
            })

        // create new category
        const category = new Category({ name })

        // save category to db
        await categoryService.save(category)

        // return category
        return resSuccess(res, category)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Create Category Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// GET ALL CATEGORIES
export const getAllCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categories = await categoryService.getAllCategories()
        if (!categories) throw new NotFoundError('Not found any categories')

        return resSuccess(res, categories)
    } catch (error) {
        next(error)
    }
}
