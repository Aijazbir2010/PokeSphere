import { useContext, useState, useEffect, useRef } from 'react'
import { Link, useFetcher } from '@remix-run/react'
import { ThemeContext } from 'theme-context'
import { useLocation } from '@remix-run/react'
import Spinner from './Spinner'

import { toast } from 'react-toastify'

type LogoutFetcherData = {
    success?: boolean
}

const Navbar = ({ name }: {name: string}) => {

  const location = useLocation()
  const currentPathname = location.pathname

  const logoutFetcher = useFetcher<LogoutFetcherData>()
  const { theme, toggleTheme } = useContext(ThemeContext)
    
  const handleToggleTheme = () => {
    if (theme === 'dark') {
        localStorage.setItem('theme', 'light')
    } else {
        localStorage.setItem('theme', 'dark')
    }
    toggleTheme()
  }

  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node) === false) {
        setIsMenuOpen(false);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutFetcher.load('/api/logout')
  }

  useEffect(() => {
    if (logoutFetcher.state === 'idle' && logoutFetcher.data?.success) {
        localStorage.removeItem('accessToken')
        window.location.href = '/?msg=LogoutSuccessful'
        setIsLoggingOut(false)
    } else if (logoutFetcher.state === 'loading' || logoutFetcher.state === 'submitting') {
        setIsLoggingOut(true)
    } else if (logoutFetcher.state === 'idle') {
        setIsLoggingOut(false)
    }
  }, [logoutFetcher])

  return (
    <>
        {isLoggingOut && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
        </div>}

        <div className={`h-20 w-full ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} py-2 px-2 md:px-10 flex flex-row justify-between items-center`}>
            
                
                <img src="/PokeSphereLogo.svg" alt="Logo" width={54} height={54} className='cursor-pointer hover:scale-110 transition-transform duration-300' onClick={() => window.location.href = '/'}/>
                
            
                <div className='flex flex-row gap-2 md:gap-5'>
                    <Link to={"/"}>
                        <div className={`group flex flex-row items-center gap-1 ${currentPathname === '/' ? 'bg-themeGreen/40' : 'bg-transparent'} hover:bg-themeGreen/40 px-4 md:px-6 py-3 h-14 rounded-2xl cursor-pointer relative transition-colors duration-300`}>
                            <i className={`material-icons ${currentPathname === '/' ? 'text-themeGreen' : 'text-themeTextGray'} group-hover:text-themeGreen transition-colors duration-300`}>language</i>
                            <span className={`${currentPathname === '/' ? 'text-themeGreen' : 'text-themeTextGray'} font-bold group-hover:text-themeGreen transition-colors duration-300 hidden md:block`}>Browse</span>
                            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} group-hover:md:hidden hidden group-hover:flex justify-center items-center px-6 h-14 rounded-2xl absolute left-[-40%] bottom-[-70px]`}>
                                <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Browse</span>
                            </div>
                        </div>
                    </Link>
                    <Link to={"/favourites"}>
                        <div className={`group flex flex-row items-center gap-1 ${currentPathname === '/favourites' ? 'bg-favouritesPink/40' : 'bg-transparent'} hover:bg-favouritesPink/40 px-4 md:px-6 py-3 h-14 rounded-2xl cursor-pointer relative transition-colors duration-300`}>
                            <i className={`fa-solid fa-heart ${currentPathname === '/favourites' ? 'text-favouritesPink' : 'text-themeTextGray'} group-hover:text-favouritesPink transition-colors duration-300`}></i>
                            <span className={`${currentPathname === '/favourites' ? 'text-favouritesPink' : 'text-themeTextGray'} font-bold group-hover:text-favouritesPink transition-colors duration-300 hidden md:block`}>Favourites</span>
                            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} group-hover:md:hidden hidden group-hover:flex justify-center items-center px-6 h-14 rounded-2xl absolute left-[-80%] bottom-[-70px]`}>
                                <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Favourites</span>
                            </div>
                        </div>
                    </Link>
                    <Link to={"/saved"}>
                        <div className={`group flex flex-row items-center gap-1 ${currentPathname === '/saved' ? 'bg-savedBlue/40' : 'bg-transparent'} hover:bg-savedBlue/40 px-4 md:px-6 py-3 h-14 rounded-2xl cursor-pointer relative transition-colors duration-300`}>
                            <i className={`fa-solid fa-bookmark ${currentPathname === '/saved' ? 'text-savedBlue' : 'text-themeTextGray'} group-hover:text-savedBlue transition-colors duration-300`}></i>
                            <span className={`${currentPathname === '/saved' ? 'text-savedBlue' : 'text-themeTextGray'} font-bold group-hover:text-savedBlue transition-colors duration-300 hidden md:block`}>Saved</span>
                            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} group-hover:md:hidden hidden group-hover:flex justify-center items-center px-6 h-14 rounded-2xl absolute left-[-55%] bottom-[-70px]`}>
                                <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Saved</span>
                            </div>
                        </div>
                    </Link>
                </div>  

                <div ref={menuRef} className='flex flex-row items-center gap-2 md:gap-3 bg-themeGreen/40 px-3 md:px-6 py-3 h-14 rounded-2xl cursor-pointer relative' onClick={() => setIsMenuOpen((prev) => !prev)}>
                    <span className='font-bold text-themeGreen'>{name}</span>
                    <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                        <i className={`fa-solid ${isMenuOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-themeGreen`}></i>
                    </div>

                    {isMenuOpen && <div className={`flex flex-col gap-5 items-center w-52 h-30 px-2 py-4 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} rounded-2xl absolute right-0 bottom-[-160px] z-50 drop-shadow-md`}>   
                        <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 py-3 h-14 w-fit rounded-2xl cursor-pointer' onClick={handleLogout}>
                            <span className='font-bold text-themeGreen'>Log out</span>
                            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                                <i className="fa-solid fa-arrow-right text-themeGreen"></i>
                            </div>
                        </div>
                        
                        <div className='flex flex-row gap-2'>
                            <span className={`font-bold ${theme === 'dark' ? 'text-themeTextGray' : 'text-themeGreen'} transition-colors duration-300`}>Light</span>
                            <div className={`${theme === 'dark' ? 'bg-themeGreen' : 'bg-themeTextGray'} w-16 h-7 rounded-full flex items-center cursor-pointer relative`} onClick={(e) => {e.stopPropagation();handleToggleTheme();}}>
                                <div className={`w-5 h-5 bg-white rounded-full absolute ${theme === 'dark' ? 'translate-x-10' : 'translate-x-1'} transition-transform duration-300`}></div>
                            </div>
                            <span className={`font-bold ${theme === 'dark' ? 'text-themeGreen' : 'text-themeTextGray'} transition-colors duration-300`}>Dark</span>
                        </div> 
                    </div>}
                </div>
        </div>
    </>
    
  )
}

export default Navbar