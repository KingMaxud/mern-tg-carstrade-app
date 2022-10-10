import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@chakra-ui/react'


import { ADD_MODEL, GET_MODELS } from '../../../shared/utils/graphql'
import {
   ModelHandleVars,
   ModelsData,
   ModelsVars,
   MutationDetailsWithId
} from '../../../shared/types'
import styles from './AddModel.module.scss'

type AddMarkProps = {
   mark: string
}

const AddModel = ({ mark }: AddMarkProps): JSX.Element => {
   const [error, setError] = useState('')
   const [addModelLoading, setAddModelLoading] = useState(false)

   const AddModelSchema = Yup.object().shape({
      modelName: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         modelName: ''
      },
      validationSchema: AddModelSchema,
      onSubmit: values => {
         setAddModelLoading(true)
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
         // Add a new model to the cache
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
         setAddModelLoading(false)
      },
      onError(error) {
         setAddModelLoading(false)
         setError(error.message)
      }
   })

   return (
      <div className={styles.container}>
         <h1 className={styles.title}>Add Model</h1>
         <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputWrapper}>
               <label htmlFor="modelName">Model: </label>
               <Input
                  id="modelName"
                  name="modelName"
                  type="text"
                  outline="1px solid rgba(0, 0, 0, 0.7)"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.modelName}
               />
            </div>
            {formik.touched.modelName && formik.errors.modelName ? (
               <div className={styles.error}>{formik.errors.modelName}</div>
            ) : null}

            <button className={styles.button} type="submit">
               Add
            </button>
         </form>
      </div>
   )
}

export default AddModel
