import { Button, HStack } from '@chakra-ui/react'

type Props = {
   count: number
   selectedPage: number
   setPage: (value: number) => void
   incrementPage: () => void
   decrementPage: () => void
}

const PagesBar = ({
   count,
   setPage,
   selectedPage,
   incrementPage,
   decrementPage
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
                  <Button onClick={decrementPage}>Prev</Button>
               )}
               {renderedButtonsValuesList.map(v => (
                  <Button onClick={() => setPage(v)} key={v}>
                     {v}
                  </Button>
               ))}
               {selectedPage !== pagesAmount && (
                  <Button onClick={incrementPage}>Next</Button>
               )}
            </div>
         )}
      </HStack>
   )
}

export default PagesBar
