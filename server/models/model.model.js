import mongoose from 'mongoose'

const modelSchema = new mongoose.Schema({
   mark: {
      type: String,
      required: true
   },
   name: {
      type: String,
      required: true
   },
   generations: [{
      name: {
         type: String
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
   }]
})

export default mongoose.model('Model', modelSchema)
