import gql from 'graphql-tag';

export default gql`
  enum ResponseType {
    review
    response
  }

  type Response {
    id: ID!
    content: String!
    type: ResponseType!
    published: Boolean!
    conclusion: Conclusion!
    entity: Entity!
    topic: Topic!
    attachments: [Attachment!]
  }
`;
