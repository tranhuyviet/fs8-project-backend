import * as Yup from 'yup'

const name = Yup.string()
    .max(50, 'Name cannot be longer than 50 characters!')
    .required('Name cannot be empty!')

export const sizeValidate = Yup.object({ name })
