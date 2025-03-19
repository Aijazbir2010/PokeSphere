import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import Pokemon from 'models/pokemon'

export const action = async ({ request }: {request: Request}) => {
    if (request.method !== 'POST') {
        return json({ error: "Method not allowed" }, { status: 405 })
    }
    try {
        const formData = await request.formData()
        const savedPokemonsString = formData.get('savedPokemons') as string
        const savedPokemons = savedPokemonsString.split(',')
        const savedPokemonsIDs = savedPokemons.map((id: string) => Number(id))

        await connectToDatabase()

        const pokemons = await Pokemon.find({id: {$in: savedPokemonsIDs}})

        return json({ pokemons, success: true })
    } catch (err) {
        return json({ error: 'Cannot Fetch Saved Pokemons ! Server Error !' }, { status: 500 })
    }
}