import React, { useState } from 'react'
import { Checkbox, FormLabel, Select, Box } from '@chakra-ui/react'
import { useLazyQuery, useQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'

import {
   GenerationsData,
   GenerationsVars,
   MarksData,
   ModelsData,
   ModelsVars, SearchParams
} from '../../../shared/types'
import {
   bodyStyles,
   colors,
   conditions,
   driveInits,
   fuelTypes,
   getEngineCapacities,
   getMileages,
   getPowers,
   getPrices,
   getYears,
   transmission
} from '../../../shared/data'
import {
   GET_GENERATIONS,
   GET_MARKS,
   GET_MODELS
} from '../../../shared/utils/graphql'
import useCustomSearchParams from "../../../shared/hooks/useCustomSearchParams";

type Props = {
   searchParamsFilter: {}
}

const AdvancedFilter = () => {
   const [search, setSearch] = useCustomSearchParams()

   const [params, setParams] = useState<SearchParams>({})
   const [condition, setCondition] = useState<string[]>(['Used'])
   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [marksLoading, setMarksLoading] = useState(false)
   const [mark, setMark] = useState('')
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [model, setModel] = useState('')
   const [generationsData, setGenerationsData] = useState<GenerationsData>({
      getGenerations: []
   })
   const [generations, setGenerations] = useState<string[]>([])
   const [yearsFrom, setYearsFrom] = useState(getYears(1940, 2022))
   const [yearsTo, setYearsTo] = useState(getYears(1940, 2022))
   const [minYear, setMinYear] = useState<number>(1940)
   const [maxYear, setMaxYear] = useState<number>(2022)
   const [pricesFrom, setPricesFrom] = useState(getPrices(0, 100000))
   const [pricesTo, setPricesTo] = useState(getPrices(0, 100000))
   const [minPrice, setMinPrice] = useState(0)
   const [maxPrice, setMaxPrice] = useState(100001)
   const [mileagesFrom, setMileagesFrom] = useState(getMileages(0, 300000))
   const [mileagesTo, setMileagesTo] = useState(getMileages(0, 300000))
   const [minMileage, setMinMileage] = useState(0)
   const [maxMileage, setMaxMileage] = useState(100001)
   const [engineCapacitiesFrom, setEngineCapacitiesFrom] = useState(
      getEngineCapacities(0, 6.5)
   )
   const [engineCapacitiesTo, setEngineCapacitiesTo] = useState(
      getEngineCapacities(0, 6.5)
   )
   const [minEngineCapacity, setMinEngineCapacity] = useState(0)
   const [maxEngineCapacity, setMaxEngineCapacity] = useState(100001)
   const [powersFrom, setPowersFrom] = useState(getPowers(0, 600))
   const [powersTo, setPowersTo] = useState(getPowers(0, 600))
   const [minPower, setMinPower] = useState(0)
   const [maxPower, setMaxPower] = useState(601)

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
         variables: {
            markName: mark,
            modelName: model
         },
         onCompleted: data => setGenerationsData(data)
      }
   )

   const handleConditionSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      if (e.target.value === 'Used & New') {
         setCondition(['Used', 'New'])
      } else {
         setCondition([e.target.value])
      }
   }
   const handleMarksSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMark(e.target.value)
      loadModels()
   }
   const handleModelsSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setModel(e.target.value)
      loadGenerations()
   }
   const handleMinYearSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMinYear(Number(e.target.value))
      setYearsTo(getYears(Number(e.target.value), 2022))
   }
   const handleMaxYearSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setMaxYear(Number(e.target.value))
      setYearsFrom(getYears(1940, Number(e.target.value)))
   }
   const handleMinPriceSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMinPrice(Number(e.target.value))
      setPricesTo(getPrices(Number(e.target.value), 2000001))
   }
   const handleMaxPriceSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMaxPrice(Number(e.target.value))
      setPricesFrom(getPrices(0, Number(e.target.value)))
   }
   const handleMinMileageSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMinMileage(Number(e.target.value))
      setMileagesTo(getPrices(Number(e.target.value), 2000001))
   }
   const handleMaxMileageSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMaxMileage(Number(e.target.value))
      setMileagesFrom(getPrices(0, Number(e.target.value)))
   }
   const handleMinEngineCapacitySelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMinEngineCapacity(Number(e.target.value))
      setEngineCapacitiesTo(getEngineCapacities(Number(e.target.value), 6.6))
   }
   const handleMaxEngineCapacitySelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMaxEngineCapacity(Number(e.target.value))
      setEngineCapacitiesFrom(getEngineCapacities(0, Number(e.target.value)))
   }
   const handleMinPowerSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMinPower(Number(e.target.value))
      setPowersTo(getPowers(Number(e.target.value), 601))
   }
   const handleMaxPowerSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setMaxPower(Number(e.target.value))
      setPowersFrom(getPowers(0, Number(e.target.value)))
   }

   return (
      <div>
         <Select id="condition" onChange={handleConditionSelection}>
            {conditions.map(condition => (
               <option value={condition} label={condition} key={condition} />
            ))}
         </Select>

         <Select placeholder="All" id="mark" onChange={handleMarksSelection}>
            {marksData.getMarks.map(m => (
               <option value={m.name} label={m.name} key={m._id} />
            ))}
         </Select>

         <Select placeholder="All" id="model" onChange={handleModelsSelection}>
            {modelsData.getModels.map(mark => (
               <option value={mark.name} label={mark.name} key={mark._id} />
            ))}
         </Select>

         <Select
            placeholder="All"
            id="generation"
            onChange={handleModelsSelection}>
            {generationsData.getGenerations.map(g => (
               <option value={g.name} label={g.name} key={g._id} />
            ))}
         </Select>

         <FormLabel htmlFor="bodyStyle">Select Body Style:</FormLabel>
         <Box>
            {bodyStyles.map(b => (
               <Checkbox key={b}>{b}</Checkbox>
            ))}
         </Box>

         <Select onChange={handleMinYearSelection}>
            <option value={1940} label={'Year from'} />
            {yearsFrom.map(year => (
               <option value={year} label={year.toString()} key={year} />
            ))}
         </Select>
         <Select onChange={handleMaxYearSelection}>
            <option value={2022} label={'To'} />
            {yearsTo.map(year => (
               <option value={year} label={year.toString()} key={year} />
            ))}
         </Select>

         <Select onChange={handleMinPriceSelection}>
            <option value={0} label={'Price from'} />
            {pricesFrom.map(price => (
               <option value={price} label={price.toString()} key={price} />
            ))}
         </Select>
         <Select onChange={handleMaxPriceSelection}>
            <option value={200001} label={'To'} />
            {pricesTo.map(price => (
               <option value={price} label={price.toString()} key={price} />
            ))}
         </Select>

         <Select onChange={handleMinMileageSelection}>
            <option value={0} label={'Mileage from'} />
            {mileagesFrom.map(mileage => (
               <option
                  value={mileage}
                  label={mileage.toString()}
                  key={mileage}
               />
            ))}
         </Select>
         <Select onChange={handleMaxMileageSelection}>
            <option value={300001} label={'To'} />
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
               <Checkbox key={b.hex}>{b.color}</Checkbox>
            ))}
         </Box>

         <Box>
            {transmission.map(t => (
               <Checkbox key={t}>{t}</Checkbox>
            ))}
         </Box>

         <Box>
            {fuelTypes.map(t => (
               <Checkbox key={t}>{t}</Checkbox>
            ))}
         </Box>

         <Box>
            {driveInits.map(d => (
               <Checkbox key={d}>{d}</Checkbox>
            ))}
         </Box>

         <Select onChange={handleMinEngineCapacitySelection}>
            <option value={0} label={'Engine Capacity from'} />
            {engineCapacitiesFrom.map(e => (
               <option value={e} label={e.toString()} key={e} />
            ))}
         </Select>
         <Select onChange={handleMaxEngineCapacitySelection}>
            <option value={6.6} label={'To'} />
            {engineCapacitiesTo.map(e => (
               <option value={e} label={e.toString()} key={e} />
            ))}
         </Select>

         <Select onChange={handleMinPowerSelection}>
            <option value={0} label={'Power from'} />
            {powersFrom.map(p => (
               <option value={p} label={p.toString()} key={p} />
            ))}
         </Select>
         <Select onChange={handleMaxPowerSelection}>
            <option value={601} label={'To'} />
            {powersTo.map(p => (
               <option value={p} label={p.toString()} key={p} />
            ))}
         </Select>
      </div>
   )
}

export default AdvancedFilter
