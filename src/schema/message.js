import gql from 'graphql-tag';

export default gql`
  type Message {
    id: ID!
    content: String!
    attachments: [Attachment!]
  }
`;
