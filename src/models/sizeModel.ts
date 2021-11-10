import mongoose, { Document } from 'mongoose'

const { Schema, model, models } = mongoose

export type SizeDocument = Document & {
    name: string
}

const sizeSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
})

const Size = models.sizes || model('sizes', sizeSchema)

export default Size
