import { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "theme-context";
import { GlobalContext } from "global-context";
import Navbar from "components/Navbar"
import PokemonCard from "components/PokemonCard";
import Spinner from "components/Spinner";
import SearchBar from "components/SearchBar"
import Filters from "components/Filters";
import Footer from "components/Footer";
import { searchPokemons } from "utils/searchPokemons";
import { filterPokemons } from "utils/filterPokemons";

export const meta: MetaFunction = () => {
  return [
    { title: "PokeSphere" },
    { name: "description", content: "Explore the captivating world of Pokémon with PokéSphere!" },
  ];
}; 

type LikedPokemonsFetcherDataType = {
  pokemons?: {
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
  }[],
  success?: true,
  error?: string,
}

const Favourites = () => {

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      window.location.href = '/login'
    }
  }, [])

  const { theme } = useContext(ThemeContext)
  const { user, isUserFetching, filters } = useContext(GlobalContext)

  const likedPokemonsFetcher = useFetcher<LikedPokemonsFetcherDataType>()
  const [likedPokemons, setLikedPokemons] = useState<any[] | null>(null)
  const [pokemons, setPokemons] = useState<any[] | null>(null)
  const [isPokemonFetching, setIsPokemonFetching] = useState(false)

  const fetchLikedPokemons = async () => {
    if (user) {
      try {
        const likedPokemons: any = [...(user.likedPokemons)].reverse()

        const formData = new FormData()
        formData.append('likedPokemons', likedPokemons)

        likedPokemonsFetcher.submit(formData, {
          method: 'post',
          action: '/api/fetchLikedPokemons',
        })
      } catch (err) {
        setIsPokemonFetching(false)
        console.log('Cannot fetch Liked Pokemons !', err)
      }
    }
  }

  useEffect(() => {
    if (!likedPokemons) {
      fetchLikedPokemons()
    }
  }, [user])

  useEffect(() => {
    if (likedPokemonsFetcher.state === 'idle' && likedPokemonsFetcher.data?.success && likedPokemonsFetcher.data?.pokemons) {
      setIsPokemonFetching(false)
      setPokemons(likedPokemonsFetcher.data.pokemons)
      setLikedPokemons(likedPokemonsFetcher.data.pokemons)
    } else if (likedPokemonsFetcher.state === 'loading' || likedPokemonsFetcher.state === 'submitting') {
      setIsPokemonFetching(true)
    } else if (likedPokemonsFetcher.state === 'idle' && likedPokemonsFetcher.data?.error) {
      setIsPokemonFetching(false)
    } else if (likedPokemonsFetcher.state === 'idle') {
      setIsPokemonFetching(false)
    }
  }, [likedPokemonsFetcher])

  const handleSearch = (query: string) => {
      const filteredPokemons = searchPokemons((likedPokemons ?? []), query)
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
        const filteredPokemons = filterPokemons((likedPokemons ?? []), filters)
        setPokemons(filteredPokemons)
      } else {
        setPokemons((likedPokemons ?? []).filter((_, index) => index < 50))
      }
      
    }
    useEffect(() => {
      handleFilters()
    }, [filters])

  return (
    <>
      {(isPokemonFetching || isUserFetching) && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
      </div>}

      <Navbar name={user ? user.name : 'Menu'}/>

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
  )
}

export default Favourites