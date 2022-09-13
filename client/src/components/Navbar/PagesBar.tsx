import React from 'react'

import styles from './PagesBar.module.scss'

type Props = {
   count: number
   page: number
   setPage: React.Dispatch<React.SetStateAction<number>>
}

const PagesBar = ({ count, page, setPage }: Props) => {
   const pagesAmount = Math.ceil(count / 4)
   const availableBefore = page !== 1
   const availableNext = page !== pagesAmount
   const handleDecrease = () => setPage(page - 1)
   const handleIncrease = () => setPage(page + 1)

   return (
      <div className={styles.container}>
         <button
            disabled={!availableBefore}
            onClick={handleDecrease}
            className={styles.arrow}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               enableBackground="new 0 0 32 32"
               version="1.1"
               viewBox="0 0 32 32">
               <path
                  clipRule="evenodd"
                  d="M20.273,5.278l-9.977,9.999  c-0.394,0.395-0.394,1.034,0,1.429h0v0l9.97,9.991c0.634,0.66,1.748,0.162,1.723-0.734V6.02C22.013,5.127,20.907,4.643,20.273,5.278  z M12.434,15.991l7.55-7.566v15.133L12.434,15.991z"
                  fill={`${availableBefore ? '#000000' : '#808080'}`}
                  fillRule="evenodd"
                  id="Arrow_Drop_Left"
               />
            </svg>
         </button>
         <button
            disabled={!availableNext}
            onClick={handleIncrease}
            className={styles.arrow}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               enableBackground="new 0 0 32 32"
               version="1.1"
               viewBox="0 0 32 32">
               <path
                  clipRule="evenodd"
                  d="M11.727,26.71l9.977-9.999  c0.394-0.395,0.394-1.034,0-1.429h0v0l-9.97-9.991c-0.634-0.66-1.748-0.162-1.723,0.734v19.943  C9.988,26.861,11.094,27.345,11.727,26.71z M19.567,15.997l-7.55,7.566V8.431L19.567,15.997z"
                  fill={`${availableNext ? '#000000' : '#808080'}`}
                  fillRule="evenodd"
                  id="Arrow_Drop_Right"
               />
            </svg>
         </button>
      </div>
   )
}

export default PagesBar
