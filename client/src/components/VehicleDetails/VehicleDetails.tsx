import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { GET_ANNOUNCEMENT } from '../../shared/utils/graphql'

type Announcement = {
   _id: string
   user: string
   photos: string
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
   description: string
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
   const [data, setData] = useState<Announcement | null>(null)

   const { loading } = useQuery<GetAnnouncementData, GetAnnouncementVars>(
      GET_ANNOUNCEMENT,
      {
         variables: { id: location.pathname.split('/')[2] },
         onCompleted: data => {
            setData(data.getAnnouncement)
         },
         onError: error => {
            console.log(error)
         }
      }
   )

   return <div>{data && <div>{data.mark}</div>}</div>
}

export default VehicleDetails
