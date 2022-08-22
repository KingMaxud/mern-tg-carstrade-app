import Filter from './Filter/Filter'
import {useEffect} from "react";

const Home = () => {

   // Change Title
   useEffect(() => {
      document.title = 'CarTrader - Buy & Sell cars'
   }, [])
   return (
      <div>
         <Filter />
      </div>
   )
}

export default Home
