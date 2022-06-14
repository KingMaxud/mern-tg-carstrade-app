import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import {
   VStack,
   Button,
   Select,
   RadioGroup,
   Radio,
   FormLabel,
   Input
} from '@chakra-ui/react'

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
   Generation,
   GenerationsData,
   GenerationsVars,
   MarksData,
   ModelsData,
   ModelsVars
} from '../../shared/types'
import useGetUser from '../../shared/hooks/useGetUser'
import {
   colors,
   driveInits,
   engineCapacity,
   fuelTypes,
   getYears,
   transmission
} from '../../shared/data'

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
   const [years, setYears] = useState(getYears(1940, 2022))
   const [bodyStyles, setBodyStyles] = useState<string[]>([])

   const { addPhoto, addPhotoComponent } = useAddPhoto()
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
         onCompleted: data => {
            setGenerationsData(data)
         }
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
         condition: 'Used',
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
         phoneNumber: '123456789'
      },
      // validationSchema: AddGenerationSchema,
      onSubmit: async values => {
         const photoUrl = await addPhoto()
         addAnnouncement({
            variables: {
               user: userId,
               mark,
               model,
               generation,
               condition: values.condition,
               price: values.price,
               year: values.year,
               mileage: values.mileage,
               color: values.color,
               bodyStyle: values.bodyStyle,
               transmission: values.transmission,
               fuelType: values.fuelType,
               driveInit: values.driveInit,
               engineCapacity: values.engineCapacity,
               power: values.power,
               photos: photoUrl || [],
               phoneNumber: '123456789'
            }
         })
         setAnnouncementLoading(true)
      }
   })

   useEffect(() => {
      if (mark) {
         loadModels()
      }
   }, [mark])

   useEffect(() => {
      if (model) {
         loadGenerations()
      }
   }, [model])

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
   }
   const handleModelsSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setModel(e.target.value)
   }
   const handleGenerationsSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      const g: Generation = JSON.parse(e.target.value)
      setGeneration(g.name)
      setYears(getYears(g.startYear, g.endYear))
      setBodyStyles(g.bodyStyles)
   }
   const handleConditionSelection = (nextValue: string) => {
      formik.setFieldValue('condition', nextValue)
   }

   return (
      <>
         <form onSubmit={formik.handleSubmit}>
            <VStack>
               <FormLabel htmlFor="mark">Select Mark:</FormLabel>
               <Select value={mark} id="mark" onChange={handleMarksSelection}>
                  <option value="" label="-- Mark --" />
                  {marksData.getMarks.map(mark => (
                     <option
                        value={mark.name}
                        label={mark.name}
                        key={mark._id}
                     />
                  ))}
               </Select>

               <FormLabel htmlFor="mark">Select Model:</FormLabel>
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

               <FormLabel htmlFor="generation">Select Generation:</FormLabel>
               <select
                  value={generation}
                  id="generation"
                  onChange={handleGenerationsSelection}>
                  <option value="" label="-- Generation --" />
                  {generationsData.getGenerations.map(generation => {
                     return (
                        <option
                           value={JSON.stringify(generation)}
                           label={generation.name}
                           key={generation._id}
                        />
                     )
                  })}
               </select>

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Year"
                  id="year"
                  name="year">
                  {years.map(year => (
                     <option value={year} label={year.toString()} key={year} />
                  ))}
               </Select>

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Body Style"
                  id="bodyStyle"
                  name="bodyStyle">
                  {bodyStyles.map(bodyStyle => (
                     <option
                        value={bodyStyle}
                        label={bodyStyle}
                        key={bodyStyle}
                     />
                  ))}
               </Select>

               <RadioGroup
                  onChange={handleConditionSelection}
                  value={formik.values.condition}
                  name="condition"
                  id="condition">
                  <Radio value="Used">Used</Radio>
                  <Radio value="New">New</Radio>
               </RadioGroup>

               <FormLabel htmlFor="mileage">Mileage</FormLabel>
               <Input
                  id="mileage"
                  name="mileage"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.mileage}
               />

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Color"
                  id="color"
                  name="color">
                  {colors.map(color => (
                     <option
                        value={color.color}
                        label={color.color}
                        key={color.hex}
                     />
                  ))}
               </Select>

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Transmission"
                  id="transmission"
                  name="transmission">
                  {transmission.map(transmission => (
                     <option
                        value={transmission}
                        label={transmission}
                        key={transmission}
                     />
                  ))}
               </Select>

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Fuel Type"
                  id="fuelType"
                  name="fuelType">
                  {fuelTypes.map(fuelType => (
                     <option value={fuelType} label={fuelType} key={fuelType} />
                  ))}
               </Select>

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Drive Init"
                  id="driveInit"
                  name="driveInit">
                  {driveInits.map(driveInit => (
                     <option
                        value={driveInit}
                        label={driveInit}
                        key={driveInit}
                     />
                  ))}
               </Select>

               <Select
                  onChange={formik.handleChange}
                  placeholder="Select Engine Capacity"
                  id="engineCapacity"
                  name="engineCapacity">
                  {engineCapacity.map(e => (
                     <option
                        value={e.toString()}
                        label={e.toString()}
                        key={e}
                     />
                  ))}
               </Select>

               <FormLabel htmlFor="power">Power</FormLabel>
               <Input
                  id="power"
                  name="power"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.power}
               />

               <FormLabel htmlFor="phoneNumber">Price</FormLabel>
               <Input
                  id="price"
                  name="price"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.price}
               />

               <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
               <Input
                  isDisabled={true}
                  id="power"
                  name="power"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
               />
               {addPhotoComponent}
               <Button type="submit">Publish Announcement</Button>
            </VStack>
         </form>
      </>
   )
}

export default AddAnnouncement
