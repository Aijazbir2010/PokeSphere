import { MetaFunction } from "@remix-run/node"
import { useContext, useState, useEffect } from "react"
import { ThemeContext } from "theme-context"
import { GlobalContext } from "global-context"
import { Link } from "@remix-run/react"
import { useSearchParams, useFetcher, useNavigation, useNavigate, useLoaderData } from "@remix-run/react"
import Footer from "components/Footer"
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Spinner from "components/Spinner"

import { toast } from 'react-toastify'

export const meta: MetaFunction = () => {
    return [
      { title: "PokeSphere-Login" },
      { name: "description", content: "Explore the captivating world of Pokémon with PokéSphere!" },
    ];
}; 

type EmailFetcherData = {
    success?: boolean
    error?: string
}

type RegisterFetcherData = {
    accessToken?: string
    success?: boolean
    error?: string
}

type LoginFetcherData = {
    accessToken?: string
    success?: boolean
    error?: string
}

const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a Valid E-mail !")
      .required("E-mail is Required !"),
    password: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .max(20, "Password cannot exceed 20 characters")
      .required("Password is Required !"),
});

const registerValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(4, "Name must be at least 4 characters")
      .max(20, "Name cannot exceed 20 characters")
      .matches(/^[a-zA-Z]*$/, "Only Letters are Allowed !")
      .required("Name is Required !"),
    email: Yup.string()
      .email("Enter a Valid E-mail !")
      .required("E-mail is Required !"),
    password: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .max(20, "Password cannot exceed 20 characters")
      .required("Password is Required !"),
    code: Yup.string()
      .min(6, 'Code must be 6 characters')
      .max(6, 'Code must be 6 characters')
      .required('Code is required !')  
});

export const loader = () => {
    return { GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID }
}

