import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import {
   GET_MARKS,
   GET_MODELS,
   GET_GENERATIONS,
   DELETE_MARK,
   DELETE_MODEL,
   DELETE_GENERATION
} from '../../utils/graphql'
import {
   MarksData,
   ModelsData,
   ModelsVars,
   GenerationsData,
   GenerationsVars,
   MutationDetails,
   ModelHandleVars,
   deleteGenerationVars
} from './Admin.types'
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
      deleteGenerationVars
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
               <div key={mark._id}>
                  <div
                     onClick={() => {
                        setSelectedMark(mark.name)
                        loadModels()
                     }}>
                     {mark.name}
                  </div>
                  <span
                     onClick={() =>
                        deleteMark({ variables: { markName: mark.name } })
                     }>
                     delete
                  </span>
               </div>
            ))}
         <div>
            {!selectedMark && 'Select Mark'}
            {modelsData &&
               modelsData.getModels.map(model => (
                  <div key={model._id}>
                     <div
                        onClick={() => {
                           setSelectedModel(model.name)
                           loadGenerations()
                        }}>
                        {model.name}
                     </div>
                     <span
                        onClick={() =>
                           deleteModel({
                              variables: {
                                 markName: selectedMark,
                                 modelName: model.name
                              }
                           })
                        }>
                        delete
                     </span>
                  </div>
               ))}
         </div>
         <div>
            {!selectedModel && 'Select Model'}
            {generationsData &&
               generationsData.getGenerations.map(generation => (
                  <div key={generation._id}>
                     {generation.name}
                     <span
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
                     </span>
                  </div>
               ))}
         </div>
      </>
   )
}

export default Admin
