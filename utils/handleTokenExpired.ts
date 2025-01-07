import { toast } from 'react-toastify'

export const handleTokenExpired = async () => {
    try {
      const theme = localStorage.getItem('theme') || 'dark'
      const response = await fetch('/api/refreshToken')
      const data = await response.json()

      if (data.success && data.accessToken) {
        console.log('Access token got: ', data.accessToken)
        localStorage.setItem('accessToken', data.accessToken)
        window.location.reload()
        toast('Please Try Again !', {style: {backgroundColor: `${theme === 'dark' ? '#303030' : '#fff'}`, color: `${theme === 'dark' ? '#fff' : '#303030'}`}, progressClassName: 'custom-progress-bar-red'})
      } else if (data.error) {
        if (data.error === 'Cookie Header Missing !' || data.error === 'Refresh Token Missing !' || data.error === 'Invalid or Expired Refresh Token !') {
          localStorage.removeItem('accessToken')
          window.location.href = '/login?msg=SessionExpired'
        }
      }
    } catch (err) {
      console.log('Cannot refresh token !', err)
    }
    
}