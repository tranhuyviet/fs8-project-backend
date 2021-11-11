import { CategoryDocument } from './../models/categoryModel'
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
import mongoose from 'mongoose'

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
        const variables: CategoryDocument = req.body as CategoryDocument

        const { name } = variables

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

// UPDATE CATEGORY
export const updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name
        await categoryValidate.validate(req.body, { abortEarly: false })

        // check the name of category exist
        const variables: CategoryDocument = req.body as CategoryDocument
        const { name } = variables

        const isExist = await categoryService.findByName(name)
        if (isExist)
            throw new BadRequestError('Category name error', null, {
                name: 'This category name is already taken',
            })

        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // if id isValid -> find category with the ID
        const isCategory = await categoryService.findById(req.params._id)
        if (!isCategory)
            throw new BadRequestError('Category not found, ID proviced invalid')

        // update category
        const category = await categoryService.updateCategory(
            req.params._id,
            variables
        )

        // return category
        return resSuccess(res, category)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Update Category Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// DELETE CATEGORY
export const deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // find the category
        const category = await categoryService.findById(req.params._id)
        if (!category)
            throw new BadRequestError('Category not found, ID proviced invalid')

        // if found category -> delete category
        await categoryService.deleteCategory(category._id)

        return resSuccess(res, null)
    } catch (error) {
        next(error)
    }
}
