export enum ActionType {
   SignIn,
   SignOut,
   SetUser
}

export interface SignIn {
   type: ActionType.SignIn
}

export interface SignOut {
   type: ActionType.SignOut
}

export type AuthActions = SignIn | SignOut
