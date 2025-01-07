import { MetaFunction } from "@remix-run/node";
import { useContext, useState, useEffect } from "react"
import { ThemeContext } from "theme-context"
import { Link, useLoaderData, useFetcher, useSearchParams } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import GoBackButton from "components/GoBackButton";
import Footer from "components/Footer";
import Spinner from "components/Spinner";

import { toast } from 'react-toastify'

export const meta: MetaFunction = () => {
    return [
      { title: "PokeSphere-Forgot Password" },
      { name: "description", content: "Explore the captivating world of Pokémon with PokéSphere!" },
    ];
}; 

type PasswordResetFetcherData = {
    success?: boolean
    error?: string
}

const passwordResetValidationSchema = Yup.object().shape({
    code: Yup.string()
      .min(6, "Code must be 6 characters")
      .max(6, "Code must be 6 characters")
      .required("Code is Required !"),
    password: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .max(20, "Password cannot exceed 20 characters")
      .required("Password is Required !"),
    confirmPassword: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .max(20, "Password cannot exceed 20 characters")
      .required("Password is Required !"),  
});

export const loader =  async ({ request }: {request: Request}) => {
    const url = new URL(request.url)
    const email = url.searchParams.get('email')
    const isEmailSent = url.searchParams.get('emailsent') || 'false'
    if (!email) {
       return redirect('/login')
    }

    if (isEmailSent === 'false') {
        const response = await fetch(`${process.env.BASE_URL}/api/forgotpassword?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        if (data.error) {
            if (data.error === 'Cannot send email ! Server error !') {
              return redirect('/login?msg=CannotSendEmail')  
            } else if (data.error === 'User not found !') {
                return redirect('/login?msg=UserNotFound')
            }
            
        }
    }
    
    return { email }
}

const Forgotpassword = () => {

    const loaderData = useLoaderData<{email: string}>()
    const passwordResetFetcher = useFetcher<PasswordResetFetcherData>()
    const [searchParams, setSearchParams] = useSearchParams()
    const { theme, toggleTheme } = useContext(ThemeContext)

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (accessToken) {
            window.location.href = '/'
        }
    
      }, [])  

    const handleToggleTheme = () => {
        if (theme === 'dark') {
            localStorage.setItem('theme', 'light')
        } else {
            localStorage.setItem('theme', 'dark')
        }
        toggleTheme()
    }

    useEffect(() => {
        setSearchParams({email: loaderData.email, emailsent: 'true'})
    }, [])

    const {
        register: passwordResetRegister,
        handleSubmit: handlePasswordResetSubmit,
        setError: setPasswordResetErrors,
        formState: { errors: passwordResetErrors },
    } = useForm({
        resolver: yupResolver(passwordResetValidationSchema),
        mode: 'onChange',
    });

    const [isResendingCode, setIsResendingCode] = useState(false)
    const [isResetingPassword, setIsResetingPassword] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const maskEmail = (email: string) => {
        const [username, domain] = email.split("@")
        if (username.length <= 2) {
          return `${username}***@${domain}`;
        }
        const visibleStart = username.slice(0, 3)
        const visibleEnd = username.slice(-2)
        return `${visibleStart}****${visibleEnd}@${domain}`
    }

    useEffect(() => {
        setTimeLeft(60)
        setIsResendDisabled(true)
        toast('Verification Code Sent To Your E-mail !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
    }, [])

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
    
    const resendCode = async () => {
        try {
            setIsResendingCode(true)
            const response = await fetch(`/api/forgotpassword?email=${encodeURIComponent(loaderData.email)}`)
            const data = await response.json()

            if (data.error) {
                if (data.error === 'Cannot send email ! Server error !') {
                    setIsResendingCode(false)
                    toast('Server Error ! Cannot Send E-mail ! PLease Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
                } else if (data.error === 'User not found !') {
                    setIsResendingCode(false)
                    toast('User With This E-mail Does Not Exist ! Please Register !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
                }
                
                setIsResendingCode(false)
                setTimeLeft(0)
                setIsResendDisabled(false)
                return
            }

            setIsResendingCode(false)
            setTimeLeft(60)
            setIsResendDisabled(true)
            toast('Verification Code Sent To Your E-mail !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-green'})
        } catch (err) {
            setIsResendingCode(false)
            console.log('Cannot resend code !', err)
        }
    }

    const resetPassword = async (data: {code: string, password: string, confirmPassword: string}) => {
        if (data.password !== data.confirmPassword) {
            setPasswordResetErrors('confirmPassword', {type: 'manual', message: 'Passwords do not match ! Please make sure both fields are identical'})
            return
        }

        const formData = new FormData()
        formData.append('email', loaderData.email)
        formData.append('code', data.code)
        formData.append('password', data.password)

        passwordResetFetcher.submit(formData, {method: 'post', action: '/api/resetPassword'})
    }

    useEffect(() => {
        if (passwordResetFetcher.state === 'submitting') {
            setIsResetingPassword(true)
        } else if (passwordResetFetcher.state === 'idle' && passwordResetFetcher.data?.success) {
            window.location.href = '/login?msg=PasswordResetSuccessful'
            setIsResetingPassword(false)
        } else if (passwordResetFetcher.state === 'idle' && passwordResetFetcher.data?.error) {
            if (passwordResetFetcher.data.error === 'Code is expired !') {
               setIsResetingPassword(false) 
               toast('Verification Code Expired !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
            } else if (passwordResetFetcher.data.error === 'Invalid code !') {
                setIsResetingPassword(false)
                toast('Invalid Verification Code !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
            }

            setIsResetingPassword(false)
        } else if (passwordResetFetcher.state === 'idle') {
            setIsResetingPassword(false)
        }
    }, [passwordResetFetcher])

    return (
        <>
            {(isResendingCode || isResetingPassword) && <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} opacity-80 fixed inset-0 z-[60] flex justify-center items-center`}>
                <Spinner />
            </div>}

            <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-20 w-full px-2 md:px-10 py-2 flex flex-row justify-between items-center`}>

                
                <img src="/PokeSphereLogo.svg" alt="Logo" width={54} height={54} className='cursor-pointer hover:scale-110 transition-transform duration-300' onClick={() => window.location.href = '/'}/>
                

                <div className='flex flex-row gap-2'>
                    <span className={`font-bold ${theme === 'dark' ? 'text-themeTextGray' : 'text-themeGreen'} transition-colors duration-300`}>Light</span>
                    <div className={`${theme === 'dark' ? 'bg-themeGreen' : 'bg-themeTextGray'} w-16 h-7 rounded-full flex items-center cursor-pointer relative`} onClick={(e) => { e.stopPropagation(); handleToggleTheme(); }}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute ${theme === 'dark' ? 'translate-x-10' : 'translate-x-1'} transition-transform duration-300`}></div>
                    </div>
                    <span className={`font-bold ${theme === 'dark' ? 'text-themeGreen' : 'text-themeTextGray'} transition-colors duration-300`}>Dark</span>
                </div>
            </div>

            <div className='flex flex-row items-center gap-3 bg-themeGreen/40 px-6 mt-10 ml-2 md:ml-10 h-14 w-fit rounded-2xl cursor-pointer drop-shadow-md' onClick={() => window.location.href = '/login'}>
                <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} px-2 py-1 rounded-md`}>
                    <i className="fa-solid fa-arrow-left text-themeGreen"></i>
                </div>
                <span className='font-bold text-themeGreen'>Go Back</span>
            </div>

            <div className={`mx-2 md:mx-10 mt-10 ${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} overflow-hidden rounded-2xl h-[1300px] xl:h-[770px] flex xl:flex-row flex-col drop-shadow-md`}>
                <div className="bg-transparent h-[50%] xl:h-full w-full xl:w-[50%] rounded-t-2xl xl:rounded-none xl:rounded-l-2xl flex justify-center items-center">

                    <div className="flex flex-col items-center">
                        <div className="flex flex-col items-center w-[340px] gap-2">
                            <span className={`${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold text-4xl`}>Enter Code</span>
                            <span className="text-themeTextGray font-bold text-sm text-center">An e-mail has been sent to {maskEmail(loaderData.email)} which contains the code to be entered to reset the password.</span>
                        </div>


                        <form className="flex flex-col gap-3 mt-5" onSubmit={handlePasswordResetSubmit(resetPassword)}>
                            <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${passwordResetErrors.code ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                                <i className="fa-solid fa-lg fa-key text-themeTextGray"></i>
                                <input type="text" className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Code" {...passwordResetRegister('code')}/>
                            </div>
                            {passwordResetErrors.code && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{passwordResetErrors.code.message}</p>}

                            <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${passwordResetErrors.password ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                                <i className="fa-solid fa-lg fa-lock text-themeTextGray"></i>
                                <input type={`${isPasswordVisible ? 'text' : 'password'}`} className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Password" {...passwordResetRegister('password')}/>
                                {isPasswordVisible ? <i className="fa-solid fa-lg fa-eye-slash text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsPasswordVisible(false)}></i> : <i className="fa-solid fa-lg fa-eye text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsPasswordVisible(true)}></i>}
                            </div>
                            {passwordResetErrors.password && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{passwordResetErrors.password.message}</p>}

                            <div className={`flex flex-row items-center gap-5 ${theme === 'dark' ? 'bg-darkThemeBackground' : 'bg-lightThemeBackground'} rounded-2xl h-14 w-[340px] md:w-96 px-6 focus-within:border-2 focus-within:border-themeGreen ${passwordResetErrors.confirmPassword ? 'border-2 border-red-500 focus-within:border-red-500' : ''}`}>
                                <i className="fa-solid fa-lg fa-lock text-themeTextGray"></i>
                                <input type={`${isConfirmPasswordVisible ? 'text' : 'password'}`} className={`bg-transparent w-full outline-none border-none ${theme === 'dark' ? 'text-white' : 'text-themeBlack'} font-bold placeholder:text-themeTextGray placeholder:font-normal`} placeholder="Confirm Password" {...passwordResetRegister('confirmPassword')}/>
                                {isConfirmPasswordVisible ? <i className="fa-solid fa-lg fa-eye-slash text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsConfirmPasswordVisible(false)}></i> : <i className="fa-solid fa-lg fa-eye text-white cursor-pointer hover:text-themeGreen transition-colors duration-300" onClick={() => setIsConfirmPasswordVisible(true)}></i>}
                            </div>
                            {passwordResetErrors.confirmPassword && <p className="font-bold text-red-500 text-xs px-6 w-[340px] md:w-96">{passwordResetErrors.confirmPassword.message}</p>}

                            <button type="submit" className="bg-themeGreen h-14 w-[340px] mt-2 md:w-96 rounded-2xl text-white font-bold hover:scale-95 transition-transform duration-300">Reset Password</button>

                            <button className="bg-transparent border-none outline-none rounded-2xl" disabled={isResendDisabled} onClick={(e) => {e.preventDefault();resendCode()}}><span className="text-white text-center hover:text-themeGreen transition-colors duration-300 cursor-pointer">{isResendDisabled ? `Resend Code in ${formatTime(timeLeft)}` : 'Resend Code'}</span></button>

                        </form>

                    </div>

                </div>


                <div className={`${theme === 'dark' ? 'bg-darkThemePrimary' : 'bg-lightThemePrimary'} h-[50%] xl:h-full w-full xl:w-[50%] rounded-b-2xl xl:rounded-none xl:rounded-r-2xl relative flex justify-center items-center`}>
                    <div className={`absolute inset-0 bg-grass opacity-80 pointer-events-none`}></div>
                    <img src="/icons/grass.svg" alt="grass-type-icon" className="w-96 h-96" />
                    <img src="/venusaur.png" alt="pokemon" className="absolute w-80 h-80" />
                </div>
            </div>

            <Footer />
        </>
    )
}

export default Forgotpassword