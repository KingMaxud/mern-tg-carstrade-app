import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Box, Button } from '@chakra-ui/react'

import {
   GET_MARKS,
   GET_MODELS,
   GET_GENERATIONS,
   DELETE_MARK,
   DELETE_MODEL,
   DELETE_GENERATION
} from '../../shared/utils/graphql'
import {
   MarksData,
   ModelsData,
   ModelsVars,
   GenerationsData,
   GenerationsVars,
   MutationDetails,
   ModelHandleVars,
   DeleteGenerationVars
} from '../../shared/types'
import AddGeneration from './AddGeneration'
import AddModel from './AddModel'
import AddMark from './AddMark'

const Admin = () => {
   const [selectedMark, setSelectedMark] = useState('')
   const [selectedModel, setSelectedModel] = useState('')

   const {
      data: marksData,
      loading: marksLoading,
      error: marksError
   } = useQuery<MarksData>(GET_MARKS)

   const [
      loadModels,
      { data: modelsData, loading: modelsLoading, error: modelsError }
   ] = useLazyQuery<ModelsData, ModelsVars>(GET_MODELS, {
      variables: { markName: selectedMark }
   })

   const [
      loadGenerations,
      {
         data: generationsData,
         loading: generationsLoading,
         error: generationsError
      }
   ] = useLazyQuery<GenerationsData, GenerationsVars>(GET_GENERATIONS, {
      variables: { markName: selectedMark, modelName: selectedModel }
   })

   useEffect(() => {
      if (selectedMark) {
         loadModels()
      }
   }, [selectedMark])

   useEffect(() => {
      if (selectedModel) {
         loadGenerations()
      }
   }, [selectedModel])

   const [deleteMark] = useMutation<
      { deleteMark: MutationDetails },
      ModelsVars
   >(DELETE_MARK)

   const [deleteModel] = useMutation<
      { deleteModel: MutationDetails },
      ModelHandleVars
   >(DELETE_MODEL)

   const [deleteGeneration] = useMutation<
      { deleteGeneration: MutationDetails },
      DeleteGenerationVars
   >(DELETE_GENERATION)

   return (
      <>
         {selectedModel ? (
            <AddGeneration mark={selectedMark} model={selectedModel} />
         ) : selectedMark ? (
            <AddModel mark={selectedMark} />
         ) : (
            <AddMark />
         )}
         {marksData &&
            marksData.getMarks.map(mark => (
               <Box key={mark._id}>
                  <div
                     onClick={() => {
                        setSelectedMark(mark.name)
                     }}>
                     {mark.name}
                  </div>
                  <Button
                     onClick={() =>
                        deleteMark({ variables: { markName: mark.name } })
                     }>
                     delete
                  </Button>
               </Box>
            ))}
         <div>
            {!selectedMark && 'Select Mark'}
            {modelsData &&
               modelsData.getModels.map(model => (
                  <Box key={model._id}>
                     <div
                        onClick={() => {
                           setSelectedModel(model.name)
                        }}>
                        {model.name}
                     </div>
                     <Button
                        onClick={() =>
                           deleteModel({
                              variables: {
                                 markName: selectedMark,
                                 modelName: model.name
                              }
                           })
                        }>
                        delete
                     </Button>
                  </Box>
               ))}
         </div>
         <div>
            {!selectedModel && 'Select Model'}
            {generationsData &&
               generationsData.getGenerations.map(generation => (
                  <Box key={generation._id}>
                     {generation.name}
                     <Button
                        onClick={() =>
                           deleteGeneration({
                              variables: {
                                 markName: selectedMark,
                                 modelName: selectedModel,
                                 generationName: generation.name
                              }
                           })
                        }>
                        delete
                     </Button>
                  </Box>
               ))}
         </div>
      </>
   )
}

export default Admin
