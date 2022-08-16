import { useMutation } from '@apollo/client'
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Button,
   useDisclosure
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'

import { CHANGE_PRICE, GET_ANNOUNCEMENT } from '../../shared/utils/graphql'
import { ChangePriceVars, MutationDetails } from '../../shared/types'
import { GetAnnouncementData } from './VehicleDetails'

type Props = {
   currentPrice: number
   id: string
}

const ChangePriceModal = ({ currentPrice, id }: Props) => {
   const [newPrice, setNewPrice] = useState<string>(currentPrice.toString())
   const [inputError, setInputError] = useState<string | null>(null)

   const { isOpen, onOpen, onClose } = useDisclosure()         // Handle modal behavior

   const [changePrice] = useMutation<
      { updateAnnouncement: MutationDetails },
      ChangePriceVars
   >(CHANGE_PRICE, {
      update: cache => {            // Change cached price
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
         <Button onClick={onOpen}>Change the price</Button>

         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Type a new price for your car</ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                  New price:{' '}
                  <input type="text" value={newPrice} onChange={handleChange} />
                  <div>{inputError}</div>
               </ModalBody>
               <ModalFooter>
                  <Button onClick={handleClick}>
                     Change price to {Number(newPrice) ? newPrice : ''}$
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default ChangePriceModal
