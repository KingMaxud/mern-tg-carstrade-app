import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, 'Please add a name']
      },
      email: {
         type: String,
         required: [true, 'Please add an email'],
         unique: true
      },
      password: {
         type: String,
         required: [true, 'Please add a password']
      },
      isAdmin: Boolean,
      myAnnouncements: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Announcement'
      }]
   },
   { timestamps: true }
)

export default mongoose.model('User', userSchema)
