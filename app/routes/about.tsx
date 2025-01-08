import { MetaFunction } from "@remix-run/node"
import { useContext } from "react"
import { ThemeContext } from "theme-context"
import { GlobalContext } from "global-context"
import UnNavbar from "components/UnNavbar"
import Navbar from "components/Navbar"
import Footer from "components/Footer"
import GoBackButton from "components/GoBackButton"
import Spinner from "components/Spinner"

export const meta: MetaFunction = () => {
  return [
    { title: "PokeSphere-About" },
    { name: "description", content: "Explore the captivating world of Pokémon with PokéSphere!" },
  ];
}; 

const About = () => {

  const { theme } = useContext(ThemeContext)
  const { user, isUserFetching } = useContext(GlobalContext) 

  return (
    <>
        {isUserFetching && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
        </div>}

        {user ? <Navbar name={user.name}/> : <UnNavbar />}

        <GoBackButton />

        <div className="main my-10 mx-2 md:mx-10">
          <div className="about-website flex flex-col gap-5 mb-10">
            <div>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold text-3xl md:text-4xl`}>Welcome to PokéSphere</span>
            </div>
            <div className="flex flex-col gap-3">
                <div className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-lg`}>Hey there! Welcome to PokéSphere, a place I&apos;ve built for every Pokémon fan out there. Here, you&apos;ll find detailed information about all Pokémon—stats, abilities, and more.</div>
                <div className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-lg`}>What makes PokéSphere special is that it&apos;s not just about exploring; you can also personalize your experience. You can save your favorite Pokémon in the Saved section or add them to your Favourites for quick access. Whether you&apos;re here to learn, collect, or just have fun, I&apos;ve made sure PokéSphere has everything you need.</div>
                <div className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-xl font-bold`}>By the way, the website&apos;s UI is inspired by The Code Dealer&apos;s video on YouTube. If you&apos;re into web development, I highly recommend checking out his channel <a href="https://www.youtube.com/@TheCodeDealer" target={"_blank"} rel={"noopener noreferrer"} className="text-themeGreen">here.</a></div>
            </div> 
          </div>
          <div className="about-website flex flex-col gap-5">
            <div>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold text-3xl md:text-4xl`}>About Me</span>
            </div>
            <div className="flex flex-col gap-3">
                <div className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-lg`}>Hi! I&apos;m Aijazbir Brar, the creator of PokéSphere. I&apos;m 14 years old and absolutely love coding. I&apos;m a full-stack developer and work with modern tools like the MERN stack, Next.js, and Remix.js.</div>
                <div className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-lg`}>I built PokéSphere as a way to properly understand TypeScript and Remix after learning both these technologies. This project has been an amazing way to put my knowledge into practice while creating something fun and useful for Pokémon fans.</div>
                <div className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-lg`}>I made PokéSphere because I&apos;m a huge Pokémon fan, and I wanted to create something awesome for other fans like me. It&apos;s been a fun journey building this, and I hope you enjoy using it as much as I enjoyed creating it!
                Thanks for stopping by! 😊</div>
            </div> 
          </div>
          
        </div>

        <Footer />
    </>
  )
}

export default About