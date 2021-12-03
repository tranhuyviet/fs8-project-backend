import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import {
    EMAIL_USER,
    EMAIL_PASS,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REFRESH_TOKEN,
} from './secrets'

const from = '"Viet Tran" <viet.tran.fi@hotmail.com>'
// const OAuth2 = google.auth.OAuth2

// const oauth2Client = new OAuth2(
//     GOOGLE_CLIENT_ID,
//     GOOGLE_CLIENT_SECRET,
//     'https://developers.google.com/oauthplayground'
// )

// const accessToken = oauth2Client.getAccessToken()

const setup = () => {
    return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            //type: 'OAuth2',
            user: EMAIL_USER,
            pass: EMAIL_PASS,
            // clientId: GOOGLE_CLIENT_ID,
            // clientSecret: GOOGLE_CLIENT_SECRET,
            // refreshToken: GOOGLE_REFRESH_TOKEN,
            // accessToken: accessToken,
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
            <h4>Fashion Shop</h4>
            <h4>Viet Tran</h4>
        `,
    }

    transport.sendMail(emailOuput)
}
