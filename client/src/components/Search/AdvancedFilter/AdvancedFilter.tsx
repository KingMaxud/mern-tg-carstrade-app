import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Checkbox, FormLabel, Select, Box } from '@chakra-ui/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import history from 'history/browser'

import {
   CheckboxKeys,
   GenerationsData,
   GenerationsVars,
   MarksData,
   ModelsData,
   ModelsVars,
   SearchParams,
   SelectKeys
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

type Props = {
   params: SearchParams
   setParams: Dispatch<SetStateAction<SearchParams>>
   setPage: Dispatch<SetStateAction<number>>
   ifParamsParsed: boolean
   setIfParamsParsed: Dispatch<SetStateAction<boolean>>
}

const AdvancedFilter = ({
   params,
   setParams,
   setPage,
   ifParamsParsed,
   setIfParamsParsed
}: Props) => {
   const [, setSearch] = useSearchParams()
   const [search] = useCustomSearchParams()

   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [marksLoading, setMarksLoading] = useState(false)
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [generationsData, setGenerationsData] = useState<GenerationsData>({
      getGenerations: []
   })
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
         onCompleted: data => setGenerationsData(data)
      }
   )

   const parseSearch = () => {
      for (const item in search) {
         if (arrayKeys.includes(item)) {
            setParams(prevState => ({
               ...prevState,
               [item]: search[item]
            }))
         } else if (stringKeys.includes(item)) {
            setParams(prevState => ({
               ...prevState,
               [item]: search[item][0]
            }))
         } else if (item === 'page') {
            let page: number = (function () {
               if (Number(search[item]) > 0) {
                  return Number(search[item])
               }
               return 1
            })()
            setPage(page)
         }
      }
   }

   // TODO:
   // history.listen(({ location, action }) => {
   //    if (action === 'POP') {
   //       parseSearch()
   //    }
   // })

   // Load models when mark changes
   useDidMountEffect(() => {
      loadModels()
      setGenerationsData({ getGenerations: [] })
      const temp = { ...params }
      delete temp['model']
      delete temp['generation']
      setParams(temp)
   }, [params.mark])

   // Load generations when model changes
   useDidMountEffect(() => {
      loadGenerations()
      const temp = { ...params }
      delete temp['generation']
      setParams(temp)
   }, [params.model])

   // Effect to generations will not be deleted when they got from search params
   useDidMountEffect(() => {
      const temp = { ...params }
      setParams(temp)
   }, [params.generation])

   // Set params object from search params when page loads
   useEffect(() => {
      parseSearch()
      setIfParamsParsed(true)
   }, [])

   // Set search params, when one of filter values changes
   useDidMountEffect(() => {
      setSearch(params, { replace: true })
   }, [params])

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
      if (e.target.value === 'Used & New') {
         setParams(prevState => ({
            ...prevState,
            condition: []
         }))
      } else {
         setParams(prevState => ({
            ...prevState,
            condition: [e.target.value]
         }))
      }
      history.push(`/search?${createSearchParams(params)}`)
   }

   const handleSelection = (
      e: React.ChangeEvent<HTMLSelectElement>,
      key: SelectKeys
   ) => {
      setPage(1)
      if (e.target.value === '') {
         const temp = { ...params }
         delete temp[key]
         setParams(temp)
      } else {
         setParams(prevState => ({
            ...prevState,
            [key]: e.target.value
         }))
      }
      history.push(`/search?${createSearchParams(params)}`)
   }

   const handleCheckbox = (key: CheckboxKeys, value: string) => {
      // If key already exists, add value, else - add key to object
      setPage(1)
      if (Object.keys(params).includes(key)) {
         if (params[key]?.includes(value)) {
            const tempParams = {
               ...params,
               [key]: params[key]?.filter(g => g !== value)
            }
            setParams(tempParams)
         } else {
            const tempArray: string[] = []
            params[key]?.map(g => tempArray.push(g))
            setParams(prevState => ({
               ...prevState,
               [key]: [...tempArray, value]
            }))
         }
      } else {
         setParams(prevState => ({
            ...prevState,
            [key]: [value]
         }))
      }
      history.push(`/search?${createSearchParams(params)}`)
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

   return (
      <div>
         {ifParamsParsed && (
            <div>
               <button
                  onClick={() => {
                     history.push(`/search?${createSearchParams(params)}`)
                  }}>
                  hello
               </button>
               <button
                  onClick={() => {
                     history.back()
                  }}>
                  back
               </button>
               <Select
                  defaultValue={conditionDefaultValue}
                  id="condition"
                  onChange={handleConditionSelection}>
                  <option value="Used & New" label="Used & New" />
                  <option value="Used" label="Used" />
                  <option value="New" label="New" />
               </Select>

               {marksData.getMarks.length > 0 && (
                  <Select
                     defaultValue={params.mark || ''}
                     id="mark"
                     onChange={e => {
                        handleSelection(e, 'mark')
                     }}>
                     <option value="" label={'All marks'} />
                     {marksData.getMarks.map(m => (
                        <option value={m.name} label={m.name} key={m._id} />
                     ))}
                  </Select>
               )}

               {marksData.getMarks.length === 0 && (
                  <Select id="mark">
                     <option value="" label={'All marks'} />
                  </Select>
               )}

               {modelsData?.getModels.length > 0 && (
                  <Select
                     defaultValue={params.model}
                     id="model"
                     onChange={e => handleSelection(e, 'model')}>
                     <option value="" label={'All models'} />
                     {modelsData.getModels.map(mark => (
                        <option
                           value={mark.name}
                           label={mark.name}
                           key={mark._id}
                        />
                     ))}
                  </Select>
               )}

               {(modelsData?.getModels.length === 0 || !modelsData) && (
                  <Select id="model">
                     <option value="" label={'All models'} />
                  </Select>
               )}

               {generationsData &&
                  generationsData.getGenerations.map(g => (
                     <Checkbox
                        isChecked={params.generation?.includes(g.name)}
                        onChange={() => handleCheckbox('generation', g.name)}
                        key={g._id}>
                        {g.name}
                     </Checkbox>
                  ))}

               <FormLabel htmlFor="bodyStyle">Select Body Style:</FormLabel>
               <Box>
                  {bodyStyles.map(b => (
                     <Checkbox
                        isChecked={params.bodyStyle?.includes(b)}
                        onChange={() => handleCheckbox('bodyStyle', b)}
                        key={b}>
                        {b}
                     </Checkbox>
                  ))}
               </Box>

               <Select
                  defaultValue={params.minYear}
                  onChange={e => handleSelection(e, 'minYear')}>
                  <option value="" label={'Year from'} />
                  {yearsFrom.map(year => (
                     <option value={year} label={year.toString()} key={year} />
                  ))}
               </Select>
               <Select
                  defaultValue={params.maxYear}
                  onChange={e => handleSelection(e, 'maxYear')}>
                  <option value="" label={'To'} />
                  {yearsTo.map(year => (
                     <option value={year} label={year.toString()} key={year} />
                  ))}
               </Select>

               <Select
                  defaultValue={params.minPrice}
                  onChange={e => handleSelection(e, 'minPrice')}>
                  <option value="" label={'Price from'} />
                  {pricesFrom.map(price => (
                     <option
                        value={price}
                        label={price.toString()}
                        key={price}
                     />
                  ))}
               </Select>
               <Select
                  defaultValue={params.maxPrice}
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

               <Select
                  defaultValue={params.minMileage}
                  onChange={e => handleSelection(e, 'minMileage')}>
                  <option value="" label={'Mileage from'} />
                  {mileagesFrom.map(mileage => (
                     <option
                        value={mileage}
                        label={mileage.toString()}
                        key={mileage}
                     />
                  ))}
               </Select>
               <Select
                  defaultValue={params.maxMileage}
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

               <Box>
                  {colors.map(b => (
                     <Checkbox
                        key={b.hex}
                        isChecked={params.color?.includes(b.color)}
                        onChange={() => handleCheckbox('color', b.color)}>
                        {b.color}
                     </Checkbox>
                  ))}
               </Box>

               <Box>
                  {transmission.map(t => (
                     <Checkbox
                        key={t}
                        isChecked={params.transmission?.includes(t)}
                        onChange={() => handleCheckbox('transmission', t)}>
                        {t}
                     </Checkbox>
                  ))}
               </Box>

               <Box>
                  {fuelTypes.map(t => (
                     <Checkbox
                        key={t}
                        isChecked={params.fuelType?.includes(t)}
                        onChange={() => handleCheckbox('fuelType', t)}>
                        {t}
                     </Checkbox>
                  ))}
               </Box>

               <Box>
                  {driveInits.map(d => (
                     <Checkbox
                        key={d}
                        isChecked={params.driveInit?.includes(d)}
                        onChange={() => handleCheckbox('driveInit', d)}>
                        {d}
                     </Checkbox>
                  ))}
               </Box>

               <Select
                  defaultValue={params.minEngineCapacity}
                  onChange={e => handleSelection(e, 'minEngineCapacity')}>
                  <option value="" label={'Engine Capacity from'} />
                  {engineCapacitiesFrom.map(e => (
                     <option value={e} label={e.toString()} key={e} />
                  ))}
               </Select>
               <Select
                  defaultValue={params.maxEngineCapacity}
                  onChange={e => handleSelection(e, 'maxEngineCapacity')}>
                  <option value="" label={'To'} />
                  {engineCapacitiesTo.map(e => (
                     <option value={e} label={e.toString()} key={e} />
                  ))}
               </Select>

               <Select
                  defaultValue={params.minPower}
                  onChange={e => handleSelection(e, 'minPower')}>
                  <option value="" label={'Power from'} />
                  {powersFrom.map(p => (
                     <option value={p} label={p.toString()} key={p} />
                  ))}
               </Select>
               <Select
                  defaultValue={params.maxPower}
                  onChange={e => handleSelection(e, 'maxPower')}>
                  <option value="" label={'To'} />
                  {powersTo.map(p => (
                     <option value={p} label={p.toString()} key={p} />
                  ))}
               </Select>
            </div>
         )}
      </div>
   )
}

export default AdvancedFilter
