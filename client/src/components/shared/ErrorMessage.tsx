import { useState } from 'react'

import styles from './ErrorMessage.module.scss'

const ErrorMessage = ({ name, error }: { name: string; error: string }) => {
   const [isOpen, setIsOpen] = useState(true)

   return (
      <div className={`${styles.container} ${!isOpen && styles.closed}`} onClick={() => setIsOpen(false)}>
         <span className={styles.name}>{name}: </span>
         <span className={styles.error}>{error}</span>
      </div>
   )
}

export default ErrorMessage
