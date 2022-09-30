import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Checkbox, FormLabel, Box } from '@chakra-ui/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'

import {
   CheckboxKeys,
   Generation,
   GenerationsData,
   GenerationsFilterArray,
   GenerationsVars,
   MarksData,
   ModelsData,
   ModelsVars,
   SearchParams,
   SelectKeys,
   SortMethod
} from '../../../shared/types'
import {
   arrayKeys,
   bodyStyles,
   colors,
   driveInits,
   fuelTypes,
   getEngineCapacities,
   getMileages,
   getPowers,
   getPrices,
   getYears,
   sortMethods,
   stringKeys,
   transmission
} from '../../../shared/data'
import {
   GET_GENERATIONS,
   GET_MARKS,
   GET_MODELS
} from '../../../shared/utils/graphql'
import useCustomSearchParams from '../../../shared/hooks/useCustomSearchParams'
import useDidMountEffect from '../../../shared/hooks/useDidMountEffect'
import styles from './AdvancedFilter.module.scss'
import Select from '../../shared/Select'
import CheckboxSelect from '../../shared/CheckboxSelect'
import CheckboxSelectGeneration from './CheckboxSelectGeneration/CheckboxSelectGeneration'

type Props = {
   params: SearchParams
   setParams: Dispatch<SetStateAction<SearchParams>>
   setPage: Dispatch<SetStateAction<number>>
   setSortMethod: Dispatch<SetStateAction<SortMethod | null>>
   ifParamsParsed: boolean
   setIfParamsParsed: Dispatch<SetStateAction<boolean>>
   loadAnnouncementTrigger: boolean
   setLoadAnnouncementTrigger: Dispatch<SetStateAction<boolean>>
}

