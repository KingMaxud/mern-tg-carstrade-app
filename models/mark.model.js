const mongoose = require('mongoose')

const markSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true
      }
   }
)

module.exports = mongoose.model('Mark', markSchema)
