import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'
import compression from 'compression'
import cookieParser from 'cookie-parser'

import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

// Import routes
import userRoutes from './routers/userRoutes'
import categoryRoutes from './routers/categoryRoutes'
import variantRoutes from './routers/variantRoutes'
import sizeRoutes from './routers/sizeRoutes'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.use(apiContentType)

// Use common 3rd-party middlewares
app.use(compression())
app.use(express.json())
app.use(cookieParser())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// ROUTES
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/variants', variantRoutes)
app.use('/api/v1/sizes', sizeRoutes)

// Custom API error handler
app.use(apiErrorHandler)

export default app
