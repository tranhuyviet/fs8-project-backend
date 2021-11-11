import { Request, Response, NextFunction } from 'express'
import { sizeValidate } from '../util/validateSize'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import { errorParse } from '../util/errorParse'
import { resSuccess } from '../util/returnRes'
import Size, { SizeDocument } from '../models/sizeModel'
import sizeService from '../services/sizeService'
import mongoose from 'mongoose'

// CREATE NEW SIZE
export const createSize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name
        await sizeValidate.validate(req.body, { abortEarly: false })

        // check the name of size exist
        const { name } = req.body
        const isExist = await sizeService.findByName(name)
        if (isExist)
            throw new BadRequestError('Size name error', null, {
                name: 'This size name is already taken',
            })

        // create new size
        const size = new Size({ name })

        // save size to db
        await sizeService.save(size)

        // return size
        return resSuccess(res, size)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Create Size Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// GET ALL SIZES
export const getAllSizes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sizes = await sizeService.getAllSizes()
        if (!sizes) throw new NotFoundError('Not found any sizes')

        return resSuccess(res, sizes)
    } catch (error) {
        next(error)
    }
}

// UPDATE SIZE
export const updateSize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name
        await sizeValidate.validate(req.body, { abortEarly: false })

        // check the name of size exist
        const variables: SizeDocument = req.body as SizeDocument
        const { name } = variables
        const isExist = await sizeService.findByName(name)
        if (isExist)
            throw new BadRequestError('Size name error', null, {
                name: 'This size name is already taken',
            })

        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // if id isValid -> find size with the ID
        const isSize = await sizeService.findById(req.params._id)
        if (!isSize)
            throw new BadRequestError('Size not found, ID proviced invalid')

        // update size
        const size = await sizeService.updateSize(req.params._id, variables)

        // return size
        return resSuccess(res, size)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Update Size Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// DELETE SIZE
export const deleteSize = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // find the size
        const size = await sizeService.findById(req.params._id)
        if (!size)
            throw new BadRequestError('Size not found, ID proviced invalid')

        // if found size -> delete size
        await sizeService.deleteSize(size._id)

        return resSuccess(res, null)
    } catch (error) {
        next(error)
    }
}
