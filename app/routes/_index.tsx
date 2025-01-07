import type { MetaFunction } from "@remix-run/node";
import { useContext, useState, useEffect } from "react";
import { useSearchParams } from "@remix-run/react";
import { ThemeContext } from "theme-context";
import { GlobalContext } from "global-context";
import UnNavbar from "components/UnNavbar";
import Navbar from "components/Navbar";
import SearchBar from "components/SearchBar";
import Footer from "components/Footer";
import Filters from "components/Filters";
import PokemonCard from "components/PokemonCard";
import Spinner from "components/Spinner";
import { searchPokemons } from "utils/searchPokemons";
import { filterPokemons } from "utils/filterPokemons";

import { toast } from 'react-toastify'

export const meta: MetaFunction = () => {
  return [
    { title: "PokeSphere" },
    { name: "description", content: "Explore the captivating world of Pokémon with PokéSphere!" },
  ];
}; 

export default function Index() {

  const [searchParams, setSearchParams] = useSearchParams()
  const { theme } = useContext(ThemeContext)
  const {isLoading, setIsLoading, allPokemons, filters, user, isUserFetching} = useContext(GlobalContext)

  const [pokemons, setPokemons] = useState<any[] | null>(null)
  const [offset, setOffset] = useState(50)
  const [isPokemonFetching, setIsPokemonFetching] = useState(false)

  const fetchPokemons = async () => {
    try {
      setIsPokemonFetching(true)
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0');
  
      const data = await response.json();
      const pokemons = data.results;
  
      const pokemonsDetails = await Promise.all(
        pokemons.map(async (pokemon: { name: string }) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
          const pokemonDetails = await response.json();
          return pokemonDetails;
        })
      );
  
      setPokemons(pokemonsDetails)
      setIsPokemonFetching(false)
    } catch (err) {
      setIsPokemonFetching(false)
      console.log('Failed to fetch Pokemons !', err);
    }
  }

  useEffect(() => {
    fetchPokemons()
  }, [])

  useEffect(() => {
    const msg = searchParams.get('msg')

    if (msg) {
      if (msg === 'LoginSuccessful') {
        toast('Log in Successful !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
      } else if (msg === 'RegisterSuccessful') {
        toast('Register Successful !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
      } else if (msg === 'LogoutSuccessful') {
        toast('Logout Successful !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
      }
    }

    const timeout = setTimeout(() => setSearchParams({}), 3000)

    return () => {
      clearTimeout(timeout)
    }

  }, [searchParams])

  const fetchMorePokemons = async () => {
    try {
      if (offset < 1000) {
        setIsLoading(true)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`)
        const data = await response.json()
        const pokemons = data.results

        const pokemonsDetails = await Promise.all(pokemons.map( async (pokemon: {name: string}) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
          const pokemonDetails = await response.json()
          return pokemonDetails
        }))

        setPokemons((prevPokemons) => [...(prevPokemons || []), ...pokemonsDetails])
        setOffset((prevOffset) => prevOffset + 50)
        setIsLoading(false)
      } else if (offset === 1000) {
          setIsLoading(true)
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=25&offset=${offset}`)
          const data = await response.json()
          const pokemons = data.results

          const pokemonsDetails = await Promise.all(pokemons.map( async (pokemon: {name: string}) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
            const pokemonDetails = await response.json()
            return pokemonDetails
          }))

          setPokemons((prevPokemons) => [...(prevPokemons || []), ...pokemonsDetails])
          setOffset(1025)
          setIsLoading(false)
      }
    } catch (err) {
        setIsLoading(false)
        console.log('Failed to fetch more Pokemons !', err)
    }
    
  }

  const showLessPokemons = () => {
    setPokemons((prevPokemons) => (prevPokemons ?? []).filter((_, index) => index < 50))
    setOffset(50)
  }

  const handleSearch = (query: string) => {
    const filteredPokemons = searchPokemons((allPokemons ?? []), query)
    setPokemons(filteredPokemons)
  }

  const handleFilters = () => {
    if (
      (filters.selectedType && filters.selectedType !== '') ||
      (filters.selectedAbility && filters.selectedAbility !== '') ||
      (filters.weight && filters.weight !== 0) ||
      (filters.height && filters.height !== 0) ||
      (filters.selectedSortOrder && filters.selectedSortOrder !== '')
    ) {
      const filteredPokemons = filterPokemons((allPokemons ?? []), filters)
      setPokemons(filteredPokemons)
    } else {
      setPokemons((allPokemons ?? []).filter((_, index) => index < 50))
    }
    
  }
  useEffect(() => {
    handleFilters()
  }, [filters])

  return (
    <>
        {(isLoading || isUserFetching || isPokemonFetching) && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
        </div>}
        
        {user ? <Navbar name={user.name}/> : <UnNavbar />}

        <SearchBar handleChange={(e) => handleSearch(e.target.value)}/>

        <Filters />

        {pokemons ? (<section className={`browse-pokemons mx-2 md:mx-10 mt-10 grid justify-center gap-5 grid-cols-1 custom-screen-3:grid-cols-2 custom-screen-2:grid-cols-3 custom-screen:grid-cols-4 ${pokemons.length !== 0 ? 'h-[600px]' : 'h-0'} overflow-y-auto`}>
          {pokemons.map((pokemon, index) => (<PokemonCard key={index} base_xp={pokemon.base_experience} height={pokemon.height} id={pokemon.id} name={pokemon.name} sprite={pokemon.sprites.other.home.front_default} types={pokemon.types} weight={pokemon.weight}/>))}
        </section>) : (<div className={`w-full mt-10 h-[700px] flex justify-center items-center`}>
          <Spinner />
        </div>)}
  
        {pokemons && pokemons.length === 0 && <div className="flex justify-center items-center w-full h-[400px]"><span className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>No Pokemons !</span></div>}

        {pokemons && <div className="flex justify-center mt-5">
            {offset !== 1025 ? (<div className={`flex flex-row items-center gap-1 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} hover:bg-themeGreen/40 px-3 md:px-6 py-3 w-fit h-14 rounded-2xl group cursor-pointer drop-shadow-md transition-colors duration-300`} onClick={fetchMorePokemons}>
                <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">Show More</span>
                <i className="fa-solid fa-chevron-down fa-lg text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
            </div>) : (<div className={`flex flex-row items-center gap-1 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} hover:bg-themeGreen/40 px-3 md:px-6 py-3 w-fit h-14 rounded-2xl group cursor-pointer drop-shadow-md transition-colors duration-300`} onClick={showLessPokemons}>
                <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">Show Less</span>
                <i className="fa-solid fa-chevron-up fa-lg text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
            </div>)}
        </div>}

        <Footer />
    </>
  );
} 

