import User, { UserDocument } from '../models/userModel'

const create = async (user: UserDocument): Promise<UserDocument> => {
    return user.save()
}

const getAllUsers = async (): Promise<UserDocument[]> => {
    return User.find({}, { password: 0, tokenResetPassword: 0 })
}

const findUserByEmail = async (email: string): Promise<UserDocument> => {
    return User.findOne({ email })
}

const findUserById = async (_id: string): Promise<UserDocument> => {
    return User.findById(_id)
}

const updateUser = async (
    _id: string,
    variables: object
): Promise<UserDocument> => {
    return User.findByIdAndUpdate(_id, variables, {
        new: true,
        runValidators: true,
    }).select('-password -tokenResetPassword')
}

export default {
    create,
    getAllUsers,
    findUserByEmail,
    findUserById,
    updateUser,
}
