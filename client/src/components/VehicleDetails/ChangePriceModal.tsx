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
import { ChangeEvent, FormEvent, useState } from 'react'

import { CHANGE_PRICE } from '../../shared/utils/graphql'
import { ChangePriceVars, MutationDetails } from '../../shared/types'

type Props = {
   currentPrice: number
   id: string
}

const ChangePriceModal = ({ currentPrice, id }: Props) => {
   const [newPrice, setNewPrice] = useState<string>(currentPrice.toString())

   const { isOpen, onOpen, onClose } = useDisclosure()

   const [changePrice] =
      useMutation<{ updateAnnouncement: MutationDetails }, ChangePriceVars>(
         CHANGE_PRICE
      )

   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setNewPrice(e.target.value)
   }

   const handleClick = () => {
      changePrice({
         variables: {
            announcementId: id,
            price: newPrice
         }
      })

      // Refresh page after price changed
      window.location.reload()
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
               </ModalBody>
               <ModalFooter>
                  <Button onClick={handleClick}>
                     Change price to {newPrice}$
                  </Button>
               </ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default ChangePriceModal
