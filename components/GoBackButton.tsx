import { useContext } from "react"
import { ThemeContext } from "theme-context"

const GoBackButton = () => {

  const { theme } = useContext(ThemeContext)

  return (
    <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 mt-10 ml-2 md:ml-10 h-14 w-fit rounded-2xl cursor-pointer drop-shadow-md' onClick={() => window.history.back()}>
        <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
            <i className="fa-solid fa-arrow-left text-themeGreen"></i>
        </div>
        <span className='font-bold text-themeGreen'>Go Back</span>
    </div>
  )
}

export default GoBackButton