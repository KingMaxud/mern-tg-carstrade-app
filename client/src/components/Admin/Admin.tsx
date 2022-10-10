import {
   ApolloCache,
   useLazyQuery,
   useMutation,
   useQuery
} from '@apollo/client'
import React, {useEffect, useState} from 'react'
import { Box, useDisclosure } from '@chakra-ui/react'

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
import AddGeneration from './AddGeneration/AddGeneration'
import AddModel from './AddModel/AddModel'
import AddMark from './AddMark/AddMark'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import DeleteModal from '../DeleteModal'
import styles from './Admin.module.scss'

const Admin = () => {
   const [selectedMark, setSelectedMark] = useState('')
   const [selectedModel, setSelectedModel] = useState('')
   const [generationsData, setGenerationsData] = useState<Generation[]>([])
   const [deleteObject, setDeleteObject] = useState('')
   const [hoveredName, setHoveredName] = useState('')

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
   // Change Title
   useEffect(() => {
      document.title = 'Admin Panel'
   }, [])

   const [deleteMark] = useMutation<
      { deleteMark: MutationDetails },
      ModelsVars
   >(DELETE_MARK, {
      update: cache => {
         // Delete mark from the cache
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
      <div className={styles.container}>
         {/*Modal window that pops up when admin deletes*/}
         <DeleteModal
            isOpen={isOpen}
            onClose={onClose}
            onOpen={onOpen}
            deleteObject={deleteObject}>
            <button
               className={styles.button}
               onClick={() => {
                  handleDelete()
                  onClose()
               }}>
               Delete
            </button>
         </DeleteModal>

         {selectedModel ? (
            <AddGeneration mark={selectedMark} model={selectedModel} />
         ) : selectedMark ? (
            <AddModel mark={selectedMark} />
         ) : (
            <AddMark />
         )}
         <div className={styles.marksContainer}>
            {marksData &&
               marksData.getMarks.map(mark => (
                  <div
                     className={`${styles.item} ${
                        mark.name === selectedMark && styles.chosen
                     } ${hoveredName === mark.name && styles.deleteObject}`}
                     onClick={() => {
                        if (selectedMark !== mark.name) {
                           setSelectedMark(mark.name)
                        } else {
                           setSelectedMark('')
                        }
                        setSelectedModel('')
                     }}
                     key={mark._id}>
                     <p>{mark.name}</p>
                     <i
                        onClick={e => {
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
                           e.stopPropagation()
                        }}
                        onMouseEnter={() => setHoveredName(mark.name)}
                        onMouseLeave={() => setHoveredName('')}>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 94.926 94.926">
                           <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
                        </svg>
                     </i>
                  </div>
               ))}
         </div>
         <div className={styles.modelsContainer}>
            {modelsData &&
               modelsData.getModels.map(model => (
                  <div
                     className={`${styles.item} ${
                        model.name === selectedModel && styles.chosen
                     } ${hoveredName === model.name && styles.deleteObject}`}
                     key={model._id}
                     onClick={() => {
                        setSelectedModel(model.name)
                     }}>
                     <p>{model.name}</p>
                     <i
                        onClick={e => {
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
                           e.stopPropagation()
                        }}
                        onMouseEnter={() => setHoveredName(model.name)}
                        onMouseLeave={() => setHoveredName('')}>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 94.926 94.926">
                           <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
                        </svg>
                     </i>
                  </div>
               ))}
         </div>
         <div className={styles.generationsContainer}>
            {generationsData &&
               generationsData.map(generation => (
                  <div
                     className={`${styles.item} ${
                        hoveredName === generation.name && styles.deleteObject
                     }`}
                     key={generation._id}>
                     <p>{generation.name}</p>
                     <i
                        onClick={e => {
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
                           e.stopPropagation()
                        }}
                        onMouseEnter={() => setHoveredName(generation.name)}
                        onMouseLeave={() => setHoveredName('')}>
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 94.926 94.926">
                           <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
                        </svg>
                     </i>
                  </div>
               ))}
         </div>
      </div>
   )
}

export default Admin
