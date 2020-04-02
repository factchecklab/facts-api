import gql from 'graphql-tag';

export default gql`
  extend type Query {
    topics: [Topic!]
  }

  type Topic {
    id: ID!
    title: String!
    summary: String
    published: Boolean!
    conclusion: Conclusion!
    originalReport: Report!
    responses: [Response!]
  }
`;


