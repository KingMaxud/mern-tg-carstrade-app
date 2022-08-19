import { useLocation } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'

import {
   DELETE_ANNOUNCEMENT,
   GET_ANNOUNCEMENT
} from '../../shared/utils/graphql'
import Photos from './Photos'
import styles from './VehicleDetails.module.scss'
import { DeleteAnnouncementVars, MutationDetails } from '../../shared/types'
import DeleteModal from '../DeleteModal'
import useGetUser from '../../shared/hooks/useGetUser'
import ChangePriceModal from './ChangePriceModal'

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

export type GetAnnouncementData = {
   getAnnouncement: Announcement
}

type GetAnnouncementVars = {
   id: string
}

const VehicleDetails = () => {
   // scroll to top on start
   window.scrollTo(0, 0)

   const location = useLocation()
   const { getIsAdmin, getUserId } = useGetUser()

   const [data, setData] = useState<Announcement | null>(null)
   const [id, setId] = useState(location.pathname.split('/')[2])
   const [alt, setAlt] = useState('')
   const [isAdmin, setIsAdmin] = useState(false)
   const [isOwner, setIsOwner] = useState(false)

   // Modal
   const [isOpen, setIsOpen] = useState(false)
   const onOpen = () => setIsOpen(true)
   const onClose = () => setIsOpen(false)

   const [getAnnouncement] = useLazyQuery<
      GetAnnouncementData,
      GetAnnouncementVars
   >(GET_ANNOUNCEMENT, {
      variables: { id },
      onCompleted: ({ getAnnouncement }) => {
         setData(getAnnouncement)
         setAlt(
            `${getAnnouncement.mark} ${getAnnouncement.model}, ${getAnnouncement.year} production year, View - `
         )
      }
   })

   const [deleteAnnouncement] = useMutation<
      { deleteAnnouncement: MutationDetails },
      DeleteAnnouncementVars
   >(DELETE_ANNOUNCEMENT)

   // Refresh data when location changes
   useEffect(() => {
      setId(location.pathname.split('/')[2])
      getAnnouncement()
   }, [location])

   useEffect(() => {
      getIsAdmin().then(res => {
         // If the user is admin
         if (res[0]) {
            setIsAdmin(true)
         }
      })

      getUserId().then(res => {
         // If the user is owner
         if (res === data?.user) {
            setIsOwner(true)
         }
      })
   }, [data])

   return (
      <div>
         <div style={{ display: 'grid', gridTemplateColumns: '45rem auto' }}>
            <div style={{ height: '1000px', backgroundColor: 'gold' }}>
               <Photos photos={data ? data.photos : null} alt={alt} />
            </div>
            <div style={{ backgroundColor: 'khaki' }}>
               <p className={styles.header}>
                  {data?.mark} {data?.model}
               </p>
               <p className={styles.price}> Price: {data?.price}$</p>
               {data && isOwner && (
                  <ChangePriceModal currentPrice={data?.price || 0} id={id} />
               )}
               <div className={styles.details}>
                  <p>Year: {data?.year}</p>
                  <p>Mileage: {data?.mileage}</p>
                  <p>Body Style: {data?.bodyStyle}</p>
                  <p>Color: {data?.color}</p>
                  <p>Transmission: {data?.transmission}</p>
                  <p>Fuel Type: {data?.fuelType}</p>
                  <p>Drivetrain: {data?.driveInit}</p>
                  <p>
                     Engine Capacity:{' '}
                     {Number.isInteger(data?.engineCapacity)
                        ? `${data?.engineCapacity}.0`
                        : data?.engineCapacity}
                  </p>
                  <p>Power: {data?.power}</p>
                  <p>
                     Description:{' '}
                     {data?.description
                        ? data?.description
                        : 'There is no description.'}
                  </p>
               </div>
               <div className={styles.contact}>
                  Contact seller: +{data?.phoneNumber}
               </div>
               {(isOwner || isAdmin) && (
                  <>
                     <Button onClick={onOpen}>Delete</Button>
                     <DeleteModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        deleteObject="your announcement">
                        <Button
                           colorScheme="blue"
                           mr={3}
                           onClick={() => {
                              deleteAnnouncement({
                                 variables: {
                                    announcementId: id
                                 }
                              })
                              onClose()
                           }}>
                           Delete
                        </Button>
                     </DeleteModal>
                  </>
               )}
            </div>
         </div>
      </div>
   )
}

export default VehicleDetails
