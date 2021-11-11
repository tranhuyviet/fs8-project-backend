import Product, { ProductDocument } from '../models/productModel'

const save = async (product: ProductDocument): Promise<ProductDocument> => {
    return product.save()
}

const getAllProducts = async (): Promise<ProductDocument[]> => {
    return Product.find({})
}

export default {
    save,
    getAllProducts,
}
