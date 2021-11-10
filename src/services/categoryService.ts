import Category, { CategoryDocument } from '../models/categoryModel'

const save = async (category: CategoryDocument): Promise<CategoryDocument> => {
    return category.save()
}

const findByName = async (name: string): Promise<CategoryDocument> => {
    return Category.findOne({ name })
}

const findById = async (_id: string): Promise<CategoryDocument> => {
    return Category.findById(_id)
}

const getAllCategories = async (): Promise<CategoryDocument[]> => {
    return Category.find({})
}

const updateCategory = async (
    _id: string,
    variables: object
): Promise<CategoryDocument> => {
    return Category.findByIdAndUpdate(_id, variables, {
        new: true,
        runValidators: true,
    })
}

const deleteCategory = async (_id: string): Promise<CategoryDocument> => {
    return Category.findByIdAndDelete(_id)
}

export default {
    save,
    findByName,
    findById,
    getAllCategories,
    updateCategory,
    deleteCategory,
}
