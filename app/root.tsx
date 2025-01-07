import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { LinksFunction, json } from "@remix-run/node";
import { ThemeProvider } from "theme-context";
import { GlobalContextProvider } from "global-context";
import AppWrapper from "components/AppWrapper";
import ProgressBar from "components/ProgressBar";
import Footer from "components/Footer";
import { ToastContainer, toast as notify } from "react-toastify";
import { getToast } from 'remix-toast';
import "./tailwind.css";
import './globals.css'
import toastStyles from 'react-toastify/ReactToastify.css?url'

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "stylesheet",
    href: toastStyles
  },
];

export const loader = async ({ request }: {request: Request}) => {
  try {
    const { toast, headers } = await getToast(request)
    return json({ toast }, { headers })
  } catch (err) {
    throw json({ error: 'Failed to load application data' }, { status: 500 })
  }
  
}

export function Layout({ children }: { children: React.ReactNode }) {

  const loaderData = useLoaderData<typeof loader>()
  const toast = loaderData?.toast

  useEffect(() => {
    if (toast) {
      notify(toast.message as string, {type: toast.type})
    }
  }, [toast])

  return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <Links />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </head>
        <body className="no-scrollbar overflow-y-scroll">
          <ProgressBar />
            <ThemeProvider>
              <GlobalContextProvider>
                <AppWrapper>
                  {children}
                  <ToastContainer autoClose={3000} theme="colored"/> 
                </AppWrapper>  
              </GlobalContextProvider>
            </ThemeProvider>
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
  );
}

export default function App() {
  return <Outlet />;
}

const useTheme = () => {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  return theme
}

export const ErrorBoundary = () => {
  const error = useRouteError()
  const theme = useTheme()

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
        <>
          
          <title>PokéSphere - Not Found Page</title>
          <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-20 w-full px-2 md:px-10 py-2 flex items-center`} onClick={() => window.location.href = '/'}>
              <img src="/PokeSphereLogo.svg" alt="Logo" width={54} height={54} className='cursor-pointer hover:scale-110 transition-transform duration-300'/>
          </div>

          <div className={`mx-2 md:mx-10 mt-10 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} overflow-hidden rounded-2xl h-[1300px] xl:h-[770px] flex xl:flex-row flex-col drop-shadow-md`}>
                <div className="bg-transparent h-[50%] xl:h-full w-full xl:w-[50%] rounded-t-2xl xl:rounded-none xl:rounded-l-2xl flex flex-col justify-center items-center">
                    <span className={`text-9xl md:text-[10rem] font-bold drop-shadow-custom-green ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>404</span>
                    <span className={`font-bold text-3xl md:text-5xl ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} mt-5`}>Page Not Found !</span>
                    <span className="text-themeTextGray text-lg md:text-2xl text-center max-w-[500px] mt-5 px-2">Oops ! The Page which you were looking for was Not Found !</span>

                    <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 mt-5 h-14 w-fit rounded-2xl cursor-pointer drop-shadow-md' onClick={() => window.location.href = '/'}>
                        <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                            <i className="fa-solid fa-home text-themeGreen"></i>
                        </div>
                        <span className='font-bold text-themeGreen'>Home</span>
                    </div>
                </div>


                <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-[50%] xl:h-full w-full xl:w-[50%] rounded-b-2xl xl:rounded-none xl:rounded-r-2xl relative flex justify-center items-center`}>
                    <div className={`absolute inset-0 bg-psychic opacity-80 pointer-events-none`}></div>
                    <img src="/icons/psychic.svg" alt="psychic-type-icon" className="w-96 h-96" />
                    <img src="/mewtwo.png" alt="pokemon" className="absolute w-80 h-80" />
                </div>
            </div>

            <Footer />
        </>  
        
    )
  }
  
  return (
    <>
          <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-20 w-full px-2 md:px-10 py-2 flex items-center`} onClick={() => window.location.href = '/'}>
              <img src="/PokeSphereLogo.svg" alt="Logo" width={54} height={54} className='cursor-pointer hover:scale-110 transition-transform duration-300'/>
          </div>

          <div className={`mx-2 md:mx-10 mt-10 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} overflow-hidden rounded-2xl h-[1300px] xl:h-[770px] flex xl:flex-row flex-col drop-shadow-md`}>
              <div className="bg-transparent h-[50%] xl:h-full w-full xl:w-[50%] rounded-t-2xl xl:rounded-none xl:rounded-l-2xl flex flex-col justify-center items-center">
                  <span className={`text-9xl md:text-[10rem] font-bold ${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Error !</span>
                  <span className="text-themeTextGray text-lg md:text-2xl text-center max-w-[500px] mt-5 px-2">We are Sorry, but an Unexpected Error occured ! Try Reloading the Page or Try Again Later !</span>

                  <div className="flex flex-row mt-5 w-[340px] justify-around">
                      <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 h-14 w-fit rounded-2xl cursor-pointer drop-shadow-md' onClick={() => window.location.href = '/'}>
                          <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                              <i className="fa-solid fa-home text-themeGreen"></i>
                          </div>
                          <span className='font-bold text-themeGreen'>Home</span>
                      </div>
                      <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 h-14 w-fit rounded-2xl cursor-pointer drop-shadow-md' onClick={() => window.location.reload()}>
                          <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                              <i className="fa-solid fa-rotate-right text-themeGreen"></i>
                          </div>
                          <span className='font-bold text-themeGreen'>Reload</span>
                      </div>
                  </div>
                  
              </div>

              <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-[50%] xl:h-full w-full xl:w-[50%] rounded-b-2xl xl:rounded-none xl:rounded-r-2xl relative flex justify-center items-center`}>
                  <div className={`absolute inset-0 bg-electric opacity-80 pointer-events-none`}></div>
                  <img src="/icons/electric.svg" alt="electric-type-icon" className="w-96 h-96" />
                  <img src="/pikachu.png" alt="pokemon" className="absolute w-80 h-80" />
              </div>
          </div>

          <Footer />
    </>
  )
}