const Login = () => {

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        window.location.href = '/'
    }

  }, [])  

  const navigation = useNavigation()
  const emailFetcher = useFetcher<EmailFetcherData>() 
  const registerFetcher = useFetcher<RegisterFetcherData>()
  const loginFetcher = useFetcher<LoginFetcherData>()  

  const { theme, toggleTheme } = useContext(ThemeContext)
  const { isLoading, setIsLoading } = useContext(GlobalContext) 

  const handleToggleTheme = () => {
    if (theme === 'dark') {
        localStorage.setItem('theme', 'light')
    } else {
        localStorage.setItem('theme', 'dark')
    }
    toggleTheme()
  }

  const loaderData = useLoaderData<{GITHUB_CLIENT_ID: string}>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isLoginFalse, setIsLoginFalse] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  useEffect(() => {
    const loginQuery = searchParams.get('l')

    setIsLoginFalse(loginQuery === 'false')

    const msg = searchParams.get('msg')

    if (msg) {
        if (msg === 'SessionExpired') {
            toast('Session Expired ! Please Log in again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
        } else if (msg === 'CannotSendEmail') {
            toast('Server Error ! Cannot Send E-mail ! PLease Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
        } else if (msg === 'UserNotFound') {
            toast('User With This E-mail Does Not Exist ! Please Register !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
        } else if (msg === 'PasswordResetSuccessful') {
            toast('Password Reset Successful ! Please Log in !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
        }

        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            params.delete('msg')
            setSearchParams(params)
        }, 3000)

        return () => clearTimeout(timeout)
    }
  }, [searchParams])

  const [isLoginPasswordVisible, setIsLoginPasswordVisible] = useState(false)
  const [isRegisterPasswordVisible, setIsRegisterPasswordVisible] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);

  const {
    register: loginFormRegister,
    handleSubmit: handleLoginSubmit,
    watch: loginWatch,
    setError: setLoginErrors,
    formState: { errors: loginErrors },
  } = useForm({
    resolver: yupResolver(loginValidationSchema),
    mode: 'onChange',
  });

  const loginEmail = loginWatch('email')

  const {
    register: registerFormRegister,
    handleSubmit: handleRegisterSubmit,
    watch: registerWatch,
    setError: setRegisterError,
    formState: { errors: registerErrors },
  } = useForm({
    resolver: yupResolver(registerValidationSchema),
    mode: 'onChange',
  });

  const registerEmail = registerWatch('email')

  const handleSendVerificationEmail = async () => {
    if(!registerEmail) {
        setRegisterError('email', {type: 'manual', message: 'Please fill the Valid E-mail before proceeding !'})
        return
    }
    const formData = new FormData();
    formData.append("email", registerEmail);

    emailFetcher.submit(formData, {
        method: "post",
        action: "/api/sendVerificationEmail",
    });
  }

  useEffect(() => {
    if (emailFetcher.state === "submitting") {
        setIsLoading(true)
    } else if (emailFetcher.state === "idle" && emailFetcher.data?.success) {
        setIsLoading(false)
        setIsEmailSent(true)
        setIsResendDisabled(true)
        setTimeLeft(60)
        toast('Verification Code Sent To Your E-mail !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
    } else if (emailFetcher.state === "idle" && emailFetcher.data?.error) {
        toast('Server Error ! Cannot Send E-mail ! Please Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
    }
    }, [emailFetcher]);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (isResendDisabled && timeLeft > 0) {
          timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
          }, 1000);
        } else if (timeLeft === 0) {
          setIsResendDisabled(false);
        }
    
        return () => clearInterval(timer);
      }, [isResendDisabled, timeLeft]);
    
      
      const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? `0${minutes}` : minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
      };

    const registerUser = async (data: {name: string, email: string, password: string, code: string}) => {
        try {
            const formData = new FormData()
            formData.append('name', data.name)
            formData.append('email', data.email)
            formData.append('password', data.password)
            formData.append('code', data.code)

            registerFetcher.submit(formData, {
                method: 'post',
                action: '/api/register',
            })
        } catch (err) {
            console.log('Cannot Register User !', err)
        }
    }
    
    useEffect(() => {
        if (registerFetcher.state === 'submitting') {
            setIsLoading(true)
        } else if (registerFetcher.state === 'idle' && registerFetcher.data?.success && registerFetcher.data?.accessToken) {
            localStorage.setItem('accessToken', registerFetcher.data.accessToken)
            window.location.href = '/?msg=RegisterSuccessful'
            setIsLoading(false)
        } else if (registerFetcher.state === 'idle' && registerFetcher.data?.error) {
            if (registerFetcher.data.error === 'Verification Code Expired !') {
                setIsLoading(false)
                toast('Verification Code Expired !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'}) 
            } else if (registerFetcher.data.error === 'Invalid Verification Code !') {
                setIsLoading(false)
                toast('Invalid Verification Code !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
            } else if (registerFetcher.data.error === 'User Already Exists With This E-mail !') {
                setIsLoading(false)
                toast('An Account With This E-mail Already Exists !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
            }
            setIsLoading(false)
        } else if (registerFetcher.state === 'idle') {
            setIsLoading(false)
        }
        
    }, [registerFetcher])


    const loginUser = async (data: {email: string, password: string}) => {
        try {
            const formData = new FormData()
            formData.append('email', data.email)
            formData.append('password', data.password)

            loginFetcher.submit(formData, {
                method: 'post',
                action: '/api/login',
            })
        } catch (err) {
            console.log('Cannot log in !', err)
        }
    }

    useEffect(() => {
        if (loginFetcher.state === 'submitting') {
            setIsLoading(true)
        } else if (loginFetcher.state === 'idle' && loginFetcher.data?.success && loginFetcher.data?.accessToken) {
            localStorage.setItem('accessToken', loginFetcher.data.accessToken)
            window.location.href = '/?msg=LoginSuccessful'
            setIsLoading(false)
        } else if (loginFetcher.state === 'idle' && loginFetcher.data?.error) {
            if (loginFetcher.data.error === 'Invalid E-mail ! User Not Found !') {
                setIsLoading(false)
                toast('Invalid E-mail ! User Not Found !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
            } else if (loginFetcher.data.error === 'Invalid Password !') {
                setIsLoading(false)
                toast('Invalid Password !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
            }

            setIsLoading(false)
        } else if (loginFetcher.state === 'idle') {
            setIsLoading(false)
        }
    }, [loginFetcher])

    const handleGithubAuthentication = () => {
        const githubURL = `https://github.com/login/oauth/authorize?client_id=${loaderData.GITHUB_CLIENT_ID}&scope=user:email`
        window.location.href = githubURL
    }

    useEffect(() => {
        const code = searchParams.get('code')

        if (code) {
            setIsLoading(true)
            fetch(`/auth/github/callback?code=${code}`).then(res => res.json()).then(data => {
                if (data.accessToken) {
                    localStorage.setItem('accessToken', data.accessToken)
                    window.location.href = '/?msg=LoginSuccessful'
                    setIsLoading(false)
                }
            }).catch(err => {
                setIsLoading(false)
                console.log('Authentication error: ', err)
            })
        }
    }, [searchParams, navigate])

  return (
    <>
        {(isLoading || navigation.state === 'loading') && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
          <Spinner />
        </div>}

        <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-20 w-full px-2 md:px-10 py-2 flex flex-row justify-between items-center`}>

                <img src="/PokeSphereLogo.svg" alt="Logo" width={54} height={54} className='cursor-pointer hover:scale-110 transition-transform duration-300' onClick={() => window.location.href = '/'}/>

                <div className='flex flex-row gap-2'>
                    <span className={`font-bold ${theme === 'dark' ? 'text-themeTextGray' : 'text-themeGreen'} transition-colors duration-300`}>Light</span>
                    <div className={`${theme === 'dark' ? 'bg-themeGreen' : 'bg-themeTextGray'} w-16 h-7 rounded-full flex items-center cursor-pointer relative`} onClick={(e) => {e.stopPropagation();handleToggleTheme();}}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute ${theme === 'dark' ? 'translate-x-10' : 'translate-x-1'} transition-transform duration-300`}></div>
                    </div>
                    <span className={`font-bold ${theme === 'dark' ? 'text-themeGreen' : 'text-themeTextGray'} transition-colors duration-300`}>Dark</span>
                </div> 
        </div>

        <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 mt-10 ml-2 md:ml-10 h-14 w-fit rounded-2xl cursor-pointer drop-shadow-md' onClick={() => window.location.href = '/'}>
            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                <i className="fa-solid fa-arrow-left text-themeGreen"></i>
            </div>
            <span className='font-bold text-themeGreen'>Go Back</span>
        </div>

        <div className={`mx-2 md:mx-10 mt-10 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} overflow-hidden rounded-2xl h-[1300px] xl:h-[770px] flex xl:flex-row flex-col drop-shadow-md relative`}>
            <div className="bg-transparent h-[50%] xl:h-full w-full xl:w-[50%] rounded-t-2xl xl:rounded-none xl:rounded-l-2xl flex justify-center items-center">
                
                <div className="flex flex-col items-center">
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold text-4xl`}>Log in</span>

                    <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 mt-5 px-6 cursor-pointer hover:scale-95 transition-transform duration-300`} onClick={handleGithubAuthentication}>
                        <img src="/github-icon.svg" alt="github-icon" className={`h-8 w-8 ${theme === 'dark' ? 'invert' : ''}`}/>
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Continue with Github</span>
                    </div> 
                    
                    <div className="flex flex-row items-center gap-2 w-full my-2">
                        <div className="border-[1px] border-themeGreen w-[50%] h-[1px] rounded-l-full"/>
                        <span className="text-themeGreen">Or</span>
                        <div className="border-[1px] border-themeGreen w-[50%] h-[1px] rounded-r-full"/>
                    </div>

                    <form action="" className="flex flex-col gap-3" onSubmit={handleLoginSubmit(loginUser)}>
                        <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${loginErrors.email ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                            <i className="fa-solid fa-lg fa-envelope text-themeTextGray"></i>
                            <input type="text" className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="E-mail" {...loginFormRegister('email')}/>
                        </div>
                        {loginErrors.email && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{loginErrors.email.message}</p>}

                        <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${loginErrors.password ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                            <i className="fa-solid fa-lg fa-lock text-themeTextGray"></i>
                            <input type={`${isLoginPasswordVisible ? 'text' : 'password'}`} className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Password" {...loginFormRegister('password')}/>
                            {isLoginPasswordVisible ? <i className="fa-solid fa-lg fa-eye-slash text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsLoginPasswordVisible(false)}></i> : <i className="fa-solid fa-lg fa-eye text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsLoginPasswordVisible(true)}></i>}
                        </div>
                        {loginErrors.password && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{loginErrors.password.message}</p>}

                        {loginEmail ? <Link to={`/forgotpassword?email=${loginEmail}&emailsent=false`} className="text-themeGreen hover:underline cursor-pointer text-sm px-6">Forgot Password ?</Link> : <span className="text-themeGreen hover:underline cursor-pointer text-sm px-6" onClick={() => setLoginErrors('email', {type: 'manual', message: 'Please fill the Valid E-mail before proceeding !'})}>Forgot Password ?</span>}

                        <button type="submit" className="bg-themeGreen h-14 w-[340px] md:w-96 rounded-2xl text-white font-bold hover:scale-95 transition-transform duration-300">Log in</button>
                    </form>

                    <div className="flex flex-row gap-1 mt-2">
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-sm`}>Not a Member ?</span>
                        <span className="text-sm text-themeGreen hover:underline cursor-pointer" onClick={() => setIsLoginFalse(true)}>Register</span>
                    </div>
                </div>

            </div>

            <div className="bg-transparent h-[50%] xl:h-full w-full xl:w-[50%] rounded-b-2xl xl:rounded-none xl:rounded-r-2xl flex justify-center items-center">
                
                <div className="flex flex-col items-center">
                    <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold text-4xl`}>Register</span>

                    <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 mt-5 px-6 cursor-pointer hover:scale-95 transition-transform duration-300`} onClick={handleGithubAuthentication}>
                        <img src="/github-icon.svg" alt="github-icon" className={`h-8 w-8 ${theme === 'dark' ? 'invert' : ''}`}/>
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'}`}>Continue with Github</span>
                    </div>

                    <div className="flex flex-row items-center gap-2 w-full my-2">
                        <div className="border-[1px] border-themeGreen w-[50%] h-[1px] rounded-l-full"/>
                        <span className="text-themeGreen">Or</span>
                        <div className="border-[1px] border-themeGreen w-[50%] h-[1px] rounded-r-full"/>
                    </div>

                    <form className="flex flex-col gap-3" onSubmit={handleRegisterSubmit(registerUser)}>
                        <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${registerErrors.name ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                            <i className="fa-solid fa-lg fa-user text-themeTextGray"></i>
                            <input type="text" className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Name" {...registerFormRegister('name')}/>
                        </div>
                        {registerErrors.name && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{registerErrors.name.message}</p>}

                        <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${registerErrors.email ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                            <i className="fa-solid fa-lg fa-envelope text-themeTextGray"></i>
                            <input type="text" className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="E-mail" {...registerFormRegister('email')}/>
                        </div>
                        {registerErrors.email && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{registerErrors.email.message}</p>}

                        <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${registerErrors.password ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                            <i className="fa-solid fa-lg fa-lock text-themeTextGray"></i>
                            <input type={`${isRegisterPasswordVisible ? 'text' : 'password'}`} className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Password" {...registerFormRegister('password')}/>
                            {isRegisterPasswordVisible ? <i className="fa-solid fa-lg fa-eye-slash text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsRegisterPasswordVisible(false)}></i> : <i className="fa-solid fa-lg fa-eye text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsRegisterPasswordVisible(true)}></i>}
                        </div>
                        {registerErrors.password && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{registerErrors.password.message}</p>}

                        <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${registerErrors.code ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                            <i className="fa-solid fa-lg fa-key text-themeTextGray"></i>
                            <input type="text" className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Code" {...registerFormRegister('code')}/>
                        </div>
                        {registerErrors.code && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{registerErrors.code.message}</p>}

                        {isEmailSent ? <button type="submit" className="bg-themeGreen h-14 w-[340px] mt-2 md:w-96 rounded-2xl text-white font-bold hover:scale-95 transition-transform duration-300">Register</button> : <button className="bg-themeGreen h-14 w-[340px] mt-2 md:w-96 rounded-2xl text-white font-bold hover:scale-95 transition-transform duration-300" onClick={(e) => {e.preventDefault();handleSendVerificationEmail()}}>Send Verification Code</button>}

                        {isEmailSent && <button className="bg-transparent border-none outline-none rounded-2xl" disabled={isResendDisabled} onClick={(e) => {e.preventDefault();handleSendVerificationEmail()}}><span className="text-white text-center hover:text-themeGreen transition-colors duration-300 cursor-pointer">{isResendDisabled ? `Resend Code in ${formatTime(timeLeft)}` : 'Resend Code'}</span></button>}

                    </form>

                    <div className="flex flex-row gap-1 mt-4">
                        <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} text-sm`}>Have an Account ?</span>
                        <span className="text-sm text-themeGreen hover:underline cursor-pointer" onClick={() => {setIsLoginFalse(false)}}>Log in</span>
                    </div>
                </div>

            </div>

            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-[50%] xl:h-full w-full xl:w-[50%] rounded-b-2xl xl:rounded-none xl:rounded-r-2xl absolute flex justify-center items-center ${isLoginFalse ? 'sliding-image-register' : 'sliding-image-login'}`}>
                <div className={`absolute inset-0 bg-water opacity-80 pointer-events-none`}></div>
                <img src="/icons/water.svg" alt="water-type-icon" className="w-96 h-96"/>
                <img src="/greninja.png" alt="pokemon" className="absolute w-80 h-80"/>
            </div>
        </div>

        <Footer />
    </>
  )
}

export default Login