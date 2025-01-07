import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import User from 'models/user'
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
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            return json({ error: 'All fields are required !' }, { status: 400 })
        }

        await connectToDatabase()

        const user = await User.findOne({email})

        if (!user) {
            return json({ error: 'Invalid E-mail ! User Not Found !' }, { status: 401 })
        }

        if (!(await bcrypt.compare(password, user.password))) {
            return json({ error: 'Invalid Password !' }, { status: 401 })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        return json({ accessToken, success: true }, { headers: {'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}` } })
    } catch (err) {
        return json({ error: 'Cannot Log in ! Server Error !' }, { status: 500 })
    }
}