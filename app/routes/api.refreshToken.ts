import { json, createCookie } from '@remix-run/node'
import { parse } from 'cookie'
import jwt from 'jsonwebtoken'

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

const generateAccessToken = (user: {email: string, userId: string}) => {
    return jwt.sign({email: user.email, userId: user.userId}, JWT_ACCESS_SECRET, {expiresIn: '1h'})
}

const refreshTokenCookie = createCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: -1,
})

export const loader = async ({ request }: {request: Request}) => {
    const cookieHeader = request.headers.get('Cookie')
    if (!cookieHeader) {
        return json({ error: 'Cookie Header Missing !' }, { status: 401 })
    }


    const cookies = parse(cookieHeader)
    const { refreshToken } = cookies

    if (!refreshToken) {
        return json({ error: 'Refresh Token Missing !' }, { status: 401 })
    }


    try {
        const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
        const newAccessToken = generateAccessToken(user as {email: string, userId: string})
        return json({ accessToken: newAccessToken, success: true })
    } catch (err) {
        return json({ error: 'Invalid or Expired Refresh Token !' }, { status: 403, headers: {'Set-Cookie': await refreshTokenCookie.serialize('')} })
    }
}