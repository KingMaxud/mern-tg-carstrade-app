import tokenService from '../utils/token.service'

export type User = {
   name: string
   email: string
   isAdmin: boolean
}

export interface AuthState {
   isAuthed: boolean,
   user: User | null
}

const token = tokenService.getLocalAccessToken()

export const initialAuthState: AuthState = {
   isAuthed: !!token,
   user: null
}
