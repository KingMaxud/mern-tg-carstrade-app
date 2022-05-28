import { useContext, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import tokenService from '../../utils/token.service'
import { AuthContext } from '../../context/context'
import { signIn } from '../../context/reducer'

const SignUp = () => {
   const { dispatch } = useContext(AuthContext)

   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

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
      <>
         <form onSubmit={formik.handleSubmit}>
            <label htmlFor="name">Name</label>
            <input
               id="name"
               name="name"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name ? (
               <div>{formik.errors.name}</div>
            ) : null}
            <label htmlFor="email">Email Address</label>
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
            <label htmlFor="password">Password</label>
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
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
               id="confirmPassword"
               name="confirmPassword"
               type="password"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.confirmPassword}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
               <div>{formik.errors.confirmPassword}</div>
            ) : null}
            <button type="submit" disabled={loading}>
               Create Account
            </button>
         </form>
         {error && <div>{error}</div>}
      </>
   )
}

const REGISTER_USER = gql`
   mutation Register($name: String!, $email: String!, $password: String!) {
      registerUser(name: $name, email: $email, password: $password) {
         accessToken
      }
   }
`

export default SignUp
