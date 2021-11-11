import Product, { ProductDocument } from '../models/productModel'

const save = async (product: ProductDocument): Promise<ProductDocument> => {
    return product.save()
}

const getAllProducts = async (): Promise<ProductDocument[]> => {
    return Product.find({})
}

const findById = async (_id: string): Promise<ProductDocument> => {
    return Product.findById(_id)
}

const deleteProduct = async (_id: string): Promise<ProductDocument> => {
    return Product.findByIdAndDelete(_id)
}

export default {
    save,
    getAllProducts,
    findById,
    deleteProduct,
}
