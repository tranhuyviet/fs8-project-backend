import Variant, { VariantDocument } from '../models/variantModel'

const save = async (variant: VariantDocument): Promise<VariantDocument> => {
    return variant.save()
}

const findByName = async (name: string): Promise<VariantDocument> => {
    return Variant.findOne({ name })
}

const findById = async (_id: string): Promise<VariantDocument> => {
    return Variant.findById(_id)
}

const getAllVariants = async (): Promise<VariantDocument[]> => {
    return Variant.find({})
}

const updateVariant = async (
    _id: string,
    variables: VariantDocument
): Promise<VariantDocument> => {
    return Variant.findByIdAndUpdate(_id, variables, {
        new: true,
        runValidators: true,
    })
}

const deleteVariant = async (_id: string): Promise<VariantDocument> => {
    return Variant.findByIdAndDelete(_id)
}

export default {
    save,
    findByName,
    findById,
    getAllVariants,
    updateVariant,
    deleteVariant,
}
