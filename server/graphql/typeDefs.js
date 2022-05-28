import { gql } from 'apollo-server-express'

export default gql`
   type UserData {
      name: String!
      email: String!
      isAdmin: Boolean!
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
      startYear: Int!
      endYear: Int!
      photoUrl: String!
      _id: ID!
   }

   type Announcement {
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
      phoneNumber: String!
      createdAt: String!
   }

   input FilterInput {
      mark: String
      model: String
      generation: [String]
      condition: [String]
      price: [String]
      year: [String]
      mileage: [String]
      color: [String]
      bodyStyle: [String]
      transmission: [String]
      fuelType: [String]
      driveInit: [String]
      engineCapacity: [String]
      power: [String]
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
      getAnnouncementsCount: Int!
   }

   type Mutation {
      # users
      registerUser(name: String!, email: String!, password: String!): TokenData!
      loginUser(email: String!, password: String!): TokenData!
      getNewTokens: TokenData!
      logout: ReturnedType!
      #models
      addMark(markName: String!): ReturnedType!
      deleteMark(markName: String!): ReturnedType!
      addModel(markName: String!, modelName: String!): ReturnedType!
      deleteModel(markName: String!, modelName: String!): ReturnedType!
      addGeneration(
         markName: String!
         modelName: String!
         generationName: String!
         startYear: String!
         endYear: String!
         photoUrl: String!
      ): ReturnedType!
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
         power: String
      ): ReturnedType!
   }
`
