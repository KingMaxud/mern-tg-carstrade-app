type Mark = {
   name: string
   _id: string
}
export type MarksData = {
   getMarks: Mark[]
}
type Model = {
   name: string
   _id: string
}
export type ModelsData = {
   getModels: Model[]
}
export type ModelsVars = {
   markName: string
}
export type Generation = {
   name: string
   bodyStyles: string[]
   startYear: number
   endYear: number
   photo: number
   _id: string
}
export type GenerationsData = {
   getGenerations: Generation[]
}
export type GenerationsVars = {
   markName: string
   modelName: string
}
export type MutationDetails = {
   success: boolean
   message: string
}
export type ModelHandleVars = {
   markName: string
   modelName: string
}
export type AddGenerationVars = {
   markName: string
   modelName: string
   bodyStyles: string[]
   generationName: string
   startYear: string
   endYear: string
   photoUrl: string
}
export type DeleteGenerationVars = {
   markName: string
   modelName: string
   generationName: string
}
export type AddAnnouncementData = {
   success: boolean
   message: string
}

export type AddAnnouncementVars = {
   user: string
   mark: string
   model: string
   generation: string
   condition: string
   price: string
   year: string
   mileage: string
   color: string
   bodyStyle: string
   transmission: string
   fuelType: string
   driveInit: string
   engineCapacity: string
   power: string
   description: string
   photos: string[]
   phoneNumber: string
}

export type SearchParams = {
   mark?: string
   model?: string
   generation?: string[]
   condition?: string[]
   minPrice?: string
   maxPrice?: string
   minYear?: string
   maxYear?: string
   minMileage?: string
   maxMileage?: string
   color?: string[]
   bodyStyle?: string[]
   transmission?: string[]
   fuelType?: string[]
   driveInit?: string[]
   minEngineCapacity?: string
   maxEngineCapacity?: string
   minPower?: string
   maxPower?: string
}

export type SearchParamsExtended = SearchParams & {
   page?: string
   sort?: string
}

export type Sort = {
   key: string
   direction: string
}

type Pagination = {
   page: string
   limit: string
}

export type Announcement = {
   photos: string[]
   condition: string
   price: number
   year: number
   mileage: number
   transmission: string
   fuelType: string
   mark: string
   model: string
   driveInit: string
   _id: string
}

export type SortMethod = {
   shortCode: string
   description: string
   sort: Sort
}

export type GetAnnouncementsData = {
   getAnnouncements: Announcement[]
}

export type GetAnnouncementsVars = {
   filter?: SearchParams
   sort?: Sort
   pagination: Pagination
}

export type GetFilteredAnnouncementCountData = {
   getFilteredAnnouncementCount: number
}

export type GetFilteredAnnouncementCountVars = {
   filter?: SearchParams
}

export type SelectKeys =
   | 'mark'
   | 'model'
   | 'minYear'
   | 'maxYear'
   | 'minPrice'
   | 'maxPrice'
   | 'minMileage'
   | 'maxMileage'
   | 'minEngineCapacity'
   | 'maxEngineCapacity'
   | 'minPower'
   | 'maxPower'
export type CheckboxKeys =
   | 'generation'
   | 'bodyStyle'
   | 'color'
   | 'transmission'
   | 'fuelType'
   | 'driveInit'

export type DeleteAnnouncementVars = {
   announcementId: string
}

export type ChangePriceVars = {
   announcementId: string
   price: string
}
