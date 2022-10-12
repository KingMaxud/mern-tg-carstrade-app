import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { FormLabel, Input } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../context/context'
import { useFormik } from 'formik'
import { signIn } from '../../context/reducer'
import tokenService from '../../shared/utils/token.service'
import { LOGIN_USER } from '../../shared/utils/graphql'
import styles from './SignIn.module.scss'
import useWindowSize from '../../shared/hooks/useWindowDimensions'

const SignIn = () => {
   const { dispatch } = useAuth()

   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)
   const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640)

   // Change title
   useEffect(() => {
      document.title = 'Sign In'
   }, [])
   // Change isMobile, when width changes
   useEffect(() => {
      setIsMobile(window.innerWidth < 640)
   }, [useWindowSize().width])

   const SignInSchema = Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         email: '',
         password: ''
      },
      validationSchema: SignInSchema,
      onSubmit: values => {
         setLoading(true)
         login({
            variables: {
               email: values.email.toLowerCase(),
               password: values.password
            }
         })
      }
   })

   const [login] = useMutation(LOGIN_USER, {
      update(_, { data: { loginUser } }) {
         const user = {
            accessToken: loginUser.accessToken,
            email: loginUser.email,
            name: loginUser.name,
            _id: loginUser._id
         }
         dispatch(signIn())
         tokenService.setLocalAccessToken(user.accessToken)
         setLoading(false)
      },
      onError(error) {
         setLoading(false)
         setError(error.message)
      }
   })

   return (
      <div className={styles.container}>
         {!isMobile && (
            <img
               className={styles.image}
               src="https://res.cloudinary.com/dxl170evw/image/upload/w_400,h_600,c_fill/v1665470000/images/jake-blucker-tMzCrBkM99Y-unsplash_z6hib7.jpg"
               alt="Lonely road"
            />
         )}
         <div className={styles.wrapper}>
            <form onSubmit={formik.handleSubmit}>
               <h1 className={styles.title}>CarTrader</h1>

               <FormLabel htmlFor="email">Email</FormLabel>
               <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
               />
               <FormLabel htmlFor="email">Password Address</FormLabel>
               <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
               />
               <button
                  className={styles.button}
                  type="submit"
                  disabled={loading}>
                  Sign In
               </button>
               {error && <div className={styles.error}>{error}</div>}
            </form>
            <div className={styles.signupLink}>
               New here? <Link to={'/signup'}>Create account</Link>
            </div>
         </div>
      </div>
   )
}

export default SignIn
