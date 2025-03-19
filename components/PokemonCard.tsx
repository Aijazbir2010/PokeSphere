import { useContext } from "react"
import { ThemeContext } from "theme-context"
import { GlobalContext } from "global-context"
import { Link } from "@remix-run/react"

interface PokemonCard {
    id: number
    sprite: string
    name: string
    height: number
    weight: number
    base_xp: number
    types: string[]
}

const PokemonCard = ({ id, sprite, name, height, weight, base_xp, types }: PokemonCard) => {

  const { theme } = useContext(ThemeContext)
  const { user, likePokemon, unlikePokemon, savePokemon, unsavePokemon } = useContext(GlobalContext)  

  const capitalizeFirstLetter = (value: string) => {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1)
  }  

  return (
    <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} rounded-2xl w-[350px] md:w-96 h-64 p-2 drop-shadow-md justify-self-center`}>
        <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-2">
                <div className={`w-12 h-12 hover:bg-favouritesPink/40 transition-colors duration-300 cursor-pointer rounded-full flex justify-center items-center group`} onClick={() => {user ? (user.likedPokemons.includes((id).toString()) ? unlikePokemon(id) : likePokemon(id)) : window.location.href = '/login'}}>
                    <i className={`fa-solid fa-heart fa-lg ${user ? (user.likedPokemons.includes((id).toString()) ? 'text-favouritesPink' : 'text-themeTextGray') : 'text-themeTextGray'} group-hover:text-favouritesPink transition-colors duration-300`}></i>
                </div>
                <div className={`w-12 h-12 bg-transparent hover:bg-savedBlue/40 transition-colors duration-300 cursor-pointer rounded-full flex justify-center items-center group`} onClick={() => {user ? (user.savedPokemons.includes((id).toString()) ? unsavePokemon(id) : savePokemon(id)) : window.location.href = '/login'}}>
                    <i className={`fa-solid fa-bookmark fa-lg ${user ? (user.savedPokemons.includes((id).toString()) ? 'text-savedBlue' : 'text-themeTextGray') : 'text-themeTextGray'} group-hover:text-savedBlue transition-colors duration-300`}></i>
                </div>   
            </div>
            <Link to={`/pokemon?name=${name}`} className="w-12 h-12 bg-transparent hover:bg-themeGreen/40 transition-colors duration-300 cursor-pointer rounded-full flex justify-center items-center group">
                <i className="fa-solid fa-arrow-right fa-lg text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
            </Link> 
        </div>

        <div className="flex flex-row">
            <img src={sprite} alt={name} className="w-36 h-36 md:w-40 md:h-40"/>

            <div className="flex flex-col justify-center gap-1 w-full text-center">
                <span className={`text-2xl md:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>{capitalizeFirstLetter(name).replaceAll('-', ' ')}</span>
                <span className="font-bold text-themeTextGray text-xs">{height}M, {weight}KG, {base_xp}XP</span>
                <div className="flex flex-row justify-center gap-5 w-full mt-2">
                    {types.map((type, index) => (<div key={index} className={`bg-${type} rounded-full w-fit px-3 py-1 text-white font-bold text-sm flex justify-center items-center`}>{capitalizeFirstLetter(type)}</div>))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default PokemonCard