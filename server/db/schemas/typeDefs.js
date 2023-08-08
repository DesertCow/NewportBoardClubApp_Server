

//* GraphQL Schema Definition
const { gql } = require("@apollo/server");

//getSubMenu(menuID: Int): [String]

const typeDefs = `#graphql

  type Query {
    getWX: WX
    getWidgetWX: WidgetWX
    getCurrentEvents: [Event]
    getPreviousEvents: [Event]
    getEvent(eventID: String): Event
    getEventList: [Event]
    getAllUsersSurfSession(userID: String!): [SurfSession]
    getSurfSession(sessionID: String!): SurfSession
    uploadUserProfilePicture(userID: String!): UploadURL
    uploadUserDefaultProfilePicture(userID: String!): String
    getSurfHack(surfHackID: String): SurfHack
    getSurfHackList: [SurfHack]
    getShaperList: [Shaper]
    uploadSurfHackPicture(pictureKey: String!): UploadURL
    uploadEventPicture(pictureKey: String!): UploadURL
    databaseCount: DatabaseStats
  }

  type Mutation {
    createUser(memberEmail: String!, password: String!, clubPassword: String!, memberFirstName: String!, memberLastName: String!): Auth
    login(memberEmail: String!, password: String!): Auth
    adminLogin(adminEmail: String!, adminPassword: String!): Auth
    updateEmail(_id: String!, memberEmail: String!): Auth
    updatePassword(_id: String!, password: String!): Auth
    updateName(_id: String!, memberFirstName: String!, memberLastName: String!): Auth
    createEvent( eventName: String!, eventSlogan: String!, eventDate: String!, eventLength: String, eventBody: String!, eventPhotoURL: String!, eventCurrent: Boolean!): Event
    deleteEvent(eventID: String!): String
    updateEvent(eventID: String!, newEventName: String!, newEventSlogan: String!, newEventDate: String!, newEventLength: String, newEventBody: String!, newEventPhotoURL: String!, newEventCurrent: Boolean!): Event
    createSurfSession( userID: String!, sessionDate: String!, sessionTime: String!, sessionLocation: String, skyConditions: String!, waveSize: String!, tideLevel: Float, tideDirection: String, sessionLength: String!, surfboardShaper: String, surfboardModel: String, surfboardLengthFT: Int, surfboardLengthIN: Int, surfboardVolume: Float, surfboardFinConfig: String, sessionNotes: String, sessionRating: Int): SurfSession
    deleteSurfSession(sessionID: String!): String
    createSurfHack(hackTitle: String!, hackBody: String!, hackPhotoURL: String!): SurfHack
    createShaper(shaperName: String!): Shaper
    deleteShaper(shaperID: String!): String
    deleteSurfHack(hackID: String!): String
    updateSurfHack(hackID: String!, newHackTitle: String, newHackBody: String, newHackPhotoURL: String): SurfHack
  }

  type UserCreated {
    password: String
    user: User
  }

  # Set up an Auth type to handle returning data from a profile creating or user login
  type Auth {
    token: ID!
  }

  type Event {
    _id: ID
    eventName: String
    eventSlogan: String
    eventDate: String
    eventLength: String
    eventBody: String
    eventPhotoURL: String
    eventCurrent: Boolean
  }

  type User {
    _id: ID
    memberEmail: String
    password: String
    loginValid: Boolean
    loginToken: String
    memberFirstName: String
    memberLastName: String
  }

  type WX {
    wind: Int
    airTemp: Int
    waterTemp: Float
    tideMSL: Float
    tideRise: Boolean
    clubStatus: Boolean
  }

  type WidgetWX {
    wind: Int
    windType: String
    airTemp: Int
    waterTemp: Float
    tideMSL: Float
    tideRise: Boolean
    nextTideType: String
    nextTideHeight: Float
    nextTideTime: String
    surfHeightBlackies: String
    surfHeight36th: String
    surfHeight56th: String
    surfHeightRiver: String
  }

  type SurfSession {
    _id: ID
    userID: String
    sessionDate: String
    sessionTime: String
    sessionLocation: String
    skyConditions: String
    waveSize: String
    tideLevel: Float
    tideDirection: String
    sessionLength: String
    surfboardShaper: String
    surfboardModel: String
    surfboardLengthFT: Int
    surfboardLengthIN: Int
    surfboardVolume: Float
    surfboardFinConfig: String
    sessionNotes: String
    sessionRating: Int
  }

  type SurfHack {
    _id: String
    hackTitle: String
    hackBody: String
    hackPhotoURL: String
  }

  type Shaper {
    _id: String
    shaperName: String
  }

  type UploadURL {
    secureUploadURL: String
    postedURL: String
  }

  type DatabaseStats {
    userCount: Int
    surfSessionCount: Int
    eventCount: Int
    surfHacksCount: Int
    shaperListCount: Int
  }
  
`;

module.exports = typeDefs;