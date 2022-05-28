import { useLazyQuery, useQuery } from '@apollo/client'

import { GET_GENERATIONS, GET_MARKS, GET_MODELS } from '../../utils/graphql'
import {
   GenerationsData,
   GenerationsVars,
   MarksData,
   ModelsData,
   ModelsVars
} from './AnnouncementsList/AnnouncementsList.types'

const Home = () => {
   const {
      data: marksData,
      loading: marksLoading,
      error: marksError
   } = useQuery<MarksData>(GET_MARKS)
   const [
      loadModels,
      { data: modelsLoading, loading: modelsData, error: modelsError }
   ] = useLazyQuery<ModelsData, ModelsVars>(GET_MODELS, {
      variables: { markName: '' }
   })
   const [
      loadGenerations,
      {
         data: GenerationsLoading,
         loading: GenerationsData,
         error: GenerationsError
      }
   ] = useLazyQuery<GenerationsData, GenerationsVars>(GET_GENERATIONS, {
      variables: { markName: '', modelName: '' }
   })

   return <div>
      Home
   </div>
}

export default Home
