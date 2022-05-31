import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import useAddPhoto from '../../shared/hooks/useAddPhoto'
import {
   ADD_ANNOUNCEMENT,
   GET_GENERATIONS,
   GET_MARKS,
   GET_MODELS
} from '../../shared/utils/graphql'
import {
   AddAnnouncementData,
   AddAnnouncementVars,
   GenerationsData,
   GenerationsVars,
   MarksData,
   ModelsData,
   ModelsVars
} from '../../shared/types'
import useGetUser from '../../shared/hooks/useGetUser'

registerPlugin(
   FilePondPluginImagePreview,
   FilePondPluginImageValidateSize,
   FilePondPluginImageExifOrientation,
   FilePondPluginFileValidateType
)

const AddAnnouncement = () => {
   const [announcementLoading, setAnnouncementLoading] = useState(true)
   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [marksLoading, setMarksLoading] = useState(true)
   const [mark, setMark] = useState('')
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [model, setModel] = useState('')
   const [generationsData, setGenerationsData] = useState<GenerationsData>({
      getGenerations: []
   })
   const [generation, setGeneration] = useState('')
   const [userId, setUserId] = useState('')
   const addPhoto = useAddPhoto()
   const { getUserId } = useGetUser()

   useQuery<MarksData>(GET_MARKS, {
      onCompleted: data => {
         setMarksData(data)
         setMarksLoading(false)
      }
   })

   const [loadModels] = useLazyQuery<ModelsData, ModelsVars>(GET_MODELS, {
      variables: { markName: mark },
      onCompleted: data => setModelsData(data)
   })

   const [loadGenerations] = useLazyQuery<GenerationsData, GenerationsVars>(
      GET_GENERATIONS,
      {
         variables: { markName: mark, modelName: model },
         onCompleted: data => setGenerationsData(data)
      }
   )

   useEffect(() => {
      getUserId().then(data => setUserId(data))
   }, [])

   const AddGenerationSchema = Yup.object().shape({
      mark: Yup.string().required('Required'),
      model: Yup.string().required('Required'),
      generation: Yup.string().required('Required'),
      condition: Yup.string().required('Required'),
      price: Yup.string().required('Required'),
      year: Yup.string().required('Required'),
      mileage: Yup.string().required('Required'),
      color: Yup.string().required('Required'),
      bodyStyle: Yup.string().required('Required'),
      transmission: Yup.string().required('Required'),
      fuelType: Yup.string().required('Required'),
      driveInit: Yup.string().required('Required'),
      engineCapacity: Yup.string().required('Required'),
      power: Yup.string().required('Required'),
      phoneNumber: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         condition: '',
         price: '',
         year: '',
         mileage: '',
         color: '',
         bodyStyle: '',
         transmission: '',
         fuelType: '',
         driveInit: '',
         engineCapacity: '',
         power: '',
         phoneNumber: ''
      },
      // validationSchema: AddGenerationSchema,
      onSubmit: values => {
         console.log(values)
         setAnnouncementLoading(true)
      }
   })

   const [addAnnouncement] = useMutation<
      AddAnnouncementData,
      AddAnnouncementVars
   >(ADD_ANNOUNCEMENT, {
      update() {
         setAnnouncementLoading(false)
      }
   })

   const handleMarksSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMark(e.target.value)
      loadModels()
   }
   const handleModelsSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setModel(e.target.value)
      loadGenerations()
   }
   const handleGenerationsSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setGeneration(e.target.value)
   }

   return (
      <>
         <form onSubmit={formik.handleSubmit}>
            <label htmlFor="mark">Select Mark:</label>
            <select value={mark} id="mark" onChange={handleMarksSelection}>
               <option value="" label="-- Mark --" />
               {marksData.getMarks.map(mark => (
                  <option value={mark.name} label={mark.name} key={mark._id} />
               ))}
            </select>
            <label htmlFor="mark">Select Model:</label>
            <select value={model} id="mark" onChange={handleModelsSelection}>
               <option value="" label="-- Model --" />
               {modelsData.getModels.map(model => (
                  <option
                     value={model.name}
                     label={model.name}
                     key={model._id}
                  />
               ))}
            </select>
            <label htmlFor="generation">Select Generation:</label>
            <select
               value={generation}
               id="generation"
               onChange={handleGenerationsSelection}>
               <option value="" label="-- Generation --" />
               {generationsData.getGenerations.map(generation => (
                  <option
                     value={generation.name}
                     label={generation.name}
                     key={generation._id}
                  />
               ))}
            </select>
            <button type="submit">Submit</button>
            <input type="checkbox" name="name" id="id" />
            <label htmlFor="price">Price: </label>
            <input
               id="price"
               name="price"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.price}
            />
            {formik.touched.price && formik.errors.price ? (
               <div>{formik.errors.price}</div>
            ) : null}
         </form>
      </>
   )
}

export default AddAnnouncement
