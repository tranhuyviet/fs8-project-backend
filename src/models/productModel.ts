import mongoose, { Document } from 'mongoose'

const { Schema, model, models, Types } = mongoose

export type ProductDocument = Document & {
    name: string
    description: string
    price: number
    discount: number
    images?: string[]
    category: string
    variants: string[]
    sizes: string[]
    user: string
}

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        // discount percentage, ex 20 -> 20%
        discount: {
            type: Number,
            default: 0,
        },
        // array of images (url)
        images: [String],
        category: {
            type: Types.ObjectId,
            ref: 'categories',
        },
        // array of colors (red, green, pink,...)
        variants: [
            {
                type: Types.ObjectId,
                ref: 'variants',
            },
        ],
        // array of sizes (XS,S,M,L,XL,...)
        sizes: [
            {
                type: Types.ObjectId,
                ref: 'sizes',
            },
        ],
        // user create or update product (admin roll)
        user: {
            type: Types.ObjectId,
            ref: 'users',
        },
    },
    { timestamps: true }
)

const Product = models.products || model('products', productSchema)

export default Product
