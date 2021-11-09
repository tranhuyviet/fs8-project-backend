import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'
import compression from 'compression'

import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

// Import routes
import movieRouter from './routers/movie'
import userRoutes from './routers/userRoutes'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.use(apiContentType)

// Use common 3rd-party middlewares
app.use(compression())
app.use(express.json())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// ROUTES
app.use('/api/v1/movies', movieRouter)
app.use('/api/v1/users', userRoutes)

// Custom API error handler
app.use(apiErrorHandler)

export default app
