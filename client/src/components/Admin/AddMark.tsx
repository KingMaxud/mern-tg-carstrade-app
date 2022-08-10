import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { useFormik } from 'formik'

import { ADD_MARK, GET_MARKS } from '../../shared/utils/graphql'
import {
   MarksData,
   ModelsVars,
   MutationDetails,
   MutationDetailsWithId
} from '../../shared/types'

const AddMark = (): JSX.Element => {
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   const AddMarkSchema = Yup.object().shape({
      markName: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         markName: ''
      },
      validationSchema: AddMarkSchema,
      onSubmit: values => {
         setLoading(true)
         addMark({ variables: { markName: values.markName } })
      }
   })

   const [addMark] = useMutation<
      { addMark: MutationDetailsWithId },
      ModelsVars
   >(ADD_MARK, {
      update(cache, data) {
         const cachedMarks = cache.readQuery<MarksData>({
            query: GET_MARKS
         })

         if (cachedMarks && data.data) {
            cache.writeQuery({
               query: GET_MARKS,
               data: {
                  getMarks: [
                     ...cachedMarks.getMarks,
                     {
                        name: formik.values.markName,
                        _id: data.data.addMark._id
                     }
                  ]
               }
            })
         }

         setLoading(false)
      },
      onError(error) {
         setLoading(false)
         setError(error.message)
      }
   })

   return (
      <>
         <h1>Add Mark</h1>
         <form onSubmit={formik.handleSubmit}>
            <label htmlFor="modelName">Mark: </label>
            <input
               id="markName"
               name="markName"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.markName}
            />
            {formik.touched.markName && formik.errors.markName ? (
               <div>{formik.errors.markName}</div>
            ) : null}
            <button type="submit">Add</button>
            {error && error}
         </form>
      </>
   )
}

export default AddMark
