import nodemailer from 'nodemailer'
import { EMAIL_USER, EMAIL_PASS } from './secrets'

const from = '"Viet Tran" <viet@viet.fi>'

const setup = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    })
}

export const sendEmail = (email: string, resetUrl: string) => {
    const transport = setup()
    const emailOuput = {
        from,
        to: email,
        subject: 'Reset password, do not reply to this email',
        html: `
            <h3>RESET PASSWORD</h3>
            <h4>Email: ${email}</h4>
            <p>Use this link to reset your password</p>
            <p>${resetUrl}</p>
            
            <br/>            
            <h4>E-commerce Website</h4>
            <h4>Viet Tran</h4>
        `,
    }

    transport.sendMail(emailOuput)
}
