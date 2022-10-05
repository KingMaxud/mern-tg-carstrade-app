export function getSessionStorageOrDefault<T>(key: string, defaultValue: T) {
   const stored = sessionStorage.getItem(key)
   if (!stored) {
      return defaultValue
   }
   return JSON.parse(stored)
}

export function getImageBySize(img: string, width: number, height: number) {
   const widthAndHeight = `upload/w_${width},h_${height},c_fill`
   const [stringStart, stringEnd] = img.split('upload')

   return stringStart.concat(widthAndHeight, stringEnd)
}

export function reverseString(str: string): string {
   return str.split('').reverse().join('') || ''
}

export function divideByThreeChars(str: string) {
   const arr = reverseString(str).match(/.{1,3}/g)
   const temp = (() => {
      if (arr) {
         return arr.join(' ')
      } else {
         return ''
      }
   })()
   return reverseString(temp)
}
