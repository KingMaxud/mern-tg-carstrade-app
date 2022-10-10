import { useMutation } from '@apollo/client'
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Input,
   useDisclosure
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'

import { ChangePriceVars, MutationDetails } from '../../../shared/types'
import { GetAnnouncementData } from '../VehicleDetails'
import { CHANGE_PRICE, GET_ANNOUNCEMENT } from '../../../shared/utils/graphql'
import styles from './ChangePriceModal.module.scss'

type Props = {
   currentPrice: number
   id: string
}

const ChangePriceModal = ({ currentPrice, id }: Props) => {
   const [newPrice, setNewPrice] = useState<string>(currentPrice.toString())
   const [inputError, setInputError] = useState<string | null>(null)

   const { isOpen, onOpen, onClose } = useDisclosure() // Handle modal behavior

   const [changePrice] = useMutation<
      { updateAnnouncement: MutationDetails },
      ChangePriceVars
   >(CHANGE_PRICE, {
      update: cache => {
         // Change cached price
         const cachedAnnouncement: GetAnnouncementData | null = cache.readQuery(
            {
               query: GET_ANNOUNCEMENT,
               variables: { id }
            }
         )
         if (cachedAnnouncement) {
            cache.writeQuery({
               query: GET_ANNOUNCEMENT,
               variables: { id },
               data: {
                  getAnnouncement: {
                     ...cachedAnnouncement.getAnnouncement,
                     price: newPrice
                  }
               }
            })
         }
         onClose()
      }
   })

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewPrice(e.target.value)
   }

   const handleClick = () => {
      if (Number(newPrice)) {
         changePrice({
            variables: {
               announcementId: id,
               price: newPrice
            }
         })
      } else {
         setInputError('Value must be a number!')
      }
   }

   return (
      <>
         <button onClick={onOpen} className={styles.button}>
            Change
         </button>

         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Type a new price for your car</ModalHeader>
               <ModalCloseButton />
               <ModalBody className={styles.modalBody}>
                  <p>New price:</p>
                  <Input
                     type="text"
                     outline="1px solid rgba(0, 0, 0, 0.7)"
                     value={newPrice}
                     onChange={handleChange}
                  />
                  <div>{inputError}</div>
               </ModalBody>
               <ModalFooter>
                  <button className={styles.button} onClick={handleClick}>
                     Change price to {Number(newPrice) ? newPrice : ''}€
                  </button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default ChangePriceModal
