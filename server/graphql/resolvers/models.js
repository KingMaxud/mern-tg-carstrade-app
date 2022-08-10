import Mark from '../../models/mark.model.js'
import Model from '../../models/model.model.js'

import { ForbiddenError, UserInputError } from 'apollo-server-errors'

export default {
   Query: {
      getMarks: async () => {
         try {
            const marks = await Mark.find()
            return marks.map(mark => ({
               name: mark.name,
               _id: mark._id
            }))
         } catch (e) {
            throw new Error(e)
         }
      },
      getModels: async (_, { markName }) => {
         const mark = await Mark.exists({ name: markName })
         if (!mark) {
            throw new UserInputError(`This mark doesn't exist`)
         }
         const models = await Model.find({ mark: markName })
         return models.map(model => ({
            name: model.name,
            _id: model._id
         }))
      },
      getGenerations: async (_, { markName, modelName }) => {
         const model = await Model.findOne({ markName, name: modelName })
         return model.generations
      }
   },
   Mutation: {
      addMark: async (_, { markName }, { userInfo }) => {
         // Admin access
         if (userInfo && userInfo.isAdmin) {
            const mark = await Mark.create({ name: markName })
            if (mark) {
               return {
                  success: true,
                  message: `Mark ${mark.name} successfully added`,
                  _id: mark._id.toString()
               }
            } else {
               throw new Error('Something went wrong')
            }
         } else {
            throw new ForbiddenError('You do not have access for this action')
         }
      },
      deleteMark: async (_, { markName }, { userInfo }) => {
         // Admin access
         if (userInfo && userInfo.isAdmin) {
            await Mark.deleteOne({ name: markName })
            await Model.deleteMany({ mark: markName })

            return {
               success: true,
               message: `Mark ${markName} has been deleted`,
            }
         } else {
            throw new ForbiddenError('You do not have access for this action')
         }
      },
      addModel: async (_, { markName, modelName }, { userInfo }) => {
         // Admin access

         if (userInfo && userInfo.isAdmin) {
            const mark = await Mark.exists({ name: markName })
            if (!mark) {
               throw new UserInputError(`This mark doesn't exist`)
            }
            const model = await Model.create({
               mark: markName,
               name: modelName
            })
            if (model) {
               return {
                  success: true,
                  message: `Model ${model.name} has been added to mark ${model.mark}`,
                  _id: model._id.toString()
               }
            } else {
               throw new Error('Something went wrong')
            }
         } else {
            throw new ForbiddenError('You do not have access for this action')
         }
      },
      deleteModel: async (_, { markName, modelName }, { userInfo }) => {
         // Admin access
         if (userInfo && userInfo.isAdmin) {
         } else {
            throw new ForbiddenError('You do not have access for this action')
         }
         const mark = await Mark.exists({ name: markName })
         if (!mark) {
            throw new UserInputError(`This mark doesn't exist`)
         }

         await Model.deleteOne({ mark: markName, name: modelName })
         return {
            success: true,
            message: `Model ${modelName} has been deleted`
         }
      },
      addGeneration: async (
         _,
         {
            markName,
            modelName,
            bodyStyles,
            generationName,
            startYear,
            endYear,
            photoUrl
         },
         { userInfo }
      ) => {
         // Admin access
         if (userInfo && userInfo.isAdmin) {
            const mark = await Mark.exists({ name: markName })
            if (!mark) {
               throw new UserInputError(`This mark doesn't exist`)
            }
            const model = await Model.findOne({
               mark: markName,
               name: modelName
            })
            if (!model) {
               throw new UserInputError(
                  `There is no model ${modelName} in ${markName}`
               )
            }

            const newArray = [
               ...model.generations,
               {
                  name: generationName,
                  startYear: Number(startYear),
                  endYear: Number(endYear),
                  bodyStyles,
                  photoUrl
               }
            ]

            model.generations = newArray

            await model.save()
            const generation = model.generations.find(g => g.name === generationName)
            return {
               success: true,
               message: `Generation ${generationName} has been added`,
               _id: generation._id.toString()
            }
         } else {
            throw new ForbiddenError('You do not have access for this action')
         }
      },
      deleteGeneration: async (
         _,
         { markName, modelName, generationName },
         { userInfo }
      ) => {
         // Admin access
         if (userInfo && userInfo.isAdmin) {
         } else {
            throw new ForbiddenError('You do not have access for this action')
         }
         const mark = await Mark.exists({ name: markName })
         if (!mark) {
            throw new UserInputError(`This mark doesn't exist`)
         }
         const model = await Model.findOne({ mark: markName, name: modelName })
         if (!model) {
            throw new UserInputError(
               `There is no model ${modelName} in ${markName}`
            )
         }
         const newArray = model.generations.filter(
            gen => gen.name !== generationName
         )
         model.generations = newArray
         model.save()
         return {
            success: true,
            message: `Generation ${generationName} has been deleted`
         }
      }
   }
}
