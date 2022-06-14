import { useSearchParams } from 'react-router-dom'

const useCustomSearchParams = () => {
   const [search, setSearch] = useSearchParams()
   const searchAsObject = Object.fromEntries(new URLSearchParams(search))

   return [searchAsObject, setSearch]
}

export default useCustomSearchParams
