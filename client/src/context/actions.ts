import { User } from './state'

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

export interface SetUser {
   type: ActionType.SetUser
   payload: User
}

export type AuthActions = SignIn | SignOut | SetUser
