import { Button, HStack } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

type Props = {
   count: number
   selectedPage: number
   page: number
   setPage: Dispatch<SetStateAction<number>>
   updateSearchParamsOnPageChanges: (page: number) => void
}

const PagesBar = ({
   count,
   page,
   setPage,
   selectedPage,
   updateSearchParamsOnPageChanges
}: Props) => {
   const pagesAmount = Math.ceil(count / 20)
   const renderedButtonsValuesList: number[] = []

   renderedButtonsValuesList.push(1)
   if (selectedPage - 2 > 1) {
      renderedButtonsValuesList.push(selectedPage - 2)
   }
   if (selectedPage - 1 > 1) {
      renderedButtonsValuesList.push(selectedPage - 1)
   }
   if (selectedPage > 1 && selectedPage < pagesAmount) {
      renderedButtonsValuesList.push(selectedPage)
   }
   if (selectedPage + 1 < pagesAmount) {
      renderedButtonsValuesList.push(selectedPage + 1)
   }
   if (selectedPage + 2 < pagesAmount) {
      renderedButtonsValuesList.push(selectedPage + 2)
   }
   if (pagesAmount !== 1) {
      renderedButtonsValuesList.push(pagesAmount)
   }

   return (
      <HStack>
         {count && (
            <div>
               {selectedPage > 1 && (
                  <Button
                     onClick={() => {
                        setPage(page - 1)
                        updateSearchParamsOnPageChanges(page - 1)
                     }}>
                     Prev
                  </Button>
               )}
               {renderedButtonsValuesList.map(v => (
                  <Button
                     onClick={() => {
                        setPage(v)
                        updateSearchParamsOnPageChanges(v)
                     }}
                     key={v}>
                     {v}
                  </Button>
               ))}
               {selectedPage !== pagesAmount && (
                  <Button
                     onClick={() => {
                        setPage(page + 1)
                        updateSearchParamsOnPageChanges(page + 1)
                     }}>
                     Next
                  </Button>
               )}
            </div>
         )}
      </HStack>
   )
}

export default PagesBar
