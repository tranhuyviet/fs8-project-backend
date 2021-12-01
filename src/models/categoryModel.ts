import mongoose, { Document } from 'mongoose'

const { Schema, model, models } = mongoose

export type CategoryDocument = Document & {
    name: string
}

const categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
    },
})

const Category = models.categories || model('categories', categorySchema)

export default Category
