import React from 'react'

import { AuthState, initialAuthState } from './state'
import { AuthActions } from './actions'

export const AuthContext = React.createContext<{
   state: AuthState
   dispatch: React.Dispatch<AuthActions>
}>({ state: initialAuthState, dispatch: () => undefined })
