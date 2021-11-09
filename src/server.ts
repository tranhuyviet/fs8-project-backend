import errorHandler from 'errorhandler'
import mongoose from 'mongoose'

import app from './app'
import { MONGODB_URI, PORT } from './util/secrets'

const mongoUrl = MONGODB_URI
const port = PORT || 5001

;(async () => {
    try {
        await mongoose.connect(mongoUrl)
        console.log('Database connected successfully')
        app.listen(port, () => {
            console.log('Server stated at port:', port)
        })
    } catch (error) {
        console.error('Database connection failed', error)
    }
})()

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())
