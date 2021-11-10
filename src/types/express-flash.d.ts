import { ReturnUser } from '../models/userModel'
/// <reference types="express" />

/**
 * This type definition augments existing definition
 * from @types/express-flash
 */
declare namespace Express {
    export interface Request {
        flash(event: string, message: any): any
    }
    export interface Request {
        user?: ReturnUser
    }
}

interface Flash {
    flash(type: string, message: any): void
}

declare module 'express-flash'
