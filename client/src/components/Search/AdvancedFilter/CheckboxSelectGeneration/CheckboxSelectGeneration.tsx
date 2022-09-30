import React, { useRef, useState } from 'react'
import { Checkbox, useOutsideClick } from '@chakra-ui/react'

import styles from './CheckboxSelectGeneration.module.scss'
import { CheckboxKeys, GenerationsFilterArray } from '../../../../shared/types'
import { getImageBySize } from '../../../../shared/utils/utils'

type Props = {
   text: string
   disabled: boolean
   generationsData: GenerationsFilterArray[]
   handleCheckbox: (key: CheckboxKeys, value: string) => void
}

const CheckboxSelectGeneration = ({
   text,
   disabled,
   generationsData,
   handleCheckbox
}: Props) => {
   const [isOpen, setIsOpen] = useState(false)

   const ref = useRef<HTMLDivElement>(null)

   useOutsideClick({
      ref: ref,
      handler: () => {
         if (isOpen) {
            // Timeout is used here to set isOpen to false after it is set in selector
            setTimeout(() => {
               setIsOpen(false)
            }, 0)
         }
      }
   })

   return (
      <div className={`${styles.container} ${disabled && styles.disabled}`}>
         <div
            onClick={() => {
               if (!disabled) {
                  setIsOpen(true)
               }
            }}
            className={`${styles.selector} ${isOpen && styles.openSelector} ${
               disabled && styles.disabledSelector
            }`}>
            <p>{text}</p>
            <i>
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.625rem"
                  height="0.625rem"
                  viewBox="0 0 307.053 307.053">
                  <g>
                     <g id="_x34_86._Down">
                        <g>
                           <path d="M302.445,80.796l-11.101-11.103c-6.123-6.131-16.074-6.131-22.209,0L153.67,183.707L37.907,67.959     c-6.134-6.13-16.08-6.13-22.209,0L4.597,79.06c-6.129,6.133-6.129,16.067,0,22.201l137.83,137.829     c6.129,6.136,16.067,6.136,22.203,0l137.815-136.096C308.589,96.864,308.589,86.926,302.445,80.796z" />
                        </g>
                     </g>
                  </g>
               </svg>
            </i>
         </div>
         {isOpen && (
            <div className={styles.selectWindow} ref={ref}>
               {generationsData.map(g => {
                  return (
                     <div
                        style={{
                           backgroundImage: `url(${getImageBySize(
                              g.generation.photoUrl,
                              224,
                              140
                           )})`
                        }}
                        className={styles.generationWrapper}
                        key={g.generation._id}>
                        <Checkbox
                           className={styles.checkbox}
                           isChecked={g.isChecked}
                           size="lg"
                           colorScheme="yellow"
                           onChange={() =>
                              handleCheckbox('generation', g.generation.name)
                           }>
                           <p>
                              {g.generation.startYear}—{g.generation.endYear}
                           </p>
                           <p>{g.generation.name}</p>
                        </Checkbox>
                     </div>
                  )
               })}
            </div>
         )}
      </div>
   )
}

export default CheckboxSelectGeneration
