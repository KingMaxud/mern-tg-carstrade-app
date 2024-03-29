const mongoose = require('mongoose')

const modelSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      },
      photos: {
         type: [{ type: String }],
         validate: [arrayLimit, '{PATH} exceeds the limit of 9']
      },
      mark: {
         type: String,
         required: true
      },
      model: {
         type: String,
         required: true
      },
      generation: {
         type: String,
         required: true
      },
      condition: {
         type: String,
         required: true,
         enum: ['Used', 'New']
      },
      price: {
         type: Number,
         required: true
      },
      year: {
         type: Number,
         required: true
      },
      mileage: {
         type: Number,
         required: true
      },
      color: {
         type: String,
         required: true
      },
      bodyStyle: {
         type: String,
         required: true
      },
      transmission: {
         type: String,
         required: true,
         enum: ['Manual', 'Automatic', 'Robot', 'Variator']
      },
      fuelType: {
         type: String,
         required: true,
         enum: ['Diesel', 'Gasoline', 'Electric', 'Hybrid']
      },
      driveInit: {
         type: String,
         required: true,
         enum: ['4WD', 'FWD', 'RWD']
      },
      engineCapacity: {
         type: Number,
         required: true
      },
      power: {
         type: Number,
         required: true
      },
      description: {
         type: String,
         required: true
      },
      phoneNumber: {
         type: Number,
         required: true
      }
   },
   { timestamps: true }
)

function arrayLimit(val) {
   return val.length <= 9
}

module.exports = mongoose.model('Announcement', modelSchema)
