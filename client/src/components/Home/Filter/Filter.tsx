import { createSearchParams, useNavigate } from 'react-router-dom'
import Select from '../../shared/Select'

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
import loader from '../../../images/fading-circles.png'

const Filter = () => {
   const navigate = useNavigate()

   const [count, setCount] = useState(0)
   const [countLoading, setCountLoading] = useState(false)
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
         setCountLoading(false)
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
      setCountLoading(true)
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

   return (
      <div className={styles.container}>
         <div className={styles.filterModule}>
            <Select
               id="mark"
               status={params.mark ? 'selected' : 'default'}
               onChange={e => {
                  setModelsData({ getModels: [] })
                  handleSelection(e, 'mark')
               }}>
               <option label="Select Mark" />
               {marksData.getMarks.map(m => (
                  <option value={m.name} label={m.name} key={m._id} />
               ))}
            </Select>

            <Select
               disabled={!modelsData.getModels.length}
               status={params.model ? 'selected' : 'default'}
               id="model"
               onChange={e => handleSelection(e, 'model')}>
               <option label="Select Model" />
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
               status={params.maxPrice ? 'selected' : 'default'}
               id="price"
               onChange={e => handleSelection(e, 'maxPrice')}>
               <option label="Maximum price"></option>
               {prices.map(price => (
                  <option
                     value={price.toString()}
                     label={price.toString()}
                     key={price.toString()}
                  />
               ))}
            </Select>

            <Select
               status={params.minYear ? 'selected' : 'default'}
               onChange={e => {
                  handleSelection(e, 'minYear')
                  setYearsTo(getYears(Number(e.target.value || 1940), 2022))
               }}>
               <option label={'Year from'} />
               {yearsFrom.map(year => (
                  <option value={year} label={year.toString()} key={year} />
               ))}
            </Select>

            <Select
               status={params.maxYear ? 'selected' : 'default'}
               onChange={e => {
                  handleSelection(e, 'maxYear')
                  setYearsFrom(getYears(1940, Number(e.target.value || 2022)))
               }}>
               <option label={'To'} />
               {yearsTo.map(year => (
                  <option value={year} label={year.toString()} key={year} />
               ))}
            </Select>
            <button className={styles.button} onClick={navigateToSearch}>
               {countLoading ? (
                  <img alt="loader" className={styles.loading} src={loader} />
               ) : (
                  <span>{count} results</span>
               )}
            </button>
         </div>
      </div>
   )
}

export default Filter
