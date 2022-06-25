import { useLocation } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'

type Announcement = {
   _id: string
   user: string
   mark: string
   model: string
   generation: string
   condition: string
   price: number
   year: number
   mileage: number
   color: string
   bodyStyle: string
   transmission: string
   fuelType: string
   driveInit: string
   engineCapacity: number
   power: number
   phoneNumber: number
}

type GetAnnouncementData = {
   getAnnouncement: Announcement
}

type GetAnnouncementVars = {
   id: string
}

const VehicleDetails = () => {
   const location = useLocation()
   const { loading } = useQuery<GetAnnouncementData, GetAnnouncementVars>(
      GET_ANNOUNCEMENT,
      {
         variables: { id: location.pathname.split('/')[2] },
         onCompleted: data => {
            console.log(data.getAnnouncement)
         },
         onError: error => {
            console.log(error)
         }
      }
   )

   return <div>VehicleDetail</div>
}

export default VehicleDetails

const GET_ANNOUNCEMENT = gql`
   query Query($id: String!) {
      getAnnouncement(id: $id) {
         mark
         model
         price
      }
   }
`
