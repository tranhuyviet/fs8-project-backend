import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const { Schema, model, models, Types } = mongoose

export interface ReturnUser {
    _id: string
    name: string
    email: string
    image?: string
    role: string
    banned: boolean
    token?: string
    createdAt?: string
    updatedAt?: string
}

export interface Item {
    product: string
    quantity: number
}

export interface CartItems {
    payment: boolean
    items: Item[]
    createdAt: string
    updatedAt: string
}

export type UserDocument = Document & {
    name: string
    email: string
    image?: string
    password?: string
    role: string
    banned: boolean
    tokenResetPassword: string
    carts: CartItems[]
    createdAt: string
    updatedAt: string
    hashPassword: (password: string) => void
    isValidPassword: (password: string) => boolean
    correctPassword: (currentPass: string, inputPass: string) => boolean
    returnAuthUser: () => ReturnUser
    returnUser: () => ReturnUser
}

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        image: {
            type: String,
            default:
                'https://res.cloudinary.com/dzaxf70c4/image/upload/v1636489332/avatar_tcj5dx.png',
        },
        password: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        banned: {
            type: Boolean,
            default: false,
        },
        tokenResetPassword: {
            type: String,
            default: '',
        },
        carts: [
            new Schema(
                {
                    payment: {
                        type: Boolean,
                        default: false,
                    },
                    items: [
                        new Schema(
                            {
                                product: {
                                    type: Types.ObjectId,
                                    ref: 'products',
                                },
                                quantity: {
                                    type: Number,
                                    default: 0,
                                },
                            },
                            { _id: false }
                        ),
                    ],
                },
                { timestamps: true }
            ),
        ],
    },
    { timestamps: true }
)

// function hash password before store to database
userSchema.methods.hashPassword = function hashPassword(password) {
    this.password = bcrypt.hashSync(password, 12)
}

// function compare input password and password in db, return true if match and false if not match
userSchema.methods.isValidPassword = function isValidPassword(
    password
): boolean {
    return bcrypt.compareSync(password, this.password)
}

// function generate json web token
userSchema.methods.generateJWT = function generateJWT() {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            image: this.image,
        },
        process.env.JWT_SECRET as string
    )
}

// function return infomation of logged in user
userSchema.methods.returnAuthUser = function returnAuthUser() {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        image: this.image,
        role: this.role,
        banned: this.banned,
        token: this.generateJWT(),
    }
}

// this function will return infomation of user, remove password and some infomation no need to return
userSchema.methods.returnUser = function returnUser(): ReturnUser {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        image: this.image,
        role: this.role,
        banned: this.banned,
        updatedAt: this.updatedAt,
    }
}

const User = models.users || model<UserDocument>('users', userSchema)

export default User
