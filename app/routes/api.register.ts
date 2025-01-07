import { json } from '@remix-run/node';
import { connectToDatabase } from 'db';
import User from 'models/user';
import VerificationEmail from 'models/verificationemail';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

const generateAccessToken = (user: {email: string, userId: string}) => {
    return jwt.sign({email: user.email, userId: user.userId}, JWT_ACCESS_SECRET, {expiresIn: '1h'})
}

const generateRefreshToken = (user: {email: string, userId: string}) => {
    return jwt.sign({email: user.email, userId: user.userId}, JWT_REFRESH_SECRET, {expiresIn: '7d'})
}

export const action = async ({ request }: {request: Request}) => {
    if (request.method !== "POST") {
            return json({ error: "Method not allowed" }, { status: 405 });
    }

    try {
        const formData = await request.formData()
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const code = formData.get('code') as string

        if (!name || !email || !password || !code) {
            return json({ error: 'All fields are required !' }, { status: 400 })
        }

        await connectToDatabase()

        const verificationEmail = await VerificationEmail.findOne({email})

        if (!verificationEmail) {
            return json({ error: 'Verification Code Expired !' }, { status: 401 })
        }

        if (code.toUpperCase() !== verificationEmail.code) {
            return json({ error: 'Invalid Verification Code !' }, { status: 401 })
        }

        const existingUser = await User.findOne({email})

        if (existingUser) {
            return json({ error: 'User Already Exists With This E-mail !' }, { status: 409 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({name, email, password: hashedPassword})

        const accessToken = generateAccessToken(newUser)
        const refreshToken = generateRefreshToken(newUser)

        return json({ accessToken, success: true }, { headers: {'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`} })
    } catch (err) {
        console.log('Error in api !', err)
        return json({ error: 'Cannot Register User ! Server Error !' }, { status: 500 })
    }
}