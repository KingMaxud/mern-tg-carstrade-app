const mongoose = require('mongoose')
const { v4: uuid } = require('uuid')

const RefreshTokenModel = new mongoose.Schema({
   token: String,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
   },
   expiryDate: Date
})

RefreshTokenModel.statics.createToken = async function (user) {
   const expiredAt = new Date()
   expiredAt.setSeconds(
      expiredAt.getSeconds() + process.env.JWT_REFRESH_TIME / 1000
   )
   const _token = uuid()
   const _object = new this({
      token: _token,
      user: user._id,
      expiryDate: expiredAt.getTime()
   })
   const refreshToken = await _object.save()

   return refreshToken.token
}

RefreshTokenModel.statics.verifyExpiration = token => {
   return token.expiryDate.getTime() < new Date().getTime()
}

module.exports = mongoose.model('RefreshToken', RefreshTokenModel)
