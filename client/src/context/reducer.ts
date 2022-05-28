import { AuthState, User } from './state'
import { ActionType, SignOut, SignIn, AuthActions, SetUser } from './actions'

export default function authReducer(
   state: AuthState,
   action: AuthActions
): AuthState {
   switch (action.type) {
      case ActionType.SignIn:
         return { ...state, isAuthed: true }
      case ActionType.SignOut:
         return { ...state, isAuthed: true }
      case ActionType.SetUser:
         return {...state, user: action.payload}
      default:
         return state
   }
}

export const signIn = (): SignIn => ({
   type: ActionType.SignIn
})

export const signOut = (): SignOut => ({
   type: ActionType.SignOut
})

export const setUser = (user: User): SetUser => ({
   type: ActionType.SetUser,
   payload: user
})
