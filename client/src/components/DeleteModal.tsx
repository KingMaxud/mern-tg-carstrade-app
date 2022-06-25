import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalFooter,
   ModalBody,
   ModalCloseButton,
   Button
} from '@chakra-ui/react'

type Props = {
   isOpen: boolean
   onOpen: () => void
   onClose: () => void
   deleteObject: string
   children: JSX.Element
}

const DeleteModal = ({
   deleteObject,
   children,
   isOpen,
   onOpen,
   onClose
}: Props) => {
   return (
      <>
         <Button onClick={onOpen}>Delete</Button>

         <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Attention!</ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                  Do you really want to delete {deleteObject}?
               </ModalBody>
               <ModalFooter>{children}</ModalFooter>
            </ModalContent>
         </Modal>
      </>
   )
}

export default DeleteModal
