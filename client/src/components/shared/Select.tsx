import React from 'react'

import styles from './Select.module.scss'

type Status = 'default' | 'selected' | 'error'

type Props = {
   status: Status
   children: any
   value?: string
   id?: string
   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
   disabled?: boolean
}

const Select = ({ id, status, value, children, onChange, disabled }: Props) => {
   const className = (() => {
      if (status === 'selected') {
         return styles.selected
      } else if (status === 'error') {
         return styles.error
      } else {
         return ''
      }
   })()
   return (
      <select value={value} disabled={disabled} id={id} className={`${className}`} onChange={onChange}>
         {children}
      </select>
   )
}

export default Select
