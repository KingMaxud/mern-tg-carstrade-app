const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js')

const getUser = async req => {
   try {
      const decoded = await jwt.verify(
         req.headers.authorization.split(' ')[1],
         process.env.JWT_SECRET
      )
      const user = await User.findById(decoded.sub).select(
         'name email isAdmin _id'
      )
      if (user) {
         return {
            isAuthed: true,
            info: { isAdmin: user.isAdmin, _id: user._id }
         }
      } else {
         return { isAuthed: false }
      }
   } catch (e) {
      return {
         isAuthed: false
      }
   }
}

module.exports = getUser
