export const searchPokemons = (pokemons: any[], query: string) => {
    if (query) {
      return pokemons.filter((pokemon) => pokemon.name.includes(query.toLowerCase().replace(' ', '-')))  
    }
    else {
        return pokemons.filter((_, index) => index < 50)
    }
}