import React, { createContext, useState, useEffect } from "react";

interface ThemeContextType {
    theme: string
    toggleTheme(): void
}

export const ThemeContext = createContext<ThemeContextType>({theme: 'dark', toggleTheme: () => console.log('Defalut Context')})

export const ThemeProvider = ({ children }: {children: React.ReactNode}) => {
    
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark'
        setTheme(savedTheme)
    }, [])

    const toggleTheme = () => {
        setTheme((prevTheme) => prevTheme === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}
