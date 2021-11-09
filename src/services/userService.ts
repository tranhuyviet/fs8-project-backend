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

export default {
    create,
    getAllUsers,
    findUserByEmail,
}
