import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { FormLabel, Input } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

import tokenService from '../../shared/utils/token.service'
import { useAuth } from '../../context/context'
import { signIn } from '../../context/reducer'
import { REGISTER_USER } from '../../shared/utils/graphql'
import styles from './SignUp.module.scss'
import useWindowSize from '../../shared/hooks/useWindowDimensions'

const SignUp = () => {
   const { dispatch } = useAuth()

   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)
   const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640)

   // Change title
   useEffect(() => {
      document.title = 'Sign Up'
   }, [])
   useEffect(() => {
      setIsMobile(window.innerWidth < 640)
   }, [useWindowSize().width])

   const SignUpSchema = Yup.object().shape({
      name: Yup.string()
         .min(2, 'Too short!')
         .max(50, 'Too long!')
         .required('Required')
         .matches(/^\w+$/, 'Name can only contain Latin letters and numbers.'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string()
         .required('Required')
         .min(6, 'Password is too short - should be 6 chars minimum.')
         .matches(
            /^\w+$/,
            'Password can only contain Latin letters and numbers.'
         ),
      confirmPassword: Yup.string().oneOf(
         [Yup.ref('password'), null],
         'Passwords must match'
      )
   })

   const formik = useFormik({
      initialValues: { name: '', email: '', password: '', confirmPassword: '' },
      validationSchema: SignUpSchema,
      onSubmit: values => {
         setLoading(true)
         register({ variables: values })
      }
   })

   const [register] = useMutation(REGISTER_USER, {
      update(_, { data: { registerUser } }) {
         const user = {
            accessToken: registerUser.accessToken,
            email: registerUser.email,
            name: registerUser.name,
            _id: registerUser._id
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
            <img className={styles.image}
               src="https://res.cloudinary.com/dxl170evw/image/upload/w_400,h_600,c_fill/v1665470000/images/jake-blucker-tMzCrBkM99Y-unsplash_z6hib7.jpg"
               alt="Lonely road"
            />
         )}
         <div className={styles.wrapper}>
            <form onSubmit={formik.handleSubmit}>
               <h1 className={styles.title}>CarTrader</h1>

               <FormLabel htmlFor="name">Name</FormLabel>
               <Input
                  id="name"
                  name="name"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
               />
               <FormLabel htmlFor="email">Email Address</FormLabel>
               <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
               />
               <FormLabel htmlFor="password">Password</FormLabel>
               <Input
                  id="password"
                  name="password"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
               />
               <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
               <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
               />
               <button
                  className={styles.button}
                  type="submit"
                  disabled={loading}>
                  Create Account
               </button>
               {error && <div className={styles.error}>{error}</div>}
            </form>
            <div className={styles.signinLink}>
               Already have account? <Link to={'/signin'}>Sign In</Link>
            </div>
         </div>
      </div>
   )
}

export default SignUp
