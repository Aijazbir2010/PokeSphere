import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import User from 'models/user'
import { requireAccessToken } from 'utils/authenticateMiddleware'

export const loader = async ({ request }: {request: Request}) => {
    return requireAccessToken(request, async (user) => {
        try {
            const url = new URL(request.url)
            const id = url.searchParams.get('id')

            if (!id) {
                return json({ error: 'Id is missing !' }, { status: 400 })
            }

            await connectToDatabase()

            const updatedUser = await User.findOneAndUpdate({userId: user.userId}, {$pull: {likedPokemons: id}}, {new: true})

            return json({ updatedUser, success: true })
        } catch (err) {
            return json({ error: 'Cannot unlike pokemon ! Server error !' }, { status: 500 })
        }
    })
    
}