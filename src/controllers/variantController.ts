import { Request, Response, NextFunction } from 'express'
import { variantValidate } from '../util/validateVariant'
import {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError,
} from '../helpers/apiError'
import { errorParse } from '../util/errorParse'
import { resSuccess } from '../util/returnRes'
import Variant, { VariantDocument } from '../models/variantModel'
import variantService from '../services/variantService'
import mongoose from 'mongoose'

// CREATE NEW VARIANT
export const createVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name, colorHex
        await variantValidate.validate(req.body, { abortEarly: false })

        // check the name of variant exist
        const { name, colorHex } = req.body
        const isExist = await variantService.findByName(name)
        if (isExist)
            throw new BadRequestError('Variant name error', null, {
                name: 'This variant name is already taken',
            })

        const isColorHexExist = await variantService.findByColorHex(colorHex)
        if (isColorHexExist)
            throw new BadRequestError('Variant color hex error', null, {
                colorHex: 'This variant color hex is already taken',
            })

        // create new variant
        const variant = new Variant({ name, colorHex })

        // save variant to db
        await variantService.save(variant)

        // return variant
        return resSuccess(res, variant)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Create Variant Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// GET ALL VARIANTS
export const getAllVariants = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const variants = await variantService.getAllVariants()
        if (!variants) throw new NotFoundError('Not found any variants')

        return resSuccess(res, variants)
    } catch (error) {
        next(error)
    }
}

// UPDATE VARIANT
export const updateVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking validate: name, color
        await variantValidate.validate(req.body, { abortEarly: false })

        // check the name of variant exist
        const variables: VariantDocument = req.body as VariantDocument
        const { name } = variables

        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // if id isValid -> find variant with the ID
        const isVariant = await variantService.findById(req.params._id)
        if (!isVariant)
            throw new BadRequestError('Variant not found, ID proviced invalid')

        // check name change or not
        if (name !== isVariant.name) {
            // if the name changed, check with another name
            const isExist = await variantService.findByName(name)
            if (isExist)
                throw new BadRequestError('Variant name error', null, {
                    name: 'This variant name is already taken',
                })
        }

        // update variant
        const variant = await variantService.updateVariant(
            req.params._id,
            variables
        )

        // return variant
        return resSuccess(res, variant)
    } catch (error) {
        if (error instanceof Error && error.name == 'ValidationError') {
            next(
                new BadRequestError(
                    'Update Variant Validate Error',
                    error,
                    errorParse(error)
                )
            )
        } else {
            next(error)
        }
    }
}

// DELETE VARIANT
export const deleteVariant = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // checking isValid id
        const isCorrectId = mongoose.Types.ObjectId.isValid(req.params._id)
        if (!isCorrectId) throw new BadRequestError('ID proviced invalid')

        // find the variant
        const variant = await variantService.findById(req.params._id)
        if (!variant)
            throw new BadRequestError('Variant not found, ID proviced invalid')

        // if found variant -> delete variant
        await variantService.deleteVariant(variant._id)

        return resSuccess(res, null)
    } catch (error) {
        next(error)
    }
}
