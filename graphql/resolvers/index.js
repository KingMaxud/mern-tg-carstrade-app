const usersResolver = require('./users.js')
const modelsResolver = require('./models.js')
const announcementsResolver = require('./announcements.js')

module.exports = {
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
