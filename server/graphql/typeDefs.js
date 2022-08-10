import { gql } from 'apollo-server-express'

export default gql`
   type UserData {
      name: String!
      email: String!
      isAdmin: Boolean!
      _id: String!
   }

   type TokenData {
      status: String!
      message: String!
      accessToken: String
   }

   type ReturnedType {
      success: Boolean!
      message: String!
   }

   type ReturnedTypeWithId {
       success: Boolean!
       message: String!
       _id: ID!
   }

   type Mark {
      name: String!
      _id: ID!
   }

   type Model {
      name: String!
      _id: ID!
   }

   type Generation {
      name: String!
      bodyStyles: [String!]
      startYear: Int!
      endYear: Int!
      photoUrl: String!
      _id: ID!
   }

   type Announcement {
      _id: ID
      user: String
      photos: [String]
      mark: String
      model: String
      generation: String
      condition: String
      price: Int
      year: Int
      mileage: Int
      color: String
      bodyStyle: String
      transmission: String
      fuelType: String
      driveInit: String
      engineCapacity: Float
      power: Int
      description: String
      phoneNumber: Int
      createdAt: String
   }

   input FilterInput {
      mark: String
      model: String
      generation: [String]
      condition: [String]
      minPrice: String
      maxPrice: String
      minYear: String
      maxYear: String
      minMileage: String
      maxMileage: String
      color: [String]
      bodyStyle: [String]
      transmission: [String]
      fuelType: [String]
      driveInit: [String]
      minEngineCapacity: String
      maxEngineCapacity: String
      minPower: String
      maxPower: String
   }

   input SortInput {
      key: String!
      direction: String!
   }

   input PaginationInput {
      page: String!
      limit: String!
   }

   type Query {
      getUploadPreset: String!
      #users
      getUser: UserData!
      #models
      getMarks: [Mark]!
      getModels(markName: String!): [Model]!
      getGenerations(markName: String!, modelName: String!): [Generation]!
      #announcements
      getAnnouncements(
         filter: FilterInput
         sort: SortInput
         pagination: PaginationInput!
      ): [Announcement]!
      getFilteredAnnouncementCount(filter: FilterInput): Int!
      getAnnouncement(id: String!): Announcement!
      getAnnouncementsCount: Int!
   }

   type Mutation {
      # users
      registerUser(name: String!, email: String!, password: String!): TokenData!
      loginUser(email: String!, password: String!): TokenData!
      getNewTokens: TokenData!
      logout: ReturnedType!
      #models
      addMark(markName: String!): ReturnedTypeWithId!
      deleteMark(markName: String!): ReturnedType!
      addModel(markName: String!, modelName: String!): ReturnedTypeWithId!
      deleteModel(markName: String!, modelName: String!): ReturnedType!
      addGeneration(
         markName: String!
         modelName: String!
         bodyStyles: [String!]
         generationName: String!
         startYear: String!
         endYear: String!
         photoUrl: String!
      ): ReturnedTypeWithId!
      deleteGeneration(
         markName: String!
         modelName: String!
         generationName: String!
      ): ReturnedType!
      #announcements
      addAnnouncement(
         user: String!
         mark: String!
         model: String!
         generation: String!
         condition: String!
         price: String!
         year: String!
         mileage: String!
         color: String!
         bodyStyle: String!
         transmission: String!
         fuelType: String!
         driveInit: String!
         engineCapacity: String!
         power: String!
         photos: [String]
         description: String!
         phoneNumber: String!
      ): ReturnedType!
      deleteAnnouncement(announcementId: ID!): ReturnedType!
      updateAnnouncement(
         announcementId: ID!
         user: String
         mark: String
         model: String
         generation: String
         condition: String
         price: String
         year: String
         mileage: String
         color: String
         bodyStyle: String
         transmission: String
         fuelType: String
         driveInit: String
         engineCapacity: String
         description: String
         power: String
      ): ReturnedType!
   }
`
