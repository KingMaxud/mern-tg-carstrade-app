import { useMutation } from '@apollo/client'

import { ModelHandleVars, MutationDetails } from './Admin.types'
import { ADD_MODEL } from '../../utils/graphql'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

type AddMarkProps = {
   mark: string
}

const AddModel = ({ mark }: AddMarkProps): JSX.Element => {
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   const AddModelSchema = Yup.object().shape({
      modelName: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         modelName: ''
      },
      validationSchema: AddModelSchema,
      onSubmit: values => {
         setLoading(true)
         addModel({
            variables: { markName: mark, modelName: values.modelName }
         })
      }
   })

   const [addModel] = useMutation<
      { addModel: MutationDetails },
      ModelHandleVars
   >(ADD_MODEL, {
      update() {
         setLoading(false)
      },
      onError(error) {
         setLoading(false)
         setError(error.message)
      }
   })

   return (
      <>
         <h1>Add Model</h1>
         <form onSubmit={formik.handleSubmit}>
            <label htmlFor="modelName">Model: </label>
            <input
               id="modelName"
               name="modelName"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.modelName}
            />
            {formik.touched.modelName && formik.errors.modelName ? (
               <div>{formik.errors.modelName}</div>
            ) : null}
            <button type="submit">Add</button>
            {error && error}
         </form>
      </>
   )
}

export default AddModel
