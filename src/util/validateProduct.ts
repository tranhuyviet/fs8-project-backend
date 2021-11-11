import * as Yup from 'yup'

const name = Yup.string()
    .min(3, 'Name must be at least 3 characters!')
    .max(200, 'Name cannot be longer than 200 characters!')
    .required('Name cannot be empty!')
const description = Yup.string()
    .min(3, 'Description must be at least 3 characters!')
    .max(1000, 'Description cannot be longer than 1000 characters!')
    .required('Description cannot be empty!')
const price = Yup.number()
    .required('Price cannot be empty')
    .moreThan(0.00000000001, 'Price have to be positive!')
const discount = Yup.number().moreThan(
    -0.00000000001,
    'Discount have to be positive!'
)

const category = Yup.string().required('Category cannot be empty')

const user = Yup.string().required('User cannot be empty')
//TODO: varians and sizes

export const createProductValidate = Yup.object({
    name,
    description,
    price,
    discount,
    category,
    user,
})
