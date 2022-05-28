import { Navigate } from 'react-router-dom'

type Props = {
   children: JSX.Element
   isAuthed: boolean
}

const NotAuthedProtected = ({ children, isAuthed }: Props): JSX.Element => {
   return <>{isAuthed ? <Navigate to="/" replace={true} /> : <>{children}</>}</>
}

export default NotAuthedProtected
