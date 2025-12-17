import { gql } from 'apollo-angular';

export const NOTIFICATION_FIELDS = gql`
  fragment NotificationFields on Notifications {
    id
    name
    description
  }
`;
