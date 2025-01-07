import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import User from 'models/user'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const loader = async ({ request }: {request: Request}) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')

    if (!code) {
        return json({ error: 'No code provided !' }, { status: 400 })
    }

    try {
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            }),
        })

        const { access_token } = await tokenResponse.json()

        const userResponse = await fetch('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        const githubUser = await userResponse.json()

        await connectToDatabase()

        let user = await User.findOne({email: githubUser.email})

        if (!user) {
            const password = githubUser.email.split('@')[0]
            const hashedPassword = await bcrypt.hash(password, 10)

            user = await User.create({name: githubUser.name.split(' ')[0] || githubUser.email.split('@')[0], email: githubUser.email, password: hashedPassword})
        }

        const accessToken = jwt.sign({email: user.email, userId: user.userId}, process.env.JWT_ACCESS_SECRET as string, {expiresIn: '1h'})
        const refreshToken = jwt.sign({email: user.email, userId: user.userId}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: '7d'})

        return json({ accessToken }, { headers: {'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Path=/; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}` } })
    } catch (err) {
        console.log('Github AUthentication Error !', err)
        return json({ error: 'Authentication Failed ! Server Error !' }, { status: 500 })
    }
}