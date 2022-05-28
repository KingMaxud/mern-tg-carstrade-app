import Announcement from '../../models/announcement.model.js'

const createFilterObject = filter => {
   const keysWithFloatingValues = [
      'price',
      'year',
      'mileage',
      'engineCapacity',
      'power'
   ]
   const filterObj = {}

   for (const key in filter) {
      if (keysWithFloatingValues.includes(key)) {
         if (filter[key][0]) {
            filterObj[key] = {
               $gte: Number(filter[key][0])
            }
         }
         if (filter[key][1]) {
            filterObj[key] = {
               ...filterObj[key],
               $lte: Number(filter[key][1])
            }
         }
      } else {
         filterObj[key] = filter[key]
      }
   }

   return filterObj
}

export default {
   Query: {
      getAnnouncements: async (_, { filter, sort, pagination }) => {
         const filterObj = createFilterObject(filter)

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
            phoneNumber
         }
      ) => {
         const announcement = await Announcement.create({
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
            phoneNumber: Number(phoneNumber)
         })

         // TODO: add announcements to User's myAnnouncements (announcement._id)

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
         await Announcement.deleteOne({ _id: announcementId })

         // TODO: delete announcement from User's myAnnouncements (announcement._id)

         return {
            success: true,
            message: `Announcement has been deleted`
         }
      },
      updateAnnouncement: async (_, body) => {
         const valuesToChange = Object.assign({}, body)
         //    delete valuesToChange.announcementId
         await Announcement.updateOne(
            { _id: body.announcementId },
            valuesToChange
         )
         return {
            success: true,
            message: 'Your announcement has been changed!'
         }
      }
   }
}
