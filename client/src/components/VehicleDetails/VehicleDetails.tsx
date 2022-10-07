import { useLocation } from 'react-router-dom'
import { useLazyQuery, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/react'

import {
   DELETE_ANNOUNCEMENT,
   GET_ANNOUNCEMENT
} from '../../shared/utils/graphql'
import Photos from './Photos/Photos'
import styles from './VehicleDetails.module.scss'
import { DeleteAnnouncementVars, MutationDetails } from '../../shared/types'
import DeleteModal from '../DeleteModal'
import useGetUser from '../../shared/hooks/useGetUser'
import ChangePriceModal from './ChangePriceModal/ChangePriceModal'
import { divideByThreeChars } from '../../shared/utils/utils'

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
         // Set title
         document.title = `${getAnnouncement.mark} ${getAnnouncement.model} ${
            getAnnouncement.year
         } for ${divideByThreeChars(getAnnouncement.price.toString())} €`
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
      <div className={`${styles.container} ${data && isOwner && styles.hasButton}`}>
         <Photos photos={data ? data.photos : null} alt={alt} />
         <div className={styles.topInfo}>
            <p className={styles.name}>
               {data?.mark} {data?.model}
            </p>
            <div className={styles.price}>
               <p>{data?.price} €</p>
               {data && isOwner && (
                  <ChangePriceModal
                     currentPrice={data?.price || 0}
                     id={id}
                  />
               )}
            </div>
         </div>
         <div className={styles.info}>
            <div className={styles.contact}>
               Contact seller: +{data?.phoneNumber}
            </div>
            <div className={styles.details}>
               <div className={styles.table}>
                  <div className={styles.keysColumn}>
                     <p>Year</p>
                     <p>Mileage</p>
                     <p>Body Style</p>
                     <p>Color</p>
                     <p>Transmission</p>
                     <p>Fuel Type</p>
                     <p>Drivetrain</p>
                     <p>Engine Capacity</p>
                     <p>Power</p>
                  </div>
                  <div className={styles.valuesColumn}>
                     <p>{data?.year}</p>
                     <p>
                        {data && divideByThreeChars(data.mileage.toString())} km
                     </p>
                     <p>{data?.bodyStyle}</p>
                     <p>{data?.color}</p>
                     <p>{data?.transmission}</p>
                     <p>{data?.fuelType}</p>
                     <p>{data?.driveInit}</p>
                     <p>
                        {Number.isInteger(data?.engineCapacity)
                           ? `${data?.engineCapacity}.0`
                           : data?.engineCapacity}
                     </p>
                     <p>{data?.power}</p>
                  </div>
               </div>
               <div className={styles.description}>
                  <div className={styles.descriptionHeader}>Description</div>
                  {data?.description
                     ? data?.description
                     : 'There is no description.'}
               </div>
            </div>
            {(isOwner || isAdmin) && (
               <div className={styles.deleteButtonContainer}>
                  <button className={styles.button} onClick={onOpen}>
                     Delete
                  </button>
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
                        {/*Change it to little icon above "price"*/}
                        Delete
                     </Button>
                  </DeleteModal>
               </div>
            )}
         </div>
      </div>
   )
}

export default VehicleDetails
