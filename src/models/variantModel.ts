import mongoose, { Document } from 'mongoose'

const { Schema, model, models } = mongoose

export type VariantDocument = Document & {
    name: string
}

const variantSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
})

const Variant = models.variants || model('variants', variantSchema)

export default Variant
