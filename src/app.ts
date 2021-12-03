import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'

// Import routes
import userRoutes from './routers/userRoutes'
import categoryRoutes from './routers/categoryRoutes'
import variantRoutes from './routers/variantRoutes'
import sizeRoutes from './routers/sizeRoutes'
import productRoutes from './routers/productRoutes'
import cartRoutes from './routers/cartRoutes'

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
// app.use(cors({ credentials: true, origin: 'https://fs8-project.vercel.app' }))
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))

// handling CORS errors
app.use((req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', '*')
    // res.setHeader(
    //     'Access-Control-Allow-Headers',
    //     'Origin, Content-Type, X-Requested-With, Accept, Authorization'
    // )
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    res.header('Content-Type', 'application/json;charset=UTF-8')
    res.header('Access-Control-Allow-Credentials')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    next()
})

// ROUTES
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v1/variants', variantRoutes)
app.use('/api/v1/sizes', sizeRoutes)
app.use('/api/v1/products', productRoutes)
app.use('/api/v1/carts', cartRoutes)

// Custom API error handler
app.use(apiErrorHandler)

export default app
