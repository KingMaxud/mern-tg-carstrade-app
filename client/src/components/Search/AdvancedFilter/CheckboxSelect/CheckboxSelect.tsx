import { useRef, useState } from 'react'
import { Checkbox, useOutsideClick } from '@chakra-ui/react'

import styles from './CheckboxSelect.module.scss'
import { CheckboxKeys, SearchParams } from '../../../../shared/types'

type Props = {
   keyName: CheckboxKeys
   values: string[]
   params: SearchParams
   handleCheckbox: (key: CheckboxKeys, value: string) => void
   text: string
}

const CheckboxSelect = ({
   keyName,
   values,
   params,
   handleCheckbox,
   text
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
      <div className={styles.container}>
         <div
            className={`${styles.selector} ${isOpen && styles.openSelector} ${(text !== 'All') && styles.selected}`}
            onClick={() => {
               setIsOpen(true)
            }}>
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
               {values.map(v => (
                  <Checkbox
                     className={styles.checkbox}
                     isChecked={!!params[keyName]?.includes(v)}
                     onChange={() => handleCheckbox(keyName, v)}
                     key={v}>
                     {v}
                  </Checkbox>
               ))}
            </div>
         )}
      </div>
   )
}

export default CheckboxSelect
