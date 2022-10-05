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
         bodyStyles
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
         _id
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
         _id
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
      $generationName: String!
      $startYear: String!
      $endYear: String!
      $photoUrl: String!
      $bodyStyles: [String!]
      $modelName: String!
   ) {
      addGeneration(
         markName: $markName
         generationName: $generationName
         startYear: $startYear
         endYear: $endYear
         photoUrl: $photoUrl
         bodyStyles: $bodyStyles
         modelName: $modelName
      ) {
         success
         message
         _id
      }
   }
`

export const DELETE_GENERATION = gql`
   mutation DeleteGeneration(
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
   query GetUser {
      getUser {
         name
         email
         isAdmin
         _id
      }
   }
`)

export const ADD_ANNOUNCEMENT = gql`
   mutation AddAnnouncement(
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
      $description: String!
      $photos: [String]
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
         description: $description
         photos: $photos
         phoneNumber: $phoneNumber
      ) {
         success
         message
      }
   }
`

export const GET_ANNOUNCEMENTS = gql`
   query GetGenerations(
      $pagination: PaginationInput!
      $sort: SortInput
      $filter: FilterInput
   ) {
      getAnnouncements(pagination: $pagination, sort: $sort, filter: $filter) {
         photos
         condition
         price
         year
         mileage
         transmission
         fuelType
         mark
         model
         driveInit
         engineCapacity
         _id
      }
   }
`

export const GET_FILTERED_ANNOUNCEMENTS_COUNT = gql`
   query GetFilteredAnnouncementCount($filter: FilterInput) {
      getFilteredAnnouncementCount(filter: $filter)
   }
`

export const GET_ANNOUNCEMENT = gql`
   query GetAnnouncement($id: String!) {
      getAnnouncement(id: $id) {
         user
         photos
         mark
         model
         generation
         condition
         price
         year
         mileage
         color
         bodyStyle
         transmission
         fuelType
         driveInit
         engineCapacity
         power
         description
         phoneNumber
         createdAt
      }
   }
`

export const DELETE_ANNOUNCEMENT = gql`
   mutation DeleteAnnouncement($announcementId: ID!) {
      deleteAnnouncement(announcementId: $announcementId) {
         success
         message
      }
   }
`

export const CHANGE_PRICE = gql`
   mutation ChangePrice($announcementId: ID!, $price: String) {
      updateAnnouncement(announcementId: $announcementId, price: $price) {
         success
         message
      }
   }
`

export const LOGIN_USER = gql`
   mutation LoginUser($email: String!, $password: String!) {
      loginUser(email: $email, password: $password) {
         accessToken
      }
   }
`

export const REGISTER_USER = gql`
   mutation Register($name: String!, $email: String!, $password: String!) {
      registerUser(name: $name, email: $email, password: $password) {
         accessToken
      }
   }
`

export const LOGOUT = gql`
   mutation Logout {
      logout {
         success
         message
      }
   }
`

export const GET_USERS_ANNOUNCEMENTS = gql`
   query GetUsersAnnouncements(
      $filter: FilterInput
      $pagination: PaginationInput!
   ) {
      getAnnouncements(filter: $filter, pagination: $pagination) {
         _id
         mark
         model
         year
         photos
         price
      }
   }
`
