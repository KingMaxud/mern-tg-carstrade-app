import { AuthState } from './state'
import { ActionType, SignOut, SignIn, AuthActions } from './actions'

export default function authReducer(
   state: AuthState,
   action: AuthActions
): AuthState {
   switch (action.type) {
      case ActionType.SignIn:
         return { ...state, isAuthed: true }
      case ActionType.SignOut:
         return { ...state, isAuthed: false }
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
