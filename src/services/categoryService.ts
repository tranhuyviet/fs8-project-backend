import Category, { CategoryDocument } from '../models/categoryModel'

const save = async (category: CategoryDocument): Promise<CategoryDocument> => {
    return category.save()
}

const findByName = async (name: string): Promise<CategoryDocument> => {
    return Category.findOne({ name })
}

export default {
    save,
    findByName,
}
