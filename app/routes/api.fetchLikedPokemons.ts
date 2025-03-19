import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import Pokemon from 'models/pokemon'

export const action = async ({ request }: {request: Request}) => {
    if (request.method !== 'POST') {
        return json({ error: "Method not allowed" }, { status: 405 })
    }
    try {
        const formData = await request.formData()
        const likedPokemonsString = formData.get('likedPokemons') as string
        const likedPokemons = likedPokemonsString.split(',')
        const likedPokemonsIDs = likedPokemons.map((id: string) => Number(id))

        await connectToDatabase()

        const pokemons = await Pokemon.find({id: {$in: likedPokemonsIDs}})

        return json({ pokemons, success: true })
    } catch (err) {
        return json({ error: 'Cannot Fetch Liked Pokemons ! Server Error !' }, { status: 500 })
    }
}