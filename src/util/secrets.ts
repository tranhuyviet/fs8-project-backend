import dotenv from 'dotenv'
import fs from 'fs'

import logger from './logger'

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables')
    dotenv.config({ path: '.env' })
} else {
    logger.debug(
        'Using .env.example file to supply config environment variables'
    )
    dotenv.config({ path: '.env.example' }) // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV
const prod = ENVIRONMENT === 'production' // Anything else is treated as 'dev'

// EMAIL
export const EMAIL_HOST = process.env['EMAIL_HOST']
export const EMAIL_PORT = process.env['EMAIL_PORT']
export const EMAIL_USER = process.env['EMAIL_USER']
export const EMAIL_PASS = process.env['EMAIL_PASS']

// GOOGLE
export const GOOGLE_CLIENT_ID = process.env['GOOGLE_CLIENT_ID']
export const GOOGLE_CLIENT_SECRET = process.env['GOOGLE_CLIENT_SECRET']
export const GOOGLE_REFRESH_TOKEN = process.env['GOOGLE_REFRESH_TOKEN']

export const PORT = process.env['PORT']
export const JWT_COOKIE_EXPIRES_IN = process.env['JWT_COOKIE_EXPIRES_IN']
export const JWT_SECRET = process.env['JWT_SECRET'] as string
export const MONGODB_URI = (
    prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI']
) as string

if (!JWT_SECRET) {
    logger.error('No client secret. Set JWT_SECRET environment variable.')
    process.exit(1)
}

if (!MONGODB_URI) {
    if (prod) {
        logger.error(
            'No mongo connection string. Set MONGODB_URI environment variable.'
        )
    } else {
        logger.error(
            'No mongo connection string. Set MONGODB_URI_LOCAL environment variable.'
        )
    }
    process.exit(1)
}
