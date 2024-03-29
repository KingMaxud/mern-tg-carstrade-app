const { ForbiddenError, UserInputError } = require('apollo-server-errors')

const Announcement = require('../../models/announcement.model.js')

const createFilterObject = filter => {
   const {
      minPrice,
      maxPrice,
      minYear,
      maxYear,
      minMileage,
      maxMileage,
      minEngineCapacity,
      maxEngineCapacity,
      minPower,
      maxPower,
      ...rest
   } = filter

   const minMaxKeys = {
      price: {
         $gte: minPrice || 0,
         $lte: maxPrice || 999999
      },
      year: {
         $gte: minYear || 1940,
         $lte: maxYear || 9999
      },
      mileage: {
         $gte: minMileage || 0,
         $lte: maxMileage || 9999999
      },
      engineCapacity: {
         $gte: minEngineCapacity || 0,
         $lte: maxEngineCapacity || 10
      },
      power: {
         $gte: minPower || 0,
         $lte: maxPower || 9999
      }
   }

   return { ...minMaxKeys, ...rest }
}

module.exports = {
   Query: {
      getAnnouncements: async (_, { filter, sort, pagination }) => {
         const filterObj = createFilterObject({ ...filter })

         const sortObj = {
            [sort?.key]: Number(sort?.direction),
            createdAt: -1
         }
         const announcements = await Announcement.find(filterObj)
            .sort(sortObj)
            .limit(Number(pagination.limit))
            .skip((Number(pagination.page) - 1) * Number(pagination.limit))
            .exec()
         return announcements
      },
      getFilteredAnnouncementCount: async (_, { filter }) => {
         const filterObj = createFilterObject({ ...filter })
         const count = await Announcement.find(filterObj).count()
         return count
      },
      getAnnouncement: async (_, { id }) => {
         const announcement = await Announcement.findOne({ _id: id })
         if (!announcement) {
            throw new UserInputError('Announcement is not find!')
         }
         return announcement
      },
      getAnnouncementsCount: async () => {
         const count = Announcement.count()
         return count
      }
   },
   Mutation: {
      addAnnouncement: async (
         _,
         {
            user,
            mark,
            model,
            generation,
            condition,
            price,
            year,
            mileage,
            color,
            bodyStyle,
            transmission,
            fuelType,
            driveInit,
            engineCapacity,
            power,
            photos,
            description,
            phoneNumber
         }
      ) => {
         await Announcement.create({
            user,
            mark,
            model,
            generation,
            condition,
            price: Number(price),
            year: Number(year),
            mileage: Number(mileage),
            color,
            bodyStyle,
            transmission,
            fuelType,
            driveInit,
            engineCapacity: Number(engineCapacity),
            power: Number(power),
            description,
            photos,
            phoneNumber: Number(phoneNumber)
         })

         if (mark) {
            return {
               success: true,
               message: `Your announcement has been successfully published!`
            }
         } else {
            throw new Error('Something went wrong')
         }
      },
      deleteAnnouncement: async (_, { announcementId }) => {
         await Announcement.findByIdAndDelete({ _id: announcementId })

         return {
            success: true,
            message: `Announcement has been deleted`
         }
      },
      updateAnnouncement: async (_, body, { userInfo }) => {
         // Owner or admin access
         await Announcement.findById(body.announcementId).then(async function (
            data
         ) {
            if (
               userInfo &&
               (userInfo.isAdmin || userInfo._id.equals(userInfo._id))
            ) {
               const valuesToChange = Object.assign({}, body)
               //    delete valuesToChange.announcementId
               await Announcement.updateOne(
                  { _id: body.announcementId },
                  valuesToChange
               )
            } else {
               throw new ForbiddenError(
                  'You do not have access for this action'
               )
            }
         })

         return {
            success: true,
            message: 'Your announcement has been changed!'
         }
      }
   }
}
