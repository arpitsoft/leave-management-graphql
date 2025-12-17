import { gql } from "apollo-angular";
import { NOTIFICATION_FIELDS } from "./notification.fragment";


export const GET_ALL_NOTIFICATION = gql`
  query GetAllNotifications($limit: Int, $skip: Int) {
    getAllNotifications(limit: $limit, skip: $skip) {
      getAllNotifications {
        ...NotificationFields
      }
      totalCount
    }
  }
  ${NOTIFICATION_FIELDS}
`;


export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        role
      }
    }
  }
`;

export const CREATE_NOTIFICATION = gql`
    mutation($input:NotificationsInput!){
        createNotificationMut(input:$input){
        ...NotificationFields
        }
    }
    ${NOTIFICATION_FIELDS}
`

export const DELETE_NOTIFICATION = gql`
    mutation($id:ID!){
        deleteNotificationMut(id:$id)
    }
`

export const UPDATE_NOTIFICATION = gql`
  mutation ($input: NotificationsInput!) {
    updateNotificationMut(input: $input) {
        ...NotificationFields
    }
  }
  ${NOTIFICATION_FIELDS}
`;