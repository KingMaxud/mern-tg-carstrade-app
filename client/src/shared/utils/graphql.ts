import { gql } from '@apollo/client'

export const GET_MARKS = gql`
   query GetMarks {
      getMarks {
         name
         _id
      }
   }
`

export const GET_MODELS = gql`
   query GetModels($markName: String!) {
      getModels(markName: $markName) {
         name
         _id
      }
   }
`

export const GET_GENERATIONS = gql`
   query GetGenerations($markName: String!, $modelName: String!) {
      getGenerations(markName: $markName, modelName: $modelName) {
         name
         startYear
         endYear
         photoUrl
         _id
      }
   }
`

export const ADD_MARK = gql`
   mutation AddMark($markName: String!) {
      addMark(markName: $markName) {
         success
         message
      }
   }
`

export const DELETE_MARK = gql`
   mutation DeleteMark($markName: String!) {
      deleteMark(markName: $markName) {
         success
         message
      }
   }
`

export const ADD_MODEL = gql`
   mutation AddModel($markName: String!, $modelName: String!) {
      addModel(markName: $markName, modelName: $modelName) {
         success
         message
      }
   }
`

export const DELETE_MODEL = gql`
   mutation DeleteModel($markName: String!, $modelName: String!) {
      deleteModel(markName: $markName, modelName: $modelName) {
         success
         message
      }
   }
`

export const ADD_GENERATION = gql`
   mutation AddGeneration(
      $markName: String!
      $modelName: String!
      $generationName: String!
      $startYear: String!
      $endYear: String!
      $photoUrl: String!
   ) {
      addGeneration(
         markName: $markName
         modelName: $modelName
         generationName: $generationName
         startYear: $startYear
         endYear: $endYear
         photoUrl: $photoUrl
      ) {
         success
         message
      }
   }
`

export const DELETE_GENERATION = gql`
   mutation Mutation(
      $markName: String!
      $modelName: String!
      $generationName: String!
   ) {
      deleteGeneration(
         markName: $markName
         modelName: $modelName
         generationName: $generationName
      ) {
         success
         message
      }
   }
`

export const GET_USER = gql(`
   query Query {
      getUser {
         name
         email
         isAdmin
         _id
      }
   }
`)

export const ADD_ANNOUNCEMENT = gql`
    mutation Mutation(
        $user: String!
        $mark: String!
        $model: String!
        $generation: String!
        $condition: String!
        $price: String!
        $year: String!
        $mileage: String!
        $color: String!
        $bodyStyle: String!
        $transmission: String!
        $fuelType: String!
        $driveInit: String!
        $engineCapacity: String!
        $power: String!
        $phoneNumber: String!
    ) {
        addAnnouncement(
            user: $user
            mark: $mark
            model: $model
            generation: $generation
            condition: $condition
            price: $price
            year: $year
            mileage: $mileage
            color: $color
            bodyStyle: $bodyStyle
            transmission: $transmission
            fuelType: $fuelType
            driveInit: $driveInit
            engineCapacity: $engineCapacity
            power: $power
            phoneNumber: $phoneNumber
        ) {
            success
            message
        }
    }
`
