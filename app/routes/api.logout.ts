import { json, createCookie } from '@remix-run/node'

const refreshTokenCookie = createCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: -1,
})

export const loader = async () => {
    return json({success: true}, {headers: {'Set-Cookie': await refreshTokenCookie.serialize('')}})
}