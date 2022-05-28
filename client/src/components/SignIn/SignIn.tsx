import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import * as Yup from 'yup'

import { useAuth } from '../../context/context'
import { useFormik } from 'formik'
import { signIn } from '../../context/reducer'
import tokenService from '../../utils/token.service'

const SignIn = () => {
   const { dispatch } = useAuth()

   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

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
         login({ variables: values })
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
      <>
         <form onSubmit={formik.handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
               id="email"
               name="email"
               type="email"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
               <div>{formik.errors.email}</div>
            ) : null}
            <label htmlFor="email">Password Address</label>
            <input
               id="password"
               name="password"
               type="password"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
               <div>{formik.errors.password}</div>
            ) : null}
            <button type="submit" disabled={loading}>
               Sign In
            </button>
         </form>
         {error && <div>{error}</div>}
      </>
   )
}

export default SignIn

const LOGIN_USER = gql`
   mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
         accessToken
      }
   }
`