const AdvancedFilter = ({
   params,
   setParams,
   setPage,
   setSortMethod,
   ifParamsParsed,
   setIfParamsParsed,
   setLoadAnnouncementTrigger,
   loadAnnouncementTrigger
}: Props) => {
   const [search] = useCustomSearchParams()
   let location = useLocation()
   const navigate = useNavigate()

   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [marksLoading, setMarksLoading] = useState(false)
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [generationsData, setGenerationsData] = useState<
      GenerationsFilterArray[]
   >([])
   const [yearsFrom, setYearsFrom] = useState(getYears(1940, 2022))
   const [yearsTo, setYearsTo] = useState(getYears(1940, 2022))
   const [pricesFrom, setPricesFrom] = useState(getPrices(0, 100000))
   const [pricesTo, setPricesTo] = useState(getPrices(0, 100000))
   const [mileagesFrom, setMileagesFrom] = useState(getMileages(0, 300000))
   const [mileagesTo, setMileagesTo] = useState(getMileages(0, 300000))
   const [engineCapacitiesFrom, setEngineCapacitiesFrom] = useState(
      getEngineCapacities(0, 6.5)
   )
   const [engineCapacitiesTo, setEngineCapacitiesTo] = useState(
      getEngineCapacities(0, 6.5)
   )
   const [powersFrom, setPowersFrom] = useState(getPowers(0, 600))
   const [powersTo, setPowersTo] = useState(getPowers(0, 600))

   // Load marks immediately
   useQuery<MarksData>(GET_MARKS, {
      onCompleted: data => {
         setMarksData(data)
         setMarksLoading(false)
      }
   })

   const [loadModels] = useLazyQuery<ModelsData, ModelsVars>(GET_MODELS, {
      variables: { markName: params.mark || '' },
      onCompleted: data => setModelsData(data)
   })

   const [loadGenerations] = useLazyQuery<GenerationsData, GenerationsVars>(
      GET_GENERATIONS,
      {
         variables: {
            markName: params.mark || '',
            modelName: params.model || ''
         },
         onCompleted: data => {
            const newArr = data.getGenerations.map(g => {
               return {
                  generation: g,
                  isChecked: params.generation?.includes(g.name) || false
               }
            })

            setGenerationsData(newArr)
         }
      }
   )

   const parseSearch = () => {
      // Trigger useEffect to load reload announcement
      setLoadAnnouncementTrigger(!loadAnnouncementTrigger)
      let params: any = {} // Declare params as an empty object
      let sortMethod: null | SortMethod = sortMethods[0]
      let page = 1
      for (const item in search) {
         // check if values must be an array or not, clean possible trash values
         if (arrayKeys.includes(item)) {
            params = {
               ...params,
               [item]: search[item]
            }
         } else if (stringKeys.includes(item)) {
            params = {
               ...params,
               [item]: search[item][0]
            }
         } else if (item === 'page') {
            page = (function () {
               if (Number(search[item]) > 0) {
                  return Number(search[item])
               }
               return 1
            })()
         } else if (item === 'sort') {
            sortMethod =
               sortMethods.find(s => s.shortCode === search[item][0]) || null
         }
      }

      setPage(page)
      setSortMethod(sortMethod)
      setParams(params)
      // Change generations' isChecked
      const newArr = generationsData.map(g => {
         return {
            generation: g.generation,
            isChecked: params.generation?.includes(g.generation.name) || false
         }
      })
      setGenerationsData(newArr)
   }

   // Parse search params when location changes
   useEffect(() => {
      parseSearch()
   }, [location])

   // Load models when mark changes
   useDidMountEffect(() => {
      if (params.mark) {
         loadModels()
      } else {
         setModelsData({ getModels: [] })
      }

      setGenerationsData([])
   }, [params.mark])

   // Load generations when model changes
   useDidMountEffect(() => {
      if (params.model) {
         loadGenerations()
      } else {
         setGenerationsData([])
      }
   }, [params.model])

   // Effect for generations will be not deleted when they are retrieved from search params
   useDidMountEffect(() => {
      const temp = { ...params }
      setParams(temp)
   }, [params.generation])

   // Set params object from search params when page loads
   useEffect(() => {
      parseSearch()
      setIfParamsParsed(true)
   }, [])

   // Handle selection data arrays
   useDidMountEffect(() => {
      setYearsTo(getYears(Number(params.minYear) || 1940, 2022))
   }, [params.minYear])
   useDidMountEffect(() => {
      setYearsFrom(getYears(1940, Number(params.maxYear) || 2022))
   }, [params.maxYear])
   useDidMountEffect(() => {
      setPricesTo(getPrices(Number(params.minPrice) || 0, 2000001))
   }, [params.minPrice])
   useDidMountEffect(() => {
      setPricesFrom(getPrices(0, Number(params.maxPrice) || 2000001))
   }, [params.maxPrice])
   useDidMountEffect(() => {
      setMileagesTo(getMileages(Number(params.minMileage) || 0, 300001))
   }, [params.minMileage])
   useDidMountEffect(() => {
      setMileagesFrom(getMileages(0, Number(params.maxMileage) || 300001))
   }, [params.maxMileage])
   useDidMountEffect(() => {
      setEngineCapacitiesTo(
         getEngineCapacities(Number(params.minEngineCapacity) || 0, 6.6)
      )
   }, [params.minEngineCapacity])
   useDidMountEffect(() => {
      setEngineCapacitiesFrom(
         getEngineCapacities(0, Number(params.maxEngineCapacity) || 6.6)
      )
   }, [params.maxEngineCapacity])
   useDidMountEffect(() => {
      setPowersTo(getPowers(Number(params.minPower) || 0, 601))
   }, [params.minPower])
   useDidMountEffect(() => {
      setPowersFrom(getPowers(0, Number(params.maxPower) || 601))
   }, [params.maxPower])

   const handleConditionSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setPage(1)
      let tempParams: SearchParams
      if (e.target.value === 'Used & New') {
         tempParams = {
            ...params,
            condition: []
         }
      } else {
         tempParams = {
            ...params,
            condition: [e.target.value]
         }
      }

      setParams(tempParams)
      navigate(`/search?${createSearchParams(tempParams)}`)
   }

   const handleSelection = (
      e: React.ChangeEvent<HTMLSelectElement>,
      key: SelectKeys
   ) => {
      setPage(1)
      let tempParams: SearchParams
      if (e.target.value === '') {
         const temp = { ...params }
         delete temp[key]
         tempParams = temp
      } else {
         tempParams = {
            ...params,
            [key]: e.target.value
         }
      }

      // Check if it is mark or model selection, delete extra keys
      switch (key) {
         case 'mark':
            delete tempParams['model']
            delete tempParams['generation']
            break
         case 'model':
            delete tempParams['generation']
            break
      }

      setParams(tempParams)
      navigate(`/search?${createSearchParams(tempParams)}`)
   }

   const handleCheckbox = (key: CheckboxKeys, value: string) => {
      let tempParams: SearchParams
      // If key already exists, add value, else - add key to object
      setPage(1)
      if (Object.keys(params).includes(key)) {
         if (params[key]?.includes(value)) {
            tempParams = {
               ...params,
               [key]: params[key]?.filter(g => g !== value)
            }
         } else {
            const tempArray: string[] = []
            params[key]?.map(g => tempArray.push(g))
            tempParams = {
               ...params,
               [key]: [...tempArray, value]
            }
         }
      } else {
         tempParams = {
            ...params,
            [key]: [value]
         }
      }

      setParams(tempParams)
      navigate(`/search?${createSearchParams(tempParams)}`)
   }

   const conditionDefaultValue = (function () {
      let value = 'Used & New'

      if (params.condition) {
         if (params.condition.length === 1) {
            value = params.condition[0]
         }
      }

      return value
   })()

   // selected, default
   const isSelected = (key: keyof typeof params) => {
      if (params[key]) {
         return 'selected'
      } else {
         return 'default'
      }
   }

   return (
      <div className={styles.container}>
         {ifParamsParsed && (
            <div className={styles.wrapper}>
               <label htmlFor="condition">Condition</label>
               <Select
                  status={isSelected('condition')}
                  value={conditionDefaultValue}
                  id="condition"
                  onChange={handleConditionSelection}>
                  <option value="Used & New" label="Used & New" />
                  <option value="Used" label="Used" />
                  <option value="New" label="New" />
               </Select>

               <label htmlFor="model">Mark</label>
               <Select
                  disabled={!marksData.getMarks.length}
                  value={params.mark || ''}
                  status={isSelected('mark')}
                  id="mark"
                  onChange={e => {
                     handleSelection(e, 'mark')
                  }}>
                  <option value="" label={'All marks'} />
                  {marksData.getMarks.map(m => (
                     <option value={m.name} label={m.name} key={m._id} />
                  ))}
               </Select>

               <label htmlFor="model">Model</label>
               <Select
                  disabled={!modelsData.getModels.length}
                  value={params.model || ''}
                  id="model"
                  status={isSelected('model')}
                  onChange={e => {
                     handleSelection(e, 'model')
                  }}>
                  <option value="" label={'All models'} />
                  {modelsData.getModels.map(m => (
                     <option value={m.name} label={m.name} key={m._id} />
                  ))}
               </Select>

               <label htmlFor="generation">Generation</label>
               <CheckboxSelectGeneration
                  text={
                     !params.generation || params.generation.length === 0
                        ? 'All'
                        : params.generation.join(', ')
                  }
                  generationsData={generationsData}
                  disabled={generationsData.length === 0}
                  handleCheckbox={handleCheckbox}
               />

               <label htmlFor="bodyStyle">Body Style</label>
               <CheckboxSelect
                  keyName="bodyStyle"
                  values={bodyStyles}
                  handleCheckbox={handleCheckbox}
                  params={params}
                  text={params.bodyStyle ? params.bodyStyle.join(', ') : 'All'}
               />

               <label htmlFor="minYear">Year</label>
               <div className={styles.selectWrapper}>
                  <Select
                     value={params.minYear || ''}
                     status={isSelected('minYear')}
                     onChange={e => handleSelection(e, 'minYear')}>
                     <option value="" label={'From'} />
                     {yearsFrom.map(year => (
                        <option
                           value={year}
                           label={year.toString()}
                           key={year}
                        />
                     ))}
                  </Select>
                  <Select
                     value={params.maxYear || ''}
                     status={isSelected('maxYear')}
                     onChange={e => handleSelection(e, 'maxYear')}>
                     <option value="" label={'To'} />
                     {yearsTo.map(year => (
                        <option
                           value={year}
                           label={year.toString()}
                           key={year}
                        />
                     ))}
                  </Select>
               </div>

               <label>Price</label>
               <div className={styles.selectWrapper}>
                  <Select
                     value={params.minPrice || ''}
                     status={isSelected('minPrice')}
                     onChange={e => handleSelection(e, 'minPrice')}>
                     <option value="" label={'From'} />
                     {pricesFrom.map(price => (
                        <option
                           value={price}
                           label={price.toString()}
                           key={price}
                        />
                     ))}
                  </Select>
                  <Select
                     value={params.maxPrice || ''}
                     status={isSelected('maxPrice')}
                     onChange={e => handleSelection(e, 'maxPrice')}>
                     <option value="" label={'To'} />
                     {pricesTo.map(price => (
                        <option
                           value={price}
                           label={price.toString()}
                           key={price}
                        />
                     ))}
                  </Select>
               </div>

               <label>Mileage</label>
               <div className={styles.selectWrapper}>
                  <Select
                     value={params.minMileage || ''}
                     status={isSelected('minMileage')}
                     onChange={e => handleSelection(e, 'minMileage')}>
                     <option value="" label={'From'} />
                     {mileagesFrom.map(mileage => (
                        <option
                           value={mileage}
                           label={mileage.toString()}
                           key={mileage}
                        />
                     ))}
                  </Select>
                  <Select
                     value={params.maxMileage || ''}
                     status={isSelected('maxMileage')}
                     onChange={e => handleSelection(e, 'maxMileage')}>
                     <option value="" label={'To'} />
                     {mileagesTo.map(mileage => (
                        <option
                           value={mileage}
                           label={mileage.toString()}
                           key={mileage}
                        />
                     ))}
                  </Select>
               </div>

               <label htmlFor="color">Color</label>
               <CheckboxSelect
                  keyName="color"
                  values={colors.map(c => c.color)}
                  handleCheckbox={handleCheckbox}
                  params={params}
                  text={params.color ? params.color.join(', ') : 'All'}
               />

               <label htmlFor="transmission">Transmission</label>
               <CheckboxSelect
                  keyName="transmission"
                  values={transmission}
                  handleCheckbox={handleCheckbox}
                  params={params}
                  text={
                     params.transmission
                        ? params.transmission.join(', ')
                        : 'All'
                  }
               />

               <label htmlFor="fuelType">Fuel Type</label>
               <CheckboxSelect
                  keyName="fuelType"
                  values={fuelTypes}
                  handleCheckbox={handleCheckbox}
                  params={params}
                  text={params.fuelType ? params.fuelType.join(', ') : 'All'}
               />

               <label htmlFor="driveInit">Drive Init</label>
               <CheckboxSelect
                  keyName="driveInit"
                  values={driveInits}
                  handleCheckbox={handleCheckbox}
                  params={params}
                  text={params.driveInit ? params.driveInit.join(', ') : 'All'}
               />

               <label>Engine Capacity</label>
               <div className={styles.selectWrapper}>
                  <Select
                     value={params.minEngineCapacity || ''}
                     status={isSelected('minEngineCapacity')}
                     onChange={e => handleSelection(e, 'minEngineCapacity')}>
                     <option value="" label={'From'} />
                     {engineCapacitiesFrom.map(e => (
                        <option value={e} label={e.toString()} key={e} />
                     ))}
                  </Select>
                  <Select
                     value={params.maxEngineCapacity || ''}
                     status={isSelected('maxEngineCapacity')}
                     onChange={e => handleSelection(e, 'maxEngineCapacity')}>
                     <option value="" label={'To'} />
                     {engineCapacitiesTo.map(e => (
                        <option value={e} label={e.toString()} key={e} />
                     ))}
                  </Select>
               </div>

               <label>Power</label>
               <div className={styles.selectWrapper}>
                  <Select
                     value={params.minPower || ''}
                     status={isSelected('minPower')}
                     onChange={e => handleSelection(e, 'minPower')}>
                     <option value="" label={'From'} />
                     {powersFrom.map(p => (
                        <option value={p} label={p.toString()} key={p} />
                     ))}
                  </Select>
                  <Select
                     value={params.maxPower || ''}
                     status={isSelected('maxPower')}
                     onChange={e => handleSelection(e, 'maxPower')}>
                     <option value="" label={'To'} />
                     {powersTo.map(p => (
                        <option value={p} label={p.toString()} key={p} />
                     ))}
                  </Select>
               </div>
            </div>
         )}
      </div>
   )
}

export default AdvancedFilter
