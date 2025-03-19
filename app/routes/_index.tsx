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
  const {allPokemons, isFetchingAllPokemons, filters, user, isUserFetching} = useContext(GlobalContext)

  const [pokemons, setPokemons] = useState<{
    id: number,
    sprite: string,
    name: string,
    height: number,
    weight: number,
    base_xp: number,
    abilities: string[],
    types: string[],
    cries: {latest: string | null, legacy: string | null},
    stats: {name: string, base_stat: number}[],
  }[] | null>(null)

  useEffect(() => {
    setPokemons(allPokemons)
  }, [allPokemons])

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
      setPokemons(allPokemons ?? [])
    }
    
  }
  useEffect(() => {
    handleFilters()
  }, [filters])

  return (
    <>
        {(isFetchingAllPokemons || isUserFetching) && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
        </div>}
        
        {user ? <Navbar name={user.name}/> : <UnNavbar />}

        <SearchBar handleChange={(e) => handleSearch(e.target.value)}/>

        <Filters />

        {pokemons ? (<section className={`browse-pokemons mx-2 md:mx-10 mt-10 grid justify-center gap-5 grid-cols-1 custom-screen-3:grid-cols-2 custom-screen-2:grid-cols-3 custom-screen:grid-cols-4 ${pokemons.length !== 0 ? 'h-[600px]' : 'h-0'} overflow-y-auto`}>
          {pokemons.map((pokemon, index) => (<PokemonCard key={index} base_xp={pokemon.base_xp} height={pokemon.height} id={pokemon.id} name={pokemon.name} sprite={pokemon.sprite} types={pokemon.types} weight={pokemon.weight}/>))}
        </section>) : (<div className={`w-full mt-10 h-[700px] flex justify-center items-center`}>
          <Spinner />
        </div>)}
  
        {pokemons && pokemons.length === 0 && <div className="flex justify-center items-center w-full h-[400px]"><span className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>No Pokemons !</span></div>}

        <Footer />
    </>
  );
} 

