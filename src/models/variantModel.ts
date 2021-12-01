import mongoose, { Document } from 'mongoose'

const { Schema, model, models } = mongoose

export type VariantDocument = Document & {
    name: string
    colorHex: string
}

const variantSchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
    },
    colorHex: {
        type: String,
        unique: true,
        lowercase: true,
    },
})

const Variant = models.variants || model('variants', variantSchema)

export default Variant
