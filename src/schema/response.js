import gql from 'graphql-tag';

export default gql`
  type Response {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    conclusion: Conclusion!
    partner: Partner!
    topic: Topic!
    attachments: [Attachment!]
  }
`;




