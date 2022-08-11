import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ADD_MODEL, GET_MODELS } from '../../shared/utils/graphql'
import {
   ModelHandleVars,
   ModelsData,
   ModelsVars,
   MutationDetailsWithId
} from '../../shared/types'

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
      { addModel: MutationDetailsWithId },
      ModelHandleVars
   >(ADD_MODEL, {
      update(cache, data) {
         const cachedModels = cache.readQuery<ModelsData, ModelsVars>({
            query: GET_MODELS,
            variables: {
               markName: mark
            }
         })

         const newData: any = {
            getModels: []
         }

         if (cachedModels && cachedModels.getModels)
            newData.getModels = cachedModels.getModels

         if (data.data) {
            newData.getModels = [
               ...newData.getModels,
               {
                  name: formik.values.modelName,
                  _id: data.data.addModel._id
               }
            ]
         }

         cache.writeQuery({
            query: GET_MODELS,
            variables: {
               markName: mark
            },
            data: newData
         })

         formik.values.modelName = ''
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
