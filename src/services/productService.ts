import Product, { ProductDocument } from '../models/productModel'

const save = async (product: ProductDocument): Promise<ProductDocument> => {
    return product.save()
}

const getAllProducts = async (
    skip: number,
    limit: number
): Promise<ProductDocument[]> => {
    return Product.find({}).skip(skip).limit(limit)
}

// calculate total number of products
const total = async (): Promise<number> => {
    return Product.find({}).countDocuments()
}

const findById = async (_id: string): Promise<ProductDocument> => {
    return Product.findById(_id)
}

const updateProduct = async (
    _id: string,
    variables: ProductDocument
): Promise<ProductDocument> => {
    return Product.findByIdAndUpdate(_id, variables, {
        new: true,
        runValidators: true,
    })
}

const deleteProduct = async (_id: string): Promise<ProductDocument> => {
    return Product.findByIdAndDelete(_id)
}

export default {
    save,
    getAllProducts,
    findById,
    updateProduct,
    deleteProduct,
    total,
}
