import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useContext, useState, useEffect } from "react"
import { ThemeContext } from "theme-context"
import { GlobalContext } from "global-context"
import Navbar from "components/Navbar"
import { useLoaderData } from "@remix-run/react"
import UnNavbar from "components/UnNavbar"
import Footer from "components/Footer"
import GoBackButton from "components/GoBackButton"
import Spinner from "components/Spinner"

export const meta: MetaFunction = () => {
  return [
    { title: "PokeSphere" },
    { name: "description", content: "Explore the captivating world of Pokémon with PokéSphere!" },
  ];
}; 

export const loader = async ({ request }: LoaderFunctionArgs) => {
    try {
        const url = new URL(request.url)
        const pokemonName = url.searchParams.get('name') || 'pikachu'

        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName?.toLowerCase()}`)
        const pokemonDetails = await response.json()

        return { pokemonDetails }
    } catch (err) {
        return new Response("Error fetching pokemon data !", {status: 500})
    }
}

const Pokemon = () => {

  const { theme } = useContext(ThemeContext)
  const { user, isUserFetching } = useContext(GlobalContext) 

  const { pokemonDetails } = useLoaderData<typeof loader>()

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    if (pokemonDetails) {
        const index = pokemonDetails.types.length === 1 ? 0 : Math.floor(Math.random() * 2);
        setRandomIndex(index); 
    } 
  }, []);

  const playOldCry = () => {
    const audio = new Audio(pokemonDetails.cries.legacy)
    audio.play()
  }

  const playNewCry = () => {
    const audio = new Audio(pokemonDetails.cries.latest)
    audio.play()
  }

  return (
    <>
        {isUserFetching && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
        </div>}

        {user ? <Navbar name={user.name}/> : <UnNavbar />}

        <GoBackButton />

        {pokemonDetails ? (<div className={`mx-2 md:mx-10 mt-10 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} rounded-2xl h-[1550px] xl:h-[770px] flex xl:flex-row flex-col drop-shadow-md`}>
            <div className="bg-transparent h-[50%] xl:h-full w-full xl:w-[50%] rounded-t-2xl xl:rounded-l-2xl px-4 md:px-10 py-5">
                <div className="flex flex-row gap-5">
                    <div className={`flex flex-row items-center gap-2 bg-transparent hover-bg-${pokemonDetails.types[randomIndex].type.name} px-3 md:px-6 py-3 w-fit h-14 rounded-2xl group cursor-pointer transition-colors duration-300`} onClick={playOldCry}>
                        <i className={`fa-solid fa-volume-high fa-lg text-themeTextGray group-hover-text-${pokemonDetails.types[randomIndex].type.name} transition-colors duration-300`}></i>
                        <span className={`font-bold text-themeTextGray group-hover-text-${pokemonDetails.types[randomIndex].type.name} transition-colors duration-300`}>Old cry</span>
                    </div>

                    <div className={`flex flex-row items-center gap-2 bg-transparent hover-bg-${pokemonDetails.types[randomIndex].type.name} px-3 md:px-6 py-3 w-fit h-14 rounded-2xl group cursor-pointer transition-colors duration-300`} onClick={playNewCry}>
                        <i className={`fa-solid fa-volume-high fa-lg text-themeTextGray group-hover-text-${pokemonDetails.types[randomIndex].type.name} transition-colors duration-300`}></i>
                        <span className={`font-bold text-themeTextGray group-hover-text-${pokemonDetails.types[randomIndex].type.name} transition-colors duration-300`}>New cry</span>
                    </div>
                </div>

                <div className={`font-bold text-4xl ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} mt-5`}>{pokemonDetails.name.charAt(0).toUpperCase() + pokemonDetails.name.slice(1)}</div>

                <div className="flex flex-col gap-2 mt-5">
                    <span className="font-bold text-themeTextGray">Abilities</span>
                    <div className="flex flex-row gap-5">
                        {pokemonDetails.abilities.map((abilityObj: any, index: number) => (<div key={index} className={`${theme === 'dark' ? 'bg-white text-themeBlack' : 'bg-themeBlack text-white'} font-bold rounded-full w-fit px-3 py-1 text-sm flex justify-center items-center text-center`}>{(abilityObj.ability.name.charAt(0).toUpperCase() + abilityObj.ability.name.slice(1)).replace('-', ' ')}</div>))}    
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                    <span className="font-bold text-themeTextGray">Types</span>
                    <div className="flex flex-row gap-5">
                        {pokemonDetails.types.map((typeObj: any, index: number) => (<div key={index} className={`bg-${typeObj.type.name} text-white font-bold rounded-full w-fit px-3 py-1 text-sm flex justify-center items-center`}>{typeObj.type.name.charAt(0).toUpperCase() + typeObj.type.name.slice(1)}</div>))}   
                    </div>
                </div>

                <div className="flex flex-col gap-2 mt-5">
                    <span className="font-bold text-themeTextGray">Base Stats</span>
                    <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-5">
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>HP</span>
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold`}>{pokemonDetails.stats[0].base_stat}</span>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} h-3 rounded-full relative`}>
                                    <div style={{width: `${Math.round((pokemonDetails.stats[0].base_stat / 255) * 100)}%`}} className={`bg-${pokemonDetails.types[randomIndex].type.name} h-full rounded-full absolute left-0`}></div>
                                </div>
                          </div>
                          <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-5">
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Attack</span>
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold`}>{pokemonDetails.stats[1].base_stat}</span>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} h-3 rounded-full relative`}>
                                    <div style={{width: `${Math.round((pokemonDetails.stats[1].base_stat / 255) * 100)}%`}} className={`bg-${pokemonDetails.types[randomIndex].type.name} h-full rounded-full absolute left-0`}></div>
                                </div>
                          </div>
                          <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-5">
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Defence</span>
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold`}>{pokemonDetails.stats[2].base_stat}</span>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} h-3 rounded-full relative`}>
                                    <div style={{width: `${Math.round((pokemonDetails.stats[2].base_stat / 255) * 100)}%`}} className={`bg-${pokemonDetails.types[randomIndex].type.name} h-full rounded-full absolute left-0`}></div>
                                </div>
                          </div>
                          <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-5">
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Special-Attack</span>
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold`}>{pokemonDetails.stats[3].base_stat}</span>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} h-3 rounded-full relative`}>
                                    <div style={{width: `${Math.round((pokemonDetails.stats[3].base_stat / 255) * 100)}%`}} className={`bg-${pokemonDetails.types[randomIndex].type.name} h-full rounded-full absolute left-0`}></div>
                                </div>
                          </div>
                          <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-5">
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Special-Defence</span>
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold`}>{pokemonDetails.stats[4].base_stat}</span>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} h-3 rounded-full relative`}>
                                    <div style={{width: `${Math.round((pokemonDetails.stats[4].base_stat / 255) * 100)}%`}} className={`bg-${pokemonDetails.types[randomIndex].type.name} h-full rounded-full absolute left-0`}></div>
                                </div>
                          </div>
                          <div className="flex flex-col gap-1">
                                <div className="flex flex-row gap-5">
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Speed</span>
                                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold`}>{pokemonDetails.stats[5].base_stat}</span>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} h-3 rounded-full relative`}>
                                    <div style={{width: `${Math.round((pokemonDetails.stats[5].base_stat / 255) * 100)}%`}} className={`bg-${pokemonDetails.types[randomIndex].type.name} h-full rounded-full absolute left-0`}></div>
                                </div>
                          </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-row gap-3 md:gap-5">
                    <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} flex flex-col gap-1 justify-center items-center rounded-2xl w-24 md:w-36 h-16 md:h-20`}>
                        <div className="flex flex-row items-center gap-2">
                            <i className="fa-solid md:fa-lg fa-weight-hanging text-themeTextGray"></i>
                            <span className="text-themeTextGray font-bold text-sm md:text-lg">Weight</span>
                        </div>
                        <span className={`${theme === 'dark' ? 'text-themeBlack' : 'text-white'} font-bold text-base md:text-xl`}>{pokemonDetails.weight}KG</span>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} flex flex-col gap-1 justify-center items-center rounded-2xl w-24 md:w-36 h-16 md:h-20`}>
                        <div className="flex flex-row items-center gap-2">
                            <i className="fa-solid md:fa-lg fa-ruler text-themeTextGray"></i>
                            <span className="text-themeTextGray font-bold text-sm md:text-lg">Height</span>
                        </div>
                        <span className={`${theme === 'dark' ? 'text-themeBlack' : 'text-white'} font-bold text-base md:text-xl`}>{pokemonDetails.height}M</span>
                    </div>
                    <div className={`${theme === 'dark' ? 'bg-white' : 'bg-themeBlack'} flex flex-col gap-1 justify-center items-center rounded-2xl w-24 md:w-36 h-16 md:h-20`}>
                        <div className="flex flex-row items-center gap-2">
                            <i className="fa-solid md:fa-lg fa-trophy text-themeTextGray"></i>
                            <span className="text-themeTextGray font-bold text-sm md:text-lg">Base XP</span>
                        </div>
                        <span className={`${theme === 'dark' ? 'text-themeBlack' : 'text-white'} font-bold text-base md:text-xl`}>{pokemonDetails.base_experience}</span>
                    </div>
                </div>

            </div>

            <div className='h-[50%] xl:h-full w-full xl:w-[50%] rounded-b-2xl xl:rounded-none xl:rounded-r-2xl relative flex justify-center items-center'>
                <div className={`absolute inset-0 bg-${pokemonDetails.types[randomIndex].type.name} opacity-80 rounded-b-2xl xl:rounded-none xl:rounded-r-2xl pointer-events-none`}></div>
                <img src={`/icons/${pokemonDetails.types[randomIndex].type.name}.svg`} alt="type-icon" className="w-96 h-96"/>
                <img src={pokemonDetails.sprites.other.home.front_default} alt="pokemon" className="absolute w-80 h-80"/>
            </div>
        </div>) : (<div className={`w-full mt-10 h-[700px] flex justify-center items-center`}>
          <Spinner />
        </div>)}

        <Footer />
    </>
  )
}

export default Pokemon