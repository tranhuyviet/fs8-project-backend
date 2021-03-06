import * as Yup from 'yup'

const name = Yup.string()
    .min(3, 'Name must be at least 3 characters!')
    .max(50, 'Name cannot be longer than 50 characters!')
    .required('Name cannot be empty!')
const email = Yup.string()
    .required('Email cannot be empty!')
    .email('Invalid email format!')
const password = Yup.string()
    .min(6, 'Password must be at least 6 characters!')
    .required('Password cannot be empty!')
const confirmPassword = Yup.string()
    .required('Confirm Password cannot be empty!')
    .oneOf([Yup.ref('password')], 'Password not match!')
const currentPassword = Yup.string()
    .min(6, 'Current Password must be at least 6 characters!')
    .required('Current Password cannot be empty!')

export const signupValidate = Yup.object({
    name,
    email,
    password,
    confirmPassword,
})

export const loginValidate = Yup.object({
    email,
    password,
})

export const updateUserValidate = Yup.object({
    name,
    email,
})

export const changePasswordValidate = Yup.object({
    currentPassword,
    password,
    confirmPassword,
})

export const forgotPasswordValidate = Yup.object({
    email,
})

export const resetPasswordValidate = Yup.object({
    password,
    confirmPassword,
})
