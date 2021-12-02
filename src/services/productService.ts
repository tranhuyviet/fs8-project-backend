import Product, { ProductDocument } from '../models/productModel'

const save = async (product: ProductDocument): Promise<ProductDocument> => {
    return product.save()
}

type Query = {
    name?: string
}

const getAllProducts = async (
    skip: number,
    limit: number,
    name: string,
    category: string,
    variant: string,
    size: string
): Promise<ProductDocument[]> => {
    let query: any = {}
    const arrayAND: any = []

    if (name && name !== 'undefined') {
        const splitName = name.split(' ')
        for (const name of splitName) {
            arrayAND.push({ name: { $regex: `.*${name}.*`, $options: 'i' } })
        }
    }

    if (category && category !== 'undefined') {
        arrayAND.push({ category: category })
    }

    if (variant && variant !== 'undefined') {
        arrayAND.push({ variants: { $eq: variant } })
    }

    if (size && size !== 'undefined') {
        arrayAND.push({ sizes: { $eq: size } })
    }

    if (arrayAND.length > 0) {
        query = { $and: arrayAND }
    }

    return Product.find(query)
        .skip(skip)
        .limit(limit)
        .populate([
            { path: 'variants', select: 'name colorHex' },
            { path: 'sizes', select: 'name' },
        ])
}

// calculate total number of products
const total = async (
    name: string,
    category: string,
    variant: string,
    size: string
): Promise<number> => {
    let query: any = {}
    const arrayAND: any = []

    if (name && name !== 'undefined') {
        const splitName = name.split(' ')
        for (const name of splitName) {
            arrayAND.push({ name: { $regex: `.*${name}.*`, $options: 'i' } })
        }
    }

    if (category && category !== 'undefined') {
        arrayAND.push({ category: category })
    }

    if (variant && variant !== 'undefined') {
        arrayAND.push({ variants: { $eq: variant } })
    }

    if (size && size !== 'undefined') {
        arrayAND.push({ sizes: { $eq: size } })
    }

    if (arrayAND.length > 0) {
        query = { $and: arrayAND }
    }
    return Product.find(query).countDocuments()
}

const suggession = async (
    category: string,
    _id: string
): Promise<ProductDocument[]> => {
    return Product.find({ $and: [{ category }, { _id: { $ne: _id } }] })
        .limit(4)
        .populate([
            { path: 'variants', select: 'name colorHex' },
            { path: 'sizes', select: 'name' },
        ])
}

const findById = async (_id: string): Promise<ProductDocument> => {
    return Product.findById(_id).populate([
        {
            path: 'variants',
            select: 'name colorHex',
        },
        {
            path: 'sizes',
            select: 'name',
        },
    ])
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
    suggession,
    updateProduct,
    deleteProduct,
    total,
}
