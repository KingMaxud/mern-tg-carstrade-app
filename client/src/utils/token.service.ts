const getLocalAccessToken = () => {
   return localStorage.getItem('accessToken')
}

const setLocalAccessToken = (accessToken: string) => {
   localStorage.setItem('accessToken', accessToken || '')
}

const removeLocalAccessToken = () => {
   localStorage.removeItem('accessToken')
}

const TokenService = {
   getLocalAccessToken,
   setLocalAccessToken,
   removeLocalAccessToken
}

export default TokenService
