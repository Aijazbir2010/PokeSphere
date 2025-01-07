import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import VerificationEmail from 'models/verificationemail'
import User from 'models/user'
import bcrypt from 'bcrypt'

export const action = async ({ request }: {request: Request}) => {
    if (request.method !== 'POST') {
        return json({ error: 'Method not allowed !' }, { status: 405 })
    }

    try {
        const formData = await request.formData()
        const email = formData.get('email') as string
        const code = formData.get('code') as string
        const password = formData.get('password') as string

        if (!code || !password) {
            return json({ error: 'ALl fields are required !' }, { status: 400 })
        }

        await connectToDatabase()

        const verificationEmail = await VerificationEmail.findOne({email})

        if (!verificationEmail) {
            return json({ error: 'Code is expired !' }, { status: 403 })
        }

        if (code.toUpperCase() !== verificationEmail.code) {
            return json({ error: 'Invalid code !' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await User.updateOne({email}, {password: hashedPassword})

        return json({ success: true })

    } catch (err) {
        return json({ error: 'Cannot reset password ! Server error !' }, { status: 500 })
    }
    
}