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
type Generation = {
   name: string
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
export type addGenerationVars = {
   markName: string
   modelName: string
   generationName: string
   startYear: string
   endYear: string
   photoUrl: string
}
export type deleteGenerationVars = {
   markName: string
   modelName: string
   generationName: string
}
