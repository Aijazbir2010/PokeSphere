import { createContext, useEffect, useState, useContext } from "react"
import { ThemeContext } from "theme-context"
import { useFetcher } from "@remix-run/react"
import { handleTokenExpired } from "utils/handleTokenExpired"

import { toast } from 'react-toastify'

interface GlobalContextType {
    isLoading: boolean
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    allPokemons: any[] | null
    isFetchingAllPokemons: boolean
    allPokemonFetchingProgress: number
    filters: FiltersType
    setFilters: React.Dispatch<React.SetStateAction<FiltersType>>
    user: any | null
    isUserFetching: boolean
    likePokemon(id: number): void
    unlikePokemon(id: number): void
    savePokemon(id: number): void
    unsavePokemon(id: number): void
}

export interface FiltersType {
  selectedType: string
  selectedAbility: string
  weight: number
  height: number
  selectedSortOrder: string
}

export const GlobalContext = createContext<GlobalContextType>({
    isLoading: false,
    setIsLoading: () => false,
    allPokemons: [],
    isFetchingAllPokemons: false,
    allPokemonFetchingProgress: 0,
    filters: {selectedType: '', selectedAbility: '', weight: 0, height: 0, selectedSortOrder: ''},
    setFilters: () => ({selectedType: '', selectedAbility: '', weight: 0, height: 0, selectedSortOrder: ''}),
    user: null,
    isUserFetching: false,
    likePokemon: () => {console.log('Default like pokemon function')},
    unlikePokemon: () => {console.log('Default unlike pokemon function')},
    savePokemon: () => {console.log('Default save pokemon function')},
    unsavePokemon: () => {console.log('Default unsave pokemon function')},
})

type UserFetcherData = {
  user?: any
  success?: boolean
  error?: string
}

export const GlobalContextProvider = ({children}: {children: React.ReactNode}) => {

  const { theme } = useContext(ThemeContext)
  const userFetcher = useFetcher<UserFetcherData>()
  const [user, setUser] = useState<any | null>(null)
  const [isUserFetching, setIsUserFetching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [allPokemons, setAllPokemons] = useState<any[] | null>(null)
  const [isFetchingAllPokemons, setIsFetchingAllPokemons] = useState(false)
  const [allPokemonFetchingProgress, setAllPokemonFetchingProgress] = useState(0)

  const fetchUser = async () => {
    try {
        const accessToken = localStorage.getItem('accessToken') as string

        if (!accessToken) {
          setUser(null)
          return
        }

        userFetcher.load(`/api/getUser?token=${encodeURIComponent(accessToken)}`)
    } catch (err) {
      setIsUserFetching(false)
      console.log('Cannot Fetch User !', err)
    }
  }

  useEffect(() => {
    fetchUser()  
  }, [])


  useEffect(() => {
    if (userFetcher.state === 'idle' && userFetcher.data?.success && userFetcher.data?.user) {
      setIsUserFetching(false)
      setUser(userFetcher.data.user)
    } else if (userFetcher.state === 'loading' || userFetcher.state === 'submitting') {
      setIsUserFetching(true)
    } else if (userFetcher.state === 'idle' && userFetcher.data?.error) {
      if (userFetcher.data.error === 'Invalid or Expired Token !') {
        handleTokenExpired()
      }
      setIsUserFetching(false)
    } else if (userFetcher.state === 'idle') {
      setIsUserFetching(false)
    }
  }, [userFetcher])

  const fetchAllPokemons = async () => {
    try {
      setIsFetchingAllPokemons(true)
      const total = 1025
      let fetchedPokemonsCount = 0
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0');
  
      const data = await response.json();
      const pokemons = data.results;
  
      const pokemonsDetails: any[] = [];
  
      for (const pokemon of pokemons) {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
        const pokemonDetails = await response.json()
        pokemonsDetails.push(pokemonDetails)
        fetchedPokemonsCount++;

        console.log('Fetched Count: ', fetchedPokemonsCount)

        if (fetchedPokemonsCount === total || fetchedPokemonsCount % 50 === 0) {
          setAllPokemonFetchingProgress(Math.floor((fetchedPokemonsCount / total) * 100))
        }
      }

      setAllPokemons(pokemonsDetails)
      setIsFetchingAllPokemons(false)
    } catch (err) {
      setIsFetchingAllPokemons(false)
      console.log('Failed to fetch all Pokemons !', err);
    }
  }

  useEffect(() => {
    fetchAllPokemons()
  }, [])

  const [filters, setFilters] = useState<FiltersType>({selectedType: '', selectedAbility: '', weight: 0, height: 0, selectedSortOrder: ''})

  const likePokemon = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        window.location.href = '/login'
      }
      const response = await fetch(`/api/likePokemon?id=${id}&token=${accessToken}`)
      const data = await response.json()

      if (data.updatedUser && data.success) {
        toast('Pokemon Liked !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-pink'})
        setUser(data.updatedUser)
      } else if (data.error) {
        if (data.error === 'Invalid or Expired Token !') {
          handleTokenExpired()
        }
      }
    } catch (err) {
      toast('Cannot Like Pokemon ! Please Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
    }
  }
  const unlikePokemon = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        window.location.href = '/login'
      }
      const response = await fetch(`/api/unlikePokemon?id=${id}&token=${accessToken}`)
      const data = await response.json()

      if (data.updatedUser && data.success) {
        toast('Pokemon Unliked !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
        setUser(data.updatedUser)
      } else if (data.error) {
        if (data.error === 'Invalid or Expired Token !') {
          handleTokenExpired()
        }
      }
    } catch (err) {
      toast('Cannot Unlike Pokemon ! Please Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
    }
  }
  const savePokemon = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        window.location.href = '/login'
      }
      const response = await fetch(`/api/savePokemon?id=${id}&token=${accessToken}`)
      const data = await response.json()

      if (data.updatedUser && data.success) {
        toast('Pokemon Saved !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-blue'})
        setUser(data.updatedUser)
      } else if (data.error) {
        if (data.error === 'Invalid or Expired Token !') {
          handleTokenExpired()
        }
      }
    } catch (err) {
      toast('Cannot Save Pokemon ! Please Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
    }
  }

  const unsavePokemon = async (id: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        window.location.href = '/login'
      }
      const response = await fetch(`/api/unsavePokemon?id=${id}&token=${accessToken}`)
      const data = await response.json()

      if (data.updatedUser && data.success) {
        toast('Pokemon Unsaved !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
        setUser(data.updatedUser)
      } else if (data.error) {
        if (data.error === 'Invalid or Expired Token !') {
          handleTokenExpired()
        }
      }
    } catch (err) {
      toast('Cannot Unsave Pokemon ! Please Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
    }
  }

  return (
    <GlobalContext.Provider value={{
        isLoading,
        setIsLoading,
        allPokemons,
        isFetchingAllPokemons,
        allPokemonFetchingProgress,
        filters,
        setFilters,
        user,
        isUserFetching,
        likePokemon,
        unlikePokemon,
        savePokemon,
        unsavePokemon,
    }}>

        {children}    
    </GlobalContext.Provider>
  )
}