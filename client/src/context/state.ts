import tokenService from '../shared/utils/token.service'

export interface AuthState {
   isAuthed: boolean
}

const token = tokenService.getLocalAccessToken()

export const initialAuthState: AuthState = {
   isAuthed: !!token
}
