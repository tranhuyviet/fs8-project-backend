import * as Yup from 'yup'

const name = Yup.string()
    .min(3, 'Name must be at least 3 characters!')
    .max(50, 'Name cannot be longer than 50 characters!')
    .required('Name cannot be empty!')

const colorHex = Yup.string()
    .required('Color cannot be empty!')
    .min(7, 'Color cannot be less than 7 characters')
    .max(7, 'Color cannot be longer than 7 characters!')

export const variantValidate = Yup.object({ name, colorHex })
