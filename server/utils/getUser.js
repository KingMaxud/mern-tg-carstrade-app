import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const getUser = async req => {
   try {
      const decoded = await jwt.verify(
         req.headers.authorization.split(' ')[1],
         process.env.JWT_SECRET
      )
      const user = await User.findById(decoded.sub).select(
         'name email myAnnouncements isAdmin _id'
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
