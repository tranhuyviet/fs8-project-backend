export interface ErrorsObj {
    [name: string]: string
}

export const errorParse = (error: any) => {
    const errors: ErrorsObj = {}
    if (error.inner) {
        error.inner.forEach((el: any) => {
            errors[el.path] = el.message
        })
    } else {
        errors.global = 'Something went wrong. Please try again.'
    }

    return errors
}
