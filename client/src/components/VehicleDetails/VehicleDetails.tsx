import { useLocation } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { Grid, GridItem } from '@chakra-ui/react'

import { GET_ANNOUNCEMENT } from '../../shared/utils/graphql'
import Photos from './Photos'

type Announcement = {
   _id: string
   user: string
   photos: string[]
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
   const [currentPhotoNumber, setCurrentPhotoNumber] = useState(0)
   const [alt, setAlt] = useState('')

   const { loading } = useQuery<GetAnnouncementData, GetAnnouncementVars>(
      GET_ANNOUNCEMENT,
      {
         variables: { id: location.pathname.split('/')[2] },
         onCompleted: ({ getAnnouncement }) => {
            setData(getAnnouncement)
            setAlt(
               `${getAnnouncement.mark} ${getAnnouncement.model}, ${getAnnouncement.year} production year, View - `
            )
         },
         onError: error => {
            console.log(error)
         }
      }
   )



   return (
      <div>
         <Grid templateColumns="45rem auto">
            <GridItem h="1000px" bg="gold">
               <Photos photos={data ? data.photos : null} alt={alt} />
            </GridItem>
            <GridItem h="100vh" bg="khaki" />
         </Grid>
      </div>
   )
}

export default VehicleDetails
