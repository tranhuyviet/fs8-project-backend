import * as Yup from 'yup'

const name = Yup.string()
    .min(3, 'Name must be at least 3 characters!')
    .max(50, 'Name cannot be longer than 50 characters!')
    .required('Name cannot be empty!')

export const variantValidate = Yup.object({ name })
