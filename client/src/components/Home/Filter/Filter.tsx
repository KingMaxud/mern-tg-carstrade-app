import { Box, Button } from '@chakra-ui/react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Select } from '@chakra-ui/react'

import {
   GetFilteredAnnouncementCountData,
   GetFilteredAnnouncementCountVars,
   MarksData,
   ModelsData,
   ModelsVars,
   SearchParams
} from '../../../shared/types'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
   GET_FILTERED_ANNOUNCEMENTS_COUNT,
   GET_MARKS,
   GET_MODELS
} from '../../../shared/utils/graphql'
import { getYears, prices } from '../../../shared/data'
import useDidMountEffect from "../../../shared/hooks/useDidMountEffect";

const Filter = () => {
   const navigate = useNavigate()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({})
   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [yearsFrom, setYearsFrom] = useState(getYears(1940, 2022))
   const [yearsTo, setYearsTo] = useState(getYears(1940, 2022))

   useQuery<MarksData>(GET_MARKS, {
      onCompleted: data => {
         setMarksData(data)
      }
   })

   const [loadModels] = useLazyQuery<ModelsData, ModelsVars>(GET_MODELS, {
      variables: { markName: params.mark || '' },
      onCompleted: data => setModelsData(data)
   })

   const [loadCount] = useLazyQuery<
      GetFilteredAnnouncementCountData,
      GetFilteredAnnouncementCountVars
   >(GET_FILTERED_ANNOUNCEMENTS_COUNT, {
      onCompleted: data => {
         setCount(data.getFilteredAnnouncementCount)
      },
      variables: {
         filter: params
      }
   })

   useDidMountEffect(() => {
      loadModels()
   }, [params.mark])

   useEffect(() => {
      loadCount()
   }, [params])

   const handleMarksSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParams(prevState => ({
         ...prevState,
         mark: e.target.value
      }))
   }
   const handleModelsSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParams(prevState => ({
         ...prevState,
         model: e.target.value
      }))
   }
   const handlePricesSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParams(prevState => ({
         ...prevState,
         maxPrice: e.target.value
      }))
   }

   const handleMinYearSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParams(prevState => ({
         ...prevState,
         minYear: e.target.value
      }))
      setYearsTo(getYears(Number(e.target.value), 2022))
   }
   const handleMaxYearSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParams(prevState => ({
         ...prevState,
         maxYear: e.target.value
      }))
      setYearsFrom(getYears(1940, Number(e.target.value)))
   }

   const goToSearch = () => {
      navigate({
         pathname: '/search',
         search: `?${createSearchParams(params)}`
      })
   }

   return (
      <Box>
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
            placeholder="Maximum price"
            id="price"
            onChange={handlePricesSelection}>
            {prices.map(price => (
               <option
                  value={price.toString()}
                  label={price.toString()}
                  key={price.toString()}
               />
            ))}
         </Select>

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
         <Button onClick={goToSearch}>{count} results</Button>
      </Box>
   )
}

export default Filter
