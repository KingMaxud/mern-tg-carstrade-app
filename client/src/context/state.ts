import tokenService from '../utils/token.service'

export interface AuthState {
   isAuthed: boolean
}

const token = tokenService.getLocalAccessToken()

export const initialAuthState: AuthState = {
   isAuthed: !!token
}
