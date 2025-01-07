import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import VerificationEmail from 'models/verificationemail'
import User from 'models/user'
import nodemailer from 'nodemailer'
import { generateCode } from 'utils/generateCode.server'

const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true,
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
});

export const loader = async ({ request }: {request: Request}) => {
    const url = new URL(request.url)
    const email = decodeURIComponent(url.searchParams.get('email') as string)

    await connectToDatabase()

    const user = await User.findOne({email})

    if (!user) {
        return json({ error: 'User not found !' }, { status: 404 })
    }

    const verificationCode = generateCode(6)

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Password Reset Code',
        html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>PokéSphere - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #3F3F3F;">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #3F3F3F; padding: 250px 10px;">
  <tr>
    <td align="center">
      <!-- Main Card Container -->
      <table border="0" cellpadding="0" cellspacing="0" width="700" style="background-color: #303030; border-radius: 24px; overflow: hidden;">
        
        <tr>
          <td align="center" style="padding: 40px 20px 20px;">
            <table border="0" cellpadding="0" cellspacing="0" style="width: auto; display: inline-table;">
                <tr>
                  <!-- Logo Column -->
                  <td style="padding-right: 10px; vertical-align: middle;">
                    <img src="https://i.ibb.co/Q8PpKVs/Poke-Sphere-Logo.png" alt="PokéSphere Logo" style="width: 50px; height: 50px;">
                  </td>
                  <!-- Text Column -->
                  <td style="vertical-align: middle;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 40px; font-weight: bold;">PokéSphere</h1>
                  </td>
                </tr>
              </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 20px 0 10px;">
            <h2 style="margin: 0; color: #ffffff; font-size: 36px;">Password Reset Code</h2>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 0 30px;">
            <p style="color: #A6A6A6; font-size: 14px; line-height: 1.5; margin: 0 0 30px; text-align: center;">
              Please enter this code in the form to reset your account's password.
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 0 30px 10px;">
            <p style="color: #35FF69; font-size: 60px; font-weight: bold; margin: 0; letter-spacing: 2px;">
              ${verificationCode}
            </p>
          </td>
        </tr>

        <tr>
          <td align="center">
            <p style="color: #FFFFFF;margin: 0;">
              This code expires in 10 minutes.
            </p>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 60px 30px 20px;">
            <p style="color: #A6A6A6; font-size: 12px; margin: 0;">
              &copy; PokéSphere ${new Date().getFullYear()} All Rights Reserved
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
        </html>`,
    };

    try {
       await transporter.sendMail(mailOptions);
        const existingEmail = await VerificationEmail.findOne({email})
        if (existingEmail) {
            await VerificationEmail.findOneAndUpdate({email}, {code: verificationCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000)})
            return json({ success: true })
        }
        await VerificationEmail.create({ email, code: verificationCode, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
        return json({ success: true })     
    } catch (err) {
        return json({ error: 'Cannot send email ! Server error !' }, { status: 500 })
    }

}