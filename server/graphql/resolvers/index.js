import usersResolver from './users.js'
import modelsResolver from './models.js'
import announcementsResolver from './announcements.js'

export default {
   Query: {
      getUploadPreset: () => {
         return process.env.CLOUDINARY_UPLOAD_PRESET
      },
      ...usersResolver.Query,
      ...modelsResolver.Query,
      ...announcementsResolver.Query
   },
   Mutation: {
      ...usersResolver.Mutation,
      ...modelsResolver.Mutation,
      ...announcementsResolver.Mutation
   }
}
