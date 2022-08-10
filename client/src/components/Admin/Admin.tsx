import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Box, Button, useDisclosure } from '@chakra-ui/react'

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
   DeleteGenerationVars,
   Generation
} from '../../shared/types'
import AddGeneration from './AddGeneration'
import AddModel from './AddModel'
import AddMark from './AddMark'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import DeleteModal from '../DeleteModal'

const Admin = () => {
   const [selectedMark, setSelectedMark] = useState('')
   const [selectedModel, setSelectedModel] = useState('')
   const [generationsData, setGenerationsData] = useState<Generation[]>([])
   const { isOpen, onOpen, onClose } = useDisclosure()

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

   const [loadGenerations] = useLazyQuery<GenerationsData, GenerationsVars>(
      GET_GENERATIONS,
      {
         variables: { markName: selectedMark, modelName: selectedModel },
         onCompleted: data => {
            data && setGenerationsData(data.getGenerations)
         }
      }
   )

   useDidMountEffect(() => {
      loadModels()
      setGenerationsData([])
   }, [selectedMark])

   useDidMountEffect(() => {
      loadGenerations()
   }, [selectedModel])

   const [deleteMark] = useMutation<
      { deleteMark: MutationDetails },
      ModelsVars
   >(DELETE_MARK, {
      update: (cache, data) => {
         const cachedMarks = cache.readQuery<MarksData>({
            query: GET_MARKS
         })
      }
   })

   const [deleteModel] = useMutation<
      { deleteModel: MutationDetails },
      ModelHandleVars
   >(DELETE_MODEL, {
      update: (cache, data) => {
         const cachedModels = cache.readQuery<ModelsData, ModelsVars>({
            query: GET_MODELS,
            variables: {
               markName: selectedMark
            }
         })
      }
   })

   const [deleteGeneration] = useMutation<
      { deleteGeneration: MutationDetails },
      DeleteGenerationVars
   >(DELETE_GENERATION, {
      update: (cache, data) => {
         const cachedGenerations = cache.readQuery<
            GenerationsData,
            GenerationsVars
         >({
            query: GET_GENERATIONS,
            variables: {
               markName: selectedMark,
               modelName: selectedModel
            }
         })
      }
   })

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
                        setSelectedModel('')
                     }}>
                     {mark.name}
                  </div>
                  <DeleteModal
                     isOpen={isOpen}
                     onOpen={onOpen}
                     onClose={onClose}
                     deleteObject={mark.name}>
                     <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                           deleteMark({
                              variables: {
                                 markName: mark.name
                              }
                           })
                           onClose()
                        }}>
                        Delete
                     </Button>
                  </DeleteModal>
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
                     <DeleteModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        deleteObject={model.name}>
                        <Button
                           colorScheme="blue"
                           mr={3}
                           onClick={() => {
                              deleteModel({
                                 variables: {
                                    markName: selectedMark,
                                    modelName: model.name
                                 }
                              })
                              onClose()
                           }}>
                           Delete
                        </Button>
                     </DeleteModal>
                  </Box>
               ))}
         </div>
         <div>
            {!selectedModel && 'Select Model'}
            {generationsData &&
               generationsData.map(generation => (
                  <Box key={generation._id}>
                     {generation.name}
                     <DeleteModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        deleteObject={generation.name}>
                        <Button
                           colorScheme="blue"
                           mr={3}
                           onClick={() => {
                              deleteGeneration({
                                 variables: {
                                    markName: selectedMark,
                                    modelName: selectedModel,
                                    generationName: generation.name
                                 }
                              })
                              onClose()
                           }}>
                           Delete
                        </Button>
                     </DeleteModal>
                  </Box>
               ))}
         </div>
      </>
   )
}

export default Admin
