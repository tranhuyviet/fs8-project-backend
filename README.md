## Fashion Shop Project

## Demo: https://fs8-project.vercel.app/

## Technologies:
Nodejs, Espress, Mongodb, Mongoose, Yup, Nodemailer, Jsonwebtoken

## Features:

1. User and Authentication:
- Sign up a new user (name, email, password, confirm password)
- Sign in the user with email and password: used jwt for authentication and cookie
- Log out the user
- Update user profile (name, email, image)
- Forget password request: send to the email token reset password: use nodemailer
- Reset password: based on the token reset password will reset the password (new password, confirm new password)
- Change password (current password, new password, confirm new password )

2. Admin role:
- Get all users
- Delete user
- Banned / Unbanned user
- Add new, update, delete product
- Add new, update and delete category, variant, size

3. Product:
- Get list of products with/without pagination
- Get list of products search by name
- Get list of products filter by category, variant, size
- All search and filter can combine
- Get a product by ID
- Get list of similar items

4. Cart:
- Add to cart: add product, quantity, variant and size to cart
- Handle change quantity of product
- Checkout form

5. Validate

## Frontend: https://github.com/tranhuyviet/fs8-project-frontend
