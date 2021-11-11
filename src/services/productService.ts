import Product, { ProductDocument } from '../models/productModel'

const save = async (product: ProductDocument): Promise<ProductDocument> => {
    return product.save()
}

export default {
    save,
}
