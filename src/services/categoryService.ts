import Category, { CategoryDocument } from '../models/categoryModel'

const save = async (category: CategoryDocument): Promise<CategoryDocument> => {
    return category.save()
}

const findByName = async (name: string): Promise<CategoryDocument> => {
    return Category.findOne({ name })
}

const getAllCategories = async (): Promise<CategoryDocument[]> => {
    return Category.find({})
}

export default {
    save,
    findByName,
    getAllCategories,
}
