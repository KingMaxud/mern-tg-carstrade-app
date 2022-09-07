import { useEffect } from 'react'

import Filter from './Filter/Filter'
import styles from './Home.module.scss'

const Home = () => {
   // Change Title
   useEffect(() => {
      document.title = 'CarTrader - Buy & Sell cars'
   }, [])
   return (
      <div className={styles.container}>
         <div className={styles.background}>
            <div><p>The easiest way to find a car!</p></div>
         </div>
         <Filter />
      </div>
   )
}

export default Home
