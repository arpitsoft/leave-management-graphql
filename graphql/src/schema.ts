export const typeDefs = `#graphql


type User {
  id: ID!
  username: String!
  name: String!
  email: String!
  role: String!
  profile_image: String
  contact: String
  department: String
}

type Notifications {
    id: ID
    name: String!
    description: String!
}

type AuthPayload {
    token: String!
    user: User!
}

type NotificationResponse {
    getAllNotifications: [Notifications!]!
    totalCount: Int!
}

input NotificationsInput {
    id: ID
    name: String!
    description: String!
}

type Query {
    notification: Notifications
    getNotification(id: String!): Notifications
    getAllNotifications(limit: Int, skip: Int): NotificationResponse!
}

type Mutation {
    login(username: String!, password: String!): AuthPayload!
    createNotificationMut(input: NotificationsInput): Notifications!
    updateNotificationMut(input: NotificationsInput): Notifications!
    deleteNotificationMut(id: ID!): String
}



`;
