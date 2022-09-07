import { Navigate } from 'react-router-dom'

type Props = {
   children: JSX.Element
   isAuthed: boolean
}

const AuthedProtected = ({ children, isAuthed }: Props): JSX.Element => {
   return <>{isAuthed ? <>{children}</> : <Navigate to="/" replace={true} />}</>
}

export default AuthedProtected
