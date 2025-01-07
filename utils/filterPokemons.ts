import { FiltersType } from "global-context"

export const filterPokemons = (pokemons: any[], filters: FiltersType) => {
    let filteredPokemons = [...pokemons]

    if (filters.selectedType) {
        filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.types.some((typeObj: any) => typeObj.type.name === filters.selectedType.toLowerCase()))
    }

    if (filters.selectedAbility) {
        filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.abilities.some((abilityObj: any) => abilityObj.ability.name === filters.selectedAbility.toLowerCase().replace(' ', '-')))
    }

    if (filters.weight) {
        filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.weight >= filters.weight)
    }

    if (filters.height) {
        filteredPokemons = filteredPokemons.filter((pokemon) => pokemon.height >= filters.height)
    }

    if (filters.selectedSortOrder) { 
        filteredPokemons = filteredPokemons.sort((a, b) => {
            return filters.selectedSortOrder === 'Ascending' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);            
        })
    }


    return filteredPokemons
}