import { Box, Button } from '@chakra-ui/react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { Select } from '@chakra-ui/react'

import {
   GetFilteredAnnouncementCountData,
   GetFilteredAnnouncementCountVars,
   MarksData,
   ModelsData,
   ModelsVars,
   SearchParams,
   SelectKeys
} from '../../../shared/types'
import React, { useEffect, useState } from 'react'
import { useLazyQuery, useQuery } from '@apollo/client'
import {
   GET_FILTERED_ANNOUNCEMENTS_COUNT,
   GET_MARKS,
   GET_MODELS
} from '../../../shared/utils/graphql'
import { getYears, prices } from '../../../shared/data'
import useDidMountEffect from '../../../shared/hooks/useDidMountEffect'
import styles from './Filter.module.scss'

const Filter = () => {
   const navigate = useNavigate()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({})
   const [marksData, setMarksData] = useState<MarksData>({ getMarks: [] })
   const [modelsData, setModelsData] = useState<ModelsData>({ getModels: [] })
   const [yearsFrom, setYearsFrom] = useState(getYears(1940, 2022))
   const [yearsTo, setYearsTo] = useState(getYears(1940, 2022))

   // Load marks immediately
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

   // Update models, when marks changes
   useDidMountEffect(() => {
      loadModels()
      // Delete irrelevant model from params
      const temp = { ...params }
      delete temp['model']
      setParams(temp)
   }, [params.mark])

   // Update announcements count, when params changes
   useEffect(() => {
      loadCount()
   }, [params])

   const handleSelection = (
      e: React.ChangeEvent<HTMLSelectElement>,
      key: SelectKeys
   ) => {
      if (e.target.value === '') {
         // Delete empty keys from params object
         const temp = { ...params }
         delete temp[key]
         setParams(temp)
      } else {
         // If value is not empty, set it to params object
         setParams(prevState => ({
            ...prevState,
            [key]: e.target.value
         }))
      }
   }

   const navigateToSearch = () => {
      navigate({
         pathname: '/search',
         search: `?${createSearchParams(params)}`
      })
   }

   // TODO: make select border brighter, change bg when selected, style button

   return (
      <div className={styles.container}>
         <div className={styles.filterModule}>
            <Select
               placeholder="Select Mark"
               id="mark"
               onChange={e => {
                  setModelsData({ getModels: [] })
                  handleSelection(e, 'mark')
               }}>
               {marksData.getMarks.map(m => (
                  <option value={m.name} label={m.name} key={m._id} />
               ))}
            </Select>

            <Select
               placeholder="Select model"
               disabled={!modelsData.getModels.length}
               id="model"
               onChange={e => handleSelection(e, 'model')}>
               {modelsData &&
                  modelsData.getModels.map(mark => (
                     <option
                        value={mark.name}
                        label={mark.name}
                        key={mark._id}
                     />
                  ))}
            </Select>

            <Select
               placeholder="Maximum price"
               id="price"
               onChange={e => handleSelection(e, 'maxPrice')}>
               {prices.map(price => (
                  <option
                     value={price.toString()}
                     label={price.toString()}
                     key={price.toString()}
                  />
               ))}
            </Select>

            <Select
               onChange={e => {
                  handleSelection(e, 'minYear')
                  setYearsTo(getYears(Number(e.target.value), 2022))
               }}>
               <option value={1940} label={'Year from'} />
               {yearsFrom.map(year => (
                  <option value={year} label={year.toString()} key={year} />
               ))}
            </Select>

            <Select
               onChange={e => {
                  handleSelection(e, 'maxYear')
                  setYearsFrom(getYears(1940, Number(e.target.value)))
               }}>
               <option value={2022} label={'To'} />
               {yearsTo.map(year => (
                  <option value={year} label={year.toString()} key={year} />
               ))}
            </Select>
            <Button onClick={navigateToSearch}>{count} results</Button>
         </div>
      </div>
   )
}

export default Filter
