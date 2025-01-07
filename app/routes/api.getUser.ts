import { json } from '@remix-run/node'
import { connectToDatabase } from "db";
import User from "models/user";
import { requireAccessToken } from "utils/authenticateMiddleware";

export const loader = async ({ request }: {request: Request}) => {
    return requireAccessToken(request, async (user) => {
        await connectToDatabase()

        try {
           const userObject = await User.findOne({userId: user.userId})

            if (!userObject) {
                return json({ error: 'User Not Found !' }, { status: 404 })
            }

            return json({ user: userObject, success: true }) 
        } catch (err) {
            console.log("Can't Fetch User ! Server Error !")
            return json({ error: "Can't Fetch User ! Server Error !" }, { status: 500 })
        }
    })
}