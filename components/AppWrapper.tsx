import { useContext, useEffect } from "react"
import { ThemeContext } from "theme-context"
import './appwrapper.css'

const AppWrapper = ({ children }: {children: React.ReactNode}) => {

  const { theme } = useContext(ThemeContext) 
    
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={`${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} min-h-screen`}>
        {children}
    </div>
  )
}

export default AppWrapper