import User, { UserDocument } from '../models/userModel'

const create = async (user: UserDocument): Promise<UserDocument> => {
    return user.save()
}

export default {
    create,
}
