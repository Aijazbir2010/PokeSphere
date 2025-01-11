import { useContext } from "react"
import { ThemeContext } from "theme-context"
import { Link } from "@remix-run/react"

const Footer = () => {

  const { theme } = useContext(ThemeContext)

  return (
    <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-[500px] md:h-60 w-full mt-10 py-5 relative`}>
        <div className={`flex flex-col gap-7 md:gap-0 md:flex-row md:justify-around w-full`}>
            <div className="flex flex-col items-center gap-5">
                <span className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Contact Us</span>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-row gap-2 items-center group">
                        <i className="fa-solid fa-lg fa-phone text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                        <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">+91-62845-23190</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center group">
                        <i className="fa-solid fa-lg fa-envelope text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                        <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">funaijazbirs@gmail.com</span>
                    </div>   
                </div> 
            </div>
            <div className="flex flex-col items-center gap-5">
                <span className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>About Us</span>
                <div className="flex flex-col items-center gap-2">
                    <Link to={'/about'} className="flex flex-row gap-1 items-center group">
                        <i className="material-icons text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">subdirectory_arrow_right</i>
                        <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">About</span>
                    </Link>
                    <Link to={'/about'} className="flex flex-row gap-1 items-center group">
                        <i className="material-icons text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">language</i>
                        <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">Portfolio</span>
                    </Link>   
                </div> 
            </div>
            <div className="flex flex-col items-center gap-5">
                <span className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>External Links</span>
                <div className="flex flex-col items-center gap-2">
                    <a href={"https://www.instagram.com/aijazbir_2010/"} target={"_blank"} rel={"noopener noreferrer"} className="flex flex-row gap-2 items-center group">
                        <i className="fa-brands fa-instagram fa-lg text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                        <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">Instagram</span>
                    </a>
                    <a href={"https://github.com/Aijazbir2010"} target={"_blank"} rel={"noopener noreferrer"} className="flex flex-row gap-2 items-center group">
                        <i className="fa-brands fa-github fa-lg text-themeTextGray group-hover:text-themeGreen transition-colors duration-300"></i>
                        <span className="font-bold text-themeTextGray group-hover:text-themeGreen transition-colors duration-300">Github</span>
                    </a>   
                </div> 
            </div>
        </div>

        <div className="flex justify-center w-full absolute bottom-5">
            <span className="text-themeTextGray">&copy; {new Date().getFullYear()} PokéSphere. All Rights Reserved.</span>   
        </div>
    </div>
    
  )
}

export default Footer