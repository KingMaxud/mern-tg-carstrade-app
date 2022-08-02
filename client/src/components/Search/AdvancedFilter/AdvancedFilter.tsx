import React, {
   Dispatch,
   SetStateAction,
   useEffect,
   useState
} from 'react'
import { Checkbox, FormLabel, Select, Box } from '@chakra-ui/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom'

import {
   CheckboxKeys,
   GenerationsData,
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

type Props = {
   params: SearchParams
   setParams: Dispatch<SetStateAction<SearchParams>>
   setPage: Dispatch<SetStateAction<number>>
   setSortMethod: Dispatch<SetStateAction<SortMethod | null>>
   ifParamsParsed: boolean
   setIfParamsParsed: Dispatch<SetStateAction<boolean>>
}

const AdvancedFilter = ({
   params,
   setParams,
   setPage,
   setSortMethod,
   ifParamsParsed,
   setIfParamsParsed
}: Props) => {
   const [search] = useCustomSearchParams()
   let location = useLocation()
   const navigate = useNavigate()

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
      let params = {}
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
   }

   // Parse search params when location changes
   useEffect(() => {
      parseSearch()
   }, [location])

   // Load models when mark changes
   useDidMountEffect(() => {
      loadModels()
      setGenerationsData({ getGenerations: [] })
   }, [params.mark])

   // Load generations when model changes
   useDidMountEffect(() => {
      loadGenerations()
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

      // If it is mark or model selection, delete waste keys
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

   return (
      <div>
         {ifParamsParsed && (
            <div>
               <Select
                  value={conditionDefaultValue}
                  id="condition"
                  onChange={handleConditionSelection}>
                  <option value="Used & New" label="Used & New" />
                  <option value="Used" label="Used" />
                  <option value="New" label="New" />
               </Select>

               {marksData.getMarks.length > 0 ? (
                  <Select
                     value={params.mark || ''}
                     id="mark"
                     onChange={e => {
                        handleSelection(e, 'mark')
                     }}>
                     <option value="" label={'All marks'} />
                     {marksData.getMarks.map(m => (
                        <option value={m.name} label={m.name} key={m._id} />
                     ))}
                  </Select>
               ) : (
                  <Select id="mark">
                     <option value="" label={'All marks'} />
                  </Select>
               )}

               {modelsData && modelsData.getModels.length > 0 ? (
                  <Select
                     value={params.model || ''}
                     id="model"
                     onChange={e => {
                        handleSelection(e, 'model')
                     }}>
                     <option value="" label={'All models'} />
                     {modelsData.getModels.map(m => (
                        <option value={m.name} label={m.name} key={m._id} />
                     ))}
                  </Select>
               ) : (
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
               <Box key={`${params.bodyStyle?.length} bodyStyle`}>
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
                  value={params.minYear || ''}
                  onChange={e => handleSelection(e, 'minYear')}>
                  <option value="" label={'Year from'} />
                  {yearsFrom.map(year => (
                     <option value={year} label={year.toString()} key={year} />
                  ))}
               </Select>
               <Select
                  value={params.maxYear || ''}
                  onChange={e => handleSelection(e, 'maxYear')}>
                  <option value="" label={'To'} />
                  {yearsTo.map(year => (
                     <option value={year} label={year.toString()} key={year} />
                  ))}
               </Select>

               <Select
                  value={params.minPrice || ''}
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
                  value={params.maxPrice || ''}
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
                  value={params.minMileage || ''}
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
                  value={params.maxMileage || ''}
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

               <Box key={`${params.color?.length} color`}>
                  {colors.map(b => (
                     <Checkbox
                        key={b.hex}
                        isChecked={params.color?.includes(b.color)}
                        onChange={() => handleCheckbox('color', b.color)}>
                        {b.color}
                     </Checkbox>
                  ))}
               </Box>

               <Box key={`${params.transmission?.length} transmission`}>
                  {transmission.map(t => (
                     <Checkbox
                        key={t}
                        isChecked={params.transmission?.includes(t)}
                        onChange={() => handleCheckbox('transmission', t)}>
                        {t}
                     </Checkbox>
                  ))}
               </Box>

               <Box key={`${params.fuelType?.length} fuelType`}>
                  {fuelTypes.map(t => (
                     <Checkbox
                        key={t}
                        isChecked={params.fuelType?.includes(t)}
                        onChange={() => handleCheckbox('fuelType', t)}>
                        {t}
                     </Checkbox>
                  ))}
               </Box>

               <Box key={`${params.driveInit?.length} driveInit`}>
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
                  value={params.minEngineCapacity || ''}
                  onChange={e => handleSelection(e, 'minEngineCapacity')}>
                  <option value="" label={'Engine Capacity from'} />
                  {engineCapacitiesFrom.map(e => (
                     <option value={e} label={e.toString()} key={e} />
                  ))}
               </Select>
               <Select
                  value={params.maxEngineCapacity || ''}
                  onChange={e => handleSelection(e, 'maxEngineCapacity')}>
                  <option value="" label={'To'} />
                  {engineCapacitiesTo.map(e => (
                     <option value={e} label={e.toString()} key={e} />
                  ))}
               </Select>

               <Select
                  value={params.minPower || ''}
                  onChange={e => handleSelection(e, 'minPower')}>
                  <option value="" label={'Power from'} />
                  {powersFrom.map(p => (
                     <option value={p} label={p.toString()} key={p} />
                  ))}
               </Select>
               <Select
                  value={params.maxPower || ''}
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
