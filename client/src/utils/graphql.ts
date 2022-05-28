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
