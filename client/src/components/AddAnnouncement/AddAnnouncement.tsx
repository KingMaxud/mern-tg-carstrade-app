import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { Button, Input, Textarea } from '@chakra-ui/react'

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
import {
   colors,
   driveInits,
   engineCapacity,
   fuelTypes,
   getYears,
   transmission
} from '../../shared/data'
import Select from '../shared/Select'
import styles from './AddAnnouncement.module.scss'
import useWindowSize from '../../shared/hooks/useWindowDimensions'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'

const AddAnnouncement = () => {
   const width = useWindowSize().width

   const [announcementLoading, setAnnouncementLoading] = useState(true)
   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [generationsData, setGenerationsData] = useState<GenerationsData>({
      getGenerations: []
   })
   const [userId, setUserId] = useState('')
   const [years, setYears] = useState(getYears(1940, 2022))
   const [bodyStyles, setBodyStyles] = useState<string[]>([])
   const [isSmallDevice, setIsSmallDevice] = useState<boolean>(
      (width || 1000) <= 600
   )

   const { addPhoto, addPhotoComponent } = useAddPhoto()
   const { getUserId } = useGetUser()

   // Load marks immediately
   useQuery<MarksData>(GET_MARKS, {
      onCompleted: data => {
         setMarksData(data)
      }
   })

   const AddGenerationSchema = Yup.object().shape({
      mark: Yup.string().required('Required'),
      model: Yup.string().required('Required'),
      generation: Yup.string().required('Required'),
      condition: Yup.string().required('Required'),
      price: Yup.string().required('Required'),
      year: Yup.string().required('Required'),
      mileage: Yup.string()
         .required('Required')
         .max(7, 'Must not be more than 7 characters'),
      color: Yup.string().required('Required'),
      bodyStyle: Yup.string().required('Required'),
      transmission: Yup.string().required('Required'),
      fuelType: Yup.string().required('Required'),
      driveInit: Yup.string().required('Required'),
      engineCapacity: Yup.string().required('Required'),
      power: Yup.string().required('Required'),
      description: Yup.string().max(
         500,
         'Must not be more than 500 characters'
      ),
      phoneNumber: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         mark: '',
         model: '',
         generation: '',
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
         description: '',
         phoneNumber: '123456789'
      },
      validationSchema: AddGenerationSchema,
      onSubmit: async values => {
         const photoUrl = await addPhoto()
         addAnnouncement({
            variables: {
               user: userId,
               mark: values.mark,
               model: values.model,
               generation: values.generation,
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
               description: values.description,
               photos: photoUrl || [],
               phoneNumber: '123456789'
            }
         })
         setAnnouncementLoading(true)
      }
   })

   const [loadModels] = useLazyQuery<ModelsData, ModelsVars>(GET_MODELS, {
      variables: { markName: formik.values.mark },
      onCompleted: data => setModelsData(data)
   })

   const [loadGenerations] = useLazyQuery<GenerationsData, GenerationsVars>(
      GET_GENERATIONS,
      {
         variables: {
            markName: formik.values.mark,
            modelName: formik.values.model
         },
         onCompleted: data => {
            setGenerationsData(data)
         }
      }
   )

   // Change Title
   useEffect(() => {
      document.title = 'Add your announcement to CarTrader'
   }, [])
   // Get user ID when page loads
   useEffect(() => {
      getUserId().then(data => setUserId(data))
   }, [])
   // Change isMobile, when width changes
   useDidMountEffect(() => {
      setIsSmallDevice((width || 0) <= 600)
   }, [width])

   // Load models, when mark changes
   useEffect(() => {
      if (formik.values.mark) {
         loadModels()
      }
   }, [formik.values.mark])
   // Load generations, when model changes
   useEffect(() => {
      if (formik.values.model) {
         loadGenerations()
      }
   }, [formik.values.model])

   const [addAnnouncement] = useMutation<
      AddAnnouncementData,
      AddAnnouncementVars
   >(ADD_ANNOUNCEMENT, {
      update() {
         setAnnouncementLoading(false)
      }
   })

   const handleMarkSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      formik.setFieldValue('mark', e.target.value)
      formik.setFieldValue('model', '')
      setModelsData({
         getModels: []
      })
      formik.setFieldValue('generation', '')
      setGenerationsData({
         getGenerations: []
      })
   }
   const handleModelSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      formik.setFieldValue('model', e.target.value)
      formik.setFieldValue('generation', '')
   }
   const handleGenerationSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      formik.setFieldValue('generation', e.target.value)
      generationsData.getGenerations.map(g => {
         if (g.name === e.target.value) {
            // Set available body styles and years
            setBodyStyles(g.bodyStyles)
            setYears(getYears(g.startYear, g.endYear))
         }
      })
   }
   const handleConditionSelection = (nextValue: string) => {
      formik.setFieldValue('condition', nextValue)
   }

   const colorSelector = (key: keyof typeof formik.values) => {
      if (!!(formik.touched[key] && formik.errors[key])) {
         return '#CC0000A5'
      } else if (formik.values[key]) {
         return '#FFB319A5'
      }
      return '#FFFFFF'
   }
   const isSelected = (key: keyof typeof formik.values) => {
      if (!!(formik.touched[key] && formik.errors[key])) {
         return 'error'
      } else if (formik.values[key]) {
         return 'selected'
      }
      return 'default'
   }

   return (
      <div className={styles.container}>
         <form onSubmit={formik.handleSubmit}>

            {/*TODO: first three selects status*/}
            <Select
               value={formik.values.mark}
               status={isSelected('mark')}
               id="mark"
               onChange={handleMarkSelection}>
               <option value="" label="Select Mark" />
               {marksData.getMarks.map(mark => (
                  <option value={mark.name} label={mark.name} key={mark._id} />
               ))}
            </Select>

            <Select
               value={formik.values.model}
               status={isSelected('model')}
               id="model"
               onChange={handleModelSelection}>
               <option value="" label="Select Model" />
               {modelsData.getModels.map(model => (
                  <option
                     value={model.name}
                     label={model.name}
                     key={model._id}
                  />
               ))}
            </Select>

            <Select
               value={formik.values.generation}
               status={isSelected('generation')}
               id="generation"
               onChange={handleGenerationSelection}>
               <option value="" label="Select Generation" />
               {generationsData.getGenerations.map(generation => {
                  return (
                     <option
                        value={generation.name}
                        label={generation.name}
                        key={generation._id}
                     />
                  )
               })}
            </Select>

            <Select
               onChange={formik.handleChange}
               status={isSelected('year')}
               id="year">
               <option value="" label="Select Year" />
               {years.map(year => (
                  <option value={year} label={year.toString()} key={year} />
               ))}
            </Select>

            <Select
               onChange={formik.handleChange}
               status={isSelected('bodyStyle')}
               id="bodyStyle">
               <option value="" label="Select Body Style" />
               {bodyStyles.map(bodyStyle => (
                  <option value={bodyStyle} label={bodyStyle} key={bodyStyle} />
               ))}
            </Select>

            <div className={styles.condition__container}>
               <div
                  onClick={() => handleConditionSelection('Used')}
                  className={`${styles.condition__item} ${
                     formik.values.condition === 'Used' && styles.selected
                  }`}>
                  Used
               </div>
               <div
                  onClick={() => handleConditionSelection('New')}
                  className={`${styles.condition__item} ${
                     formik.values.condition === 'New' && styles.selected
                  }`}>
                  New
               </div>
            </div>

            <Input
               background={colorSelector('mileage')}
               mt="0.25rem"
               mb="0.25rem"
               width={isSmallDevice ? '90vw' : '32rem'}
               outline="1px solid rgba(0, 0, 0, 0.7)"
               id="mileage"
               name="mileage"
               type="text"
               placeholder="Enter Mileage"
               onChange={formik.handleChange}
               value={formik.values.mileage}
            />

            <Select
               onChange={formik.handleChange}
               status={isSelected('color')}
               id="color">
               <option value="" label="Select Color" />
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
               status={isSelected('transmission')}
               id="transmission">
               <option value="" label="Select Transmission" />
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
               status={isSelected('fuelType')}
               id="fuelType">
               <option value="" label="Select Fuel Type" />
               {fuelTypes.map(fuelType => (
                  <option value={fuelType} label={fuelType} key={fuelType} />
               ))}
            </Select>

            <Select
               onChange={formik.handleChange}
               status={isSelected('driveInit')}
               id="driveInit">
               <option value="" label="Select Drive Init" />
               {driveInits.map(driveInit => (
                  <option value={driveInit} label={driveInit} key={driveInit} />
               ))}
            </Select>

            <Select
               onChange={formik.handleChange}
               status={isSelected('engineCapacity')}
               id="engineCapacity">
               <option value="" label="Select Engine Capacity" />
               {engineCapacity.map(e => (
                  <option value={e.toString()} label={e.toString()} key={e} />
               ))}
            </Select>

            <Input
               background={colorSelector('power')}
               mt="0.25rem"
               mb="0.25rem"
               width={isSmallDevice ? '90vw' : '32rem'}
               color="black"
               id="power"
               name="power"
               type="text"
               outline="1px solid rgba(0, 0, 0, 0.7)"
               placeholder="Enter power"
               onChange={formik.handleChange}
               value={formik.values.power}
            />

            <Input
               background={colorSelector('price')}
               mt="0.25rem"
               mb="0.25rem"
               width={isSmallDevice ? '90vw' : '32rem'}
               id="price"
               name="price"
               type="text"
               outline="1px solid rgba(0, 0, 0, 0.7)"
               placeholder="Enter price"
               onChange={formik.handleChange}
               value={formik.values.price}
            />

            <Textarea
               background={colorSelector('description')}
               mt="0.25rem"
               mb="0.25rem"
               width={isSmallDevice ? '90vw' : '32rem'}
               outline="1px solid rgba(0, 0, 0, 0.7)"
               id="description"
               name="description"
               placeholder="Enter description"
               onChange={formik.handleChange}
               value={formik.values.description}
            />

            <Input
               background={colorSelector('phoneNumber')}
               mt="0.25rem"
               mb="0.25rem"
               width={isSmallDevice ? '90vw' : '32rem'}
               isDisabled={true}
               id="phoneNumber"
               name="phoneNumber"
               type="text"
               placeholder="Enter phone number"
               onChange={formik.handleChange}
               value={formik.values.phoneNumber}
            />

            <label htmlFor="modelName" className={styles.photoLabel}>
               Photo:{' '}
            </label>
            {addPhotoComponent}
            <Button
               bg="#ffb319"
               width={isSmallDevice ? '90vw' : '32rem'}
               type="submit">
               Publish Announcement
            </Button>
         </form>
      </div>
   )
}

export default AddAnnouncement
