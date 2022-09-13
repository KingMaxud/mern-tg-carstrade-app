import React from 'react'

import styles from './Select.module.scss'

type Props = {
   isSelected: boolean
   children: any
   id?: string
   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
   disabled?: boolean
}

const Select = ({ id, isSelected, children, onChange, disabled }: Props) => {
   return (
      <select disabled={disabled} id={id} className={`${isSelected && styles.selected}`} onChange={onChange}>
         {children}
      </select>
   )
}

export default Select
