const mongoose = require('mongoose')

const modelSchema = new mongoose.Schema({
   mark: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   generations: [
      {
         name: {
            type: String
         },
         bodyStyles: {
            type: [String]
         },
         startYear: {
            type: Number
         },
         endYear: {
            type: Number
         },
         photoUrl: {
            type: String
         }
      }
   ]
})

module.exports = mongoose.model('Model', modelSchema)
