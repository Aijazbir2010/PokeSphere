import { json } from '@remix-run/node'
import { connectToDatabase } from 'db'
import Pokemon from 'models/pokemon'

export const loader = async () => {
    try {
        await connectToDatabase()
        const pokemons = await Pokemon.find()
        
        return json({ pokemons, success: true })
    } catch (err) {
        return json({ error: 'Cannot Fetch Pokemons ! Server Error !' }, { status: 500 })
    }
}