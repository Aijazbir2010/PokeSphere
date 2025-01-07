import { useContext } from "react"
import { ThemeContext } from "theme-context"

type SearchBarProps ={
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar = ({ handleChange }: SearchBarProps) => {

  const { theme } = useContext(ThemeContext)
    
  return (
    <div className="w-full flex justify-center mt-20">
        <div className={`flex flex-row justify-between ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} w-[90%] md:w-[70%] h-14 rounded-2xl px-4 md:px-6 py-3 drop-shadow-md`}>
            <input type="text" className={`bg-transparent w-full outline-0 border-0 font-bold placeholder:font-normal placeholder:text-themeTextGray ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`} placeholder="Search Pokemon" onChange={handleChange}/>
            <div className={`flex justify-center items-center cursor-pointer group`}>
                <i className="fa-solid fa-magnifying-glass text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
            </div>
        </div>    
    </div>
     
  )
}

export default SearchBar