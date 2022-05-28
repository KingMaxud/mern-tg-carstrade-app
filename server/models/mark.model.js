import mongoose from 'mongoose'

const markSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         unique: true
      }
   }
)

export default mongoose.model('Mark', markSchema)
