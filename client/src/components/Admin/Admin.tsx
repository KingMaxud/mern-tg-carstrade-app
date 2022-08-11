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
import Test from '../../Test'

const Admin = () => {
   const [selectedMark, setSelectedMark] = useState('')
   const [selectedModel, setSelectedModel] = useState('')
   const [generationsData, setGenerationsData] = useState<Generation[]>([])

   let deletedName = '' // To handle cache
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
      update: cache => {
         const cachedMarks = cache.readQuery<MarksData>({
            query: GET_MARKS
         })

         const cachedModels = cache.readQuery<ModelsData, ModelsVars>({
            query: GET_MODELS,
            variables: {
               markName: deletedName
            }
         })

         if (cachedModels) {
            cachedModels.getModels.map(m => {
               const cachedGenerations = cache.readQuery<
                  GenerationsData,
                  GenerationsVars
               >({
                  query: GET_GENERATIONS,
                  variables: {
                     markName: deletedName,
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

            deleteModelCache(
               cache,
               deletedName,
               cachedModels.getModels.map(m => m.name)
            )
         }

         const newData: any = {
            getMarks: []
         }

         if (cachedMarks) {
            newData.getMarks = cachedMarks.getMarks.filter(
               m => m.name !== deletedName
            )
         }

         debugger

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
         // At first, delete all generations, related to Model
         const cachedGenerations = cache.readQuery<
            GenerationsData,
            GenerationsVars
         >({
            query: GET_GENERATIONS,
            variables: {
               markName: selectedMark,
               modelName: deletedName
            }
         })

         const deletedList: string[] = []

         if (cachedGenerations) {
            cachedGenerations.getGenerations.map(g => deletedList.push(g.name))
         }
         deleteGenerationCache(cache, deletedName, deletedList)

         // Then, delete model
         deleteModelCache(cache, selectedMark, [deletedName])
      }
   })

   const [deleteGeneration] = useMutation<
      { deleteGeneration: MutationDetails },
      DeleteGenerationVars
   >(DELETE_GENERATION, {
      update: cache =>
         deleteGenerationCache(cache, selectedModel, [deletedName])
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

      debugger

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

      debugger

      cache.writeQuery({
         query: GET_GENERATIONS,
         variables: {
            markName: selectedMark,
            modelName: modelName
         },
         data: newData
      })
   }

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
                  <Button
                     colorScheme="blue"
                     mr={3}
                     onClick={() => {
                        deleteMark({
                           variables: {
                              markName: mark.name
                           }
                        })
                        deletedName = mark.name
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
                           deleteModel({
                              variables: {
                                 markName: selectedMark,
                                 modelName: model.name
                              }
                           })
                           deletedName = model.name
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
                           deleteGeneration({
                              variables: {
                                 markName: selectedMark,
                                 modelName: selectedModel,
                                 generationName: generation.name
                              }
                           })
                           deletedName = generation.name
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
