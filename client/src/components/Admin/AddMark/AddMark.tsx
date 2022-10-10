import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Input } from '@chakra-ui/react'

import { ADD_MARK, GET_MARKS } from '../../../shared/utils/graphql'
import {
   MarksData,
   ModelsVars,
   MutationDetailsWithId
} from '../../../shared/types'
import styles from './AddMark.module.scss'

const AddMark = (): JSX.Element => {
   const [error, setError] = useState('')
   const [addMarkLoading, setAddMarkLoading] = useState(false)

   const AddMarkSchema = Yup.object().shape({
      markName: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         markName: ''
      },
      validationSchema: AddMarkSchema,
      onSubmit: values => {
         setAddMarkLoading(true)
         addMark({ variables: { markName: values.markName } })
      }
   })

   const [addMark] = useMutation<
      { addMark: MutationDetailsWithId },
      ModelsVars
   >(ADD_MARK, {
      update(cache, data) {
         // Add a new model to the cache
         const cachedMarks = cache.readQuery<MarksData>({
            query: GET_MARKS
         })

         const newData: any = {
            getMarks: []
         }

         if (cachedMarks && cachedMarks.getMarks)
            newData.getMarks = cachedMarks.getMarks

         if (data.data) {
            newData.getMarks = [
               ...newData.getMarks,
               {
                  name: formik.values.markName,
                  _id: data.data.addMark._id
               }
            ]
         }

         cache.writeQuery({
            query: GET_MARKS,
            data: newData
         })

         formik.values.markName = ''
         setAddMarkLoading(false)
      },
      onError(error) {
         setAddMarkLoading(false)
         setError(error.message)
      }
   })

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Add Mark</h1>
         <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputWrapper}>
               <label htmlFor="modelName">Mark: </label>
               <Input
                  id="markName"
                  name="markName"
                  type="text"
                  outline="1px solid rgba(0, 0, 0, 0.7)"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.markName}
               />
            </div>
            {formik.touched.markName && formik.errors.markName ? (
               <div className={styles.error}>{formik.errors.markName}</div>
            ) : null}

            <button className={styles.button} type="submit">
               Add
            </button>
         </form>
      </div>
   )
}

export default AddMark
