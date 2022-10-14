const {
   ApolloError,
   AuthenticationError,
   UserInputError
} = require('apollo-server-errors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../../models/user.model.js')
const RefreshToken = require('../../models/refreshToken.model.js')
const {
   validateLoginInput,
   validateRegisterInput
} = require('../../utils/validators.js')

module.exports = {
   Query: {
      getUser: async (_, __, { req }) => {
         try {
            const decoded = await jwt.verify(
               req.headers.authorization.split(' ')[1],
               process.env.JWT_SECRET
            )
            const user = await User.findById(decoded.sub).select(
               'name email isAdmin _id'
            )
            return user
         } catch (e) {
            throw new AuthenticationError('Token is expired')
         }
      }
   },
   Mutation: {
      registerUser: async (_, { name, email, password }, { req, res }) => {
         // Validation
         const { errors, valid } = validateRegisterInput(name, email, password)

         if (!valid) {
            throw new UserInputError('Errors', { errors })
         }

         // Check if user exists
         const userExists = await User.findOne({ email })
         if (userExists) {
            throw new ApolloError(
               'An account with this email address already exists',
               'REGISTER_EXIST'
            )
         }

         // Hash password
         const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(password, salt)

         // Create User
         const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin: false
         })

         if (user) {
            const accessToken = generateAccessToken(user._id)

            const refreshToken = RefreshToken.createToken(user)
            // Set refreshToken to Cookie
            res.cookie('refreshToken', refreshToken, {
               maxAge: 1000 * 60 * 60 * 24 * 30,
               httpOnly: true,
               sameSite: 'strict',
               secure: false // It should be TRUE!!!
            })

            return {
               status: 'OK',
               message: 'New token were generated',
               accessToken
            }
         } else {
            throw new UserInputError('Invalid user value')
         }
      },
      loginUser: async (_, { email, password }, { req, res }) => {
         // Validation
         const { errors, valid } = validateLoginInput(email, password)

         if (!valid) {
            throw new UserInputError('Errors', { errors })
         }

         // Check for user email
         const user = await User.findOne({ email })

         if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = generateAccessToken(user._id)

            const refreshToken = await RefreshToken.createToken(user)
            // Set refreshToken to Cookie
            res.cookie('refreshToken', refreshToken, {
               maxAge: 1000 * 60 * 60 * 24 * 30,
               httpOnly: true,
               sameSite: 'strict',
               secure: false // It should be TRUE!!!
            })

            return {
               status: 'OK',
               message: 'New token were generated',
               accessToken
            }
         } else {
            throw new AuthenticationError('Invalid Credentials')
         }
      },
      getNewTokens: async (_, __, { req, res }) => {
         const requestToken = req.cookies?.refreshToken
         try {
            const refreshToken = await RefreshToken.findOne({
               token: requestToken
            }).populate('user', '-password')
            if (!refreshToken) {
               return new ApolloError(
                  'Refresh token is not in database!',
                  'TOKEN_ERROR'
               )
            }

            if (RefreshToken.verifyExpiration(refreshToken)) {
               await RefreshToken.findByIdAndRemove(refreshToken._id).exec()

               return {
                  status: 'Failed',
                  message:
                     'Refresh token was expired. Please make a new login request.'
               }
            }

            const newAccessToken = generateAccessToken(refreshToken.user._id)
            const newRefreshToken = await RefreshToken.createToken(
               refreshToken.user
            )

            res.cookie('refreshToken', newRefreshToken, {
               maxAge: 1000 * 60 * 60 * 24 * 30,
               httpOnly: true,
               sameSite: 'strict',
               secure: false // It should be TRUE!!!
            })

            return {
               status: 'OK',
               message: `New token were generated`,
               accessToken: newAccessToken
            }
         } catch (err) {
            throw new ApolloError(
               `Error in Get New Tokens: ${err}`,
               'TOKEN_ERROR'
            )
         }
      },
      logout: async (_, __, { req, res }) => {
         const requestToken = req.cookies?.refreshToken
         try {
            await RefreshToken.deleteOne({ token: requestToken })
         } catch (err) {
            throw new ApolloError(`Error in removing Token`, 'TOKEN_ERROR')
         }

         res.clearCookie('refreshToken')
         return {
            success: true,
            message: 'User was successfully logged out'
         }
      }
   }
}

const generateAccessToken = userId => {
   const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TIME
   })

   return accessToken
}
