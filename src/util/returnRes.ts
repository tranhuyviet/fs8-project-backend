import { Response } from 'express'
export const resError = (
    res: Response,
    message: string,
    errors: object | null,
    code: number
) => {
    return res.status(code).json({
        status: 'error',
        message,
        errors,
    })
}

export const resSuccess = (
    res: Response,
    data: any = null,
    code: number = 200
) => {
    return res.status(code).json({
        status: 'success',
        data,
    })
}
