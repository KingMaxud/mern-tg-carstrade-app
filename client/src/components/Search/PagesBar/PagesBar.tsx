import { Button } from '@chakra-ui/react'
import { Dispatch, SetStateAction } from 'react'

import styles from './PagesBar.module.scss'

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

   // Determine, which page buttons have to be rendered
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
      <div className={styles.container}>
         {!!count && (
            <div>
               {selectedPage > 1 && (
                  <Button
                     border="1px"
                     borderColor="gray.500"
                     onClick={() => {
                        setPage(page - 1)
                        updateSearchParamsOnPageChanges(page - 1)
                     }}>
                     Prev
                  </Button>
               )}
               {renderedButtonsValuesList.map(v => (
                  <Button
                     border="1px"
                     borderColor="gray.500"
                     background={
                        v === selectedPage
                           ? 'rgba(255, 179, 25, 0.65)'
                           : '#ffffff'
                     }
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
                     border="1px"
                     borderColor="gray.500"
                     onClick={() => {
                        setPage(page + 1)
                        updateSearchParamsOnPageChanges(page + 1)
                     }}>
                     Next
                  </Button>
               )}
            </div>
         )}
      </div>
   )
}

export default PagesBar
