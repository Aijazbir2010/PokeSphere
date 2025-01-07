import { json } from '@remix-run/node'
import jwt from 'jsonwebtoken'

export const requireAccessToken = async (request: Request, next: (user: {email: string, userId: string}) => Promise<Response>) => {
    const url = new URL(request.url)
    const queryToken = url.searchParams.get('token')

    if (!queryToken) {
        return json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = decodeURIComponent(queryToken)

    try {
        const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string)
        return next(user as {email: string, userId: string})
    } catch (err) {
        return json({ error: 'Invalid or Expired Token !' }, { status: 403 })
    }
}