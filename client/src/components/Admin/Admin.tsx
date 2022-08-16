import {
   ApolloCache,
   useLazyQuery,
   useMutation,
   useQuery
} from '@apollo/client'
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
   const [deleteObject, setDeleteObject] = useState('')

   let deletionTarget = ''
   const { isOpen, onOpen, onClose } = useDisclosure()

   // Load marks immediately
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

   // Update models, when mark changes
   useDidMountEffect(() => {
      loadModels()
      setGenerationsData([])
   }, [selectedMark])
   // Update generations, when model changes
   useDidMountEffect(() => {
      loadGenerations()
   }, [selectedModel])

   const [deleteMark] = useMutation<
      { deleteMark: MutationDetails },
      ModelsVars
   >(DELETE_MARK, {
      update: cache => {         // Delete mark from the cache
         const cachedMarks = cache.readQuery<MarksData>({
            query: GET_MARKS
         })

         const cachedModels = cache.readQuery<ModelsData, ModelsVars>({
            query: GET_MODELS,
            variables: {
               markName: deleteObject
            }
         })

         if (cachedModels) {
            // Delete from cache all the generations, related to the models
            cachedModels.getModels.map(m => {
               const cachedGenerations = cache.readQuery<
                  GenerationsData,
                  GenerationsVars
               >({
                  query: GET_GENERATIONS,
                  variables: {
                     markName: deleteObject,
                     modelName: m.name
                  }
               })

               const deletedList: string[] = []

               if (cachedGenerations) {
                  cachedGenerations.getGenerations.map(g =>
                     deletedList.push(g.name)
                  )
               }
               deleteGenerationCache(cache, m.name, deletedList)
            })
            // Delete from cache all the models, related to the mark
            deleteModelCache(
               cache,
               deleteObject,
               cachedModels.getModels.map(m => m.name)
            )
         }

         const newData: any = {
            getMarks: []
         }

         if (cachedMarks) {
            newData.getMarks = cachedMarks.getMarks.filter(
               m => m.name !== deleteObject
            )
         }

         cache.writeQuery({
            query: GET_MARKS,
            data: newData
         })
      }
   })

   const [deleteModel] = useMutation<
      { deleteModel: MutationDetails },
      ModelHandleVars
   >(DELETE_MODEL, {
      update: cache => {
         // At first, delete all generations, related to the model
         const cachedGenerations = cache.readQuery<
            GenerationsData,
            GenerationsVars
         >({
            query: GET_GENERATIONS,
            variables: {
               markName: selectedMark,
               modelName: deleteObject
            }
         })

         const deletedList: string[] = []

         if (cachedGenerations) {
            cachedGenerations.getGenerations.map(g => deletedList.push(g.name))
         }
         deleteGenerationCache(cache, deleteObject, deletedList)

         // Then, delete model
         deleteModelCache(cache, selectedMark, [deleteObject])
      }
   })

   const [deleteGeneration] = useMutation<
      { deleteGeneration: MutationDetails },
      DeleteGenerationVars
   >(DELETE_GENERATION, {
      update: cache =>
         deleteGenerationCache(cache, selectedModel, [deleteObject])
   })

   function deleteModelCache(
      cache: ApolloCache<any>,
      markName: string,
      deletedModels: string[]
   ) {
      const cachedModels = cache.readQuery<ModelsData, ModelsVars>({
         query: GET_MODELS,
         variables: {
            markName: markName
         }
      })

      const newData: any = {
         getModels: []
      }

      if (cachedModels) {
         newData.getModels = cachedModels.getModels.filter(
            m => !deletedModels.includes(m.name)
         )
      }

      cache.writeQuery({
         query: GET_MODELS,
         variables: {
            markName: markName
         },
         data: newData
      })
   }

   function deleteGenerationCache(
      cache: ApolloCache<any>,
      modelName: string,
      deletedGenerations: string[]
   ) {
      const cachedGenerations = cache.readQuery<
         GenerationsData,
         GenerationsVars
      >({
         query: GET_GENERATIONS,
         variables: {
            markName: selectedMark,
            modelName: modelName
         }
      })

      const newData: any = {
         getGenerations: []
      }

      if (cachedGenerations)
         newData.getGenerations = cachedGenerations.getGenerations.filter(
            g => !deletedGenerations.includes(g.name)
         )

      cache.writeQuery({
         query: GET_GENERATIONS,
         variables: {
            markName: selectedMark,
            modelName: modelName
         },
         data: newData
      })
   }

   type HandleDelete = () => void

   // Delete function template
   const [handleDelete, setHandleDelete] = useState<HandleDelete>(() => {})

   return (
      <>
         {/*Modal window that pops up when admin deletes*/}
         <DeleteModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            deleteObject={deleteObject}>
            <Button
               colorScheme="blue"
               mr={3}
               onClick={() => {
                  handleDelete()
                  onClose()
               }}>
               Delete
            </Button>
         </DeleteModal>

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
                  <Button
                     colorScheme="blue"
                     mr={3}
                     onClick={() => {
                        setDeleteObject(mark.name)
                        deletionTarget = mark.name
                        setHandleDelete(() => () => {
                           deleteMark({
                              variables: {
                                 markName: deletionTarget
                              }
                           })
                        })
                        onOpen()
                     }}>
                     Delete
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
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                           setDeleteObject(model.name)
                           deletionTarget = model.name
                           setHandleDelete(() => () => {
                              deleteModel({
                                 variables: {
                                    markName: selectedMark,
                                    modelName: deletionTarget
                                 }
                              })
                           })
                           onOpen()
                        }}>
                        Delete
                     </Button>
                  </Box>
               ))}
         </div>
         <div>
            {!selectedModel && 'Select Model'}
            {generationsData &&
               generationsData.map(generation => (
                  <Box key={generation._id}>
                     {generation.name}
                     <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={() => {
                           setDeleteObject(generation.name)
                           deletionTarget = generation.name
                           setHandleDelete(() => () => {
                              deleteGeneration({
                                 variables: {
                                    markName: selectedMark,
                                    modelName: selectedModel,
                                    generationName: deletionTarget
                                 }
                              })
                           })
                           onOpen()
                        }}>
                        Delete
                     </Button>
                  </Box>
               ))}
         </div>
      </>
   )
}

export default Admin
