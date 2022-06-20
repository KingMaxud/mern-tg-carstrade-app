import { useSearchParams } from 'react-router-dom'

const useCustomSearchParams = () => {
   const [search, setSearch] = useSearchParams()

   const searchObject: any = {}
   search.forEach(function (value, key) {
      if (Object.keys(searchObject).includes(key)) {
         searchObject[key].push(value)
      } else {
         searchObject[key] = [value]
      }
   })

   return [searchObject, setSearch]
}

export default useCustomSearchParams
