import { useContext, useEffect } from "react"
import { ThemeContext } from "theme-context"
import { GlobalContext } from "global-context"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./ui/select"
  
import './filters.css'


const Filters = () => {

  const { theme } = useContext(ThemeContext)  
  const {filters, setFilters} = useContext(GlobalContext)

  const pokemonTypes = [
    "Normal",
    "Fire",
    "Water",
    "Electric",
    "Grass",
    "Ice",
    "Fighting",
    "Poison",
    "Ground",
    "Flying",
    "Psychic",
    "Bug",
    "Rock",
    "Ghost",
    "Dragon",
    "Dark",
    "Steel",
    "Fairy",
  ];
  
  const pokemonAbilities = [
    "Overgrow",
    "Blaze",
    "Torrent",
    "Shield Dust",
    "Shed Skin",
    "Compound Eyes",
    "Swarm",
    "Keen Eye",
    "Run Away",
    "Intimidate",
    "Static",
    "Sand Veil",
    "Synchronize",
    "Levitate",
    "Pressure",
    "Adaptability",
    "Multiscale",
    "Sturdy",
    "Inner Focus",
    "Guts",
  ];  

  const handleSelectTypeChange = (value: string) => {
    setFilters({...filters, selectedType: value})
  } 

  const handleSelectAbilityChange = (value: string) => {
    setFilters({...filters, selectedAbility: value})
  } 

  const handleSelectSortOrderChange = (value: string) => {
    setFilters({...filters, selectedSortOrder: value})
  }

  const incrementWeight = () => setFilters({...filters, weight: filters.weight + 1})
  const decrementWeight = () => setFilters({...filters, weight: filters.weight > 0 ? filters.weight - 1 : 0})

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value === "" || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
        setFilters({...filters, weight: value === "" ? 0 : parseInt(value)})
    }
  }

  const incrementHeight = () => setFilters({...filters, height: filters.height + 1})
  const decrementHeight = () => setFilters({...filters, height: filters.height > 0 ? filters.height - 1 : 0})

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (value === "" || /^[0-9]+(\.[0-9]*)?$/.test(value)) {
        setFilters({...filters, height: value === "" ? 0 : parseInt(value)})
    }
  }

  const clearFilters = () => {
    setFilters({selectedType: '', selectedAbility: '', weight: 0, height: 0, selectedSortOrder: ''})
  }

  return (
    <div className="flex flex-row justify-between mx-2 md:mx-10 mt-10">
        <div className="filters grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-4 lg:grid-cols-3 xl:flex xl:flex-row xl:gap-5">
            <Select value={filters.selectedType} onValueChange={handleSelectTypeChange}>
                <SelectTrigger className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} w-fit h-14 border-none outline-none px-3 md:px-6 py-3 rounded-2xl text-themeTextGray placeholder:text-themeTextGray space-x-2 drop-shadow-md group hover:text-themeGreen transition-colors duration-300`}>
                    <i className="fa-regular fa-circle-dot text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                    <SelectValue placeholder='Types'/>
                </SelectTrigger>
                <SelectContent className={`${theme === 'dark' ? 'bg-darkThemePrimary text-white' : 'bg-lightThemePrimary text-themeBlack'} border-none outline-none`}>
                    {pokemonTypes.map((type, index) => (
                        <SelectItem key={index} value={type} className="focus:bg-themeGreen/40 focus:text-themeGreen">{type}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={filters.selectedAbility} onValueChange={handleSelectAbilityChange}>
                <SelectTrigger className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} w-fit h-14 border-none outline-none px-3 md:px-6 py-3 rounded-2xl text-themeTextGray placeholder:text-themeTextGray space-x-2 drop-shadow-md group hover:text-themeGreen transition-colors duration-300`}>
                    <i className="fa-solid fa-bolt text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                    <SelectValue placeholder='Abilities'/>
                </SelectTrigger>
                <SelectContent className={`${theme === 'dark' ? 'bg-darkThemePrimary text-white' : 'bg-lightThemePrimary text-themeBlack'} border-none outline-none`}>
                    {pokemonAbilities.map((ability, index) => (
                        <SelectItem key={index} value={ability} className="focus:bg-themeGreen/40 focus:text-themeGreen">{ability}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <div className={`flex flex-row items-center gap-2 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} w-fit px-3 md:px-6 py-3 h-14 rounded-2xl drop-shadow-md`}>
                <i className="fa-solid fa-weight-hanging text-themeTextGray"></i>
                <input value={filters.weight > 0 ? filters.weight : ''} type="text" className="w-12 bg-transparent outline-none border-none text-themeTextGray text-sm placeholder:text-themeTextGray placeholder:text-xs" placeholder={filters.weight > 0 ? '' : 'Weight'} onChange={handleWeightChange}/>
                <div className="flex flex-col gap-3 ml-2">
                    <i className="fa-solid fa-xs fa-chevron-up text-themeTextGray hover:text-themeGreen transition-colors duration-300 cursor-pointer" onClick={incrementWeight}></i>
                    <i className="fa-solid fa-xs fa-chevron-down text-themeTextGray hover:text-themeGreen transition-colors duration-300 cursor-pointer" onClick={decrementWeight}></i>                    
                </div>
            </div>

            <div className={`flex flex-row items-center gap-2 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} w-fit px-3 md:px-6 py-3 h-14 rounded-2xl drop-shadow-md`}>
                <i className="fa-solid fa-ruler text-themeTextGray"></i>
                <input value={filters.height > 0 ? filters.height : ''} type="text" className="w-12 bg-transparent outline-none border-none text-themeTextGray text-sm placeholder:text-themeTextGray placeholder:text-xs" placeholder={filters.height > 0 ? '' : 'Height'} onChange={handleHeightChange}/>
                <div className="flex flex-col gap-3 ml-2">
                    <i className="fa-solid fa-xs fa-chevron-up text-themeTextGray hover:text-themeGreen transition-colors duration-300 cursor-pointer" onClick={incrementHeight}></i>
                    <i className="fa-solid fa-xs fa-chevron-down text-themeTextGray hover:text-themeGreen transition-colors duration-300 cursor-pointer" onClick={decrementHeight}></i>                    
                </div>
            </div>

            <Select value={filters.selectedSortOrder} onValueChange={handleSelectSortOrderChange}>
                <SelectTrigger className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} w-fit h-14 border-none outline-none px-3 md:px-6 py-3 rounded-2xl text-themeTextGray placeholder:text-themeTextGray space-x-2 drop-shadow-md group hover:text-themeGreen transition-colors duration-300`}>
                    <i className="fa-solid fa-arrow-down-a-z text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                    <SelectValue placeholder='Sort Order'/>
                </SelectTrigger>
                <SelectContent className={`${theme === 'dark' ? 'bg-darkThemePrimary text-white' : 'bg-lightThemePrimary text-themeBlack'} border-none outline-none`}>
                    <SelectItem value={'Ascending'} className="focus:bg-themeGreen/40 focus:text-themeGreen">Ascending</SelectItem>
                    <SelectItem value={'Descending'} className="focus:bg-themeGreen/40 focus:text-themeGreen">Descending</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className={`flex flex-row items-center gap-1 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} hover:bg-themeGreen/40 px-3 md:px-6 py-3 w-fit h-14 rounded-2xl group cursor-pointer drop-shadow-md transition-colors duration-300`} onClick={clearFilters}>
            <i className="fa-solid fa-xmark fa-lg text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
            <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">Clear Filters</span>
        </div>
    </div>
  )
}

export default Filters