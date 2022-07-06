export function getSessionStorageOrDefault<T>(key: string, defaultValue: T) {
   const stored = sessionStorage.getItem(key)
   if (!stored) {
      return defaultValue
   }
   return JSON.parse(stored)
}
