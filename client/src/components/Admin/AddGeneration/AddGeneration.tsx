import React, {useEffect, useState} from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { Checkbox, Input } from '@chakra-ui/react'

import { ADD_GENERATION, GET_GENERATIONS } from '../../../shared/utils/graphql'
import useAddPhoto from '../../../shared/hooks/useAddPhoto'
import {
   AddGenerationVars,
   GenerationsData,
   GenerationsVars,
   MutationDetailsWithId
} from '../../../shared/types'
import { bodyStyles } from '../../../shared/data'
import styles from './AddGeneration.module.scss'
import AddGenerationSelect from './AddGenerationSelect/AddGenerationSelect'

type Props = {
   mark: string
   model: string
}

type FormikValues = {
   generationName: string
   bodyStyles: string[]
   startYear: string
   endYear: string
   photo: string
}

const AddGeneration = ({ mark, model }: Props): JSX.Element => {
   const { addPhoto, addPhotoComponent } = useAddPhoto()

   const [error, setError] = useState('')
   const [addGenerationLoading, setAddGenerationLoadingLoading] =
      useState(false)
   const [photoUrlError, setPhotoUrlError] = useState('')

   const AddGenerationSchema = Yup.object().shape({
      generationName: Yup.string().required('Required'),
      bodyStyles: Yup.array().of(Yup.string()).required('Required'),
      startYear: Yup.string().required('Required'),
      endYear: Yup.string().required('Required')
   })

   const formik = useFormik<FormikValues>({
      initialValues: {
         generationName: '',
         bodyStyles: [],
         startYear: '',
         endYear: '',
         photo: ''
      },
      validationSchema: AddGenerationSchema,
      onSubmit: async values => {
         setAddGenerationLoadingLoading(true)
         const photoUrl = await addPhoto()

         if (photoUrl) {
            values.photo = photoUrl[0]
            addGeneration({
               variables: {
                  markName: mark,
                  modelName: model,
                  generationName: values.generationName,
                  bodyStyles: values.bodyStyles,
                  startYear: values.startYear,
                  endYear: values.endYear,
                  photoUrl: values.photo
               }
            })
         } else {
            setPhotoUrlError('Please add photo')
         }
      }
   })

   const [addGeneration] = useMutation<
      { addGeneration: MutationDetailsWithId },
      AddGenerationVars
   >(ADD_GENERATION, {
      update(cache, data) {
         // Add a new generation to the cache
         const cachedGenerations = cache.readQuery<
            GenerationsData,
            GenerationsVars
         >({
            query: GET_GENERATIONS,
            variables: {
               markName: mark,
               modelName: model
            }
         })

         const newData: any = {
            getGenerations: []
         }

         if (cachedGenerations && cachedGenerations.getGenerations)
            newData.getGenerations = cachedGenerations.getGenerations

         if (formik.values.photo && data.data) {
            newData.getGenerations = [
               ...newData.getGenerations,
               {
                  name: formik.values.generationName,
                  bodyStyles: formik.values.bodyStyles,
                  startYear: Number(formik.values.startYear),
                  endYear: Number(formik.values.endYear),
                  photoUrl: formik.values.photo,
                  _id: data.data?.addGeneration._id
               }
            ]
         }

         cache.writeQuery({
            query: GET_GENERATIONS,
            variables: {
               markName: mark,
               modelName: model
            },
            data: newData
         })
         formik.values.generationName = ''
         setAddGenerationLoadingLoading(false)
      },
      onError(error) {
         setAddGenerationLoadingLoading(false)
         setError(error.message)
      }
   })

   useEffect(() => {
      console.log(formik.values.bodyStyles)
   }, [formik.values.bodyStyles])

   return (
      <div
         className={styles.container}>
         <h1 className={styles.title}>Add Generation</h1>
         <form onSubmit={formik.handleSubmit}>
            <div className={styles.inputWrapper}>
               <label htmlFor="modelName">Generation: </label>
               <Input
                  id="generationName"
                  name="generationName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.generationName}
               />
            </div>
            {formik.touched.generationName && formik.errors.generationName ? (
               <div className={styles.error}>
                  {formik.errors.generationName}
               </div>
            ) : null}

            <div className={styles.inputWrapper}>
               <label htmlFor="modelName">Start Year: </label>
               <Input
                  id="startYear"
                  name="startYear"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startYear}
               />
            </div>
            {formik.touched.startYear && formik.errors.startYear ? (
               <div className={styles.error}>{formik.errors.startYear}</div>
            ) : null}

            <div className={styles.inputWrapper}>
               <label htmlFor="modelName">End Year: </label>
               <Input
                  id="endYear"
                  name="endYear"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endYear}
               />
            </div>
            {formik.touched.endYear && formik.errors.endYear ? (
               <div className={styles.error}>{formik.errors.endYear}</div>
            ) : null}

            <AddGenerationSelect>
               {bodyStyles.map(b => (
                  <Checkbox
                     key={b}
                     onChange={() => {
                        if (formik.values.bodyStyles.includes(b)) {
                           formik.setFieldValue(
                              'bodyStyles',
                              formik.values.bodyStyles.filter(v => v !== b)
                           )
                        } else {
                           formik.values.bodyStyles.push(b)
                        }
                     }}>
                     {b}
                  </Checkbox>
               ))}
            </AddGenerationSelect>
            {formik.touched.bodyStyles && formik.errors.bodyStyles ? (
               <div className={styles.error}>{formik.errors.bodyStyles}</div>
            ) : null}

            {addPhotoComponent}
            <div className={styles.error}>{photoUrlError}</div>
            <button className={styles.button} type="submit">
               Add
            </button>
         </form>
      </div>
   )
}

export default AddGeneration
