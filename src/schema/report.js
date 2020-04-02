import gql from 'graphql-tag';

export default gql`
  extend type Query {
    reports: [Report!]
    report(id: ID!): Report
  }

  type Report {
    id: ID!
    content: String!
    url: String
    closed: Boolean!
  }
`;



